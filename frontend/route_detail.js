import ROUTE_DATA from './js-modules/route-data.js';
import { CURRENT_ROUTE } from './js-modules/current-route.js';
import { MAKE_POINT_URL } from './js-modules/constants.js';

$(async () => {
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    if(typeof id !== "string") {
        window.location.href="./route_list.html";
        return;
    }
    
    let route = await ROUTE_DATA.getRoute(id);
    displayRoute(route);
})

function displayRoute(data) {
    let table = document.querySelector("#point-list");
    let points = data.points;

    let contents = "";
    //contents += `<div class="title-simple"><h1>${data.title}</h1></div>\n`;
    contents += `<div class="text-body"><div class="clearfix"><h2>${data.description}</h2></div></div>\n`;
    contents += `<div  class="row" data-masonry='{"percentPosition": true }' style='margin-top:2rem'>`;
    for (let point of points) {
        contents += `
            <div class="col-sm-6 col-lg-4 mb-4">
                <div class="card">
                    <img class="card-img-top" src="${point.photos[0].image}" width="100%" height="200" focusable="false"/>
                    <div class="card-body">
                        <h5 class="card-title"><a href=${MAKE_POINT_URL(point.id)}>${point.title}</a></h5>
                        <div class="text-ellipsis--3">${point.description}</div>
                    </div>
                </div>
            </div>
        `;
        //contents += `<tr><td><a href=${urlPoint}>${point.title}</a></td><td>${point.description}</td></tr>\n`;
    }
    contents += `</div>`;
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
        window.location.href="./route_planning.html";
    } else {
        $('#route-planning').modal('show');
    }
}

async function replaceRoute(e) {
    CURRENT_ROUTE.refresh(await extractRoutePoints(e.target));
    window.location.href="./route_planning.html";
}

async function extendRoute(e) {
    CURRENT_ROUTE.append(await extractRoutePoints(e.target));
    window.location.href="./route_planning.html"; 
}
