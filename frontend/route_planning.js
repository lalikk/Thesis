import Cookies from './node_modules/js-cookie/dist/js.cookie.mjs'
let contents = "";
let ids = Cookies.get("route");
if (typeof ids == 'undefined') {
  let contents = `To start planning a route, either select an existing route or add any point.\n`;
  contents += `<div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
  <button type="button" class="btn btn-primary btn-lg px-4 gap-3" onclick="location.href='route_list.html'">Take me to predefined routes</button>
  <button type="button" class="btn btn-outline-secondary btn-lg px-4"onclick="location.href='location.html'">Find what is around me</button>
  </div>`

  console.log(contents);  

  let textBody = document.querySelector('#empty-route');
  textBody.innerHTML = contents;
} else {

  let table = document.querySelector("#point-list");  
  var idsArray = JSON.parse(ids);

  $.getJSON('http://localhost:8080/rest/points', function(data, status) {
    console.log(data, status);
    let contents = "";
    for (let point of data) {
      if( idsArray.includes(point.id) )
        contents += `<tr data-point="${point.id}"><td>${point.title}</td><td>${point.description}</td><td>
        <span class="table-remove"
          ><button type="button" data-point="${point.id}" class="point-remove btn btn-danger btn-rounded btn-sm my-0">
            Remove
          </button></span
        >
      </td></tr>\n`;
    }
    table.innerHTML = contents;

    for (let button of document.querySelectorAll(".point-remove")) {
        button.onclick = removePoint;
    }
})



  /*for (let element in idsArray) {
    if (element == 0) { continue; }
    await $.getJSON(`http://localhost:8080/rest/points/${element}`, function(data, status) {
      console.log(data, status);
      contents += `<tr data-point="${data.id}"><td>${data.title}</td><td>${data.description}</td><td>
        <span class="table-remove"
        ><button type="button" data-point="${data.id}" class="point-remove btn btn-danger btn-rounded btn-sm my-0">
        Remove</button></span></td></tr>\n`;    
    //await x;//onsole.log(x);
  console.log(contents);
  });
  }
  table.innerHTML = contents;

  for (let button of document.querySelectorAll(".point-remove")) {
    button.onclick = removePoint;
  }*/
}

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