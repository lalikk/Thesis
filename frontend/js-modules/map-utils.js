
/**
 * Both userLocation and elements of routePoints have type 
 * { coordinates: { latitude: number, longitude: number }}
 * 
 * @param {*} userLocation 
 * @param {*} routePoints 
 */
export async function COMPUTE_ROUTE(routePoints, userLocation = null) {
    return new Promise((success, error) => {
        let routeCoords = [];
        if (userLocation !== null) {
            routeCoords.push(TRANSFORM_COORDINATES(userLocation.coordinates));
        }
        for (let point of routePoints) {
            routeCoords.push(TRANSFORM_COORDINATES(point.coordinates));
        }
        if (routeCoords.length < 2) {
            success([]);
        }
        SMap.Route.route(routeCoords, { geometry: true, itinerary: true, criterion:"turist1"})
            .then((route) => {
                let result = route.getResults();
                let geometry = sliceGeometry(result.geometry, result.points);
                if (userLocation === null) {
                    // Add an empty segment if user location is not provided as a stand in for the 
                    // first route segment (necessary for CURRENT_ROUTE.getActiveSegment() to work).
                    geometry.unshift({ points: [] });
                }
                success(geometry);
            }, error);
    });
}

/**
 * Compute the closest point from source within targets. 
 * If its distance is more than limit (or targets empty), return -1.
 */
export function FIND_CLOSEST(source, targets, limit) {
    if (targets.length == 0) {
        return -1;
    }

    source = TRANSFORM_COORDINATES(source);
    var smallestDistance = { index: -1, distance: Number.POSITIVE_INFINITY };
    for (let i = 0; i < targets.length; ++i) {
        let distance = source.distance(TRANSFORM_COORDINATES(targets[i]));
        if (distance < smallestDistance.distance) {
            smallestDistance.index = i;
            smallestDistance.distance = distance;
        }
    }

    if (smallestDistance.distance > limit) {
        return -1;
    } else {
        return smallestDistance.index;
    }
}

/**
 * Compute a subset of target coordinates that have distance from source at most limit
 * If none satisfy this condition, returns empty array
 */
 export function FIND_IN_RANGE(source, targets, limit) {
    if (targets.length == 0) {
        return null;
    }
    source = TRANSFORM_COORDINATES(source);
    let closePoints = [];
    for (let i = 0; i < targets.length; ++i) {
        let distance = source.distance(TRANSFORM_COORDINATES(targets[i]));
        if (distance < limit) {
            closePoints.push(i);
        }
    }
    return closePoints;
}

/**
 * 
 * @param {*} coordinates Location as either { latitude: number, longitude: number }, or { x: number, y: number }
 * @returns SMap.Coords representation ofl ocation
 */
export function TRANSFORM_COORDINATES(coordinates) {
    if (coordinates instanceof SMap.Coords) {
        return coordinates;
    }
    if (coordinates.latitude !== undefined && coordinates.longitude !== undefined) {
        return SMap.Coords.fromWGS84(coordinates.longitude, coordinates.latitude);
    }
    if (coordinates.x !== undefined && coordinates.y !== undefined) {
        return SMap.Coords.fromWGS84(coordinates.x, coordinates.y);
    } 
    throw new Error("Invalid coordinates object.", { cause: coordinates });
}

export function TRANSFORM_ALL_COORDINATES(array) {
    let result = [];
    for (let point of array) {
        result.push(TRANSFORM_COORDINATES(point));
    }
    return result;
}

/**
 * For an array of points returns an array of coordinates. Respects the order.
 * Expects [ point { coordinates: {} }] or [ point {coords: {} }], otherwise returns null
 * @param {*} points 
 */
export function EXTRACT_COORDINATES(points) {
    if (typeof points === null || points.length ==  0){
        return null;
    }
    let result = [];
    if(points[0].coordinates !== undefined) {
        for (let point of points) {
            result.push(TRANSFORM_COORDINATES(point.coordinates));
        }
        return result;
    }
    if(points[0].coords !== undefined) {
        for (let point of points) {
            result.push(TRANSFORM_COORDINATES(point.coords));
        }
        return result;
    }
    return null
}

/**
 * Expects two arrays, first of any Objects, second with indices. If any is empty, or there is an index 
 * greater than length of array of objects, returns null.
 * Otherwise returns subset of objects array with only objects on indices given by second array.
 * Order of objects in the new array is the same as order of indices, duplicates are allowed
 */
export function SUBSET_WITH_INDICES(objects, indices) {
    if (objects === null || indices === null) {
        return null;
    }
    let resultArray = [];
    let limit = objects.length;
    for (let index of indices) {
        if (index >= limit) {
            return null;
        } else {
            resultArray.push(objects[index]);
        }
    }
    return resultArray;
}

export function CREATE_ROUTE_URL(routePoints, userLocation = null) {
    let url = new SMap.URL.Route();
    let options = { type:"trial", trialTurist:true };
    let routeCoords = [];
    if (userLocation !== null) {
        routeCoords.push(TRANSFORM_COORDINATES(userLocation.coordinates));
    }
    for (let point of routePoints) {
        routeCoords.push(TRANSFORM_COORDINATES(point.coordinates));
    }
    if (routeCoords.length < 2) {
        return null;
    }
    url.addStart(routeCoords[0], options);
    url.addDestination(routeCoords[routeCoords.length-1]);
    for (let i = 1; i < routeCoords.length-1; ++i) {
        url.addWaypoint(routeCoords[i], options);
    }
    return url.toString();
}

/**
 * Split geometry into segments according to an itinerary.
 * @param {*} geometry An array of { x: longitude, y: latitude } points 
 * @param {*} points An itinerary returned by SMap.Route.route referencing points in geometry.
 * @returns An array of objects of type { points: [Point] } where Point is { coordinates: { latitude, longitude } }
 */
function sliceGeometry(geometry, points) {
    let geometrySegments = [];
    var partingIndex = 0;
    // skip leading zeroes
    while (points[partingIndex].index == 0) {
      ++partingIndex;
    }
    for (; partingIndex < points.length; ++partingIndex) {
        if(points[partingIndex].index == 0) {
            geometrySegments.push({
                points: geometry.splice(0, points[partingIndex - 1].index + 1),
            });
            while (points[partingIndex].index == 0) {
                ++partingIndex;
            }
        }
    }
    geometrySegments.push({
        points: geometry,
    });

    return geometrySegments;
}