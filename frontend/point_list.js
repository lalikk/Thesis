$.getJSON('http://localhost:8080/rest/points', function(data, status) {
    console.log(data, status);
    data["title"]
    table = document.querySelector("#point-list");

    contents = "";
    for (point of data) {
        contents += `<tr><td>${point.title}</td><td>${point.description}</td></tr>\n`;
    }
    table.innerHTML = contents;
})