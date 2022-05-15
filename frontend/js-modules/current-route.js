import { MILLIS_IN_DAY, FIVE_MINUTES, SANITIZE_ID, ENSURE_ID_ARRAY } from "./constants.js";

const VISITED_IDS_KEY = "VISITED_POINTS";
const VISITED_IDS_AGE_KEY = "VISITED_POINTS_AGE";

const ROUTE_PLANNED_IDS_KEY = "ROUTE_PLANNED_POINTS";
const ROUTE_PLANNED_IDS_AGE_KEY = "ROUTE_PLANNED_POINTS_AGE";
const ROUTE_SORTED_KEY = "ROUTE_SORTED";
const ROUTE_GEOMETRY_KEY = "ROUTE_GEOMETRY";
const ROUTE_TRACKING_KEY = "ROUTE_TRACKING";
const ROUTE_TRACKING_AGE_KEY = "ROUTE_TRACKING_AGE";

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
        return ROUTE_MANAGER.computeActiveRoute().length == 0 && !this.isTraverseDone;
    }

    /**
     * 
     * @returns true if all points of route have been visited
     */
    isTraverseDone() {
        let currentIds = ROUTE_MANAGER.computeActiveRoute();
        let visitedIds = VISITED_POINTS.getAllPoints();
        return currentIds.every(val => visitedIds.includes(val));
    }

    /**
     * 
     * @returns true if there is at least one visited point on planned route
     */
     hasVisitedPoints() {
        return ROUTE_MANAGER.hasVisitedPoints();
    }

    /**
     * Route is considered sorted if it is an unedited predefined route with defined ordering or if it is a free route
     * where optimal route has been computed and hasn't been edited since. 
     * @returns 
     */
    isSorted() {
        try {
            return window.localStorage.getItem(ROUTE_SORTED_KEY) === "true" || ROUTE_MANAGER.readPlannedRoute().length <= 1;
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

    isOffTrackLonger(timeLimit = FIVE_MINUTES) {
        try {
            return Date.now() - window.localStorage.getItem(ROUTE_TRACKING_AGE_KEY) > timeLimit;
        } catch (error) {
            console.error("Cannot read off route time.", error);
            return true;
        }
    }

    stopTracking() {
        this.#setTracking(false);       
    }

    restartTracking() {
        this.#setTracking(true);
        this.clearGeometry();        
        try {
            window.localStorage.removeItem(ROUTE_TRACKING_AGE_KEY);
        } catch (error) {
            console.error("Cannot clear off route time.", error);
        }
    }

    resetTrackingTime() {
        try {
            window.localStorage.setItem(ROUTE_TRACKING_AGE_KEY, Date.now());
        } catch (error) {
            console.error("Cannot set leaving route.", error);
        }
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

    /**
     * @returns route points without visited. 
     */
    getUnvisitedRoutePoints() {
        return ROUTE_MANAGER.getUnvisitedPoints();
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
        let changed = ROUTE_MANAGER.appendPlannedRoute(ids);
        let routeSize = ROUTE_MANAGER.getPlannedRouteSize();
        if (routeSize <= 2) {
            this.#clearSorted();
        } else {
            this.#setSorted();
        }
        this.clearGeometry();
        return changed;
    }

    // TODO refactoring reuse from ^^^^^^
    appendLeft(idsArg) {
        let ids = ENSURE_ID_ARRAY(idsArg);
        if (ids === undefined) {
            throw new Error("Invalid point id array: "+idsArg);
        }
        let changed = ROUTE_MANAGER.appendLeftPlannedRoute(ids);
        let routeSize = ROUTE_MANAGER.getPlannedRouteSize();
        if (routeSize <= 2) {
            this.#clearSorted();
        } else {
            this.#setSorted();
        }
        this.clearGeometry();
        return changed;
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


    /**
     * Move all visited points to the back of the route.
     */
    shiftVisitedToBack() {
        ROUTE_MANAGER.shiftVisitedToBack();
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

    // Save planned route to local storage.
    writePlannedRoute(ids) {
        try {
            window.localStorage.setItem(ROUTE_PLANNED_IDS_KEY, JSON.stringify(ids));
            window.localStorage.setItem(ROUTE_PLANNED_IDS_AGE_KEY, Date.now());
        } catch (error) {
            console.error("Cannot write planned route points.", error);
        }
    }

    // Get planned route from local storage.
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

    shiftVisitedToBack() {
        let routeBeginning = this.getUnvisitedPoints();
        let allPoints = this.readPlannedRoute();
        let visited = VISITED_POINTS.getAllPoints();
        for (let v of visited) {
            if (allPoints.includes(v)) {
                routeBeginning.push(v);
            }
        }
        this.writePlannedRoute(routeBeginning);
    }

    // Add given point ids to the planned route at the end of the route.
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
        return changed;
    }

    // Add given point ids to the planned route at the beginning of the route.
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
        return changed;
    }

    // Remove id from route points.
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

    // Get ids of route points that form a continuous sequence. There can be visited points
    // at the beginning of the sequence, but not in the middle.
    computeActiveRoute(ids = null) {              // TODO error handlings
        if (ids == null) {
            ids = this.readPlannedRoute();  
        }
        let visited = VISITED_POINTS.getAllPoints();
        //console.log(ids, visited);
        let activeIds = [];
        let index = 0;
        // Visited points from begining of the route should be displayed for history purposes
        while (visited.includes(ids[index])) {
            activeIds.push(ids[index]);
            ++index;
        }
        //console.log(activeIds, index);
        // After first unvisited point, add only unvisited to route, visited are by default not part of navigation
        for (; index < ids.length; ++index) {
            if (!visited.includes(ids[index])) {
                activeIds.push(ids[index]);
                //console.log(activeIds);
            }
        } 
        return activeIds;
    }

    // Get ids of point on route that are not visited.
    getUnvisitedPoints() {
        let visitedIds = VISITED_POINTS.getAllPoints();
        let ids = this.readPlannedRoute();
        return ids.filter(x => !visitedIds.includes(x));
    }

    // True if route contains a visited point (initial or somewhere in the middle).
    hasVisitedPoints() {
        let ids = this.readPlannedRoute();
        let activeIds = this.computeActiveRoute(ids);
        if (ids.length == 0 || activeIds.length == 0) {
            return false;
        }
        return !(ids.length == activeIds.length) || VISITED_POINTS.isVisited(activeIds[0]);
    }

    // Number of points in route.
    getPlannedRouteSize() {
        return this.readPlannedRoute().length;
    }

}

export let VISITED_POINTS = new VisitedPoints();
export let CURRENT_ROUTE = new CurrentRoute();
let ROUTE_MANAGER = new RouteManager();
