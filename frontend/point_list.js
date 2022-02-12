import POINT_DATA from "./js-modules/point-data.js";
import { MAKE_POINT_URL } from './js-modules/constants.js';

$(async () => {
    let points = await POINT_DATA.getAllPoints();
    let div = document.querySelector("#masonry");
    let contents = "";

    for (let id in points) {
        let point = points[id];
        contents += renderPointCard(point);
    }
    div.innerHTML = contents;
})

function renderPointCard(point) {
    return `<div class="col-sm-6 col-lg-4 mb-4">
                <div class="card">
                    <img class="card-img-top" src="${point.photos[0].image}" width="100%" height="200" focusable="false"/>
                    <div class="card-body">
                        <h5 class="card-title"><a href="${MAKE_POINT_URL(point.id)}">${point.title}</a></h5>
                        <p class="card-text">${point.description}</p>
                    </div>
                </div>
            </div>`;
}
