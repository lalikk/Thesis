import Cookies from './node_modules/js-cookie/dist/js.cookie.mjs'

const urlPoint = new URL("http://localhost:3000/point_detail");
var center = SMap.Coords.fromWGS84(16.6, 49.19);      // TODO
var m = new SMap(JAK.gel("m"), center, 13);
var layer = new SMap.Layer.Marker();

initMap();

$.getJSON(`http://localhost:8080/rest/points/`, function(data, status) {
  console.log(data, status);
  for (let point of data){
    addSimpleMarker(point);
  }
  placeUser();
  m.getSignals().addListener(this, "marker-click", function(e) {
    var marker = e.target;
    var id = marker.getId();
    let markers = layer.getMarkers();
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].getId() == id) {
        urlPoint.search = new URLSearchParams({id:`${id}`});  
        console.log(urlPoint);
        window.location.href=urlPoint;             
        break;
      }
    }
  });
});

function initMap(){
  m.addDefaultLayer(SMap.DEF_BASE).enable();
  m.addDefaultControls();
  var sync = new SMap.Control.Sync({bottomSpace:0});
  m.addControl(sync);
  m.addLayer(layer);
  layer.enable();
}

function addSimpleMarker(point) {
  var marker = new SMap.Marker(SMap.Coords.fromWGS84(point.coordinates.latitude, point.coordinates.longitude), point.id, {title:point.title});
  layer.addMarker(marker);
}

function addUserMarker(coordinates) {
  let location = JAK.mel("div");
  let text = JAK.mel("div", {}, {position:"absolute", left:"0px", top:"2px", textAlign:"center", width:"22px", color:"white", fontWeight:"bold"});
  text.innerHTML = "X";
  location.appendChild(text); 
  let pic = JAK.mel("img", {src:SMap.CONFIG.img+"/marker/drop-red.png"});
  location.appendChild(pic);
  console.log(coordinates.latitude);
  console.log(coordinates.longitude);
  var marker = new SMap.Marker(SMap.Coords.fromWGS84(parseFloat(coordinates.longitude), parseFloat(coordinates.latitude)), null, {url:location, title:"You are standing here"});
  layer.addMarker(marker);
} 

function placeUser() {
  navigator.geolocation.watchPosition( function (position){
    receiveCoords(position);
    let locationAllowed = Cookies.get('locationAllowed');
    console.log()
    if (typeof locationAllowed != 'undefined' && locationAllowed == 'true') {
      console.log(`userLocation = ${Cookies.get('userLocation')}`)
      let userLocation = JSON.parse(Cookies.get('userLocation'));
      addUserMarker(userLocation);
      console.log(userLocation);
    }
  }, showError);

}

function receiveCoords(position) {
  console.log(position.coords.latitude);
  console.log(position.coords.longitude);
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
  console.log(x);
}