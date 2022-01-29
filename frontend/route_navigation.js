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
    for (let routePoint of userRoute) {
      coords.push(routePoint.SMapCoords);
    }
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

displayPointMarkers(await routePointsPromise);
displayRoute(await routePromise, null);
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
  if (userLocation != null) {
    changeRouteProgress(routeGeometry, userLocation);   
  }
  for (let g of routeGeometry) {
    layerGeometry.addGeometry(g);
  }
  layerGeometry.redraw();
}

function changeRouteProgress(routeGeometry, userLocation) {
  let segmentProgress = Cookies.get('userProgress');
  for (let i = 0; i < segmentProgress; ++i) {
    routeGeometry[i]._options.color = 'gray';
  }
  let closestPoint = findUserOnRoute(routeGeometry[segmentProgress].getCoords(), userLocation);
  let visitedPart = routeGeometry[segmentProgress]._coords.splice(0, closestPoint+1);
  let visitedGeometry = new SMap.Geometry(routeGeometry[segmentProgress].getType(), null, visitedPart, routeGeometry[segmentProgress].getOptions());
  visitedGeometry._options.color='gray';
  routeGeometry.splice(segmentProgress, 0, visitedGeometry);
}

function findUserOnRoute(route, user) {
  if (route.length == 0) {
    return 0;
  }
  let firstPointDistance = calcDistance(user.SMapCoords, route[0]);
  var smallestDistance = {index:0, distance:firstPointDistance}
  for (let i =0; i < route.length; ++i) {
    let distance = calcDistance(user.SMapCoords, route[i]);
    if (distance < smallestDistance.distance) {
      smallestDistance.index = i;
      smallestDistance.distance = distance;
    }
  }
  return smallestDistance.index;
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