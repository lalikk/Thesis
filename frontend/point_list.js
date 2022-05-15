import POINT_DATA from "./js-modules/point-data.js";
import { MAKE_POINT_URL } from './js-modules/constants.js';
import TAG_DATA from './js-modules/point-tag-data.js';

$(async () => {
    await renderPoints(await POINT_DATA.getAllPoints());
})

async function renderPoints(points, tag = null) {
    let div = document.querySelector("#masonry");
    let contents = "<h1 style='margin-bottom: 1rem;'>Místa</h1> ";
    console.log("Before", points);
    if (tag != null) {
        let pointIds = Object.values(points).filter(x => x.tags.map(t => t.id).includes(tag.id)).map(x => x.id);
        points = await POINT_DATA.getPoints(pointIds);
      }
    console.log("After", points);
    for (let id in points) {
        let point = points[id];
        contents += renderPointCard(point);
    }
    div.innerHTML = contents;
}

function renderPointCard(point) {
    return `<div class="col-sm-6 col-lg-4 mb-4">
                <a href="${MAKE_POINT_URL(point.id)}">
                <div class="card">
                    <object class="card-img-top" data="${point.photos[0] ? point.photos[0].image: ""}" width="100%" height="200" focusable="false">
                      <img class="card-img-top" src="./images/noimage.jpg" type="image/jpeg" width="100%" height="200" focusable="false"/>
                    </object>
                    <div class="card-body">
                        <h5 class="card-title">${point.title}</h5>
                        <div class="card-detail text-ellipsis--3">${point.description}</div>
                    </div>
                </div>
                </a>
            </div>`;
}


window.toggleTagFilter = async function(element) {
    console.log(element);
    let elementId = element.dataset['tag'];
    let nextElementId = getNextTag(elementId);
    toggleFilterButton(elementId, nextElementId);
    let tagTitle =getTagTitle(nextElementId);
    let tag = await TAG_DATA.getTagFromTitle(tagTitle);
    await renderPoints(await POINT_DATA.getAllPoints(),tag);
    console.log(tag);
  }
  
  function toggleFilterButton(elementId, nextElementId) {
    console.log(document.querySelector('#tags-all'));
    console.log(elementId, nextElementId);
    document.querySelector(`#${elementId}`).classList.toggle("d-none");
    document.querySelector(`#${nextElementId}`).classList.toggle("d-none");
  }
  
  function getNextTag(elementId) {
    switch (elementId) {
      case "tags-all":
        return "tags-nature";
      case "tags-nature":
          return "tags-church";
      case "tags-church":
        return "tags-architecture";
      case "tags-architecture":    
        return "tags-all";
      default:
        console.error("Invalid tag name");
        return "tags-all";
    }
  }
  
  function getTagTitle(elementId) {
    switch (elementId) {
      case "tags-all":
        return null;
      case "tags-nature":
          return "Nature";
      case "tags-church":
        return "Church";
      case "tags-architecture":    
      return "Architecture";
      default:
        console.error("Invalid tag name");
        return null;
    }
  }
  