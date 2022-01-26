import Cookies from './node_modules/js-cookie/dist/js.cookie.mjs'

$.getJSON('http://localhost:8080/rest/routes/1', function(data, status) {
    console.log(data, status);
    let table = document.querySelector("#point-list");
    let points = data.points;

    let contents = "";
    for (let point of points) {
        contents += `<tr><td>${point.title}</td><td>${point.description}</td></tr>\n`;

    }
    table.innerHTML = contents;

    document.querySelector("#planning-button").setAttribute('data-route', data.id);
    document.querySelector("#planning-button").onclick = startPlanning;
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
            document.cookie = "route=" + json_ids;
            // TODO now go to route planning page
        })
    } else {
        $('#route-planning').modal('show')



    }


    /*var ids = [];
    var  json_ids = JSON.stringify(ids);
    document.cookie = "route=" + json_ids;
    ids.push(point.id);*/

}
