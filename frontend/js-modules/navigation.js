import { TRANSFORM_COORDINATES, TRANSFORM_ALL_COORDINATES, FIND_CLOSEST, EXTRACT_COORDINATES, FIND_IN_RANGE, SUBSET_WITH_INDICES } from "./map-utils.js";
import { RANGE_ON_POINT, RANGE_POINT_NEARBY, RANGE_OFF_ROUTE, MILLIS_IN_DAY } from "./constants.js";
import { CURRENT_ROUTE, VISITED_POINTS } from "./current-route.js";
import POINT_DATA from "./point-data.js";

const IGNORED_IDS_KEY = "IGNORED_POINTS";
const IGNORED_IDS_AGE_KEY = "IGNORED_POINTS_AGE";

export class MapView {
    #map = null;
    #layerMarkers = null;
    #layerGeometry = null;
    #markerClickListeners = [];

    constructor(element) {
        var center = SMap.Coords.fromWGS84(16.6, 49.19);  // TODO
        this.#map = new SMap(JAK.gel(element), center, 13);
        this.#map.addDefaultLayer(SMap.DEF_BASE).enable();
        this.#map.addDefaultControls();

        this.#layerMarkers = new SMap.Layer.Marker();
        this.#layerGeometry = new SMap.Layer.Geometry();
        this.#map.addLayer(this.#layerMarkers).enable();
        this.#map.addLayer(this.#layerGeometry).enable();

        var sync = new SMap.Control.Sync({bottomSpace:0});
        this.#map.addControl(sync);
        
        let listeners = this.#markerClickListeners;
        this.#map.getSignals().addListener(this, "marker-click", function(e) {
            let marker = e.target;
            for (let listener of listeners) {
                listener(marker);
            }
        });
    }

    addMarkerClickListener(listener) {
        if (!this.#markerClickListeners.includes(listener)) {
            this.#markerClickListeners.push(listener);
        }
    }

    addPointMarker(point, label, visited = false) {
        let location = JAK.mel("div");
        var pic;
        if (visited === false) {
            pic = JAK.mel("img", {src:SMap.CONFIG.img+"/marker/drop-red.png"});
        } else {
            pic = JAK.mel("img", {src:SMap.CONFIG.img+"/marker/drop-blue.png"});   
        }
        location.appendChild(pic);
        let text = JAK.mel("div", {}, {position:"absolute", left:"0px", top:"2px", textAlign:"center", width:"22px", color:"white", fontWeight:"bold"});
        text.innerHTML = `${label}`;
        location.appendChild(text);
        var marker = new SMap.Marker(TRANSFORM_COORDINATES(point.coordinates), `point-${point.id}`, { url: location, title: point.title });
        this.#layerMarkers.addMarker(marker);
    }

    getPointMarkers() {
        let markers = this.#layerMarkers.getMarkers();
        console.log(markers);
        let result = [];
        for (let marker of markers) {
            if (marker.getId().startsWith("point-")) {
                result.push(marker);
            }
        }
        return result;
    }

    removePointMarkers() {
        console.log("HELLO!!!");
        let pointMarkers = this.getPointMarkers();
        console.log(pointMarkers);
        for (let marker of pointMarkers) {
            this.#layerMarkers.removeMarker(marker, true);
        }
        this.#layerMarkers.redraw();
    }

    drawRouteGeometry(geometry, activeSegment = -1, userLocation = null, offRoute = false) {
        // TODO: Handle offRoute.
        console.log("Off route",offRoute);
        console.log("Draw geometry", geometry);
        this.#layerGeometry.removeAll();
        if (offRoute == true) {
            this.#drawOffRoute(geometry);
        } else {
            this.#drawProgress(geometry, activeSegment, userLocation);
        }
    }

    #drawOffRoute(geometry) {
        let options = { color:'gray', opacity:0.4}
        for (let g of geometry) {
            let coords = TRANSFORM_ALL_COORDINATES(g.points);
            let segmentGeometry = new SMap.Geometry(SMap.GEOMETRY_POLYLINE, null, coords, options);
            this.#layerGeometry.addGeometry(segmentGeometry);
        }
    }

    #drawProgress(geometry, activeSegment, userLocation) {
        for (let i=0; i < geometry.length; i++) {
            let segment = geometry[i];
            let options = {};
            if (activeSegment > i || activeSegment == -1) {
                options.color = 'gray';
            }
            let coords = TRANSFORM_ALL_COORDINATES(segment.points);
            if (activeSegment == i && userLocation != null) {
                // Try to split segment into visited and unvisited.
                this.#drawActiveSegment(coords, userLocation);
            } else {
                let segmentGeometry = new SMap.Geometry(SMap.GEOMETRY_POLYLINE, null, coords, options);
                console.log(segmentGeometry);
                this.#layerGeometry.addGeometry(segmentGeometry);
            }
        }
        this.#layerGeometry.redraw();
    }


    #drawActiveSegment(coords, userLocation) {
        let userInSegment = FIND_CLOSEST(userLocation, coords, 100);
        console.log("Position of user in segment:",userInSegment);
        if (userInSegment > 0) {
            let visited = coords.splice(0, userInSegment + 1);
            let visitedGeometry = new SMap.Geometry(SMap.GEOMETRY_POLYLINE, null, visited, { color: 'gray' });
            this.#layerGeometry.addGeometry(visitedGeometry);
        }
        let segmentGeometry = new SMap.Geometry(SMap.GEOMETRY_POLYLINE, null, coords);
        this.#layerGeometry.addGeometry(segmentGeometry);
    }

    refreshUserMarker(userPosition) {
        // Clear existing marker
        for (let marker of this.#layerMarkers.getMarkers()) {
            if (marker.getId() == "user") {
                this.#layerMarkers.removeMarker(marker);
                break;
            }
        }
        if (userPosition != null) {
            let location = JAK.mel("div");
            let pic = JAK.mel("img", {src:SMap.CONFIG.img+"/marker/drop-red.png"});
            location.appendChild(pic);
            var marker = new SMap.Marker(TRANSFORM_COORDINATES(userPosition.coordinates), "user", null);
            this.#layerMarkers.addMarker(marker);
        }   
    }

}

