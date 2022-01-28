import Cookies from './node_modules/js-cookie/dist/js.cookie.mjs'
const urlPoint = new URL("http://localhost:3000/point_detail");


/* Testing data */
//const userLocationTEST = SMap.Coords.fromWGS84(16.583476454501444, 49.205610336621596);
var center = SMap.Coords.fromWGS84(16.6, 49.19);  // TODO

/* Map objects */
var m = new SMap(JAK.gel("m"), center, 13);
var layerMarkers = new SMap.Layer.Marker();
var layerPlanning = m.addDefaultLayer(SMap.DEF_BASE).enable();  
var layerGeometry = new SMap.Layer.Geometry();

/* Route planning data */
var route = Cookies.get("route");
var ids = [];
if (typeof route != 'undefined') {
  ids = JSON.parse(route);
}
var visited = Cookies.get("visited");
var visitedIds = [];
if (typeof visited != 'undefined') {
  visitedIds = JSON.parse(visited);
}

initMap();

function initMap() {
  m.addDefaultLayer(SMap.DEF_BASE).enable();
  m.addDefaultControls();
  var sync = new SMap.Control.Sync({bottomSpace:0});
  m.addControl(sync);
  m.addLayer(layerMarkers);
  m.addLayer(layerGeometry).enable();
  layerMarkers.enable();
  placeUser();
}

function placeUser() {
  navigator.geolocation.watchPosition( function (position){
    receiveCoords(position);
    let locationAllowed = Cookies.get('locationAllowed');
    if (typeof locationAllowed != 'undefined' && locationAllowed == 'true') {
      let userLocation = JSON.parse(Cookies.get('userLocation'));
      findUser(userLocation);  
      $.getJSON('http://localhost:8080/rest/points', function(data, status) {     // TODO cleanup - super messy but this cannot
        console.log(data, status);                                                // start before starting point is received    
        var indexInRoute = 1;
        for (let point of data) {
          if( ids.includes(point.id) && !visitedIds.includes(point.id)) {
            addPointToMap(point, indexInRoute);
            indexInRoute++;
          }
        }
        reactToMarkerClick();
        displayPlannedRoute();
    })
    }
}, showError);
}

function findUser(userLocation) {
  let markers = layerMarkers.getMarkers();
  var userOnMap = false;
  for (var i = 0; i < markers.length; i++) {
    if (markers[i].getId() == 'user_location') {
      userOnMap = true;
      break;
    }
  }
  if (userOnMap) {
    moveUser(userLocation);
  } else {
    addUserMarker(userLocation);
  }
}

function moveUser(userLocation) {
  addUserMarker(userLocation);
}

function addUserMarker(userLocation) {
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
  var userMarker = new SMap.Marker(SMap.Coords.fromWGS84(userLocation.longitude, userLocation.latitude), "user_location", {url:location, title:"You are standing here"});
  layerMarkers.addMarker(userMarker);
}


function receiveCoords(position) {
  Cookies.set('locationAllowed', 'true');
  Cookies.set('userLocation', JSON.stringify({latitude:position.coords.latitude, longitude:position.coords.longitude}));
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






function addPointToMap(point, indexInRoute) {
  let coordinates = point.coordinates;
  let location = JAK.mel("div");
  let pic = JAK.mel("img", {src:SMap.CONFIG.img+"/marker/drop-red.png"});
  location.appendChild(pic);
  let text = JAK.mel("div", {}, {position:"absolute", left:"0px", top:"2px", textAlign:"center", width:"22px", color:"white", fontWeight:"bold"});
  text.innerHTML = `${indexInRoute}`;
  location.appendChild(text);
  var marker = new SMap.Marker(SMap.Coords.fromWGS84(coordinates.latitude, coordinates.longitude), `${point.id}`, {url:location, title:point.title});
  layerMarkers.addMarker(marker);
  ++i;
}

function reactToMarkerClick() {
  m.getSignals().addListener(this, "marker-click", function(e) {
    var marker = e.target;
    var id = marker.getId();
    let markers = layerMarkers.getMarkers();
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].getId() == id) {
            urlPoint.search = new URLSearchParams({id:`${id}`});  
            window.location.href=urlPoint;             
        break;
      }
    }
  });
}

function displayPlannedRoute() {
  let recompute = Cookies.get('navigationRecompute');
  if (typeof recompute == 'undefined' || recompute == 'true') {
    displayChangedRoute();
  } else {
    displayExistingRoute();
  }
}
var coords = [];
function displayChangedRoute() {  
  let markers = layerMarkers.getMarkers();
  for (var i = 0; i < markers.length; i++) {
    if (markers[i].getId() == 'user_location') {
      coords.push(markers[i]._coords);
      break;
    }
  }
  for (var i = 0; i < markers.length; i++) {
      if (markers[i].getId() != 'user_location') {
        coords.push(markers[i]._coords);
    }
  }
  SMap.Route.route(coords, {
  geometry: true
  }).then(findRoute);  }

function findRoute(route) {
  var coords = route.getResults().geometry;
  var cz = m.computeCenterZoom(coords);
  m.setCenterZoom(cz[0], cz[1]);
  var g = new SMap.Geometry(SMap.GEOMETRY_POLYLINE, null, coords);
  layerGeometry.addGeometry(g);
  storeGeometry(g);
}

function storeGeometry(g) {
  let geometry = {type: g.getType(), coords: g.getCoords(), options:g.getOptions()};
  let jsonGeometry = JSON.stringify(geometry);
  window.localStorage.setItem('geometry', jsonGeometry);
  Cookies.set('navigationRecompute', 'false');
}

function displayExistingRoute() {
  let g = window.localStorage.getItem('geometry');
  let geometry = JSON.parse(g);
  let coords = [];
  for (let c of geometry.coords) {
    coords.push(SMap.Coords.fromWGS84(c.x, c.y));
  }
  let newGeometry = new SMap.Geometry(geometry.type, null, coords, geometry.options);
  layerGeometry.addGeometry(newGeometry);
  layerGeometry.redraw();
}
