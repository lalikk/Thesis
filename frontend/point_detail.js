import POINT_DATA from './js-modules/point-data.js';
import { VISITED_POINTS, CURRENT_ROUTE } from './js-modules/current-route.js';

$(async () => {
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    if(typeof id !== "string") {
        window.location.href="./point_list.html";
        return;
    }
    
    let point = await POINT_DATA.getPoint(id);
    displayPoint(point);

    let present = urlParams.get('present');
    if (present === "true") {
        VISITED_POINTS.markAsVisited(id);
    }
})

// http://localhost:3000/point_detail?id=1&present=true when accessed from given location

function displayPoint(point) {
    let div = document.querySelector("#point-contents");
    let contents = "";
    
    contents += `<div class="title-simple"><h1>${point.title}</h1></div>`;
    contents += `
        <button type="button" id='add-to-planning' data-id="${point.id}" onclick="window.addToPlanning(this)" 
                class="btn btn-primary btn-lg px-4 gap-3 position-absolute" style="right: 1rem; top: 8rem;">
            Add to planned route
        </button>
    `;
    contents += `<div class="text-body"><div class="clearfix"><h4>${point.description}</h4></div></div>`;
    if(point.photos.length > 1) {
        contents += `
            <div class="row" style="position: relative;">
                <div id="more-pictures-info" style="position: absolute; top: 2rem; left: 2rem; pointer-events:none;">
                    <h1 style="width: fit-content;">+${point.photos.length - 1}</h1>
                </div>
            </div>
        `;
    } 
    
    contents += renderPointGallery(point);
    div.innerHTML = contents;
}

function renderPointGallery(point) {
    if(point.photos.length == 0) {
        return "";
    }
    let items = renderGalleryPhoto(point.photos[0]);
    for(let i=1; i<point.photos.length; i++) {
        items += renderGalleryPhoto(point.photos[i], "d-none");
    }
    return `<div>${items}</div>`;
}

function renderGalleryPhoto(photo, classes = "") {
    return `
        <div class="col-lg-3 col-md-4 col-xs-6 thumb ${classes}">
            <a href="${photo.image}" data-fancybox="gallery">
                <img src="${photo.image}" class="zoom img-fluid" alt="">      
            </a>
        </div>
    `;
}

window.addToPlanning = function(element) {
    let id = element.getAttribute("data-id");
    if (!CURRENT_ROUTE.append(id)) {
        $('#point-route-duplicate').modal('show');
    } else {
        window.location.href="./route_planning.html";
    }
}