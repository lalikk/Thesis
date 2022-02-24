import { URL_POINT_TAG_LIST, MILLIS_IN_DAY, SANITIZE_ID, ENSURE_ID_ARRAY } from "./constants.js";

const TAG_DATA_KEY = "TAG_DATA";
const TAG_DATA_AGE_KEY = "TAG_DATA_AGE";

class PointData {
    #tags = null;

    /**
     * Get the list of all points, fetching data from server if necessary.
     * @returns 
     */
    async getAllTags() {
        await this.#ensureTags();
        return this.#tags;
    }

    /**
     * Get point by ID, fetching data from server if necessary.
     * 
     * @param {*} id Numeric point id. Also accepts string, interpreting it as number.
     * @returns 
     */
    async getTagFromId(id) {
        await this.#ensureTags();
        // TODO: SANITIZE_ID
        if (typeof id === "string") {
            id = parseInt(id);
            if(isNaN(id)) {
                return undefined;
            }
        }
        return this.#tags[id];
    }

    async getTagFromTitle(title) {
        await this.#ensureTags();
        if (typeof title === "string") {
            for (let tag of Object.values(this.#tags)){
                if (tag.name == title){
                    return tag;
                }
            }
        } else {
            return undefined;
        }
        return undefined;
    }

    async #ensureTags() {
        if(this.#tags === null) {
            this.#loadFromLocalStorage();
            if (this.#tags === null) {
                try {
                    let serverData = await this.#loadFromServer();
                    this.#tags = serverData;
                    this.#saveToLocalStorage();
                } catch (error) {
                    this.#loadFromLocalStorage(true);
                    if(this.#tags === null) {
                        throw new Error("Cannot load point data.", { cause: error });
                    }
                }
            }
        }
    }

    #loadFromLocalStorage(force = false) {
        try {
            let age = window.localStorage.getItem(TAG_DATA_AGE_KEY);
            if(!force && (age == null || Date.now() - age > MILLIS_IN_DAY)) {
                console.log("Skip loading tags. Stale data.");
                this.#tags = null;
                return;
            }

            let dataString = window.localStorage.getItem(TAG_DATA_KEY);
            this.#tags = JSON.parse(dataString);
            if(typeof this.#tags !== "object") {
                throw new Error("Parsed data is not an object", { cause: this.#tags });
            }
        } catch (error) {
            console.error("Error loading tags from local storage:", error);
            this.#tags = null;
        }
    }

    #saveToLocalStorage() {
        try {
            let dataString = JSON.stringify(this.#tags);
            window.localStorage.setItem(TAG_DATA_KEY, dataString);
            window.localStorage.setItem(TAG_DATA_AGE_KEY, Date.now());
        } catch (error) {
            console.error("Error saving tags to local storage:", error);
        }
    }

    #loadFromServer() {
        return new Promise((success, error) => {
            $.getJSON(URL_POINT_TAG_LIST)
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

let TAG_DATA = new PointData();

export default TAG_DATA;