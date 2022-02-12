import { MapView, Navigation } from "./js-modules/navigation.js";
import POINT_DATA from './js-modules/point-data.js';
import { VISITED_POINTS, CURRENT_ROUTE } from "./js-modules/current-route.js";
import { MAKE_POINT_URL } from './js-modules/constants.js';

var MAP = null;
var NAVIGATION = null;

$(async () => {
  MAP = new MapView("map");
  NAVIGATION = new Navigation(MAP);

  // Open point detail on marker click.
  MAP.addMarkerClickListener(onPointMarkerClick);

  let routePointIds = CURRENT_ROUTE.getRoutePoints();
  let routePoints = await POINT_DATA.getPoints(routePointIds);

  syncMarkersWithRoute(MAP, routePoints);
});

window.recomputeOffRoute = function() {
  console.log("Recompute off route.");
}

window.ignoreOffRoute = function() {
  console.log("Ignore off route.");
}

window.recomputeNearby = function(element) {
  console.log("Recompute add nearby.", element);
}

window.ignoreNearby = function(element) {
  console.log("Ignore add nearby.", element);
}

function syncMarkersWithRoute(map, routePoints) {
  map.removePointMarkers();
  for (let i = 0; i < routePoints.length; i++) {
    map.addPointMarker(routePoints[i], i+1);
  }
}

function onPointMarkerClick(marker) {
  if (marker.getId().startsWith("point-")) {
    let id = marker.getId().substring(6);
    window.location.href = MAKE_POINT_URL(id); 
  }
}

