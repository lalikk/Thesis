import { MILLIS_IN_DAY, SANITIZE_ID, ENSURE_ID_ARRAY } from "./constants.js";

const VISITED_IDS_KEY = "VISITED_POINTS";
const VISITED_IDS_AGE_KEY = "VISITED_POINTS_AGE";

const ROUTE_PLANNED_IDS_KEY = "ROUTE_PLANNED_POINTS";
const ROUTE_PLANNED_IDS_AGE_KEY = "ROUTE_PLANNED_POINTS_AGE";
const ROUTE_SORTED_KEY = "ROUTE_SORTED";
const ROUTE_GEOMETRY_KEY = "ROUTE_GEOMETRY";
const ROUTE_TRACKING_KEY = "ROUTE_TRACKING";

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

    /**
     * @returns false if there is a planned route for planning view
     */
    isEmpty() {
        return ROUTE_MANAGER.readPlannedRoute().length == 0;
    }

    /**
     * 
     * @returns true if there are points to visit in the route - the route can be drawn in map
     */
    isActive() {
        return ROUTE_MANAGER.readActiveRoute().length == 0 && !this.isTraverseDone;
    }

    /**
     * 
     * @returns true if all points of route have been visited
     */
    isTraverseDone() {
        let currentIds = ROUTE_MANAGER.readActiveRoute();
        let visitedIds = VISITED_POINTS.getAllPoints();
        return currentIds.every(val => visitedIds.includes(val));
    }

    /**
     * Route is considered sorted if it is an unedited predefined route with defined ordering or if it is a free route
     * where optimal route has been computed and hasn't been edited since. 
     * @returns 
     */
    isSorted() {
        try {
            return window.localStorage.getItem(ROUTE_SORTED_KEY) === "true";
        } catch (error) {
            console.error("Cannot read sorted status.", error);
            // Sorting is disabled by default.
            return true;
        }
    }

    /**
     * 
     * @returns true if user is following the route and progress should be monitored
     */
    isTracked() {
        return this.#getTracking();
    }

    stopTracking() {
        this.#setTracking(false);
    }

    restartTracking() {
        this.#setTracking(true);
        this.clearGeometry();
    }

    /**
     * 
     * @returns route used for navigation, cleaned of visited points outside the route
     */
    getActiveRoutePoints() {
        return ROUTE_MANAGER.computeActiveRoute();
    }

    /**
     * 
     * @returns whole route including points that are visited and are not part of drawn route
     */
    getPlannedRoutePoints() {
        return ROUTE_MANAGER.readPlannedRoute();
    }

    refresh(idsArg, sorted = false) {
        let ids = ENSURE_ID_ARRAY(idsArg);
        if (ids === undefined) {
            throw new Error("Invalid point id array: "+idsArg);
        }
        this.clearGeometry();
        ROUTE_MANAGER.writePlannedRoute(ids);        
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
        if (ROUTE_MANAGER.appendPlannedRoute(ids)) {
            this.#clearSorted();
        } else {
            this.#setSorted();
        }
        this.clearGeometry();
    }

    // TODO refactoring reuse from ^^^^^^
    appendLeft(idsArg) {
        let ids = ENSURE_ID_ARRAY(idsArg);
        if (ids === undefined) {
            throw new Error("Invalid point id array: "+idsArg);
        }
        if (ROUTE_MANAGER.appendPlannedRoute(ids)) {
            this.#clearSorted();
        } else {
            this.#setSorted();
        }
        this.clearGeometry();
    }

    remove(idArg) {
        let id = SANITIZE_ID(idArg);
        if (id === undefined) {
            throw new Error("Invalid point id: " + idArg);
        }
        this.clearGeometry();
        if (ROUTE_MANAGER.remove(id) <= 1) {
            this.#setSorted();
        } else {
            this.#clearSorted();
        }
        this.clearGeometry();
    }

    /**
     * Clear both route and its geometry.
     */
    clear() {
        ROUTE_MANAGER.writePlannedRoute([]);
        this.clearGeometry();
        this.#setSorted();
    }

    clearGeometry() {
        try {
            window.localStorage.removeItem(ROUTE_GEOMETRY_KEY);
        } catch (error) {
            console.error("Cannot clear geometry.", error);
        }
    }

    setGeometry(geometry) {
        this.#writeGeometry(geometry);
    }

    getGeometry() {
        return this.#readGeometry();
    }

    /**
     * Returns -1 if current route is empty, or if every point is visited.
     */
    getActiveSegment() {
        let visited = VISITED_POINTS.getAllPoints();
        let route = ROUTE_MANAGER.computeActiveRoute();
        if (route.length == 0) {
            return -1;
        }
        if (visited.includes(route[route.length - 1])) {
            return -1;
        }
        for (let i = route.length - 2; i >= 0; i--) {
            if (visited.includes(route[i])) {
                return i + 1;
            }
        }
        return 0;
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

    #writeGeometry(geometry) {
        try {
            window.localStorage.setItem(ROUTE_GEOMETRY_KEY, JSON.stringify(geometry));
        } catch (error) {
            console.error("Cannot write geometry to storage.", error);
        }
    }

    #readGeometry() {
        try {
            let geoData = window.localStorage.getItem(ROUTE_GEOMETRY_KEY);
            if (geoData === null) {
                // Missing geometry.
                return null;
            } else {
                return JSON.parse(geoData);
            }
        } catch (error) {
            console.error("Cannot read geometry from local storage.", error);
            return null;
        }
    }

    #setTracking(tracking) {
        try {
            window.localStorage.setItem(ROUTE_TRACKING_KEY, JSON.stringify(tracking));
        } catch (error) {
            console.error("Cannot write tracking to storage.", error);
        }
    }

    #getTracking() {
        try {
            let tracking = window.localStorage.getItem(ROUTE_TRACKING_KEY);
            if (tracking === null) {
                // Tracking is on by default.
                return true;
            } else {
                return JSON.parse(tracking);
            }
        } catch (error) {
            console.error("Cannot read tracking from local storage.", error);
            return null;
        }
    }
}

