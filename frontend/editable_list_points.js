const urlPoint = new URL("http://localhost:3000/editable_point_detail");

$.getJSON(`http://localhost:8080/rest/points`, function(data, status) {
    console.log(data, status);
    console.log("new request");
    window.localStorage.setItem('pointsRequest', JSON.stringify(data));
    displayData(data);
})

function displayData(data) {
    let div = document.querySelector("#editable-point-list");
    let contents = `<thead><tr>
        <th scope="col">Existing points</th>
        <!--<th scope="col">Tag</th>-->
        <th scope="col"> <button type="button" id='add-point' class="btn btn-primary btn-lg px-4 gap-3" 
        > Create new point
      </button></th>
    </tr>
    </thead>`;

    for (let point of data) {
    urlPoint.search = new URLSearchParams({id:`${point.id}`});
        contents += `<tr><td><a href=${urlPoint}>${point.title}</a></td>\n
            <td><span class="point-remove"><button type="button" data-point="${point.id}" 
            class="btn btn-primary btn-lg px-4 gap-3">
            Remove</button></span>
            <span class="point-remove"><button type="button" data-point="${point.id}" 
            class="btn btn-secondary btn-lg px-4 gap-3">
            Edit</button></span></td></tr>\n`;
    }
    div.innerHTML = contents;
}


