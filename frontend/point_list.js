const urlPoint = new URL("http://localhost:3000/point_detail");

$.getJSON(`http://localhost:8080/rest/points`, function(data, status) {
    console.log(data, status);
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
})
