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
var pointLocation;
var ignoredNearby = [];
var ignored = Cookies.get("ignoredPointsNearby");
if (typeof ignored != 'undefined') {
  ignoredNearby = JSON.parse(ignored);
}
var plannedRoute = Cookies.get("route");
var ids = [];
if (typeof plannedRoute != 'undefined') {
  ids = JSON.parse(plannedRoute);
}
var visited = Cookies.get("visited");
var visitedIds = [];
if (typeof visited != 'undefined') {
  visitedIds = JSON.parse(visited);
}

initMap();

let allPointsPromise = new Promise((success, error) => {
  $.getJSON('http://localhost:8080/rest/points', (data) => {  
    for (let point of data) {
      point["SMapCoords"] = SMap.Coords.fromWGS84(point.coordinates.latitude, point.coordinates.longitude);
    }
    document.querySelector("#button-recompute-off-route").onclick = recomputeOffRoute;
    document.querySelector("#button-ignore-route").onclick = ignoreOffRoute;

    document.querySelector("#button-recompute-add-nearby").onclick = recomputeAddNearby;
    document.querySelector("#button-ignore-nearby").onclick = ignoreAddNearby;
    success(data) 
  }, error);
});

let routePointsPromise = new Promise((success, error) => {
  $.getJSON('http://localhost:8080/rest/points', (data) => {
    //console.log(data);  
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

let locationPromise = createLocationPromise();

function createLocationPromise() {
  return new Promise((success, error) => {
  navigator.geolocation.getCurrentPosition((data) => {
    data["SMapCoords"] = SMap.Coords.fromWGS84(data.coords.longitude, data.coords.latitude);
    success(data);
  }, error);
});
}

let routePromise = createRoutePromise();

function createRoutePromise() {
  return new Promise(async (success, error) => {
    let recompute = Cookies.get('navigationRecompute');
    // TODO: (?) Remove recompute flag and use existence of geometry instead.
    console.log("recompute", recompute);
    if(recompute === "false") {
      let g = window.localStorage.getItem('geometry');
      let geometry = JSON.parse(g);
      let geometries = [];
      for (let g of geometry) {
        let coords = [];
        for (let c of g.coords) {
          coords.push(SMap.Coords.fromWGS84(c.x, c.y));
        }
        geometries.push(new SMap.Geometry(g.type, null, coords, g.options));
      }
      success(geometries);
    } else {
      var coords = [];
      // TODO: Handle case when location is not available (promis throws exception).
      let userLocation = await locationPromise;
      let userRoute = await routePointsPromise;
      coords.push(userLocation.SMapCoords);
      console.log("user location=", userLocation.SMapCoords);
      for (let routePoint of userRoute) {
        coords.push(routePoint.SMapCoords);
      }
      console.log(coords);
      // Add error handling
      SMap.Route.route(coords, { geometry: true, itinerary:true }).then((route) => {
        var routeResults = route.getResults();
        var coords = routeResults.geometry;
        var g = new SMap.Geometry(SMap.GEOMETRY_POLYLINE, null, coords);
        // slice geometry
        let geometryPerSegments = sliceGeometry(g, routeResults.points);
        storeGeometry(geometryPerSegments);
        // which segment of route user is on, always start at beginning as user location = 1st point
        Cookies.set('userProgress', '0');
        success(geometryPerSegments);
      });
    }
  });
}

displayPointMarkers(await routePointsPromise);
await displayRoute(await routePromise, null);
updateUserMarker(await locationPromise);
await displayRoute(await routePromise, await locationPromise);
saveLocations(await allPointsPromise);

navigator.geolocation.watchPosition(async function (position) {
  position["SMapCoords"] = SMap.Coords.fromWGS84(position.coords.longitude, position.coords.latitude);
  updateUserMarker(position);
  receiveCoords(position);
  await displayRoute(await routePromise, position);
  checkPointsAround(position);
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

async function displayRoute(routeGeometry, userLocation) {
  let recompute = Cookies.get('navigationRecompute');
  if (typeof recompute == 'undefined' || JSON.parse(recompute) == true) {
    console.log("*****recompute =", recompute);
    let promiseUser = createLocationPromise();
    console.log(promiseUser);
    userLocation = await promiseUser;
    console.log("userLocation received promise=", userLocation);
    let promiseRoute = createRoutePromise();
    routeGeometry = await promiseRoute;
    console.log("routeGeometry received promise=", routeGeometry);
    console.log(routeGeometry);
  }      
  if (userLocation != null) {
    changeRouteProgress(routeGeometry, userLocation);   
  }
  for (let g of routeGeometry) {
    layerGeometry.addGeometry(g);
  }
  layerGeometry.clear();
  layerGeometry.redraw();
  Cookies.remove('ignoreOffRoute');
}

async function changeRouteProgress(routeGeometry, userLocation) {
  let segmentProgress = Cookies.get('userProgress');
  for (let i = 0; i < segmentProgress; ++i) {
    routeGeometry[i]._options.color = 'gray';
  }
  if (checkGoalReached(routeGeometry, userLocation)) {
    if (segmentProgress+1 == plannedRoute.length) {
      plannedRoute = [];
      Cookies.remove('route');
      layerGeometry.removeAll();
      // TODO modal route is over
    } else {
      visitedIds.push(plannedRoute[segmentProgress]);
      Cookies.set('visited', JSON.stringify(visitedIds));
      segmentProgress++;
    }
  }
  let closestPoint = findUserOnRoute(routeGeometry[segmentProgress].getCoords(), userLocation);
  if (closestPoint == -1 ) {
    await informUserOffRoute(userLocation); 
    return;
  }
  let visitedPart = routeGeometry[segmentProgress]._coords.splice(0, closestPoint+1);
  let visitedGeometry = new SMap.Geometry(routeGeometry[segmentProgress].getType(), null, visitedPart, routeGeometry[segmentProgress].getOptions());
  visitedGeometry._options.color='gray';
  routeGeometry.splice(segmentProgress, 0, visitedGeometry);
}

function checkGoalReached(route, user){
  if (calcDistance(user, route[route.length -1]) < 0.05) {
    return true;
  } else {
    return false;
  }
}

function findUserOnRoute(route, user) {
  if (route.length == 0) {
    return 0;
  }
  console.log(user);
  let firstPointDistance = calcDistance(user.SMapCoords, route[0]);
  var smallestDistance = {index:0, distance:firstPointDistance}
  for (let i =0; i < route.length; ++i) {
    let distance = calcDistance(user.SMapCoords, route[i]);
    if (distance < smallestDistance.distance) {
      smallestDistance.index = i;
      smallestDistance.distance = distance;
    }
  }
  //console.log(smallestDistance.distance);
  if (smallestDistance.distance > 0.05) {
    return -1;
  } else {
    return smallestDistance.index;
  }
}

function calcDistance(coords1, coords2) {
	if ((coords1.x == coords2.x) && (coords1.y == coords2.y)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * coords1.y/180;
		var radlat2 = Math.PI * coords2.y/180;
		var theta = coords1.x-coords2.x;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60;
		return dist;
	}
}

async function informUserOffRoute(userLocation) {
  let ignoreOffRoute = Cookies.get('ignoreOffRoute');
  //console.log(ignoreOffRoute);
  if (typeof ignoreOffRoute == 'undefined'){
    document.querySelector("#button-recompute-off-route").setAttribute('data-userLocation', JSON.stringify(userLocation));
    console.log(userLocation);
    console.log(JSON.stringify(userLocation));
    $('#off-route').modal('show');
  }
  // TODO: if ignoring, add option to recompute later
}

async function recomputeOffRoute (e) {
  console.log(e);
  Cookies.set('navigationRecompute', 'true');
  Cookies.set('ignoreOffRoute', 'true');
  //console.log(e.target.dataset['userlocation']);
  let location = JSON.parse(e.target.dataset['userlocation']);
  let smapCoords = SMap.Coords.fromWGS84(location.SMapCoords.x, location.SMapCoords.y);
  console.log("button click =", location);
  //console.log(smapCoords);
  await displayRoute(null,null);//{SMapCoords:smapCoords});
  console.log("display finished");
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
  console.log("Update user marker", userMarker);
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
  let geometry = [];
  for (let gItem of g) {
     geometry.push({type: gItem.getType(), coords: gItem.getCoords(), options:gItem.getOptions()});
  }
  let jsonGeometry = JSON.stringify(geometry);
  window.localStorage.setItem('geometry', jsonGeometry);
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
    routeGeometry.push(new SMap.Geometry(geometry.getType(), null, segment, geometry.getOptions()));
  }
  return routeGeometry;
}

function saveLocations (points) {
  pointLocation = points;
}

function checkPointsAround(userLocation) {
  for (let point of pointLocation) {
    if (!ignoredNearby.includes(point.id) && !visitedIds.includes(point.id)){
      if (calcDistance(userLocation.SMapCoords, point.SMapCoords) < 0.1) {
        document.querySelector("#button-ignore-nearby").setAttribute('data-nearbyPoint', point.id);
        document.querySelector("#button-recompute-add-nearby").setAttribute('data-nearbyPoint', point.id);
        $('#off-route').modal('show');
      }
    }
  }
}

function recomputeAddNearby(e) {
  Cookies.set('navigationRecompute', 'true');
  let nextPoint = Cookies.get('userProgress');
  console.log(plannedRoute);
  plannedRoute.splice(nextPoint, 0, e.target.dataset['nearbyPoint']);
  console.log(plannedRoute);
  Cookies.set('route', JSON.stringify(plannedRoute));
  // ignore, do not recommend again
  ignoreAddNearby(e);

}

function ignoreAddNearby(e) {
  ignoredNearby.push(e.target.dataset['nearbyPoint']);
  Cookies.set('ignoredPointsNearby', JSON.stringify(ignoredNearby));
}