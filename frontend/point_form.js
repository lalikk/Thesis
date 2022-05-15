import { RETRIEVE_TOKEN } from './js-modules/authorisation-check.js'
import { URL_CREATE_POINT, URL_DISTANCES_CREATE, URL_DISTANCES_LIST, URL_POINT_LIST_EDIT } from './js-modules/constants.js';
import { TRANSFORM_COORDINATES } from './js-modules/map-utils.js';
import POINT_DATA from './js-modules/point-data.js';
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
    await storePoint(newPoint);
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

async function storePoint(point) {

    //await updateDistances();
    //return;
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
        success: async function(data) {
            console.log(data);
            console.log("Point successfully created");
            await updateDistances(data);
            POINT_DATA.clear();
            window.location = URL_POINT_LIST_EDIT;
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


async function updateDistances(created) {

    let points = await POINT_DATA.getAllPoints();
    for (let point of Object.values(points)) {
        if (point.id == created.id) {
            continue;
        }

        await distancePromise(created, point);
        await distancePromise(point, created);
    }
}

function distancePromise(A, B) {
    return new Promise((success, error) => {
        let A_coords = TRANSFORM_COORDINATES(A.coordinates);
        let B_coords = TRANSFORM_COORDINATES(B.coordinates);
        SMap.Route.route([A_coords, B_coords], { criterion:"turist1" }).then((route) => {
            var routeResults = route.getResults();
            //console.log(i,j);
            console.log(routeResults);
            let distanceObj = { 
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
                type:'POST',
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