import { MapView, Navigation } from "./js-modules/navigation.js";
import POINT_DATA from './js-modules/point-data.js';
import { VISITED_POINTS, CURRENT_ROUTE } from "./js-modules/current-route.js";
import { MAKE_POINT_URL } from './js-modules/constants.js';
import { COMPUTE_ROUTE } from "./js-modules/map-utils.js";

var MAP = null;
var NAVIGATION = null;

$(async () => {
  MAP = new MapView("map");
  NAVIGATION = new Navigation();

  // Open point detail on marker click.
  MAP.addMarkerClickListener(onPointMarkerClick);

  let routePointIds = CURRENT_ROUTE.getRoutePoints();
  let routePoints = await POINT_DATA.getPoints(routePointIds);

  syncMarkersWithRoute(MAP, routePoints);

  MAP.drawRouteGeometry(await ensureGeometry(routePoints), CURRENT_ROUTE.getActiveSegment());
  let userLocation = await NAVIGATION.getUserCoordinates();
  MAP.refreshUserMarker(userLocation);
  let geometry = await ensureGeometry();
  console.log("Route geometry", geometry);
  MAP.drawRouteGeometry(geometry, CURRENT_ROUTE.getActiveSegment(), userLocation.coordinates);

  NAVIGATION.monitorUserCoordinates(async (userLocation) => {
    MAP.refreshUserMarker(userLocation);
    MAP.drawRouteGeometry(await ensureGeometry(routePoints), CURRENT_ROUTE.getActiveSegment(), userLocation.coordinates);
  }, (locationError) => {
    // TODO: Handle location error.
    showLocationError(locationError);
  });

  NAVIGATION.monitorPointsNearby((pointReached, pointsNearby) => {
    if (pointReached != null) {
      VISITED_POINTS.markAsVisited(pointReached.id);
      let isRouteFinished = CURRENT_ROUTE.isTraverseDone();
      document.querySelector("#button-display-reached").setAttribute("data-id", point.id);
      document.querySelector("#button-display-reached").setAttribute("data-finished", isRouteFinished);
      // do something if route is finished - TODO figure out 

    } else {  // Reached point has highest priority, points nearby can be added with next movement detection

      //document.querySelector("#button-ignore-nearby").setAttribute('data-id', point.id);      DO in loop, one for each
      //document.querySelector("#button-recompute-add-nearby").setAttribute('data-id', point.id);
      //document.querySelector("button-display-reached").
      $('#point-nearby').modal('show');
      // TODO: Handle points nearby.
      COMPUTE_ROUTE.clearGeometry();
      forceRedraw(false); 
    }
  });

  NAVIGATION.monitorOffRoute(() => {
    // Only triggered when not ignored
    $('#off-route').modal('show');
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

async function ensureGeometry() {                          // TODO route points passing???
  let cachedGeometry = CURRENT_ROUTE.getGeometry();
  if (cachedGeometry != null) {
    // Initially draw cached geometry while waiting for location if possible.
    return cachedGeometry;
  } else {
    let routePointIds = CURRENT_ROUTE.getRoutePoints();
    let routePoints = await POINT_DATA.getPoints(routePointIds);
    let userLocation = await NAVIGATION.getUserCoordinates();
    console.log("Initial location:", userLocation);
    let computedGeometry = await COMPUTE_ROUTE(routePoints, userLocation);
    CURRENT_ROUTE.setGeometry(computedGeometry);
    return computedGeometry;
  }
}

async function forceRedraw(offRoute) {
  let userLocation = await NAVIGATION.getUserCoordinates();
  MAP.drawRouteGeometry(await ensureGeometry(routePoints), CURRENT_ROUTE.getActiveSegment(), userLocation.coordinates, offRoute);
}

/* BUTTON CLICK HANDLER FUNCTIONS */

window.recomputeOffRoute = function() {
  CURRENT_ROUTE.clearGeometry();
  forceRedraw(false);
  console.log("Recompute off route.");
}

window.ignoreOffRoute = function() {
  // TODO: set information somewhere
  CURRENT_ROUTE.stopTracking();
  // TODO: if ignoring, add option to recompute later
  document.querySelector("#side-recompute").classList.toggle('d-none');
    // TODO: if ignoring, redraw differently
    forceRedraw(true);
  console.log("Ignore off route.");
}

window.recomputeNearby = function(element) {
  // Force recompute (clear geometry in CURRENT_ROUTE and redraw ensureGeometry())
  CURRENT_ROUTE.appendLeft(element.getAttribute("data-id"));
  console.log("Recompute add nearby.", element);
}

window.ignoreNearby = function(element) {
  // TODO error handling??
  NAVIGATION.markAsIgnored(element.getAttribute("data-id"));
}

window.displayReached = function(element) {
  let redirectUrl = MAKE_POINT_URL(element.getAttribute("data-id"));
  let finished = element.getAttribute("data-finished");
  if (finished == true) {
    $('#goal-reached').modal('show');
    // TODO prepare modal
  }
  window.location.href=redirectUrl;
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