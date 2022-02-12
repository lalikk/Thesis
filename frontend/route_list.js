import ROUTE_DATA from './js-modules/route-data.js';
import { URL_ROUTE_DETAIL_PREFIX } from './js-modules/constants.js';

$(async () => {
    let routes = await ROUTE_DATA.getAllRoutes();

    let table = "";
    for (let id in routes) {
        let route = routes[id];
        table += renderRouteTableRow(route);
    }

    document.querySelector("#route-list").innerHTML = table;
})

function renderRouteTableRow(route) {
    let url = new URL(URL_ROUTE_DETAIL_PREFIX.toString());
    url.search = new URLSearchParams({ id: route.id });
    return `
        <tr>
            <td><a href="${url}">${route.description}</a></td>
        </tr>
    `;
}