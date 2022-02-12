export const URL_POINT_LIST = new URL("http://localhost:8080/rest/points");
export const URL_ROUTE_LIST = new URL("http://localhost:8080/rest/routes");

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