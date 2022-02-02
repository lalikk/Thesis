import Cookies from './node_modules/js-cookie/dist/js.cookie.mjs'

let distances = JSON.parse(Cookies.get('distances'));
var points = [];

let ids = Cookies.get("route");
console.log(ids);
if (typeof ids == 'undefined') {
  displayEmpty();
} else {
  let table = document.querySelector("#point-list");  
  var idsArray = JSON.parse(ids);
  const urlPoint = new URL("http://localhost:3000/point_detail");

  $.getJSON('http://localhost:8080/rest/points', function(data, status) {
    console.log(data, status)
    let contents = "";
    for (let point of data) {
      if( idsArray.includes(point.id) ) {
      urlPoint.search = new URLSearchParams({id:`${point.id}`});
      let visitedIds = Cookies.get('visited');
      if (typeof visitedIds == 'undefined' || !visitedIds.includes(parseInt(point.id))) {
        points.push(point);
        contents += `<tr data-point="${point.id}"><td><a href=${urlPoint}>${point.title}</a></td><td>${point.description}</td><td>
        <span class="table-remove"
          ><button type="button" data-point="${point.id}" class="point-remove btn btn-danger btn-rounded btn-sm my-0">
          Remove</button></span></td></tr>\n`;
      } else {
        contents += `<tr data-point="${point.id}"><td><a href=${urlPoint}><p class="text-muted">${point.title}</p></a></td><td><p class="text-muted">${point.description}</p></td><td>
          <span class="table-remove"
            ><button type="button" data-point="${point.id}" class="point-remove btn btn-danger btn-rounded btn-sm my-0">
            Remove</button></span></td></tr>\n`;         
        }
      }
     }
     contents+= `<div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
     <button type="button" id="button-order-route" class="btn btn-primary btn-lg px-4 gap-3">Recommend route</button></div>`;
    table.innerHTML = contents;
    document.querySelector("#button-order-route").onclick = computeRouteOrder();
    for (let button of document.querySelectorAll(".point-remove")) {
        button.onclick = removePoint;
    }

})
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

function displayEmpty() {
  let contents = `To start planning a route, either select an existing route or add any point.\n`;
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
  console.log("closestId:", closestId);
  var cost = 0;
  let vistiedPoints = [];



}

function computePath(cost, vistiedPoints) {
  
}














function suggestShortestPath() {
  // TODO modal pop up location

  //var idsSorted = suggestShortestPath();
  //let startingPoint = await findClosestToUser();

}

function distance(pointA, pointB) {
  for (let d of distances) {
    if ((d.pointAId == pointA && d.pointBId == pointB) || (d.pointAId == pointB && d.pointBId == pointA)) {
      return d.distance;
    }
  }
}

async function findClosestToUser() {
  let userLocation = await getUserPosition();
  let userSMap = SMap.Coords.fromWGS84(userLocation.x, userLocation.y);
  console.log(userLocation);
  console.log(points);
  let minDistance = {distance:userSMap.distance(SMap.Coords.fromWGS84(points[0].coordinates.latitude, points[0].coordinates.longitude)), id:points[0].id};
  console.log(minDistance);
  for (let p of points) {
    let currentSMap = SMap.Coords.fromWGS84(p.coordinates.latitude, p.coordinates.longitude);
    let currentDistance = userSMap.distance(currentSMap);
    if (currentDistance < minDistance.distance) {
      minDistance.distance = currentDistance;
      minDistance.id = p.id;
    }
    console.log(minDistance);
  }
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