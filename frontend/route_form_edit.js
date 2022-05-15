import POINT_DATA from './js-modules/point-data.js';
import ROUTE_DATA from './js-modules/route-data.js';
import { MAKE_EDITABLE_ROUTE_URL, MAKE_POINT_URL, URL_CREATE_ROUTE } from './js-modules/constants.js';
import { RETRIEVE_TOKEN } from './js-modules/authorisation-check.js'

var allPoints;
var routePoints = [];
var id;
$(async () => {
    allPoints = await POINT_DATA.getAllPoints();
    allPoints = Object.values(allPoints);
    let urlParams = new URLSearchParams(window.location.search);
    id = urlParams.get('id');
    if(typeof id !== "string") {
        window.location.href="./route_list_edit.html"; 
        return;
    }
    let route = await ROUTE_DATA.getRoute(id);
    routePoints = route.points.map(x => JSON.stringify(x.id));
    console.log(route);
    console.log(allPoints);
    console.log(routePoints);
    document.getElementById("routeDescriptionEdit").value = route.description;
    document.getElementById("route-diff-check").checked = route.difficult;
    displaySelectedPoints();
    displayAvailablePoints();
})

window.moveSelectedPoints = function(element) {
    console.log(element);
    let selectedPoint = element.dataset['selectpoint'];
    console.log(selectedPoint);
    routePoints.push(selectedPoint);
    console.log(routePoints);
    displaySelectedPoints();
    displayAvailablePoints();
}

window.moveDeselectedPoints = function(element) {
    let deselectedPoint = element.dataset['deselectpoint'];
    var index = routePoints.indexOf(deselectedPoint);
    if (index !== -1) {
        routePoints.splice(index, 1);
    }
    displaySelectedPoints();
    displayAvailablePoints();
}

function displayAvailablePoints() {
    let div = document.getElementById("selectable_points_list_edit");
    let contents = "";
    div.innerHTML = contents;
    contents += `<div id="point-list-available" class="container">`;
    contents += `<div  class="row" data-masonry='{"percentPosition": true }'>`;
    for (let point of allPoints) {
        if (!routePoints.includes(JSON.stringify(point.id))){
            contents += `
            <div class="col-sm-6 col-lg-4 mb-4">
                <div class="card" onclick="window.moveSelectedPoints(this)"  data-selectpoint="${point.id}" style="cursor:pointer;">
                <div id="select-point-button"   style="position: absolute; top: 2rem; left: 2rem"
                ></div>
                    <div>
                        <img class="card-img-top" src="${point.photos[0].image}" width="100%" height="200" focusable="false"/>
                        <div class="image-overlay">
                            <span>+</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${point.title}</h5>
                        <div class="card-detail text-ellipsis--3">${point.description}</div>
                    </div>
                </div>
            </div>
            `;
        }
    }
    contents += `</div></div>`;
    div.innerHTML = contents;
}

function displaySelectedPoints() {
    let div = document.getElementById("route_points_list_edit");
    let contents = "";
    div.innerHTML = contents; 
    contents += `<div id="point-list-available" class="container">`;
    contents += `<div  class="row" data-masonry='{"percentPosition": true }'>`;
    for (let point of allPoints) {
        if (routePoints.includes(JSON.stringify(point.id))){
            contents += `
            <div class="col-sm-6 col-lg-4 mb-4">
            <div class="card" onclick="window.moveDeselectedPoints(this)" data-deselectpoint="${point.id}" style="cursor:pointer;">
            <div id="select-point-button"   style="position: absolute; top: 2rem; left: 2rem"
            ></div>
                    <div>
                        <img class="card-img-top" src="${point.photos[0].image}" width="100%" height="200" focusable="false"/>
                        <div class="image-overlay">
                            <span>−</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${point.title}</h5>
                        <div class="card-detail text-ellipsis--3">${point.description}</div>
                    </div>
                </div>
            </div>
            `;
        }
    }
    contents += `</div></div>`;
    div.innerHTML = contents;
}

window.submitRoute = async function () {
    let newRoute = {}
    newRoute.id = id;
    newRoute.title = document.getElementById("routeDescriptionEdit").value; 
    newRoute.description = document.getElementById("routeDescriptionEdit").value;
    newRoute.points = await POINT_DATA.getPoints(routePoints);
    newRoute.difficult = document.getElementById("route-diff-check").checked;
    sendRoute(newRoute);
}

function sendRoute(route) {
    let routeJSON = JSON.stringify(route);
    let token = RETRIEVE_TOKEN();
    console.log(route);
    console.log(token);
    $.ajaxSetup({
    headers : {
        "Authorization": token
    }
    });
    $.ajax({
        url:URL_CREATE_ROUTE,
        dataType:'json',
        type:'PUT',
        contentType:'application/json',
        data: routeJSON,
        success: function(data) {
            console.log("Route successfully created");
            ROUTE_DATA.clear();
            window.location = MAKE_EDITABLE_ROUTE_URL(route.id);
        },
        error: function(data) {
            if (data.status == 400) {
                alert("Invalid route data. Please check the form.");
            } else {
                alert("Connection error.");
            }
            console.log(data);
        }
    })
}