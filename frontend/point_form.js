import { RETRIEVE_TOKEN } from './js-modules/authorisation-check.js'
import { URL_CREATE_POINT } from './js-modules/constants.js';
import TAG_DATA from './js-modules/point-tag-data.js';

var pointTags;

$(async () => {
    pointTags = await TAG_DATA.getAllTags();
    pointTags = Object.values(pointTags);
    displayCheckboxes(pointTags);
})

function displayCheckboxes(data) {
    let div = document.querySelector("#point-tags");
    let contents = "";
    for (let tag of data) {
        contents += `<div class="form-check">\n
            <input type="checkbox" class="form-check-input" id="${tag.name}">\n
            <label class="form-check-label" for="${tag.name}">${tag.name}</label>\n
            </div>\n`
    }
    div.innerHTML = contents;
}

window.createPoint = async function() {
    console.log('Create point function reached');
    let newPoint = {};
    newPoint.title = document.getElementById("pointTitle").value;
    newPoint.description = document.getElementById("pointDescription").value;
    newPoint.coordinates = {}
    newPoint.coordinates.latitude = document.getElementById("latitude").value;
    newPoint.coordinates.longitude = document.getElementById("longitude").value;
    newPoint.photos = null;
    newPoint.tags = [];
    await fillTags(newPoint.tags);
    console.log(newPoint);
    storePoint(newPoint);
}

async function fillTags(tags) {
    console.log(pointTags);
    for (let tag of pointTags) {
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
        type:'POST',
        contentType:'application/json',
        data: pointJSON,
        success: function(data) {
            console.log("Point successfully created");
        },
        error: function(data) {
            console.log(data);
        }
    })
}
