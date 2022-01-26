import Cookies from './node_modules/js-cookie/dist/js.cookie.mjs'

$.getJSON('http://localhost:8080/rest/points', function(data, status) {
    console.log(data, status);
    let table = document.querySelector("#point-list");

    var ids = [];
    let contents = "";
    for (let point of data) {
        contents += `<tr data-point="${point.id}"><td>${point.title}</td><td>${point.description}</td><td>
        <span class="table-remove"
          ><button type="button" data-point="${point.id}" class="point-remove btn btn-danger btn-rounded btn-sm my-0">
            Remove
          </button></span
        >
      </td></tr>\n`;
        ids.push(point.id);
    }
    table.innerHTML = contents;
    var  json_ids = JSON.stringify(ids);
    document.cookie = "route=" + json_ids;

    for (let button of document.querySelectorAll(".point-remove")) {
        button.onclick = removePoint;
    }
})

function removePoint(e) {
    console.log(e.target);
    console.log(e.target.dataset['point']);
    let id = e.target.dataset['point'];
    let row = document.querySelector(`tr[data-point="${id}"]`);
    console.log(row);
    row.classList.add("d-none");

    removeIdFromCookie(id);
}

function removeIdFromCookie(id) {
    console.log(id);
    var ids = Cookies.get("route");
    var arr = JSON.parse(ids);
    let index = arr.indexOf(parseInt(id));
    arr.splice(index, 1);    
    ids = JSON.stringify(arr);
    document.cookie = "route=" + ids;
}