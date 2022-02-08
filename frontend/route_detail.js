import Cookies from './node_modules/js-cookie/dist/js.cookie.mjs'
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

$.getJSON(`http://localhost:8080/rest/routes/${id}`, function(data, status) {
    console.log(data, status);
    let table = document.querySelector("#point-list");
    let points = data.points;
    const urlPoint = new URL("http://localhost:3000/point_detail");

    let contents = "";
    //contents += `<div class="title-simple"><h1>${data.title}</h1></div>\n`;
    contents += `<div class="text-body"><div class="clearfix"><h4>${data.description}</h4></div></div>\n`;
    
    for (let point of points) {
        urlPoint.search = new URLSearchParams({id:`${point.id}`});
        contents += `<div class="col-sm-6 col-lg-4 mb-4">
            <div class="card">
            <img class="card-img-top" src="${point.photos[0].image}" width="100%" height="200" focusable="false"/>
            <div class="card-body">
            <h5 class="card-title"><a href=${urlPoint}>${point.title}</a></h5>
            <p class="card-text">${point.description}</p>
            </div>
            </div>
            </div>`;
        //contents += `<tr><td><a href=${urlPoint}>${point.title}</a></td><td>${point.description}</td></tr>\n`;
    }
    table.innerHTML = contents;

    document.querySelector("#planning-button").setAttribute('data-route', data.id);
    document.querySelector("#planning-button").onclick = startPlanning;

    document.querySelector("#button-replace-route").setAttribute('data-route', data.id);
    document.querySelector("#button-replace-route").onclick = replaceRoute;
    document.querySelector("#button-extend-route").setAttribute('data-route', data.id);
    document.querySelector("#button-extend-route").onclick = extendRoute;
})

function startPlanning(e){
    console.log(e);
    let ids = Cookies.get("route");
    console.log(ids);
    if (typeof ids == 'undefined') {
        let id = e.target.dataset['route'];
        $.getJSON(`http://localhost:8080/rest/routes/${id}`, function(data, status) {
            console.log(data, status);
            var ids = [];
            for (let point of data.points) {
                ids.push(point.id);
            }
            var json_ids = JSON.stringify(ids);
            Cookies.set('route', json_ids);
            Cookies.set('navigationRecompute', 'true');
            Cookies.set('displayRecommend', 'true');
            window.location.href="route_planning.html";
        })
    } else {
        $('#route-planning').modal('show')
    }
}

function replaceRoute(e) {
    Cookies.remove('route');
    Cookies.remove('visited');
    Cookies.ser('userProgress', 0);
    Cookies.set('displayRecommend', 'true');
    startPlanning(e);  
}

function extendRoute(e) {
    let ids = Cookies.get("route");
    let idsArray = JSON.parse(ids);
    $.getJSON(`http://localhost:8080/rest/route_points/${id}`, function(data, status) {
        for (let point of data) { 
            if (!idsArray.includes(parseInt(point.id))) {
                idsArray.push(parseInt(point.id));  
            }
        }
    var json_ids = JSON.stringify(idsArray);
    Cookies.set('route', json_ids);
    Cookies.set('navigationRecompute', 'true');
    Cookies.set('displayRecommend', 'true');
    window.location.href="route_planning.html";
    }); 
}
