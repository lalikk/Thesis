import ROUTE_DATA from './js-modules/route-data.js';
import { MAKE_POINT_URL, MAKE_REMOVE_ROUTE_URL, MAKE_EDIT_ROUTE_FORM_URL } from './js-modules/constants.js';
import { RETRIEVE_TOKEN } from './js-modules/authorisation-check.js'

$(async () => {
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    if(typeof id !== "string") {
        window.location.href="./route_list_edit.html";
        return;
    }
    
    let route = await ROUTE_DATA.getRoute(id);
    displayRoute(route);
})

function displayRoute(data) {
    let table = document.querySelector("#route-contents-edit");
    let points = data.points;

    let contents = "";
    contents += `<button type="button" id='edit-route' class="btn btn-primary btn-lg px-4 gap-3" onclick="location.href='${MAKE_EDIT_ROUTE_FORM_URL(data.id)}'"
      style="position: absolute; right: 12rem; top: 8rem;">Edit</button>`;
    contents += `<button type="button" id='remove-route' class="btn btn-primary btn-lg px-4 gap-3" data-removerouteid="${data.id}" onclick="window.removeRoute(this)" 
      style="position: absolute; right: 1rem; top: 8rem;"> Remove
    </button>`
    //contents += `<div class="title-simple"><h1>${data.title}</h1></div>\n`;
    contents += `<div class="text-body"><div class="clearfix"><h4>${data.description}</h4></div></div>\n`;
    contents += `<div id="point-list" class="container py-5">`;
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
    contents += `</div></div>`;
    table.innerHTML = contents;
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
            },
            error: function(data) {
                console.log(data);
            }
        })
}