/*
var pointLocation;
var ignoredNearby = [];
var ignored = Cookies.get("ignoredPointsNearby");
if (typeof ignored != 'undefined') {
  ignoredNearby = JSON.parse(ignored);
}


let routePointsPromise = createRoutePointsPromise();
function createRoutePointsPromise(){
  return new Promise((success, error) => {
    if (allPoints == null) {
      $.getJSON('http://localhost:8080/rest/points', (data) => {
        window.localStorage.setItem('pointsRequest', JSON.stringify(data));
        success(prepareRoutePoints(data));
      }).fail(error); 
    } else {
      let data = JSON.parse(allPoints);
      success(prepareRoutePoints(data));
    }
  });
}

function computeRoutePoints() {
  var indexInRoute = 1;
  let routePoints = [];
  for (let id of plannedRoute) {
    if (!visitedIds.includes(id)) {
      let point = remainingPoints.get(id);
      point["indexInRoute"] = indexInRoute;
      point["SMapCoords"] = SMap.Coords.fromWGS84(point.coordinates.latitude, point.coordinates.longitude);
      routePoints.push(point);
      indexInRoute++;
    }
  }
  return routePoints;
}

function prepareRoutePoints(data) {
  for (let id of plannedRoute) {
    if(!visitedIds.includes(parseInt(id))) {
      for (let point of data) {
          if (point.id == id) {
            remainingPoints.set(point.id, point); 
          }
      }
    }      
  }
  let routePoints = computeRoutePoints();
  console.log("routePoints",routePoints);
  return routePoints;
}


let locationPromise = createLocationPromise();

function createLocationPromise() {
  return new Promise((success, error) => {
  navigator.geolocation.getCurrentPosition((data) => {
    data["SMapCoords"] = SMap.Coords.fromWGS84(data.coords.longitude, data.coords.latitude);
    success(data);
  }, error);
});
}

function createRoutePromise(userLocation, userRoute) {
  return new Promise(async (success, error) => {
    let recompute = Cookies.get('navigationRecompute');
    // TODO: (?) Remove recompute flag and use existence of geometry instead.
    if(recompute === "false") {
      let g = window.localStorage.getItem('geometry');
      let geometry = JSON.parse(g);
      let geometries = [];
      for (let g of geometry) {
        let coords = [];
        for (let c of g.coords) {
          coords.push(SMap.Coords.fromWGS84(c.x, c.y));
        }
        geometries.push(new SMap.Geometry(SMap.GEOMETRY_POLYLINE, null, coords, g.options));
      }
      success(geometries);
    } else if (userLocation != null && userRoute != null) {
      console.log("user route", userRoute);
      var coords = [];
      // TODO: Handle case when location is not available (promis throws exception).
      coords.push(userLocation.SMapCoords);
      for (let routePoint of userRoute) {
        coords.push(routePoint.SMapCoords);
      }
      console.log("coords",coords);
      // Add error handling
      SMap.Route.route(coords, { geometry: true, itinerary:true }).then((route) => {
        var routeResults = route.getResults();
        console.log("route results", routeResults);
        var coords = routeResults.geometry;
        var g = new SMap.Geometry(SMap.GEOMETRY_POLYLINE, null, coords);
        // slice geometrydisplayPointMarkers
        let geometryPerSegments = sliceGeometry(g, routeResults.points);
        storeGeometry(geometryPerSegments);
        // which segment of route user is on, always start at beginning as user location = 1st point
        Cookies.set('userProgress', '0');
        success(geometryPerSegments);
      });
    } else {
      success(null);
    }
  });
}

let globalPoints = await routePointsPromise;
console.log("global points:", globalPoints);
displayPointMarkers(globalPoints);
let globalRoute = await createRoutePromise(null, globalPoints);
if (globalRoute != null) {
  await displayRoute(globalRoute, null);
}
let globalLocation = await locationPromise;
globalRoute = await createRoutePromise(globalLocation, globalPoints);
updateUserMarker(globalLocation);
await displayRoute(globalRoute, globalLocation);
if (allPoints == null) {
  saveLocations(await allPointsPromise)
} else {
  saveLocations(JSON.parse(allPoints))};

navigator.geolocation.watchPosition(function (position) {
  position["SMapCoords"] = SMap.Coords.fromWGS84(position.coords.longitude, position.coords.latitude);
  globalLocation = position;
  updateUserMarker(position);
  receiveCoords(position);
  displayRoute(globalRoute, position);
  checkPointsAround(position);
}, showError);

function displayRoute(routeGeometry, userLocation) {
  var currentGeometry;
  if (userLocation != null) {
    currentGeometry = changeRouteProgress(routeGeometry, userLocation);
    //console.log("Display with location",routeGeometry.length, routeGeometry);

  } else {
    currentGeometry = routeGeometry;
    //console.log("Display NO location",routeGeometry.length, routeGeometry);
  }
  layerGeometry.removeAll();
  for (let g of currentGeometry) {
    layerGeometry.addGeometry(g);
  }
  layerGeometry.clear();
  layerGeometry.redraw();
  Cookies.remove('ignoreOffRoute');
}

function changeRouteProgress(routeGeometry, userLocation) {
  let segmentProgress = Cookies.get('userProgress');
  for (let i = 0; i < segmentProgress; ++i) {
    routeGeometry[i]._options.color = 'gray';
  }
  segmentProgress = Cookies.get('userProgress');
  //console.log("User segment progress:",segmentProgress);
  if (checkGoalReached(routeGeometry[segmentProgress], userLocation)) {
    if (segmentProgress == plannedRoute.length -1) {
      plannedRoute = [];
      Cookies.remove('route');
      layerGeometry.removeAll();
      // TODO modal route is over
    } else {
      visitedIds.push(plannedRoute[segmentProgress]);
      Cookies.set('visited', JSON.stringify(visitedIds));
      segmentProgress++;
      Cookies.set('userProgress', segmentProgress);
    }
  }
  //console.log("User segment progress:",segmentProgress);
  let changedGeometry = createGeometryCopy(routeGeometry);
  //console.log("in change route progress",changedGeometry);
  let closestPoint = findUserOnRoute(changedGeometry[segmentProgress].getCoords(), userLocation);
  //console.log("Closest point by distance calc",closestPoint);
  //console.log("User on route:", closestPoint, segmentProgress, routeGeometry, userLocation);
  //console.log(routeGeometry[segmentProgress].getCoords);
  if (closestPoint == -1 ) {
    //console.log("Triggered inform off route", closestPoint);
    //console.log("User on route:", closestPoint, segmentProgress, routeGeometry, userLocation);
    //console.log(changedGeometry[segmentProgress].getCoords);
  
    informUserOffRoute(userLocation); 
    return changedGeometry;
  }
  let visitedPart = changedGeometry[segmentProgress]._coords.splice(0, closestPoint+1);
  let visitedGeometry = new SMap.Geometry(SMap.GEOMETRY_POLYLINE, null, visitedPart, changedGeometry[segmentProgress].getOptions());
  visitedGeometry._options.color='gray';
  changedGeometry.splice(segmentProgress, 0, visitedGeometry);
  return changedGeometry;
}

function createGeometryCopy(routeGeometry) {
  let newGeometry = [];
  for (let g of routeGeometry) {
    let coordinates = [];
    let newGeometryData = JSON.parse(JSON.stringify({type:g.getType, coords:g.getCoords(), options:g.getOptions()}));
    for (let i = 0; i < newGeometryData.coords.length; i++) {
      coordinates.push(SMap.Coords.fromWGS84(newGeometryData.coords[i].x, newGeometryData.coords[i].y));
    }
    newGeometryData.coords = coordinates;
    newGeometry.push(new SMap.Geometry(SMap.GEOMETRY_POLYLINE, null, newGeometryData.coords, newGeometryData.options))
  }
  return newGeometry;
}

function checkGoalReached(route, user){
  //console.log("Check goal",route, user);
  let userSMap = SMap.Coords.fromWGS84(user.SMapCoords.x, user.SMapCoords.y);
  let routeEndSMap = SMap.Coords.fromWGS84(route._coords[route._coords.length-1].x, route._coords[route._coords.length-1].y);
  //console.log()
  //if (calcDistance(user, route[route.length -1]) < 0.05) {
  //console.log(userSMap);
  //console.log(routeEndSMap);
  //console.log(userSMap.distance(routeEndSMap));
  if (userSMap.distance(routeEndSMap) < 100){
    console.log("checkpoint reached");
    return true;
  } else {
    return false;
  }
}

function findUserOnRoute(route, user) {
  if (route.length == 0) {
    return 0;
  }
  //console.log(route);
  let firstPointDistance = user.SMapCoords.distance(route[0]);
  var smallestDistance = {index:0, distance:firstPointDistance}
  for (let i = 0; i < route.length; ++i) {
    //let distance = calcDistance(user.SMapCoords, route[i]);
    let distance = user.SMapCoords.distance(route[i]);
    if (distance < smallestDistance.distance) {
      smallestDistance.index = i;
      smallestDistance.distance = distance;
    }
  }
  //console.log("Data fo distance calculation:", route, user);
  //console.log("Smallest distance",smallestDistance);
  if (smallestDistance.distance > 100) {
    return -1;
  } else {
    return smallestDistance.index;
  }
}

function informUserOffRoute(userLocation) {
  let ignoreOffRoute = Cookies.get('ignoreOffRoute');
  //console.log(ignoreOffRoute);
  if (typeof ignoreOffRoute == 'undefined'){
    document.querySelector("#button-recompute-off-route").setAttribute('data-userLocation', JSON.stringify(userLocation));
    $('#off-route').modal('show');
  }
  // TODO: if ignoring, add option to recompute later
}

function recomputeOffRoute (e) {
  Cookies.set('navigationRecompute', 'true');
  Cookies.set('ignoreOffRoute', 'true');
  createRoutePromise(globalLocation, globalPoints).then((route) => {
    console.log("Route recomputed.");
    globalRoute = route;
    displayRoute(route, globalLocation);
    //window.location.reload();
  });
}

function ignoreOffRoute () {
  Cookies.set('ignoreOffRoute', 'true');
}

function updateUserMarker(userLocation) {
  let markers = layerMarkers.getMarkers();
  for (var i = 0; i < markers.length; i++) {
      if (markers[i].getId() == 'user_location') {
        layerMarkers.removeMarker(markers[i]);        
        break;
    }
  }  
  var location = JAK.mel("div");
  var pic = JAK.mel("img", {src:SMap.CONFIG.img+"/marker/drop-red.png"});
  location.appendChild(pic);
  var userMarker = new SMap.Marker(userLocation.SMapCoords, "user_location", {url:location, title:"You are standing here"});
  layerMarkers.addMarker(userMarker);
}

function showError(error) {
  var x;
  switch(error.code) {
    case error.PERMISSION_DENIED:
      x = "User denied the request for Geolocation."
      break;
    case error.POSITION_UNAVAILABLE:
      x = "Location information is unavailable."
      break;
    case error.TIMEOUT:
      x = "The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      x = "An unknown error occurred."
      break;
  }
  Cookies.set('locationAllowed', false);
}

function storeGeometry(g) {
  let geometry = [];
  for (let gItem of g) {
     geometry.push({type: gItem.getType(), coords: gItem.getCoords(), options:gItem.getOptions()});
  }
  let jsonGeometry = JSON.stringify(geometry);
  window.localStorage.setItem('geometry', jsonGeometry);
  let x = window.localStorage.getItem('updated');
  if (x == null) {
    x = "";
  }
  //window.localStorage.setItem('updated', x + "1");
  Cookies.set('navigationRecompute', 'false');
}

function sliceGeometry(geometry, points) {
  let geometrySegments = [];
  var partingIndex = 0;
  // skip leading zeroes
  while (points[partingIndex].index == 0) {
    ++partingIndex;
  }
  for (; partingIndex < points.length; ++partingIndex) {
    if(points[partingIndex].index == 0) {
      geometrySegments.push(geometry._coords.splice(0, points[partingIndex-1].index+1));
      while (points[partingIndex].index == 0) {
        ++partingIndex;
      }
    }
  }
  geometrySegments.push(geometry._coords);
  return createGeometries(geometrySegments, geometry);
}

function createGeometries(geometrySegments, geometry) {
  let routeGeometry = [];
  for (let segment of geometrySegments) {
    routeGeometry.push(new SMap.Geometry(SMap.GEOMETRY_POLYLINE, null, segment, geometry.getOptions()));
  }
  return routeGeometry;
}

function saveLocations (points) {
  pointLocation = points;
}

function checkPointsAround(userLocation) {
  for (let point of pointLocation) {
    //console.log(userLocation, pointLocation);
    if (!ignoredNearby.includes(point.id) && !visitedIds.includes(point.id) && !plannedRoute.includes(point.id)){
      //console.log("nearest sight distance", userLocation.SMapCoords.distance(point.SMapCoords));
      if (userLocation.SMapCoords.distance(point.SMapCoords) < 200) {
        //console.log("Point nearby", userLocation, point, userLocation.SMapCoords.distance(point.SMapCoords));
        document.querySelector("#button-ignore-nearby").setAttribute('data-nearbyPoint', point.id);
        document.querySelector("#button-recompute-add-nearby").setAttribute('data-nearbyPoint', point.id);
        $('#point-nearby').modal('show');
      }
    }
  }
}

function recomputeAddNearby(e) {
  Cookies.set('navigationRecompute', 'true');
  let nextPoint = Cookies.get('userProgress');
  //console.log(e.target.dataset);
  plannedRoute.splice(nextPoint, 0, parseInt(e.target.dataset['nearbypoint']));
  //console.log(plannedRoute);
  Cookies.set('route', JSON.stringify(plannedRoute));
  createRoutePointsPromise().then((points) => {
    globalPoints = points;
    displayPointMarkers(points);
    updateUserMarker(globalLocation);
    createRoutePromise(globalLocation, points).then((route) => {
      //console.log("Route recomputed!!!.");
      globalRoute = route;
      displayRoute(route, globalLocation);
    })
  });
  // ignore, do not recommend again
  ignoreAddNearby(e);

}

function ignoreAddNearby(e) {
  ignoredNearby.push(e.target.dataset['nearbypoint']);
  Cookies.set('ignoredPointsNearby', JSON.stringify(ignoredNearby));
}
*/