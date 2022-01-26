import Cookies from './node_modules/js-cookie/dist/js.cookie.mjs'

$.getJSON('http://localhost:8080/rest/points', function(data, status) {
    console.log(data, status);
    let table = document.querySelector("#point-list");

    var ids = [];
    let contents = "";
    for (let point of data) {
        contents += `<tr data-point="${point.id}"><td>${point.title}</td><td>${point.description}</td></tr>\n`;
        ids.push(point.id);
    }
    table.innerHTML = contents;
    var  json_ids = JSON.stringify(ids);
    document.cookie = "route=" + json_ids;

})
