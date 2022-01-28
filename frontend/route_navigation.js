import Cookies from './node_modules/js-cookie/dist/js.cookie.mjs'

const urlPoint = new URL("http://localhost:3000/point_detail");
var center = SMap.Coords.fromWGS84(16.6, 49.19);
var userLocation = SMap.Coords.fromWGS84(16.583476454501444, 49.205610336621596);
var m = new SMap(JAK.gel("m"), center, 13);
var layerMarkers = new SMap.Layer.Marker();
var layerPlanning = m.addDefaultLayer(SMap.DEF_BASE).enable();  
var layerGeometry = new SMap.Layer.Geometry();
m.addLayer(layerGeometry).enable();
var ids = JSON.parse(Cookies.get("route"));
var visitedIds = JSON.parse(Cookies.get("visited"));
var i = 1;

initMap();

$.getJSON('http://localhost:8080/rest/points', function(data, status) {
    console.log(data, status);
    for (let point of data) {
      if( ids.includes(point.id) && !visitedIds.includes(point.id)) {
        addPointToMap(point);
      }
    }
    reactToMarkerClick();
    displayPlannedRoute();
})

function initMap() {
  m.addDefaultLayer(SMap.DEF_BASE).enable();
  m.addDefaultControls();
  var sync = new SMap.Control.Sync({bottomSpace:0});
  m.addControl(sync);
  m.addLayer(layerMarkers);
  layerMarkers.enable();
  placeUser();
}

function placeUser() {
  var location = JAK.mel("div");
  var pic = JAK.mel("img", {src:SMap.CONFIG.img+"/marker/drop-red.png"});
  location.appendChild(pic);
  var userMarker = new SMap.Marker(userLocation, "user_location", {url:location, title:"You are standing here"});
  layerMarkers.addMarker(userMarker);
}

function addPointToMap(point) {
  let coordinates = point.coordinates;
  let location = JAK.mel("div");
  let pic = JAK.mel("img", {src:SMap.CONFIG.img+"/marker/drop-red.png"});
  location.appendChild(pic);
  let text = JAK.mel("div", {}, {position:"absolute", left:"0px", top:"2px", textAlign:"center", width:"22px", color:"white", fontWeight:"bold"});
  text.innerHTML = `${i}`;
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
    console.log(markers);
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].getId() == id) {
            urlPoint.search = new URLSearchParams({id:`${id}`});  
            console.log(urlPoint);
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

function displayChangedRoute() {  
  var coords = [];
  let markers = layerMarkers.getMarkers();
  console.log(markers);
  for (var i = 0; i < markers.length; i++) {
      if (markers[i].getId() != userLocation) {
        console.log(markers[i]._coords);
        coords.push(markers[i]._coords);
    }
  }
  console.log(coords);
  SMap.Route.route(coords, {
  geometry: true
  }).then(findRoute);  }

function findRoute(route) {
  var coords = route.getResults().geometry;
  var cz = m.computeCenterZoom(coords);
  m.setCenterZoom(cz[0], cz[1]);
  var g = new SMap.Geometry(SMap.GEOMETRY_POLYLINE, null, coords);
  console.log(g);
  layerGeometry.addGeometry(g);
  storeGeometry(g);
}

function storeGeometry(g) {
  let geometry = {type: g.getType(), coords: g.getCoords(), options:g.getOptions()};
  console.log(geometry);
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
  console.log(layerGeometry.getGeometries());
  layerGeometry.redraw();
  console.log(newGeometry);
}