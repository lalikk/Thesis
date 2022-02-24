import { MAKE_POINT_URL} from './js-modules/constants.js';
import { MapView, Navigation} from "./js-modules/navigation.js";
import POINT_DATA from './js-modules/point-data.js';
import { VISITED_POINTS } from './js-modules/current-route.js';
import TAG_DATA from './js-modules/point-tag-data.js';

var MAP = null;
var NAVIGATION = null;

$(async () => {
  MAP = new MapView("m");
  NAVIGATION = new Navigation();
  MAP.addMarkerClickListener(onPointMarkerClick);
  let allPoints = await POINT_DATA.getAllPoints();
  await syncMarkersWithRoute(Object.values(allPoints));
  let userLocation = await NAVIGATION.getUserCoordinates();
  MAP.refreshUserMarker(userLocation);
  NAVIGATION.monitorUserCoordinates(async (userLocation) => {
    MAP.refreshUserMarker(userLocation);
  }, (locationError) => {
    showLocationError(locationError);
  });
})

function onPointMarkerClick(marker) {
  if (marker.getId().startsWith("point-")) {
    let id = marker.getId().substring(6);
    window.location.href = MAKE_POINT_URL(id); 
  }
}

async function syncMarkersWithRoute(points, tag = null) {
  console.log(points, tag);
  if (tag != null) {
    points = points.filter(x => x.tags.map(t => t.id).includes(tag.id));
  }
  console.log("after filter",points);
  let visitedPointIds = VISITED_POINTS.getAllPoints();
  let visitedPoints = await POINT_DATA.getPoints(visitedPointIds);
  MAP.removePointMarkers();
  for (let i = 0; i < points.length; i++) {
    if (!visitedPoints.includes(points[i])) {
      MAP.addPointMarker(points[i], i+1);
    } else {
      MAP.addPointMarker(points[i], i+1, true);
    }
  }
  for (let i = 0; i < visitedPoints.length; i++) {
    if (!points.includes(visitedPoints[i])){
      MAP.addPointMarker(visitedPoints[i], "", true);
    }
  }
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

window.toggleTagFilter = async function(element) {
  console.log(element);
  let elementId = element.dataset['tag'];
  let nextElementId = getNextTag(elementId);
  toggleFilterButton(elementId, nextElementId);
  let tagTitle =getTagTitle(nextElementId);
  let tag = await TAG_DATA.getTagFromTitle(tagTitle);
  await syncMarkersWithRoute(Object.values(await POINT_DATA.getAllPoints()), tag);
  console.log(tag);

}

function toggleFilterButton(elementId, nextElementId) {
  console.log(document.querySelector('#tags-all'));
  console.log(elementId, nextElementId);
  document.querySelector(`#${elementId}`).classList.toggle("d-none");
  document.querySelector(`#${nextElementId}`).classList.toggle("d-none");
}

function getNextTag(elementId) {
  switch (elementId) {
    case "tags-all":
      return "tags-nature";
    case "tags-nature":
        return "tags-church";
    case "tags-church":
      return "tags-architecture";
    case "tags-architecture":    
      return "tags-all";
    default:
      console.error("Invalid tag name");
      return "tags-all";
  }
}

function getTagTitle(elementId) {
  switch (elementId) {
    case "tags-all":
      return null;
    case "tags-nature":
        return "Nature";
    case "tags-church":
      return "Church";
    case "tags-architecture":    
    return "Architecture";
    default:
      console.error("Invalid tag name");
      return null;
  }
}
