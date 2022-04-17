import POINT_DATA from './js-modules/point-data.js';
import { MAKE_EDIT_POINT_FORM_URL, MAKE_REMOVE_POINT_URL } from './js-modules/constants.js';
import { RETRIEVE_TOKEN } from './js-modules/authorisation-check.js'

$(async () => {
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    if(typeof id !== "string") {
        window.location.href="./point_list_edit.html";
        return;
    }
    let point = await POINT_DATA.getPoint(id);
    displayPoint(point);
})

function displayPoint(point) {
    let div = document.querySelector("#point-contents-edit");
    let contents = "";
    
    contents += `<div class="title-simple"><h1>${point.title}</h1></div>`;
    contents += `
        <button type="button" id='point-edit-button' data-id="${point.id}" onclick="location.href='${MAKE_EDIT_POINT_FORM_URL(point.id)}'" 
                class="btn btn-primary btn-lg px-4 gap-3 position-absolute" style="right: 10rem; top: 8rem;">
            Edit
        </button>
    `;    
    contents += `
    <button type="button" id='point-remove-button' data-removepointid="${point.id}" onclick="window.removePoint(this)" 
            class="btn btn-primary btn-lg px-4 gap-3 position-absolute" style="right: 1rem; top: 8rem;">
        Remove
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
            },
            error: function(data) {
                console.log(data);
            }
        })
}
