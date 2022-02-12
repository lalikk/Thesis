import Cookies from './node_modules/js-cookie/dist/js.cookie.mjs'
import ROUTE_DATA from './js-modules/route-data.js';
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
    contents += `<div class="text-body"><div class="clearfix"><h4>${data.description}</h4></div></div>\n`;
    contents += `<div  class="row" data-masonry='{"percentPosition": true }'>`;
    for (let point of points) {
        contents += `
            <div class="col-sm-6 col-lg-4 mb-4">
                <div class="card">
                    <img class="card-img-top" src="${point.photos[0].image}" width="100%" height="200" focusable="false"/>
                    <div class="card-body">
                        <h5 class="card-title"><a href=${MAKE_POINT_URL(point.id)}>${point.title}</a></h5>
                        <p class="card-text">${point.description}</p>
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

function startPlanning(e){
    console.log(e);
    let idsCookie = Cookies.get("route");
    console.log(ids);
    if (typeof idsCookie == 'undefined') {
        //$.getJSON(`http://localhost:8080/rest/routes/${id}`, function(data, status) {
        var ids = [];
        for (let point of receivedData.points) {
            ids.push(point.id);
        }
        var json_ids = JSON.stringify(ids);
        Cookies.set('route', json_ids);
        Cookies.set('navigationRecompute', 'true');
        Cookies.set('displayRecommend', 'true');
        window.location.href="route_planning.html";
        //})
    } else {
        $('#route-planning').modal('show')
    }
}

function replaceRoute(e) {
    Cookies.remove('route');
    Cookies.remove('visited');
    Cookies.set('userProgress', 0);
    Cookies.set('displayRecommend', 'true');
    startPlanning(e);  
}

function extendRoute(e) {
    let ids = Cookies.get("route");
    let idsArray = JSON.parse(ids);
    //$.getJSON(`http://localhost:8080/rest/route_points/${id}`, function(data, status) {
        for (let point of receivedData.points) { 
            if (!idsArray.includes(parseInt(point.id))) {
                idsArray.push(parseInt(point.id));  
            }
        }
    var json_ids = JSON.stringify(idsArray);
    Cookies.set('route', json_ids);
    Cookies.set('navigationRecompute', 'true');
    Cookies.set('displayRecommend', 'true');
    window.location.href="route_planning.html";
    //}); 
}
