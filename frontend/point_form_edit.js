import POINT_DATA from './js-modules/point-data.js';
import TAG_DATA from './js-modules/point-tag-data.js';
import { URL_CREATE_POINT } from './js-modules/constants.js';
import { RETRIEVE_TOKEN } from './js-modules/authorisation-check.js'

var id = null;
var allTags = null;
$(async () => {
    let urlParams = new URLSearchParams(window.location.search);
    id = urlParams.get('id');
    if(typeof id !== "string") {
        window.location.href="./point_list_edit.html"; 
        return;
    }
    
    let point = await POINT_DATA.getPoint(id);
    allTags = await TAG_DATA.getAllTags();
    allTags = Object.values(allTags);
    console.log(allTags);
    // chcek valid point retrieved, else redirect
    displayTags(allTags);
    fillPointData(point);
})

function displayTags(data) {
    let div = document.querySelector("#point-tags-edit");
    let contents = "";
    for (let tag of data) {
        contents += `<div class="form-check">\n
            <input type="checkbox" class="form-check-input" id="${tag.name}">\n
            <label class="form-check-label" for="${tag.name}">${tag.name}</label>\n
            </div>\n`
    }
    div.innerHTML = contents;
}

function fillPointData(point) {
    document.getElementById("pointTitleEdit").value = point.title;
    document.getElementById("pointDescriptionEdit").value = point.description;
    document.getElementById("latitudeEdit").value = point.coordinates.latitude;
    document.getElementById("longitudeEdit").value = point.coordinates.longitude;
    for (let tag of point.tags) {
        document.getElementById(tag.name).checked = true;
    }
}

window.editPoint = async function() {
    let editedPoint = {};
    editedPoint.id = id;    
    editedPoint.title = document.getElementById("pointTitleEdit").value;
    editedPoint.description = document.getElementById("pointDescriptionEdit").value;
    editedPoint.coordinates = {}
    editedPoint.coordinates.latitude = document.getElementById("latitudeEdit").value;
    editedPoint.coordinates.longitude = document.getElementById("longitudeEdit").value;
    editedPoint.photos = null;
    editedPoint.tags = [];
    await fillTags(editedPoint.tags);
    storePoint(editedPoint);
}

async function fillTags(tags) {
    console.log(allTags);
    for (let tag of allTags) {
        let checkboxState = document.getElementById(tag.name);
        console.log(checkboxState, tag.name);
        if (checkboxState.checked ) {
            tags.push(tag);
        }
    }
}

function storePoint(point) {
    let pointJSON = JSON.stringify(point);
    let token = RETRIEVE_TOKEN();
    console.log(point);
    console.log(token);
    $.ajaxSetup({
    headers : {
        "Authorization": token
    }
    });
    $.ajax({
        url:URL_CREATE_POINT,
        dataType:'json',
        type:'PUT',
        contentType:'application/json',
        data: pointJSON,
        success: function(data) {
            console.log("Point successfully edited");
        },
        error: function(data) {
            console.log(data);
        }
    })
}