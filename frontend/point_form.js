let pointTags = window.localStorage.getItem('pointTagsRequest');

if (pointTags == null) {
    $.getJSON('http://localhost:8080/rest/point_tags', function(data, status) {
        console.log(data, status);
        window.localStorage.setItem('pointTagsRequest', JSON.stringify(data));
        displayCheckboxes(data);
    });
} else {
    let data = JSON.parse(pointTags);
    displayCheckboxes(data);
}

function displayCheckboxes(data) {
    let div = document.querySelector("#point-tags");
    let contents = "";
    for (let tag of data) {
        contents += `<div class="form-check">\n
            <input type="checkbox" class="form-check-input" id="${tag.name}">\n
            <label class="form-check-label" for="${tag.name}">${tag.name}</label>\n
            </div>\n`
    }
    div.innerHTML = contents;
}