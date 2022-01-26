
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

var options = {};

$.getJSON('http://localhost:8080/rest/coordinates', function(data, status) {
    console.log(data, status);
    
    for (let index = 0; index < data.length; index++) {
        var location = SMap.Coords.fromWGS84(data[index].latitude, data[index].longitude);
        var point_marker = new SMap.Marker(location, "point" + (index+1), options);
        layer.addMarker(point_marker);
    }
   })

