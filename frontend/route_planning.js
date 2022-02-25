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
  displayReorderButton(!CURRENT_ROUTE.isSorted());
  renderTable(await POINT_DATA.getPoints(currentRoute));
}

function renderTable(currentRoute) {
  let table = document.querySelector("#point-list");  
  let contents = "";

  for (let point of currentRoute) {
    contents += renderTableRow(point, VISITED_POINTS.isVisited(point.id));
  }

  table.innerHTML = contents;
}

function renderTableRow(point, visited) {
  return `
    <tr data-point="${point.id}">
      <td>
        <a href=${MAKE_POINT_URL(point.id)} class="${visited ? "text-muted" : ""}">${point.title}</a>
      </td>
      <td>
      <span class="visited-remove">
        <button type="button" data-pointadd="${point.id}" onclick="window.revertVisited(this)" class="${visited ? "" : "d-none"} point-remove btn btn-primary btn-rounded btn-sm my-0">Add to route</button>
      </span>
        <span class="table-remove">
          <button type="button" data-pointremove="${point.id}" onclick="window.removePoint(this)" class="point-remove btn btn-danger btn-rounded btn-sm my-0">Remove</button>
        </span>
      </td>
    </tr>
  `;
}

window.removePoint = function(element) {
  let pointId = element.dataset['pointremove'];
  let row = document.querySelector(`tr[data-point="${pointId}"]`);
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
  document.querySelector("#point-list").innerHTML = "";
  displayReorderButton(false);
  renderTable(await POINT_DATA.getPoints(idsArray));
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
