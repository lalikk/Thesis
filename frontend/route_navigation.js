import { MapView, Navigation } from "./js-modules/navigation.js";
import POINT_DATA from './js-modules/point-data.js';
import { VISITED_POINTS, CURRENT_ROUTE } from "./js-modules/current-route.js";
import { MAKE_POINT_URL } from './js-modules/constants.js';
import { COMPUTE_ROUTE, CREATE_ROUTE_URL } from "./js-modules/map-utils.js";

var MAP = null;
var NAVIGATION = null;

$(async () => {
  MAP = new MapView("map");
  NAVIGATION = new Navigation();

  // Open point detail on marker click.
  MAP.addMarkerClickListener(onPointMarkerClick);

  let routePointIds = await CURRENT_ROUTE.getActiveRoutePoints();
  console.log("Route points:", routePointIds);
  let routePoints = await POINT_DATA.getPoints(routePointIds);

  console.log(MAP, routePoints);
  await syncMarkersWithRoute(MAP, routePoints);

  let isTracked = CURRENT_ROUTE.isTracked();
  MAP.drawRouteGeometry(await ensureGeometry(), CURRENT_ROUTE.getActiveSegment(), null, !isTracked);
  let userLocation = await NAVIGATION.getUserCoordinates();
  MAP.refreshUserMarker(userLocation);
  let geometry = await ensureGeometry();
  console.log("Route geometry", geometry);
  MAP.drawRouteGeometry(geometry, CURRENT_ROUTE.getActiveSegment(), userLocation.coordinates, !isTracked);  
  document.querySelector('#side-recompute').classList.toggle("d-none", isTracked);
  
  NAVIGATION.monitorUserCoordinates(async (userLocation) => {
    MAP.refreshUserMarker(userLocation);
    MAP.drawRouteGeometry(await ensureGeometry(), CURRENT_ROUTE.getActiveSegment(), userLocation.coordinates, !CURRENT_ROUTE.isTracked());
  }, (locationError) => {
    // TODO: Handle location error.
    showLocationError(locationError);
  });

  NAVIGATION.monitorPointsNearby(async (pointReached, pointNearby) => {
    console.log("Reached point", pointReached);
    console.log("Nearby point", pointNearby);
    if (pointReached != null) {
      VISITED_POINTS.markAsVisited(pointReached.id);        
      let isRouteFinished = CURRENT_ROUTE.isTraverseDone();
      document.querySelector("#button-display-reached").setAttribute("data-id", pointReached.id);
      document.querySelector("#button-display-reached").setAttribute("data-finished", isRouteFinished);
      document.querySelector("#point-reached .modal-title").innerHTML = `You have reached "${pointReached.title}".`;
      if (isRouteFinished) {
        $('#route-completed').modal('show');
      }
      $('#point-reached').modal('show');
      // do something if route is finished - TODO figure out
      
      let routePointIds = await CURRENT_ROUTE.getActiveRoutePoints();
      await syncMarkersWithRoute(MAP, await POINT_DATA.getPoints(routePointIds));
      MAP.drawRouteGeometry(await ensureGeometry(), CURRENT_ROUTE.getActiveSegment(), userLocation.coordinates, !CURRENT_ROUTE.isTracked()); 
    } // Reached point has highest priority, points nearby can be added with next movement detection
    if (pointNearby != null) {
      console.log("Nearby", pointNearby);
      document.querySelector("#button-ignore-nearby").setAttribute('data-id', pointNearby.id);
      document.querySelector("#button-recompute-add-nearby").setAttribute('data-id', pointNearby.id);
      document.querySelector("#point-nearby .modal-title").innerHTML = `"${pointNearby.title}" is near. Add to route?`;
      $('#point-nearby').modal('show');
    }
  });

  NAVIGATION.monitorOffRoute((wentOffRoute) => {
    // Only triggered when not ignored
    if (wentOffRoute) {
      $('#off-route').modal('show');
    } else {
      $('#route-return').modal('show');
    }
  });
  
});

async function syncMarkersWithRoute(map, routePoints) {
  let visitedPointIds = VISITED_POINTS.getAllPoints();
  let visitedPoints = await POINT_DATA.getPoints(visitedPointIds);
  map.removePointMarkers();
  for (let i = 0; i < routePoints.length; i++) {
    if (!visitedPoints.includes(routePoints[i])) {
      map.addPointMarker(routePoints[i], i+1);
    } else {
      map.addPointMarker(routePoints[i], i+1, true);
    }
  }
  for (let i = 0; i < visitedPoints.length; i++) {
    if (!routePoints.includes(visitedPoints[i])){
      map.addPointMarker(visitedPoints[i], "", true);
    }
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
    let routePointIds = CURRENT_ROUTE.getActiveRoutePoints();
    //CURRENT_ROUTE.refresh(routePointIds);
    let routePoints = await POINT_DATA.getPoints(routePointIds);
    let userLocation = await NAVIGATION.getUserCoordinates(); 
    console.log("Initial location:", userLocation);
    let computedGeometry = await COMPUTE_ROUTE(routePoints, userLocation);
    console.log(MAP, routePoints);
    CURRENT_ROUTE.setGeometry(computedGeometry);
    await syncMarkersWithRoute(MAP, routePoints);
    return computedGeometry;
  }
}

async function forceRedraw(offRoute) {
  let userLocation = await NAVIGATION.getUserCoordinates();
  MAP.drawRouteGeometry(await ensureGeometry(), CURRENT_ROUTE.getActiveSegment(), userLocation.coordinates, offRoute);
}

/* BUTTON CLICK HANDLER FUNCTIONS */

window.returnRecompute = async function() {
  console.log("Recompute pressed");
  CURRENT_ROUTE.restartTracking();
  await forceRedraw(false);
  document.querySelector('#side-recompute').classList.toggle("d-none", true);
}

window.recomputeOffRoute = async function() {
  CURRENT_ROUTE.shiftVisitedToBack();
  CURRENT_ROUTE.restartTracking();
  CURRENT_ROUTE.clearGeometry();
  document.querySelector('#side-recompute').classList.toggle("d-none", true);
  await forceRedraw(false);
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

window.recomputeNearby = async function(element) {
  // Force recompute (clear geometry in CURRENT_ROUTE and redraw ensureGeometry())
  CURRENT_ROUTE.appendLeft(element.getAttribute("data-id"));
  CURRENT_ROUTE.shiftVisitedToBack();
  CURRENT_ROUTE.clearGeometry();
  await forceRedraw(false);
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
    $('#route-completed').modal('show');
    // TODO prepare modal
  }
  window.location.href=redirectUrl;
}

window.ignoreReturn = function() {
  CURRENT_ROUTE.resetTrackingTime();
}

window.addEventListener('online',  returnOnline);
window.addEventListener('offline', informOffline);

async function returnOnline(event) {
  console.log("ONLINE", event);
  await forceRedraw(false);
  $('#inform-online').modal('show');
}

async function informOffline(event) {
  console.log("OFFLINE", event);
  let userLocation = await NAVIGATION.getUserCoordinates();
  let points = await POINT_DATA.getPoints(await CURRENT_ROUTE.getUnvisitedRoutePoints());
  $('#inform-offline').modal('show');
  document.querySelector('#button-offline-app').onclick = function() {window.open(CREATE_ROUTE_URL(points, userLocation));}
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
}
