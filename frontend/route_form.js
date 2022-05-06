import POINT_DATA from './js-modules/point-data.js';
import { MAKE_POINT_URL, URL_CREATE_ROUTE } from './js-modules/constants.js';
import { RETRIEVE_TOKEN } from './js-modules/authorisation-check.js'

var allPoints;
var routePoints = [];
$(async () => {
    allPoints = await POINT_DATA.getAllPoints();
    allPoints = Object.values(allPoints);
    console.log(allPoints);
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
    let div = document.getElementById("selectable_points_list");
    let contents = "";
    div.innerHTML = contents;
    contents += `<div id="point-list-available" class="container py-5">`;
    contents += `<div  class="row" data-masonry='{"percentPosition": true }'>`;
    for (let point of allPoints) {
        if (!routePoints.includes(JSON.stringify(point.id))){
            contents += `
            <div class="col-sm-6 col-lg-4 mb-4">
                <div class="card" onclick="window.moveSelectedPoints(this)"  data-selectpoint="${point.id}">
                <div id="select-point-button"   style="position: absolute; top: 2rem; left: 2rem"
                ><h1 style="width: fit-content;">+</h1></div>
                    <img class="card-img-top" src="${point.photos[0].image}" width="100%" height="200" focusable="false"/>
                    <div class="card-body">
                        <h5 class="card-title"><a href=${MAKE_POINT_URL(point.id)}>${point.title}</a></h5>
                        <p class="card-text">${point.description}</p>
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
    let div = document.getElementById("route_points_list");
    let contents = "";
    div.innerHTML = contents; 
    contents += `<div id="point-list-available" class="container py-5">`;
    contents += `<div  class="row" data-masonry='{"percentPosition": true }'>`;
    for (let point of allPoints) {
        if (routePoints.includes(JSON.stringify(point.id))){
            contents += `
            <div class="col-sm-6 col-lg-4 mb-4">
            <div class="card" onclick="window.moveDeselectedPoints(this)"  data-deselectpoint="${point.id}">
            <div id="select-point-button"   style="position: absolute; top: 2rem; left: 2rem"
            ><h1 style="width: fit-content;">-</h1></div>
                    <img class="card-img-top" src="${point.photos[0].image}" width="100%" height="200" focusable="false"/>
                    <div class="card-body">
                        <h5 class="card-title"><a href=${MAKE_POINT_URL(point.id)}>${point.title}</a></h5>
                        <p class="card-text">${point.description}</p>
                    </div>
                </div>
            </div>
        `;
        }
    }
    contents += `</div></div>`;
    div.innerHTML = contents;
}

window.createRoute = async function () {
    let newRoute = {}
    newRoute.description = document.getElementById("routeDescription").value;
    newRoute.points =   new Set(routePoints);
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
        type:'POST',
        contentType:'application/json',
        data: routeJSON,
        success: function(data) {
            console.log("Route successfully created");
        },
        error: function(data) {
            console.log(data);
        }
    })
}