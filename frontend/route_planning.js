import Cookies from './node_modules/js-cookie/dist/js.cookie.mjs'

let distances = JSON.parse(Cookies.get('distances'));
console.log("distances:", distances);
var remainingPoints = new Map();

let ids = Cookies.get("route");
let visited = Cookies.get('visited');
var visitedIds = [];
if (typeof visited != 'undefined') {
  visitedIds = JSON.parse(visited);
}

if (typeof ids == 'undefined') {
  clearTable();
  displayEmpty();
} else {
  clearEmptyRoute();
  var idsArray = JSON.parse(ids);
  $.getJSON('http://localhost:8080/rest/points', function(data, status) {
    console.log(data, status)
    for (let id of idsArray) {
      if(!visitedIds.includes(parseInt(id))) {
        for (let point of data) {
            if (point.id == id) {
              remainingPoints.set(point.id, point); 
            }
        }
      }      
    }
    buildTable(idsArray);
  })
}

function buildTable(idsArray) {
  let table = document.querySelector("#point-list");  
  let contents = "";
  let displayRecommendButton = Cookies.get('displayRecommend');
  const urlPoint = new URL("http://localhost:3000/point_detail");

  for (let id of idsArray) {
    urlPoint.search = new URLSearchParams({id:`${id}`});
    if (!visitedIds.includes(id)) {
      //console.log(typeof remainingPoints.get(id), remainingPoints.get(id), id);
      contents += `<tr data-point="${id}"><td><a href=${urlPoint}>${remainingPoints.get(id).title}</a></td><td>${remainingPoints.get(id).description}</td><td>
      <span class="table-remove"
        ><button type="button" data-point="${id}" class="point-remove btn btn-danger btn-rounded btn-sm my-0">
        Remove</button></span></td></tr>\n`;
    } else {
      contents += `<tr data-point="${id}"><td><a href=${urlPoint}><p class="text-muted">${remainingPoints.get(id).title}</p></a></td><td><p class="text-muted">${remainingPoints.get(id).description}</p></td><td>
        <span class="table-remove"
          ><button type="button" data-point="${id}" class="point-remove btn btn-danger btn-rounded btn-sm my-0">
          Remove</button></span></td></tr>\n`;         
    }
  }
  if (typeof displayRecommendButton != undefined && displayRecommendButton == 'true') {
    contents+= `<div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
      <button type="button" id="button-order-route" class="btn btn-primary btn-lg px-4 gap-3">Recommend route</button></div>`;
    table.innerHTML = contents;
    document.querySelector("#button-order-route").onclick = computeRouteOrder;
  } else {
    table.innerHTML = contents;
  }
  for (let button of document.querySelectorAll(".point-remove")) {
    button.onclick = removePoint;
  }
}


function removePoint(e) {
    console.log(e.target);
    console.log(e.target.dataset['point']);
    let id = e.target.dataset['point'];
    let row = document.querySelector(`tr[data-point="${id}"]`);
    console.log(row);
    row.classList.add("d-none");
    removeIdFromCookie(id);
}

function removeIdFromCookie(id) {
    console.log(id);
    var ids = Cookies.get("route");
    var arr = JSON.parse(ids);
    let index = arr.indexOf(parseInt(id));
    arr.splice(index, 1);    
    if (arr.length == 0) {
      displayEmpty();
      Cookies.remove('route');
    } else {
      ids = JSON.stringify(arr);
      Cookies.set('route', ids);
    }
    let visitedIds = Cookies.get('visited');
    if (typeof visitedIds == 'undefined' || !JSON.parse(visitedIds).includes(id)){
      Cookies.set('navigationRecompute', 'true');
    }
  }

function clearTable() {
  let contents = "";
  let textBody = document.querySelector('#point-list');
  textBody.innerHTML = contents;
}

function clearEmptyRoute() {
  let contents = "";
  let textBody = document.querySelector('#empty-route');
  textBody.innerHTML = contents;  
}

function displayEmpty() {
  let contents = `<div><h2>To start planning a route, either select an existing route or add any point.\n</h2></div>`;
  contents += `<div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
  <button type="button" class="btn btn-primary btn-lg px-4 gap-3" onclick="location.href='route_list.html'">Take me to predefined routes</button>
  <button type="button" class="btn btn-outline-secondary btn-lg px-4"onclick="location.href='location.html'">Find what is around me</button>
  </div>`
  console.log(contents);  
  let textBody = document.querySelector('#empty-route');
  textBody.innerHTML = contents;
}

async function computeRouteOrder() {
  let startingPoint = await findClosestToUser();
  let orderedRoute = [startingPoint];
  console.log(idsArray);
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
  //console.log(points);
  console.log("pointId:", pointId);
  console.log("unusedPoints:", unusedPoints);
  let minDistance = {distance:Number.MAX_VALUE, id:-1};
  console.log(minDistance);
  console.log("distances:", distances); 
  for (let d of distances) {
    //console.log(d);
    if ((d.pointAId == pointId || d.pointBId == pointId) && d.distance < minDistance.distance) {
      if (unusedPoints.includes(d.pointAId) || unusedPoints.includes(d.pointBId)){
        minDistance.distance = d.distance;
        let closestId =  d.pointAId == pointId ? d.pointBId : d.pointAId;
        minDistance.id = closestId;
      }
    }
    //console.log("min distance:", minDistance);
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