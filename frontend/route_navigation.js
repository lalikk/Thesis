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

let routePointsPromise = new Promise((success, error) => {
  $.getJSON('http://localhost:8080/rest/points', (data) => {
    console.log(data);  
    let routePoints = [];
    var indexInRoute = 1;
    for (let point of data) {
      if(ids.includes(point.id) && !visitedIds.includes(point.id)) {
        point["indexInRoute"] = indexInRoute;
        point["SMapCoords"] = SMap.Coords.fromWGS84(point.coordinates.latitude, point.coordinates.longitude);
        routePoints.push(point);
        indexInRoute++;
      }
    }
    success(routePoints)
  }).fail(error);
});

let locationPromise = new Promise((success, error) => {
  navigator.geolocation.getCurrentPosition((data) => {
    data["SMapCoords"] = SMap.Coords.fromWGS84(data.coords.longitude, data.coords.latitude);
    success(data);
  }, error);
});

let routePromise = new Promise(async (success, error) => {
  let recompute = Cookies.get('navigationRecompute');
  // TODO: (?) Remove recompute flag and use existence of geometry instead.
  if(recompute === "false") {
    let g = window.localStorage.getItem('geometry');
    let geometry = JSON.parse(g);
    let coords = [];
    for (let c of geometry.coords) {
      coords.push(SMap.Coords.fromWGS84(c.x, c.y));
    }
    let newGeometry = new SMap.Geometry(geometry.type, null, coords, geometry.options);
    success(newGeometry);
  } else {
    var coords = [];
    // TODO: Handle case when location is not available (promis throws exception).
    let userLocation = await locationPromise;
    let userRoute = await routePointsPromise;
    coords.push(userLocation.SMapCoords);
    for (let routePoint of userRoute) {
      coords.push(routePoint.SMapCoords);
    }
    console.log(coords);
    // Add error handling
    SMap.Route.route(coords, { geometry: true, itinerary:true }).then((route) => {
      var coords = route.getResults().geometry;
      console.log(route.getResults());
      var g = new SMap.Geometry(SMap.GEOMETRY_POLYLINE, null, coords);
      // slice geometry
      storeGeometry(g);
      success(g);
    });
  }
});

displayRoute(await routePromise, null);

displayPointMarkers(await routePointsPromise);
updateUserMarker(await locationPromise);
displayRoute(await routePromise, await locationPromise);


navigator.geolocation.watchPosition(function (position) {
  position["SMapCoords"] = SMap.Coords.fromWGS84(position.coords.longitude, position.coords.latitude);
  updateUserMarker(position);
  receiveCoords(position);
}, showError);

function displayPointMarkers(points) {
  for (let point of points) {
    let location = JAK.mel("div");
    let pic = JAK.mel("img", {src:SMap.CONFIG.img+"/marker/drop-red.png"});
    location.appendChild(pic);
    let text = JAK.mel("div", {}, {position:"absolute", left:"0px", top:"2px", textAlign:"center", width:"22px", color:"white", fontWeight:"bold"});
    text.innerHTML = `${point.indexInRoute}`;
    location.appendChild(text);
    var marker = new SMap.Marker(point.SMapCoords, `${point.id}`, { url: location, title: point.title });
    layerMarkers.addMarker(marker);
  }
}

function displayRoute(routeGeometry, userLocation) {
  layerGeometry.addGeometry(routeGeometry);
  layerGeometry.redraw();
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
  //console.log("Update user marker", userMarker);
  layerMarkers.addMarker(userMarker);
}


function initMap() {
  m.addDefaultLayer(SMap.DEF_BASE).enable();
  m.addDefaultControls();
  var sync = new SMap.Control.Sync({bottomSpace:0});
  m.addControl(sync);
  m.addLayer(layerMarkers);
  m.addLayer(layerGeometry).enable();
  layerMarkers.enable();
  reactToMarkerClick();
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

function storeGeometry(g) {
  let geometry = {type: g.getType(), coords: g.getCoords(), options:g.getOptions()};
  let jsonGeometry = JSON.stringify(geometry);
  window.localStorage.setItem('geometry', jsonGeometry);
  Cookies.set('navigationRecompute', 'false');
}