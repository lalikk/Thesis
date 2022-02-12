import { MILLIS_IN_DAY, SANITIZE_ID, ENSURE_ID_ARRAY } from "./constants.js";

const VISITED_IDS_KEY = "VISITED_POINTS";
const VISITED_IDS_AGE_KEY = "VISITED_POINTS_AGE";

const ROUTE_IDS_KEY = "ROUTE_POINTS";
const ROUTE_IDS_AGE_KEY = "ROUTE_POINTS_AGE";
const ROUTE_SORTED_KEY = "ROUTE_SORTED";
const ROUTE_GEOMETRY_KEY = "ROUTE_GEOMETRY";

class VisitedPoints {

    getAllPoints() {
        return this.#readStorage();
    }

    clear() {
        this.#writeStorage([]);
    }

    markAsVisited(idArg) {
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

    removeFromVisited(idArg) {
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

    isVisited(idArg) {
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
            window.localStorage.setItem(VISITED_IDS_KEY, JSON.stringify(ids));
            window.localStorage.setItem(VISITED_IDS_AGE_KEY, Date.now());

            CURRENT_ROUTE.refreshGeometry(ids);
        } catch (error) {
            console.error("Cannot write visited points.", error);
        }
    }

    #readStorage() {
        let lastModified = window.localStorage.getItem(VISITED_IDS_AGE_KEY);
        if(lastModified == null || Date.now() - lastModified > MILLIS_IN_DAY) {
            this.clear();
            return [];
        }

        let idData = window.localStorage.getItem(VISITED_IDS_KEY);
        if(idData == null) {
            return [];
        }
        try {
            let visited = JSON.parse(idData);
            if (typeof visited.length === "number") {
                return visited;
            } else {
                console.error("Invalid visited points.", visited);
            }
        } catch (error) {
            console.error("Invalid visited points.", error);
            return [];
        }
    }

}

class CurrentRoute {

    isEmpty() {
        return this.#readRoute().length == 0;
    }

    isSorted() {
        try {
            return window.localStorage.getItem(ROUTE_SORTED_KEY) === "true";
        } catch (error) {
            console.error("Cannot read sorted status.", error);
            // Sorting is disabled by default.
            return true;
        }
    }

    getRoutePoints() {
        return this.#readRoute();
    }

    refresh(idsArg, sorted = false) {
        let ids = ENSURE_ID_ARRAY(idsArg);
        if (ids === undefined) {
            throw new Error("Invalid point id array: "+idsArg);
        }
        this.#writeRoute(ids);
        if (sorted || ids.length <= 1) {
            this.#setSorted();
        } else {
            this.#clearSorted();
        }
    }

    append(idsArg) {
        let ids = ENSURE_ID_ARRAY(idsArg);
        if (ids === undefined) {
            throw new Error("Invalid point id array: "+idsArg);
        }
        let changed = false;
        let currentIds = this.#readRoute();
        for (let id of ids) {
            if (!currentIds.includes(id)) {
                changed = true;
                currentIds.push(id);
            }
        }
        if (changed) {
            this.#writeRoute(currentIds);
            if (currentIds.length <= 1) {
                this.#setSorted();
            } else {
                this.#clearSorted();
            }
        }
        return changed;
    }

    remove(idArg) {
        let id = SANITIZE_ID(idArg);
        if (id === undefined) {
            throw new Error("Invalid point id: " + idArg);
        }
        let ids = this.#readRoute();
        let index = ids.indexOf(id);
        if (index != -1) {
            ids.splice(index, 1);
            this.#writeRoute(ids);
            if (ids.length <= 1) {
                this.#setSorted();
            } else {
                this.#clearSorted();
            }
        }
    }

    /**
     * Clear both route and its geometry.
     */
    clear() {
        this.#writeRoute([]);
        this.#setSorted();
    }

    clearGeometry() {
        try {
            window.localStorage.removeItem(ROUTE_GEOMETRY_KEY);
        } catch (error) {
            console.error("Cannot clear geometry.", error);
        }
    }

    refreshGeometry(visited = null) {
        if (visited === null) {
            visited = VISITED_POINTS.getAllPoints();
        }
    }

    getActiveSegment() {
        //TODO
    }

    #clearSorted() {
        try {
            window.localStorage.removeItem(ROUTE_SORTED_KEY);
        } catch (error) {
            console.error("Cannot clear sorted status.", error);
        }
    }

    #setSorted() {
        try {
            window.localStorage.setItem(ROUTE_SORTED_KEY, "true");
        } catch (error) {
            console.error("Cannot set sorted status.", error);
        }
    }

    
    #writeRoute(ids) {
        try {
            window.localStorage.setItem(ROUTE_IDS_KEY, JSON.stringify(ids));
            window.localStorage.setItem(ROUTE_IDS_AGE_KEY, Date.now());
            this.clearGeometry();
        } catch (error) {
            console.error("Cannot write route points.", error);
        }
    }

    #readRoute() {
        let lastModified = window.localStorage.getItem(ROUTE_IDS_AGE_KEY);
        if(lastModified == null || Date.now() - lastModified > MILLIS_IN_DAY) {
            this.clear();
            return [];
        }

        let idData = window.localStorage.getItem(ROUTE_IDS_KEY);
        if(idData == null) {
            return [];
        }
        try {
            let route = JSON.parse(idData);
            if (typeof route.length === "number") {
                return route;
            } else {
                console.error("Invalid route points.", route);
            }
        } catch (error) {
            console.error("Invalid route points.", error);
            return [];
        }
    }

}

export let VISITED_POINTS = new VisitedPoints();
export let CURRENT_ROUTE = new CurrentRoute();