let distances = [];


let allPointsPromise = new Promise((success, error) => {
    $.getJSON('http://localhost:8080/rest/points', (data) => {  
      for (let point of data) {
        point["SMapCoords"] = SMap.Coords.fromWGS84(point.coordinates.latitude, point.coordinates.longitude);
      }
      success(data) 
    }, error);
  });
  
  let points = await allPointsPromise;
  console.log(points);

  for (let i=0; i < points.length-1; ++i) {
      for (let j=i+1; j<points.length; ++j) {
          let coords = [points[i].SMapCoords, points[j].SMapCoords];
          console.log(i,j);
          SMap.Route.route(coords, {}).then((route) => {
              var routeResults = route.getResults();
              console.log(i,j);
              let distanceObj = {pointAId:points[i].id, pointBId:points[j].id, distance:routeResults.length};
              distances.push(distanceObj);
              $.post('http://localhost:8080/rest/distances', JSON.stringify(distanceObj), null, "json");
          })
      }
  }
  
  console.log(distances);

  /*for (let i=0; i < distances.length; ++i) {
      $.postJson('http://localhost:8080/rest/distances', JSON.stringify(distances[i]));
  }*/