class RouteManager {
    writePlannedRoute(ids) {
        try {
            window.localStorage.setItem(ROUTE_PLANNED_IDS_KEY, JSON.stringify(ids));
            window.localStorage.setItem(ROUTE_PLANNED_IDS_AGE_KEY, Date.now());
        } catch (error) {
            console.error("Cannot write planned route points.", error);
        }
    }

    readPlannedRoute() {
        let lastModified = window.localStorage.getItem(ROUTE_PLANNED_IDS_AGE_KEY);
        if(lastModified == null || Date.now() - lastModified > MILLIS_IN_DAY) {
            ROUTE_MANAGER.writePlannedRoute([]);
            return [];
        }

        let idData = window.localStorage.getItem(ROUTE_PLANNED_IDS_KEY);
        if(idData == null) {
            return [];
        }
        try {
            let route = JSON.parse(idData);
            if (typeof route.length === "number") {
                return route;
            } else {
                console.error("Invalid planned route points.", route);
            }
        } catch (error) {
            console.error("Invalid planned route points.", error);
            return [];
        }
    }

    appendPlannedRoute(ids) {
        let changed = false;
        let currentIds = this.readPlannedRoute();
        for (let id of ids) {
            if (!currentIds.includes(id)) {
                changed = true;
                currentIds.push(id);
            }
        }
        if (changed) {
            this.writePlannedRoute(currentIds);
        }
        return currentIds.length > 1;
    }

    appendLeftPlannedRoute(ids) {
        let changed = false;
        let currentIds = this.readPlannedRoute();
        for (let id of ids) {
            if (!currentIds.includes(id)) {
                changed = true;
                currentIds.unshift(id);
            }
        }
        if (changed) {
            this.writePlannedRoute(currentIds);
        }
        return currentIds.length > 1;
    }

    remove(id) {
        let ids = this.readPlannedRoute();
        let index = ids.indexOf(id);
        if (index != -1) {
            ids.splice(index, 1);
            this.writePlannedRoute(ids);
            return ids.length;
        }
        return -1;
    }

    computeActiveRoute() {              // TODO error handlings
        let ids = this.readPlannedRoute();  
        let visited = VISITED_POINTS.getAllPoints();
        console.log(ids, visited);
        let activeIds = [];
        let index = 0;
        // Visited points from begining of the route should be displayed for history purposes
        while (visited.includes(ids[index])) {
            activeIds.push(ids[index]);
            ++index;
        }
        console.log(activeIds, index);
        // After first unvisited point, add only unvisited to route, visited are by default not part of navigation
        for (; index < ids.length; ++index) {
            if (!visited.includes(ids[index])) {
                activeIds.push(ids[index]);
                console.log(activeIds);
            }
        } 
        return activeIds;
    }
}

export let VISITED_POINTS = new VisitedPoints();
export let CURRENT_ROUTE = new CurrentRoute();
let ROUTE_MANAGER = new RouteManager();
