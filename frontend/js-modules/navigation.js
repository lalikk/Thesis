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
        var marker = new SMap.Marker(this.#pointCoordinates(point), `point-${point.id}`, { url: location, title: point.title });
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

    #pointCoordinates(point) {
        return SMap.Coords.fromWGS84(point.coordinates.latitude, point.coordinates.longitude);
    }

}

export class Navigation {
    #map = null;

    constructor(map) {
        this.#map = map;
    }
}
