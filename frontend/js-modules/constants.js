export const MILLIS_IN_DAY = 1000 * 60 * 60 * 24;
export const FIVE_MINUTES = 1000 * 60 * 5;

export const RANGE_ON_POINT = 100;      
export const RANGE_POINT_NEARBY = 500;
export const RANGE_OFF_ROUTE = 50;

const BASE_URL = window.location.protocol + "//" + window.location.host;

export const URL_POINT_LIST = new URL(BASE_URL + "/rest/points");
export const URL_DISTANCES_LIST = new URL(BASE_URL + "/rest/distances");
export const URL_ROUTE_LIST = new URL(BASE_URL + "/rest/routes");
export const URL_POINT_TAG_LIST = new URL(BASE_URL + "/rest/point_tags");

export const URL_CREATE_POINT = new URL(BASE_URL + "/rest/auth/points")
export const URL_REMOVE_POINT_PREFIX = new URL(BASE_URL + "/rest/auth/point")
export const URL_CREATE_ROUTE = new URL(BASE_URL + "/rest/auth/routes")
export const URL_REMOVE_ROUTE_PREFIX = new URL(BASE_URL + "/rest/auth/route")

export const URL_POINT_DETAIL_PREFIX = new URL(BASE_URL + "/point_detail.html");
export const URL_ROUTE_DETAIL_PREFIX = new URL(BASE_URL + "/route_detail.html");
export const URL_POINT_DETAIL_PREFIX_EDITABLE = new URL(BASE_URL + "/point_editable.html");
export const URL_POINT_DETAIL_PREFIX_EDIT_FORM = new URL(BASE_URL + "/point_form_edit.html"); 
export const URL_POINT_CREATE_REDIRECT = new URL(BASE_URL + "/point_form.html");
export const URL_POINT_LIST_EDIT = new URL(BASE_URL + "/point_list_edit.html");
export const URL_ROUTE_LIST_EDIT = new URL(BASE_URL + "/route_list_edit.html");

export const URL_ROUTE_DETAIL_PREFIX_EDITABLE = new URL(BASE_URL + "/route_editable.html");
export const URL_ROUTE_DETAIL_PREFIX_EDIT_FORM = new URL(BASE_URL + "/route_form_edit.html"); 
export const URL_ROUTE_CREATE_REDIRECT = new URL(BASE_URL + "/route_form.html");

export const URL_USER_LOGIN = new URL(BASE_URL + "/rest/login");
export const URL_USER_AUTH_CHECK = new URL(BASE_URL + "/rest/auth_check");

export function MAKE_POINT_URL(id) {
    let url = new URL(URL_POINT_DETAIL_PREFIX.toString());
    url.search = new URLSearchParams({ 'id': id });
    return url;
}

export function MAKE_EDITABLE_POINT_URL(id) {
    let url = new URL(URL_POINT_DETAIL_PREFIX_EDITABLE.toString());
    url.search = new URLSearchParams({ 'id': id });
    return url;
}

export function MAKE_EDIT_POINT_FORM_URL(id) {
    let url = new URL(URL_POINT_DETAIL_PREFIX_EDIT_FORM.toString());
    url.search = new URLSearchParams({ 'id': id });
    return url;
}

export function MAKE_REMOVE_POINT_URL(id) {
    let url = new URL(URL_REMOVE_POINT_PREFIX.toString());
    url = url.href;
    url = url.concat("/", id.toString());
    return url;
}

export function MAKE_ROUTE_URL(id) {
    let url = new URL(URL_ROUTE_DETAIL_PREFIX.toString());
    url.search = new URLSearchParams({ 'id': id });
    return url;
}

export function MAKE_EDITABLE_ROUTE_URL(id) {
    let url = new URL(URL_ROUTE_DETAIL_PREFIX_EDITABLE.toString());
    url.search = new URLSearchParams({ 'id': id});
    return url;
}

export function MAKE_EDIT_ROUTE_FORM_URL(id) {
    let url = new URL(URL_ROUTE_DETAIL_PREFIX_EDIT_FORM.toString());
    url.search = new URLSearchParams({ 'id': id });
    return url;
}

export function MAKE_REMOVE_ROUTE_URL(id) {
    let url = new URL(URL_REMOVE_ROUTE_PREFIX.toString());
    url = url.href;
    url = url.concat("/", id.toString());
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