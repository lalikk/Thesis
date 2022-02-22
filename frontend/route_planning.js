import Cookies from './node_modules/js-cookie/dist/js.cookie.mjs'
import POINT_DATA from './js-modules/point-data.js';
import { VISITED_POINTS, CURRENT_ROUTE } from './js-modules/current-route.js'
import { MAKE_POINT_URL } from './js-modules/constants.js'

$(async () => {
  await displayCurrentRoute();
});

async function displayCurrentRoute() {
  let currentRoute = CURRENT_ROUTE.getRoutePoints();
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
        <button type="button" data-pointremove="${point.id}" onclick="window.revertVisited(this)" class="${visited ? "" : "d-none"} point-remove btn btn-primary btn-rounded btn-sm my-0">Add to route</button>
      </span>
        <span class="table-remove">
          <button type="button" data-point-add="${point.id}" onclick="window.removePoint(this)" class="point-remove btn btn-danger btn-rounded btn-sm my-0">Remove</button>
        </span>
      </td>
    </tr>
  `;
}

window.removePoint = function(element) {
  let pointId = element.dataset['pointremove'];
  console.log(pointId);
  let row = document.querySelector(`tr[data-pointremove="${pointId}"]`);
  row.parentNode.removeChild(row);
  CURRENT_ROUTE.remove(pointId);
  displayEmptyMessage(CURRENT_ROUTE.isEmpty());
  displayReorderButton(!CURRENT_ROUTE.isSorted()); 
}

window.revertVisited = async function(element) {
  console.log(element);
  VISITED_POINTS.removeFromVisited(element.dataset['point']);
  document.querySelector(`tr[data-point-add="${pointId}"]`).classList.toggle("d-none", true);
  await this.displayCurrentRoute();
}

function displayEmptyMessage(visible) {
  document.querySelector('#empty-route').classList.toggle("d-none", !visible);
}

function displayReorderButton(visible) {
  document.querySelector('#button-order-route').classList.toggle("d-none", !visible);
}


///////////// Optimal distances

let distances = JSON.parse(Cookies.get('distances'));
console.log("distances:", distances);


window.computeRouteOrder = async function() {
  let startingPoint = await findClosestToUser();
  let orderedRoute = [startingPoint];
  //console.log(idsArray);
  let unusedPoints = JSON.parse(JSON.stringify(idsArray));
  unusedPoints.splice(unusedPoints.indexOf(startingPoint), 1);
  console.log("closestId:", startingPoint);
  console.log("unused initial", unusedPoints);
  while (orderedRoute.length < idsArray.length) {
    console.log("ordered route:", orderedRoute);  
    console.log("unused points:", unusedPoints);
    orderedRoute.push(findClosestPoint(orderedRoute[orderedRoute.length - 1], unusedPoints));
  }
  if (JSON.stringify(idsArray) != JSON.stringify(orderedRoute)) {
    idsArray = orderedRoute;
    Cookies.set('route', JSON.stringify(idsArray));
    Cookies.set('navigationRecompute', 'true');
  }
  // Optimal route is presented, no recomputation offered till change
  Cookies.set('displayRecommend', 'false');    
  console.log(idsArray);
  console.log("ordered route", orderedRoute);
  console.log("unused:", unusedPoints);
  displayNewOrder(idsArray);
}

function displayNewOrder(idsArray) {
  document.querySelector("#point-list").innerHTML = "";
  buildTable(idsArray);
}

async function findClosestToUser() {
  let userLocation = await getUserPosition();
  let userSMap = SMap.Coords.fromWGS84(userLocation.x, userLocation.y);
  //console.log(userLocation);
  //console.log(points);
  let points = Array.from(remainingPoints.values());
  console.log(remainingPoints);
  console.log(points);

  let minDistance = {distance:userSMap.distance(SMap.Coords.fromWGS84(points[0].coordinates.latitude, points[0].coordinates.longitude)), id:points[0].id};
  //console.log(minDistance);
  for (let p of points) {
    let currentSMap = SMap.Coords.fromWGS84(p.coordinates.latitude, p.coordinates.longitude);
    let currentDistance = userSMap.distance(currentSMap);
    if (currentDistance < minDistance.distance) {
      minDistance.distance = currentDistance;
      minDistance.id = p.id;
    }
    //console.log(minDistance);
  }
  return minDistance.id;
}

function findClosestPoint(pointId,unusedPoints) {
  console.log("pointId:", pointId);
  console.log("unusedPoints:", unusedPoints);
  let minDistance = {distance:Number.MAX_VALUE, id:-1};
  console.log(minDistance);
  console.log("distances:", distances); 
  for (let d of distances) {
    console.log(d);
    if ((d.pointAId == pointId || d.pointBId == pointId) && d.distance < minDistance.distance) {
      if (unusedPoints.includes(d.pointAId) || unusedPoints.includes(d.pointBId)){
        minDistance.distance = d.distance;
        let closestId =  d.pointAId == pointId ? d.pointBId : d.pointAId;
        minDistance.id = closestId;
      }
    }
    console.log("min distance:", minDistance);
  }
  unusedPoints = unusedPoints.splice(unusedPoints.indexOf(minDistance.id), 1);
  return minDistance.id;
}

  function getUserPosition() {
    return new Promise((success, error) => {
      navigator.geolocation.getCurrentPosition((data) => {
        data = SMap.Coords.fromWGS84(data.coords.longitude, data.coords.latitude);
        success(data);
      }, error);
    });
  }
