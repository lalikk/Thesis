const urlPoint = new URL("http://localhost:3000/point_detail");

$.getJSON(`http://localhost:8080/rest/points`, function(data, status) {
    console.log(data, status);
    let div = document.querySelector("#mansonry");
    let contents = "";

    for (let point of data) {
    urlPoint.search = new URLSearchParams({id:`${point.id}`});
        contents += `<div class="col-sm-6 col-lg-4 mb-4">
            <div class="card">
            <svg class="bd-placeholder-img card-img-top" width="100%" height="200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image cap" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"/><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text></svg>
            <div class="card-body">
            <h5 class="card-title">${point.title}</h5>
            <p class="card-text">${point.description}</p>
            </div>
            </div>
            </div>`;
    }
    div.innerHTML = contents;
})
