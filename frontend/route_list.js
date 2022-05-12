import ROUTE_DATA from './js-modules/route-data.js';
import { MAKE_ROUTE_URL } from './js-modules/constants.js';

$(async () => {
    await renderRoutes(await ROUTE_DATA.getAllRoutes());
})

async function renderRoutes(routes, difficult = null) {

  let table = "<h1 style='margin-bottom: 1rem;'>Naučné trasy</h1>  ";
  for (let id in routes) {
      let route = routes[id];
      if (difficult != null && route.difficult != difficult){
        continue;
      }
      console.log(route)
      if (route.points.length >= 1) {
          table += renderCardRow(route);
      }
  }

  document.querySelector("#route-cards").innerHTML = table;
}

function renderCardRow(route) {
    return `
    <div data-route="${route.id}" class="card-planning" style="background-image: url('${route.points[0].photos[0].image}');">
      <div class="inner-planning" style="padding-right:2rem;">
        <span style="display: inline-block;">      
        <a href=${MAKE_ROUTE_URL(route.id)}><h3>${route.description}</h3></a>
        </span>
      </div>
    </div>`;
  }
  
  window.toggleTagFilter = async function(element) {
    console.log(element);
    let elementId = element.dataset['tag'];
    console.log(elementId);
    let nextElementId = getNextTag(elementId);
    toggleFilterButton(elementId, nextElementId);
    renderRoutes(await ROUTE_DATA.getAllRoutes(), getDifficult(nextElementId));
  }
  
  function toggleFilterButton(elementId, nextElementId) {
    console.log(document.querySelector('#tags-all'));
    console.log(elementId, nextElementId);
    document.querySelector(`#${elementId}`).classList.toggle("d-none");
    document.querySelector(`#${nextElementId}`).classList.toggle("d-none");
  }

  function getNextTag(elementId) {
    switch (elementId) {
      case "tags-difficulty":
        return "tags-easy";
      case "tags-easy":
          return "tags-hard";
      case "tags-hard":    
        return "tags-difficulty";
      default:
        console.error("Invalid tag name");
        return "tags-difficulty";
    }
  }

  function getDifficult(elementId){
    switch (elementId) {
      case "tags-difficulty":
        return null;
      case "tags-easy":
          return false;
      case "tags-hard":    
        return true;
      default:
        console.error("Invalid tag name");
        return null;
    }
  }