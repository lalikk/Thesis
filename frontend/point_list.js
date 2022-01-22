$.getJSON('http://localhost:8080/rest/points', function(data, status) {
    console.log(data, status);
    data["title"]
    document.querySelector("#point-list").innerHTML=`<div> ${data["title"]} <\div>`
})