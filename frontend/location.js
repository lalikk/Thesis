var center = SMap.Coords.fromWGS84(14.41790, 50.12655);
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
var marker = new SMap.Marker(center, "myMarker", {url:znacka});
layer.addMarker(marker);