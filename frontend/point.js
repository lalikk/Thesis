$.getJSON('http://localhost:8080/rest/points', function(data, status) {
    console.log(data, status);
    data["name"]
    document.querySelector("#point-name").innerHTML=`<div> ${data["name"]} <\div>`
})