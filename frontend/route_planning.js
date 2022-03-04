import Cookies from './node_modules/js-cookie/dist/js.cookie.mjs'
import POINT_DATA from './js-modules/point-data.js';
import { VISITED_POINTS, CURRENT_ROUTE } from './js-modules/current-route.js'
import { MAKE_POINT_URL } from './js-modules/constants.js'
import { Navigation } from './js-modules/navigation.js';
import { EXTRACT_COORDINATES, FIND_CLOSEST, TRANSFORM_COORDINATES } from "./js-modules/map-utils.js"

$(async () => {
  await displayCurrentRoute();
});

async function displayCurrentRoute() {
  let currentRoute = CURRENT_ROUTE.getPlannedRoutePoints();
  displayEmptyMessage(currentRoute.length == 0);
  displayReorderButton(!CURRENT_ROUTE.isSorted() && !CURRENT_ROUTE.isEmpty());
  renderCards(await POINT_DATA.getPoints(currentRoute));
}

function renderCards(currentRoute) {  
  let div = document.querySelector("#point-cards");  
  let contents = "";

  for (let i=0; i < currentRoute.length; ++i) {
    contents += renderCardRow(currentRoute[i], VISITED_POINTS.isVisited(currentRoute[i].id), i == 0, i == currentRoute.length-1);
  }
  div.innerHTML = contents;
}

function renderCardRow(point, visited, isFirst, isLast) {
  return `
  <div data-point="${point.id}" class="card-planning" style="background-image: url('${point.photos[0].image}');">
    <div class="inner-planning">
      <span style="display: inline-block;">      
      <a href=${MAKE_POINT_URL(point.id)} class="${visited ? "text-muted" : ""}"><h3>${point.title}</h3></a>
      </span>
      <span class="visited-remove" style="display: inline-block; margin: 0 1rem 0 4rem;">
        <button type="button" data-pointadd="${point.id}" onclick="window.revertVisited(this)" class="${visited ? "" : "invisible"} point-remove delbtn  btn-pink-delete my-0">
          <span class="mdi mdi-delete mdi-24px">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
            </svg>
          </span>
        </button>
      </span>
      <span class="visited-remove" style="display: inline-block; margin: 0 1rem 0 0;">
      <button type="button" data-pointup="${point.id}" onclick="window.moveUp(this)" class="${isFirst ? "invisible" : ""} point-remove delbtn  btn-delete my-0">
        <span class="mdi mdi-delete mdi-24px">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" class="bi bi-arrow-up-short" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
          </svg>
        </span>
      </button>
    </span>
    <span class="visited-remove" style="display: inline-block; margin: 0 1rem 0 0;">
    <button type="button" data-pointdown="${point.id}" onclick="window.moveDown(this)" class="${isLast ? "invisible" : ""} point-remove delbtn  btn-delete my-0" >
      <span class="mdi mdi-delete mdi-24px">
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
        </svg>
      </span>
    </button>
  </span>
      <span class="table-remove" style="display: inline-block;">
        <button type="button" data-pointremove="${point.id}" onclick="window.removePoint(this)" class="point-remove delbtn btn-delete my-0">
          <span class="mdi mdi-delete mdi-24px">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
            </svg>
          </span>
        </button>
      </span>
    </div>
  </div>`;
}

window.removePoint = function(element) {
  let pointId = element.dataset['pointremove'];
  let row = document.querySelector(`div[data-point="${pointId}"]`);
  row.parentNode.removeChild(row);
  CURRENT_ROUTE.remove(pointId);
  displayEmptyMessage(CURRENT_ROUTE.isEmpty());
  displayReorderButton(!CURRENT_ROUTE.isSorted()); 
}

window.revertVisited = async function(element) {
  let pointId =element.dataset['pointadd'];
  VISITED_POINTS.removeFromVisited(pointId);
  document.querySelector(`tr[data-point="${pointId}"]`).classList.toggle("d-none", true);
  await displayCurrentRoute();
}

window.moveUp = async function(element) {
  let pointId = element.dataset['pointup'];
  let route = CURRENT_ROUTE.getPlannedRoutePoints();
  let index = route.indexOf(parseInt(pointId));
  route = swap(route, index, index-1);
  CURRENT_ROUTE.refresh(route, route.length >= 2);
  await displayCurrentRoute();
}

window.moveDown = async function(element) {
  let pointId = element.dataset['pointdown'];
  let route = CURRENT_ROUTE.getPlannedRoutePoints();
  let index = route.indexOf(parseInt(pointId));
  route = swap(route, index, index+1);
  CURRENT_ROUTE.refresh(route, route.length >= 2);
  await displayCurrentRoute();
}

function swap(array, from, to) {
  let temp = array[from];
  array[from] = array[to];
  array[to] = temp;
  return array;
}

function displayEmptyMessage(visible) {
  CURRENT_ROUTE.restartTracking();  
  document.querySelector('#empty-route').classList.toggle("d-none", !visible);
}

function displayReorderButton(visible) {
  document.querySelector('#button-order-route').classList.toggle("d-none", !visible);
}


///////////// Optimal distances

let distances = JSON.parse(Cookies.get('distances'));
console.log("distances:", distances);

window.computeRouteOrder = async function() {
  if (CURRENT_ROUTE.hasVisitedPoints()) {
    // TODO let user know to remove visited points
    return;
  }

  let startingPointId = await findClosestToUser();
  let orderedRoute = [startingPointId];
  //console.log(idsArray);
  let unusedPoints = CURRENT_ROUTE.getPlannedRoutePoints();
  unusedPoints.splice(unusedPoints.indexOf(startingPointId), 1);
  console.log("closestId:", startingPointId);
  console.log("unused initial", unusedPoints);
  while (unusedPoints.length > 0) {
    console.log("ordered route:", orderedRoute);  
    console.log("unused points:", unusedPoints);
    orderedRoute.push(findClosestPoint(orderedRoute[orderedRoute.length - 1], unusedPoints));
  }
  if (JSON.stringify(CURRENT_ROUTE.getPlannedRoutePoints()) != JSON.stringify(orderedRoute)) {
    CURRENT_ROUTE.refresh(orderedRoute, true);
  }
  await displayNewOrder(orderedRoute);
}

async function displayNewOrder(idsArray) {
  document.querySelector("#point-cards").innerHTML = "";
  displayReorderButton(false);
  renderCards(await POINT_DATA.getPoints(idsArray));
}

/**
 * Finds a point closest to user location, returns its id
 * @returns point id
 */
async function findClosestToUser() {
  let NAVIGATION = new Navigation();
  let userLocation = await NAVIGATION.getUserCoordinates();
  let points = await POINT_DATA.getPoints(CURRENT_ROUTE.getPlannedRoutePoints());
  let pointCoordinates = EXTRACT_COORDINATES(Object.values(points));
  console.log("Points transformation:", points, pointCoordinates, userLocation);
  let index = FIND_CLOSEST(userLocation.coordinates, pointCoordinates);
  let closestPoint = (Object.values(points)[index]);
  console.log(closestPoint);
  return closestPoint.id;
}

function findClosestPoint(pointId, unusedPoints) {
  console.log("pointId:", pointId);
  console.log("unusedPoints:", unusedPoints);
  let source = POINT_DATA.getPoint(pointId);
  let targets = POINT_DATA.getPoints(unusedPoints);
  targets = EXTRACT_COORDINATES(Object.values(targets));
  let index = FIND_CLOSEST(source.coordinates, targets);

  return unusedPoints.splice(index, 1)[0];
}
