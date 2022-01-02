var stred = SMap.Coords.fromWGS84(14.41790, 50.12655);
var mapa = new SMap(JAK.gel("mapa"), center, 13);
mapa.addDefaultLayer(SMap.DEF_BASE).enable();
mapa.addDefaultControls();	  