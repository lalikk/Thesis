import POINT_DATA from './js-modules/point-data.js';
import { VISITED_POINTS, CURRENT_ROUTE } from './js-modules/current-route.js';
import { MAKE_EDIT_POINT_FORM_URL, URL_ROUTE_PLANNING, MAKE_REMOVE_POINT_URL, URL_POINT_LIST_EDIT } from './js-modules/constants.js';
import { CHECK_VALID_LOGIN, RETRIEVE_TOKEN } from './js-modules/authorisation-check.js';

$(async () => {
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    if(typeof id !== "string") {
        window.location.href="./point_list.html";
        return;
    }

    let point = await POINT_DATA.getPoint(id);
    await displayPoint(point);

    $('[data-fancybox]').fancybox({
        loop : true
    });

    let present = urlParams.get('present');
    if (present === "true") {
        VISITED_POINTS.markAsVisited(id);
    }
})

// http://localhost:3000/point_detail?id=1&present=true when accessed from given location; the url for the qr code

async function displayPoint(point) {
    let div = document.querySelector("#point-contents");
    let contents = "";
    contents += `<div class="title-simple"><h1>${point.title}</h1></div>`;

    contents += `<div class="text-body mx-auto" style="max-width:900px"><div class="clearfix fs-5 lh-sm" style="text-align: justify;">${point.description}</div></div>`;
    
    contents += renderPointGallery(point);
    contents += `
    <button type="button" id='add-to-planning' data-id="${point.id}" onclick="window.addToPlanning(this)" 
            class="btn btn-primary btn-lg px-4 gap-3" style="margin: 0.5rem auto; display:block">
        Add to planned route
    </button>
    `;

    if (await CHECK_VALID_LOGIN()) {
        contents += `
            <div class="my-2 text-center">
                <button type="button" id='point-edit-button' data-id="${point.id}" onclick="location.href='${MAKE_EDIT_POINT_FORM_URL(point.id)}'" 
                        class="btn btn-primary btn-lg px-4 gap-3 mx-1" style="margin: 0 auto;">
                    Edit
                </button>`;    
        contents += `<button type="button" id='point-remove-button' data-removepointid="${point.id}" onclick="window.removePoint(this)" 
                        class="btn btn-primary btn-lg px-4 gap-3 mx-1" style="margin: 0 auto;">
                    Remove
                </button>
            </div>
        `;
    }

    div.innerHTML = contents;
}

function renderPointGallery(point) {
    if(point.photos.length == 0) {
        return "";
    }
    let items = renderGalleryPhoto(point.photos[0], point.photos.length);
    for(let i=1; i<point.photos.length; i++) {
        items += renderGalleryPhoto(point.photos[i], -1, "d-none");
    }
    return `<div class="my-4">${items}</div>`;
}

function renderGalleryPhoto(photo, overlay = -1, classes = "") {
    let overlayElement = "";
    if (overlay > 1) {
        overlayElement = `
        <div class="image-overlay">
            <span>+${overlay - 1}</span>
        </div>`;
    }
    return `
        <div class="col-lg-3 col-md-4 col-xs-6 thumb position-relative mx-auto ${classes}">
            <a href="${photo.image}" data-fancybox="gallery">
                <img src="${photo.image}" class="zoom img-fluid" alt="">      
            </a>
            ${overlayElement}
        </div>
    `;
}

window.addToPlanning = function(element) {
    let id = element.getAttribute("data-id");
    if (!CURRENT_ROUTE.append(id)) {
        $('#point-route-duplicate').modal('show');
    } else {
        window.location.href = URL_ROUTE_PLANNING;
    }
}

window.removePoint = async function(element) {
    let pointId = element.dataset['removepointid'];
    let token = RETRIEVE_TOKEN();
    let url = MAKE_REMOVE_POINT_URL(pointId);
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
                POINT_DATA.clear();
                window.location = URL_POINT_LIST_EDIT;
            },
            error: function(data) {
                console.log(data);
            }
        })
}
