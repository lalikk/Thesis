import { MAKE_EDITABLE_POINT_URL, MAKE_EDIT_POINT_FORM_URL, MAKE_REMOVE_POINT_URL, URL_POINT_CREATE_REDIRECT } from './js-modules/constants.js';
import { RETRIEVE_TOKEN } from './js-modules/authorisation-check.js'
import POINT_DATA from './js-modules/point-data.js';

$( async () => {
    let data = Object.values(await POINT_DATA.getAllPoints());            // todo error handling
    displayData(data);
})

function displayData(data) {
    let div = document.querySelector("#editable-point-list");
    let contents = `<thead><tr>
        <th scope="col">Existing points</th>
        <!--<th scope="col">Tag</th>-->
        <th scope="col"> <button type="button" id='add-point' onclick="location.href='${URL_POINT_CREATE_REDIRECT}'" class="btn btn-primary btn-lg px-4 gap-3" 
        > Create new point
      </button></th>
    </tr>
    </thead>`;

    for (let point of data) {
        contents += `<tr><td><a href=${MAKE_EDITABLE_POINT_URL(point.id)}>${point.title}</a></td>\n
            <td><span class="point-remove"><button type="button" data-pointremove="${point.id}" onclick="window.removePoint(this)"
            class="btn btn-primary btn-lg px-4 gap-3">
            Remove</button></span>
            <span class="point-remove"><button type="button" data-point="${point.id}" onclick="location.href='${MAKE_EDIT_POINT_FORM_URL(point.id)}'" 
            class="btn btn-secondary btn-lg px-4 gap-3">
            Edit</button></span></td></tr>\n`;
    }
    div.innerHTML = contents;
}

window.removePoint = async function(element) {
    let pointId = element.dataset['pointremove'];
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
                window.location = window.location;
            },
            error: function(data) {
                console.log(data);
            }
        })
}
