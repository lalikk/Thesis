import Cookies from './node_modules/js-cookie/dist/js.cookie.mjs'

const urlPoint = new URL("http://localhost:3000/point_detail");
var center = SMap.Coords.fromWGS84(16.6, 49.19);
var m = new SMap(JAK.gel("m"), center, 13);


m.addDefaultLayer(SMap.DEF_BASE).enable();
m.addDefaultControls();

var znacka = JAK.mel("div");
var obrazek = JAK.mel("img", {src:SMap.CONFIG.img+"/marker/drop-red.png"});
znacka.appendChild(obrazek);


var sync = new SMap.Control.Sync({bottomSpace:0});
m.addControl(sync);


var layer = new SMap.Layer.Marker();
m.addLayer(layer);
layer.enable();

var ids = Cookies.get("route");
var arr = JSON.parse(ids);
var i = 1;

arr.forEach(element => {
$.getJSON(`http://localhost:8080/rest/points/${element}`, function(data, status) {
    console.log(data, status);
    let coordinates = data.coordinates;

    var location = JAK.mel("div");
    var pic = JAK.mel("img", {src:SMap.CONFIG.img+"/marker/drop-red.png"});
    location.appendChild(pic);
    var text = JAK.mel("div", {}, {position:"absolute", left:"0px", top:"2px", textAlign:"center", width:"22px", color:"white", fontWeight:"bold"});
    text.innerHTML = `${i}`;
    location.appendChild(text);

    var marker = new SMap.Marker(SMap.Coords.fromWGS84(coordinates.latitude, coordinates.longitude), `${data.id}`, {url:location, title:data.title});
    layer.addMarker(marker);
    ++i;

    m.getSignals().addListener(this, "marker-click", function(e) {
        // vybrany marker
        var marker = e.target;
        var id = marker.getId();
        console.log(id);
        // zobrazime jeho jmeno - parovani vybraneho markeru pomoci jeho id a nasich vstupnich dat
        let markers = layer.getMarkers();
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

   })
 
});
