import ROUTE_DATA from "./js-modules/route-data.js";
import POINT_DATA from "./js-modules/point-data.js";
import TAG_DATA from "./js-modules/point-tag-data.js";

if('serviceWorker' in navigator) {
  let registration;

  const registerServiceWorker = async () => {
    registration = await navigator.serviceWorker.register('./service-worker.js');
    console.log("Service worker registered.", registration);
  };

  registerServiceWorker();
}

POINT_DATA.getAllPoints();
ROUTE_DATA.getAllRoutes();
TAG_DATA.getAllTags();



  let distances = [];

  let allPointsPromise = new Promise((success, error) => {
      $.getJSON('http://localhost:8080/rest/points', (data) => {  
        for (let point of data) {
          point["SMapCoords"] = SMap.Coords.fromWGS84(point.coordinates.longitude, point.coordinates.latitude);
        }
        success(data) 
      }, error);
    });
    
    let points = await allPointsPromise;
    console.log(points);

  function distancePromise(){
    return new Promise((success, error) => {
      var a = [];
    for (let i=0; i < points.length; ++i) {
        for (let j=0; j<points.length; ++j) {
          if (i==j) {
            continue;
          }
            let coords = [points[i].SMapCoords, points[j].SMapCoords];
            console.log(i,j);
            console.log(coords);
            SMap.Route.route(coords, {}).then((route) => {
                var routeResults = route.getResults();
                //console.log(i,j);
                console.log(routeResults);
                let distanceObj = {pointAId:points[i].id, pointBId:points[j].id, distance:routeResults.time};
                console.log(distanceObj);
                a.push([distanceObj.pointAId, distanceObj.pointBId, distanceObj.distance])
                distances.push(distanceObj);
                //$.post('http://localhost:8080/rest/distances', JSON.stringify(distanceObj), null, "json");
            })
        }
    }
    console.log(a);
    success(distances)});
  }

  //console.log(distances);
  let d = await distancePromise();
  console.log("d:",d);
  if (typeof Cookies.get('distances') == undefined) {
    Cookies.set('distances', JSON.stringify(d));
  }

  function stateChange() {
    setTimeout(function () {
      Cookies.set('distances', JSON.stringify(d));
    }, 5000);
  }

  stateChange();

  

    /*for (let i=0; i < distances.length; ++i) {
        $.postJson('http://localhost:8080/rest/distances', JSON.stringify(distances[i]));
    }*/