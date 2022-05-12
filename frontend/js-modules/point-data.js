import { URL_POINT_LIST, URL_DISTANCES_LIST, MILLIS_IN_DAY, SANITIZE_ID, ENSURE_ID_ARRAY } from "./constants.js";
import ROUTE_DATA from "./route-data.js";

const POINT_DATA_KEY = "POINT_DATA";
const DISTANCES_DATA_KEY = "DISTANCES_DATA";
const POINT_DATA_AGE_KEY = "POINT_DATA_AGE";

class PointData {
    #points = null;
    #distances = null;

    /**
     * Get the list of all points, fetching data from server if necessary.
     * @returns 
     */
    async getAllPoints() {
        await this.#ensurePoints();
        return this.#points;
    }

    async getAllDistances() {
        await this.#ensurePoints();
        return this.#distances;
    }

    async getPoints(idsArg) {
        await this.#ensurePoints();
        let ids = ENSURE_ID_ARRAY(idsArg);
        if (ids === undefined) {
            throw new Error("Invalid id list: "+idsArg);
        }
        let result = [];
        for (let id of ids) {
            let point = this.#points[id];
            if (point === undefined) {
                // TODO: Handle this in caller.
                throw new Error("Missing point with id "+id);
            }
            result.push(point);
        }
        return result;
    }

    clear() {
        try {
            window.localStorage.removeItem(DISTANCES_DATA_KEY);
            window.localStorage.removeItem(POINT_DATA_AGE_KEY);
            ROUTE_DATA.clear();
        } catch (error) {
            console.error("Error clearing local storage:", error);
        }
    }


    /**
     * Get point by ID, fetching data from server if necessary.
     * 
     * @param {*} id Numeric point id. Also accepts string, interpreting it as number.
     * @returns 
     */
    async getPoint(id) {
        await this.#ensurePoints();
        // TODO: SANITIZE_ID
        if (typeof id === "string") {
            id = parseInt(id);
            if(isNaN(id)) {
                return undefined;
            }
        }
        return this.#points[id];
    }

    async #ensurePoints() {
        if(this.#points === null || this.#distances === null) {
            this.#loadFromLocalStorage();
            if (this.#points === null || this.#distances === null) {
                try {
                    this.#points = await this.#loadFromServer();
                    this.#distances = await this.#loadDistancesFromServer();
                    this.#saveToLocalStorage();
                } catch (error) {
                    this.#loadFromLocalStorage(true);
                    if(this.#points === null) {
                        throw new Error("Cannot load point data.", { cause: error });
                    }
                }
            }
        }
    }

    #loadFromLocalStorage(force = false) {
        try {
            let age = window.localStorage.getItem(POINT_DATA_AGE_KEY);
            if(!force && (age == null || Date.now() - age > MILLIS_IN_DAY)) {
                console.log("Skip loading points. Stale data.");
                this.#points = null;
                return;
            }

            let dataString = window.localStorage.getItem(POINT_DATA_KEY);
            this.#points = JSON.parse(dataString);
            let dataString2 = window.localStorage.getItem(DISTANCES_DATA_KEY);
            this.#distances = JSON.parse(dataString2);
            if(typeof this.#points !== "object") {
                throw new Error("Parsed data is not an object", { cause: this.#points });
            }
            if(typeof this.#distances !== "object") {
                throw new Error("Parsed data is not an object", { cause: this.#distances });
            }
        } catch (error) {
            console.error("Error loading points from local storage:", error);
            this.#points = null;
            this.#distances = null;
        }
    }

    #saveToLocalStorage() {
        try {
            let dataString = JSON.stringify(this.#points);
            window.localStorage.setItem(POINT_DATA_KEY, dataString);
            let dataString2 = JSON.stringify(this.#distances);
            window.localStorage.setItem(DISTANCES_DATA_KEY, dataString2);
            window.localStorage.setItem(POINT_DATA_AGE_KEY, Date.now());
        } catch (error) {
            console.error("Error saving points to local storage:", error);
        }
    }

    #loadFromServer() {
        return new Promise((success, error) => {
            $.getJSON(URL_POINT_LIST)
                .done((data) => {
                    let result = {};
                    for(let point of data) {
                        result[point.id] = point;
                    }
                    success(result);
                })
                .fail((e) => error(e));
        });
    }

    #loadDistancesFromServer() {
        return new Promise((success, error) => {
            $.getJSON(URL_DISTANCES_LIST)
                .done((data) => {
                    console.log(data);
                    success(data);
                })
                .fail((e) => error(e));
        });
    }
}

let POINT_DATA = new PointData();

export default POINT_DATA;