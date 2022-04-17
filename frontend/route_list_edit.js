import { MAKE_EDITABLE_ROUTE_URL, MAKE_EDIT_ROUTE_FORM_URL, MAKE_REMOVE_ROUTE_URL, URL_ROUTE_CREATE_REDIRECT } from './js-modules/constants.js';
import { RETRIEVE_TOKEN } from './js-modules/authorisation-check.js'
import ROUTE_DATA from './js-modules/route-data.js';

$( async () => {
    let data = Object.values(await ROUTE_DATA.getAllRoutes()); 
    displayData(data);
})

function displayData(data) {
    let div = document.querySelector("#editable-route-list");
    let contents = `<thead><tr>
        <th scope="col">Existing routes</th>
        <!--<th scope="col">Tag</th>-->
        <th scope="col"> <button type="button" id='add-route' onclick="location.href='${URL_ROUTE_CREATE_REDIRECT}'" class="btn btn-primary btn-lg px-4 gap-3" 
        > Create new route
      </button></th>
    </tr>
    </thead>`;

    for (let route of data) {
        contents += `<tr><td><a href=${MAKE_EDITABLE_ROUTE_URL(route.id)}>${route.description}</a></td>\n
            <td><span class="route-remove"><button type="button" data-routeremove="${route.id}" onclick="window.removeRoute(this)"
            class="btn btn-primary btn-lg px-4 gap-3">
            Remove</button></span>
            <span class="route-remove"><button type="button" data-route="${route.id}" onclick="location.href='${MAKE_EDIT_ROUTE_FORM_URL(route.id)}'" 
            class="btn btn-secondary btn-lg px-4 gap-3">
            Edit</button></span></td></tr>\n`;
    }
    div.innerHTML = contents;
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
            },
            error: function(data) {
                console.log(data);
            }
        })
}
