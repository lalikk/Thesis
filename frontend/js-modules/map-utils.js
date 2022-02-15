
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
        SMap.Route.route(routeCoords, { geometry: true, itinerary: true })
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

// TODO fix latitude/longitude switching problem so simple function can be used everywhere
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