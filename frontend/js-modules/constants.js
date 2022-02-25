export const MILLIS_IN_DAY = 1000 * 60 * 60 * 24;
export const FIVE_MINUTES = 1000 * 60 * 5;

export const RANGE_ON_POINT = 100;      
export const RANGE_POINT_NEARBY = 500;
export const RANGE_OFF_ROUTE = 50;

export const URL_POINT_LIST = new URL("http://localhost:8080/rest/points");
export const URL_ROUTE_LIST = new URL("http://localhost:8080/rest/routes");
export const URL_POINT_TAG_LIST = new URL("http://localhost:8080/rest/point_tags");

export const URL_POINT_DETAIL_PREFIX = new URL("http://localhost:3000/point_detail");
export const URL_ROUTE_DETAIL_PREFIX = new URL("http://localhost:3000/route_detail");

export function MAKE_POINT_URL(id) {
    let url = new URL(URL_POINT_DETAIL_PREFIX.toString());
    url.search = new URLSearchParams({ 'id': id });
    return url;
}

export function MAKE_ROUTE_URL(id) {
    let url = new URL(URL_ROUTE_DETAIL_PREFIX.toString());
    url.search = new URLSearchParams({ 'id': id });
    return url;
}

export function SANITIZE_ID(id) {
    if (typeof id === "string") {
        id = parseInt(id);
        if(isNaN(id)) {
            return undefined;
        }
    }
    if (typeof id === "number") {
        return id;
    }
    return undefined;
}

export function ENSURE_ID_ARRAY(ids) {
    let id = SANITIZE_ID(ids);
    if (id === undefined) {
        if (typeof ids.length === "number") {
            return ids;
        } else {
            return undefined;
        }
    } else {
        return [id];
    }
}