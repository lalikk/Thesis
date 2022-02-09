const urlPoint = new URL("http://localhost:3000/point_detail");

let points = window.localStorage.getItem('pointsRequest');
if (points == null) {
    $.getJSON(`http://localhost:8080/rest/points`, function(data, status) {
        console.log(data, status);
        console.log("new request");
        window.localStorage.setItem('pointsRequest', JSON.stringify(data));
        displayData(data);
    })
} else {
    let data = JSON.parse(points);
    console.log("reuse data");
    displayData(data);
}

function displayData(data) {
    let div = document.querySelector("#mansonry");
    let contents = "";

    for (let point of data) {
    urlPoint.search = new URLSearchParams({id:`${point.id}`});
        contents += `<div class="col-sm-6 col-lg-4 mb-4">
            <div class="card">
            <img class="card-img-top" src="${point.photos[0].image}" width="100%" height="200" focusable="false"/>
            <div class="card-body">
            <h5 class="card-title"><a href="${urlPoint}">${point.title}</a></h5>
            <p class="card-text">${point.description}</p>
            </div>
            </div>
            </div>`;
    }
    div.innerHTML = contents;
}