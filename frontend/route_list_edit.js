import { MAKE_EDITABLE_ROUTE_URL, MAKE_EDIT_ROUTE_FORM_URL, MAKE_REMOVE_ROUTE_URL, URL_ROUTE_CREATE_REDIRECT } from './js-modules/constants.js';
import { RETRIEVE_TOKEN } from './js-modules/authorisation-check.js'
import ROUTE_DATA from './js-modules/route-data.js';

$( async () => {
    let data = Object.values(await ROUTE_DATA.getAllRoutes()); 
    displayData(data);
})

function displayData(data) {
    let div = document.querySelector("#editable-route-list");
    let contents = "";

    for (let route of data) {
        contents += `
            <tr>
                <td class="fs-4">
                    <a href=${MAKE_EDITABLE_ROUTE_URL(route.id)}>${route.description}</a>
                </td>
                <td class="text-end">
                    <span class="route-remove">
                        <button type="button" data-routeremove="${route.id}" onclick="window.removeRoute(this)"
                                class="btn btn-primary btn-lg px-4 gap-3">
                            Remove
                        </button>
                    </span>
                    <span class="route-remove">
                        <button type="button" data-route="${route.id}" onclick="location.href='${MAKE_EDIT_ROUTE_FORM_URL(route.id)}'" 
                                class="btn btn-secondary btn-lg px-4 gap-3">
                            Edit
                        </button>
                    </span>
                </td>
            </tr>
        `;
    }
    div.innerHTML = contents;
}

window.createRoute = function() {
    window.location = URL_ROUTE_CREATE_REDIRECT;
}

window.removeRoute = async function(element) {
    let pointId = element.dataset['routeremove'];
    let token = RETRIEVE_TOKEN();
    let url = MAKE_REMOVE_ROUTE_URL(pointId);
    console.log(url);
    $.ajaxSetup({
        headers : {
            "Authorization": token
        }
        });
        $.ajax({
            url:url,
            type:'DELETE',
            contentType:'application/json',
            success: function(data) {
                console.log("Route successfully removed");
                ROUTE_DATA.clear();
                window.location = window.location;
            },
            error: function(data) {
                console.log(data);
            }
        })
}
