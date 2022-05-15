import ROUTE_DATA from './js-modules/route-data.js';
import { CURRENT_ROUTE } from './js-modules/current-route.js';
import { MAKE_POINT_URL, URL_ROUTE_PLANNING, MAKE_EDIT_ROUTE_FORM_URL, MAKE_REMOVE_ROUTE_URL, URL_ROUTE_LIST_EDIT } from './js-modules/constants.js';
import { CHECK_VALID_LOGIN, RETRIEVE_TOKEN } from './js-modules/authorisation-check.js';

$(async () => {
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    if(typeof id !== "string") {
        window.location.href="./route_list.html";
        return;
    }
    
    let route = await ROUTE_DATA.getRoute(id);
    await displayRoute(route);
})

async function displayRoute(data) {
    let table = document.querySelector("#point-list");
    let points = data.points;

    let contents = "";
    //contents += `<div class="title-simple"><h1>${data.title}</h1></div>\n`;
    contents += `<div class="text-body"><div class="clearfix"><h1>${data.description}</h1></div></div>\n`;
    contents += `<div  class="row" data-masonry='{"percentPosition": true }' style='margin-top:2rem'>`;
    for (let point of points) {
        contents += `
            <div class="col-sm-6 col-lg-4 mb-4">
                <a href="${MAKE_POINT_URL(point.id)}">
                <div class="card">
                    <object class="card-img-top" data="${point.photos[0] ? point.photos[0].image: ""}" width="100%" height="200" focusable="false">
                      <img class="card-img-top" src="./images/noimage.jpg" type="image/jpeg" width="100%" height="200" focusable="false"/>
                    </object>
                    <div class="card-body">
                        <h5 class="card-title">${point.title}</h5>
                        <div class="card-detail text-ellipsis--3">${point.description}</div>
                    </div>
                </div>
                </a>
            </div>
        `;
    }
    contents += `</div>`;

    contents += `
        <button type="button" id='planning-button' class="btn btn-primary btn-lg px-4 gap-3" 
                style="margin: 0 auto; display:block">Add to route planning</button>
    `;
    if (await CHECK_VALID_LOGIN()) {
        contents += `<div class="my-2 text-center">`;
        contents += `<button type="button" id='edit-route' class="btn btn-primary btn-lg px-4 gap-3 mx-1" onclick="location.href='${MAKE_EDIT_ROUTE_FORM_URL(data.id)}'">Edit</button>`;
        contents += `<button type="button" id='remove-route' class="btn btn-primary btn-lg px-4 gap-3 mx-1" data-removerouteid="${data.id}" onclick="window.removeRoute(this)">Remove</button>`;
        contents += `</div>`;
    }
    table.innerHTML = contents;

    let planningButton = document.querySelector("#planning-button");
    planningButton.setAttribute('data-route', data.id);
    planningButton.onclick = startPlanning;

    let replaceRouteButton = document.querySelector("#button-replace-route");
    replaceRouteButton.setAttribute('data-route', data.id);
    replaceRouteButton.onclick = replaceRoute;

    let extendRouteButton = document.querySelector("#button-extend-route");
    extendRouteButton.setAttribute('data-route', data.id);
    extendRouteButton.onclick = extendRoute;
}

async function extractRoutePoints(element) {
    let routeId = element.getAttribute('data-route');
    let route = await ROUTE_DATA.getRoute(routeId);
    let routePoints = [];
    for (let point of route.points) {
        routePoints.push(point.id);
    }
    return routePoints;
}

async function startPlanning(e) {
    if (CURRENT_ROUTE.isEmpty()) {
        CURRENT_ROUTE.append(await extractRoutePoints(e.target));
        window.location.href = URL_ROUTE_PLANNING;
    } else {
        $('#route-planning').modal('show');
    }
}

async function replaceRoute(e) {
    CURRENT_ROUTE.refresh(await extractRoutePoints(e.target));
    window.location.href = URL_ROUTE_PLANNING;
}

async function extendRoute(e) {
    CURRENT_ROUTE.append(await extractRoutePoints(e.target));
    window.location.href = URL_ROUTE_PLANNING; 
}

window.removeRoute = async function(element) {
    let routeId = element.dataset['removerouteid'];
    let token = RETRIEVE_TOKEN();
    let url = MAKE_REMOVE_ROUTE_URL(routeId);
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
                console.log("Point successfully edited");
                ROUTE_DATA.clear();
                window.location = URL_ROUTE_LIST_EDIT;
            },
            error: function(data) {
                console.log(data);
            }
        })
}
