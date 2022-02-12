import { URL_POINT_LIST, MILLIS_IN_DAY } from "./constants.js";

const POINT_DATA_KEY = "POINT_DATA";
const POINT_DATA_AGE_KEY = "POINT_DATA_AGE";

class PointData {
    #points = null;

    /**
     * Get the list of all points, fetching data from server if necessary.
     * @returns 
     */
    async getAllPoints() {
        await this.#ensurePoints();
        return this.#points;
    }

    /**
     * Get point by ID, fetching data from server if necessary.
     * 
     * @param {*} id Numeric point id. Also accepts string, interpreting it as number.
     * @returns 
     */
    async getPoint(id) {
        await this.#ensurePoints();
        if (typeof id === "string") {
            id = parseInt(id);
            if(isNaN(id)) {
                return undefined;
            }
        }
        return this.#points[id];
    }

    async #ensurePoints() {
        if(this.#points === null) {
            this.#loadFromLocalStorage();
            if (this.#points === null) {
                try {
                    let serverData = await this.#loadFromServer();
                    this.#points = serverData;
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
            if(typeof this.#points !== "object") {
                throw new Error("Parsed data is not an object", { cause: this.#points });
            }
        } catch (error) {
            console.error("Error loading points from local storage:", error);
            this.#points = null;
        }
    }

    #saveToLocalStorage() {
        try {
            let dataString = JSON.stringify(this.#points);
            window.localStorage.setItem(POINT_DATA_KEY, dataString);
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
}

let POINT_DATA = new PointData();

export default POINT_DATA;