import { TRANSFORM_COORDINATES, TRANSFORM_ALL_COORDINATES, FIND_CLOSEST } from "./map-utils.js";

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

    addPointMarker(point, label) {
        let location = JAK.mel("div");
        let pic = JAK.mel("img", {src:SMap.CONFIG.img+"/marker/drop-red.png"});
        location.appendChild(pic);
        let text = JAK.mel("div", {}, {position:"absolute", left:"0px", top:"2px", textAlign:"center", width:"22px", color:"white", fontWeight:"bold"});
        text.innerHTML = `${label}`;
        location.appendChild(text);
        var marker = new SMap.Marker(TRANSFORM_COORDINATES(point.coordinates), `point-${point.id}`, { url: location, title: point.title });
        this.#layerMarkers.addMarker(marker);
    }

    getPointMarkers() {
        let markers = this.#layerMarkers.getMarkers();
        let result = [];
        for (let marker of markers) {
            if (marker.getId().startWith("point-")) {
                result.push(marker);
            }
        }
        return result;
    }

    removePointMarkers() {
        let pointMarkers = this.getPointMarkers();
        for (let marker of pointMarkers) {
            this.#layerMarkers.removeMarker(marker, true);
        }
        this.#layerMarkers.redraw();
    }

    drawRouteGeometry(geometry, activeSegment = -1, userLocation = null, offRoute = false) {
        // TODO: Handle offRoute.
        this.#layerGeometry.removeAll();
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
    #map = null;

    constructor(map) {
        this.#map = map;
    }

    async getUserCoordinates() {
        return new Promise((success) => {
            navigator.geolocation.getCurrentPosition((data) => {
                success({ coordinates: data.coords });
            }, (error) => {
                console.error("Cannot get user location.", error);
                success(null);
            })
        });
    }

    monitorUserCoordinates(success, error = (e) => console.error(e)) {
        navigator.geolocation.watchPosition((position) => success({ coordinates: position.coords }), error);     
    }

    monitorPointsNearby(callback) {
        navigator.geolocation.watchPosition((position) => {
            // TODO: Find points...
            // callback(point);
        });
    }

    monitorOffRoute(callback) {
        // TODO.
    }

}