export class Navigation {

    #ignoredPoints = new IgnoredPoints();
    #lastLocation = null;

    constructor() {
    }

    markAsIgnored(id) {
        this.#ignoredPoints.markAsIgnored(id);
    }

    async getUserCoordinates() {
        let navigation = this;
        return new Promise((success) => {
            if (navigation.#lastLocation == null) {
                navigator.geolocation.getCurrentPosition((data) => {
                    console.log("fadfa")
                    navigation.#lastLocation = { coordinates: data.coords };
                    success({ coordinates: data.coords });
                }, (error) => {
                    console.error("Cannot get user location.", error);
                    success(null);
                }, {
                    timeout: 1000,   // 1 second
                })
            } else {
                success(navigation.#lastLocation);
            }
        });
    }

    monitorUserCoordinates(success, error = (e) => console.error(e)) {
        let navigation = this;
        navigator.geolocation.watchPosition((position) => {
            navigation.#lastLocation = { coordinates: position.coords };
            success({ coordinates: position.coords });
        }, error);     
    }

    monitorPointsNearby(callback) {
        navigator.geolocation.watchPosition(async (position) => {
            let allPoints = await POINT_DATA.getAllPoints();
            console.log("all points",allPoints);
            let trackedPoints = this.#filterUntracked(Object.values(allPoints));
            console.log(trackedPoints);
            let allCoordinates = EXTRACT_COORDINATES(trackedPoints);
            let closestIndex = FIND_CLOSEST(position.coords, allCoordinates, RANGE_ON_POINT);
            console.log("closest:", allCoordinates, trackedPoints);
            if (closestIndex != -1) {
                callback(trackedPoints[closestIndex], null);
            } else {
                console.log("Checking add nearby", position.coords, allCoordinates);
                let closestNearby = FIND_CLOSEST(position.coords, allCoordinates, RANGE_POINT_NEARBY);
                console.log(closestNearby);
                if (closestNearby != -1) {
                    callback(null, trackedPoints[closestNearby]);
                } else {
                    callback(null, null);
                }
            }
        });
    }

    monitorOffRoute(callback) {
        navigator.geolocation.watchPosition((position) => {
            if (!CURRENT_ROUTE.isTracked()){
                return;
            }
            let geometryPoints = CURRENT_ROUTE.getGeometry();
            if (geometryPoints == null) {
                return;
            }
            let coords = [];
            for (let g of geometryPoints) {
                coords.push(g.points);
            }
            console.log(coords, coords.flat())
            let inUserRange = FIND_IN_RANGE(position.coords, coords.flat(),  RANGE_OFF_ROUTE);
            if (inUserRange.length == 0) {
                callback(true);
            }
        });
    }

    #filterUntracked(points) {
        let visitedIds = VISITED_POINTS.getAllPoints();
        let ignoredIds = this.#ignoredPoints.getAllPoints();
        return points.filter(x => !visitedIds.includes(x.id) && !ignoredIds.includes(x.id));
    }
}

class IgnoredPoints {

    getAllPoints() {
        return this.#readStorage();
    }

    clear() {
        this.#writeStorage([]);
    }

    markAsIgnored(idArg) {
        let id = SANITIZE_ID(idArg);
        if (id === undefined) {
            throw new Error("Invalid point id: " + idArg);
        } else {
            let ids = this.#readStorage();
            if(!ids.includes(id)) {
                ids.push(id);
                this.#writeStorage(ids);
            }
        }
    }

    removeFromIgnored(idArg) {
        let id = SANITIZE_ID(idArg);
        if (id === undefined) {
            throw new Error("Invalid point id: " + idArg);
        } else {
            let ids = this.#readStorage();
            var index = ids.indexOf(id);
            if (index !== -1) {
                ids.splice(index, 1);
                this.#writeStorage(ids);
            }
        }
    }

    isIgnored(idArg) {
        let id = SANITIZE_ID(idArg);
        if (id === undefined) {
            throw new Error("Invalid point id: " + idArg);
        } else {
            let ids = this.#readStorage();
            return ids.includes(id);
        }
    }

    #writeStorage(ids) {
        try {
            window.localStorage.setItem(IGNORED_IDS_KEY, JSON.stringify(ids));
            window.localStorage.setItem(IGNORED_IDS_AGE_KEY, Date.now());
        } catch (error) {
            console.error("Cannot write ignored points.", error);
        }
    }

    #readStorage() {
        let lastModified = window.localStorage.getItem(IGNORED_IDS_AGE_KEY);
        if(lastModified == null || Date.now() - lastModified > MILLIS_IN_DAY) {
            this.clear();
            return [];
        }

        let idData = window.localStorage.getItem(IGNORED_IDS_KEY);
        if(idData == null) {
            return [];
        }
        try {
            let ignored = JSON.parse(idData);
            if (typeof ignored.length === "number") {
                return ignored;
            } else {
                console.error("Invalid ignored points.", ignored);
            }
        } catch (error) {
            console.error("Invalid ignored points.", error);
            return [];
        }
    }
}  
