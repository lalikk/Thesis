import { MapView, Navigation } from "./js-modules/navigation.js";
import POINT_DATA from './js-modules/point-data.js';
import { VISITED_POINTS, CURRENT_ROUTE } from "./js-modules/current-route.js";
import { MAKE_POINT_URL } from './js-modules/constants.js';
import { COMPUTE_ROUTE } from "./js-modules/map-utils.js";

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

  MAP.drawRouteGeometry(await ensureGeometry(), CURRENT_ROUTE.getActiveSegment());
  let userLocation = await NAVIGATION.getUserCoordinates();
  MAP.refreshUserMarker(userLocation);
  let geometry = await ensureGeometry();
  console.log("Route geometry", geometry);
  MAP.drawRouteGeometry(geometry, CURRENT_ROUTE.getActiveSegment(), userLocation.coordinates);

  NAVIGATION.monitorUserCoordinates(async (userLocation) => {
    MAP.refreshUserMarker(userLocation);
    MAP.drawRouteGeometry(await ensureGeometry(), CURRENT_ROUTE.getActiveSegment(), userLocation.coordinates);
  }, (locationError) => {
    // TODO: Handle location error.
    showLocationError(locationError);
  });

  NAVIGATION.monitorPointsNearby((point) => {
    // TODO: Handle points nearby.
    // TODO: Mark point as visited if part of route.
  });

  NAVIGATION.monitorOffRoute(() => {
    // TODO: Handle off route.
  });
  
});

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

async function ensureGeometry() {
  let cachedGeometry = CURRENT_ROUTE.getGeometry();
  if (cachedGeometry != null) {
    // Initially draw cached geometry while waiting for location if possible.
    return cachedGeometry;
  } else {
    let userLocation = await NAVIGATION.getUserCoordinates();
    console.log("Initial location:", userLocation);
    let computedGeometry = await COMPUTE_ROUTE(routePoints, userLocation);
    CURRENT_ROUTE.setGeometry(computedGeometry);
    return computedGeometry;
  }
}

/* BUTTON CLICK HANDLER FUNCTIONS */

window.recomputeOffRoute = function() {
  console.log("Recompute off route.");
}

window.ignoreOffRoute = function() {
  console.log("Ignore off route.");
}

window.recomputeNearby = function(element) {
  // Force recompute (clear geometry in CURRENT_ROUTE and redraw ensureGeometry())
  console.log("Recompute add nearby.", element);
}

window.ignoreNearby = function(element) {
  console.log("Ignore add nearby.", element);
}

function showLocationError(error) {
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



/*
var ignoredNearby = [];
var ignored = Cookies.get("ignoredPointsNearby");
if (typeof ignored != 'undefined') {
  ignoredNearby = JSON.parse(ignored);
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