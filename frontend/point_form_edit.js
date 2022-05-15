import POINT_DATA from './js-modules/point-data.js';
import TAG_DATA from './js-modules/point-tag-data.js';
import { URL_CREATE_POINT, MAKE_EDITABLE_POINT_URL, URL_DISTANCES_CREATE } from './js-modules/constants.js';
import { RETRIEVE_TOKEN } from './js-modules/authorisation-check.js'
import { TRANSFORM_COORDINATES } from './js-modules/map-utils.js';

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
    let existingPoint = await POINT_DATA.getPoint(id);
    console.log("Existing:", existingPoint);
    editedPoint.id = id;    
    editedPoint.title = document.getElementById("pointTitleEdit").value;
    editedPoint.description = document.getElementById("pointDescriptionEdit").value;
    editedPoint.coordinates = {}
    editedPoint.coordinates.id = existingPoint.coordinates.id;
    editedPoint.coordinates.latitude = document.getElementById("latitudeEdit").value;
    editedPoint.coordinates.longitude = document.getElementById("longitudeEdit").value;
    //editedPoint.photos = existingPoint.photos;
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
        success: async function(data) {
            await updateDistances(data);
            POINT_DATA.clear();
            window.location = MAKE_EDITABLE_POINT_URL(point.id);
            console.log("Point successfully edited");
        },
        error: function(data) {
            if (data.status == 400) {
                alert("Invalid point data. Please check the form.");
            } else {
                alert("Connection error.");
            }
            console.log(data);
        }
    })
}



async function updateDistances(updated) {
    let distancesArray = await POINT_DATA.getAllDistances();
    let distances = {};
    for (let dist of distancesArray) {
        distances[`${dist.pointAId},${dist.pointBId}`] = dist;
    }
    console.log(distances);
    let points = await POINT_DATA.getAllPoints();
    for (let point of Object.values(points)) {
        if (point.id == updated.id) {
            continue;
        }

        await distancePromise(updated, point, distances);
        await distancePromise(point, updated, distances);
    }
}

function distancePromise(A, B, existing) {
    return new Promise((success, error) => {
        let A_coords = TRANSFORM_COORDINATES(A.coordinates);
        let B_coords = TRANSFORM_COORDINATES(B.coordinates);
        SMap.Route.route([A_coords, B_coords], { criterion:"turist1" }).then((route) => {
            var routeResults = route.getResults();
            //console.log(i,j);
            console.log(routeResults);
            let distanceObj = { 
                id: existing[`${A.id},${B.id}`].id,
                pointAId: A.id, 
                pointBId: B.id, 
                distance: routeResults.time
            };

            if (!distanceObj.distance) {
                distanceObj.distance = A_coords.distance(B_coords) / 1.4;
            }

            if (distanceObj.distance == 0) {
                distanceObj.distance = 0.1;
            }

            let distanceJSON = JSON.stringify(distanceObj);
            let token = RETRIEVE_TOKEN();
            $.ajaxSetup({
                headers : { "Authorization": token }
            });
            
            $.ajax({
                url: URL_DISTANCES_CREATE,
                dataType:'json',
                type:'PUT',
                contentType:'application/json',
                data: distanceJSON,
                success: function(data) {
                    console.log("Posted distance data for:", distanceObj);
                    success();
                },
                error: function(data) {
                    console.log("Distance post failed.", distanceObj);
                    error();
                }
            });
        });
    });
}