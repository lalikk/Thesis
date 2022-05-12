import { URL_ROUTE_LIST, MILLIS_IN_DAY } from "./constants.js";

const ROUTE_DATA_KEY = "ROUTE_DATA";
const ROUTE_DATA_AGE_KEY = "ROUTE_DATA_AGE";

class RouteData {
    #routes = null;

    /**
     * Get the list of all routes, fetching data from server if necessary.
     * @returns 
     */
    async getAllRoutes() {
        await this.#ensureRoutes();
        return this.#routes;
    }

    /**
     * Get route by ID, fetching data from server if necessary.
     * 
     * @param {*} id Numeric route id. Also accepts string, interpreting it as number.
     * @returns 
     */
    async getRoute(id) {
        await this.#ensureRoutes();
        if (typeof id === "string") {
            id = parseInt(id);
            if(isNaN(id)) {
                return undefined;
            }
        }
        return this.#routes[id];
    }

    clear() {
        try {
            window.localStorage.removeItem(ROUTE_DATA_KEY);
            window.localStorage.removeItem(ROUTE_DATA_AGE_KEY);
        } catch (error) {
            console.error("Error clearing routes to local storage:", error);
        }
    }

    async #ensureRoutes() {
        if(this.#routes === null) {
            this.#loadFromLocalStorage();
            if (this.#routes === null) {
                try {
                    let serverData = await this.#loadFromServer();
                    this.#routes = serverData;
                    this.#saveToLocalStorage();
                } catch (error) {
                    this.#loadFromLocalStorage(true);
                    if(this.#routes === null) {
                        throw new Error("Cannot load route data.", { cause: error });
                    }
                }
            }
        }
    }

    #loadFromLocalStorage(force = false) {
        try {
            let age = window.localStorage.getItem(ROUTE_DATA_AGE_KEY);
            if(!force && (age == null || Date.now() - age > MILLIS_IN_DAY)) {
                console.log("Skip loading routes. Stale data.");
                this.#routes = null;
                return;
            }

            let dataString = window.localStorage.getItem(ROUTE_DATA_KEY);
            this.#routes = JSON.parse(dataString);
            if(typeof this.#routes !== "object") {
                throw new Error("Parsed data is not an object", { cause: this.#routes });
            }
        } catch (error) {
            console.error("Error loading routes from local storage:", error);
            this.#routes = null;
        }
    }

    #saveToLocalStorage() {
        try {
            let dataString = JSON.stringify(this.#routes);
            window.localStorage.setItem(ROUTE_DATA_KEY, dataString);
            window.localStorage.setItem(ROUTE_DATA_AGE_KEY, Date.now());
        } catch (error) {
            console.error("Error saving routes to local storage:", error);
        }
    }

    #loadFromServer() {
        return new Promise((success, error) => {
            $.getJSON(URL_ROUTE_LIST)
                .done((data) => {
                    let result = {};
                    for(let route of data) {
                        result[route.id] = route;
                    }
                    success(result);
                })
                .fail((e) => error(e));
        });
    }
}

let ROUTE_DATA = new RouteData();

export default ROUTE_DATA;