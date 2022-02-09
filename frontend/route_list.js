let routes = window.localStorage.getItem('routesRequest');

if (routes == null) {
    $.getJSON('http://localhost:8080/rest/routes', function(data, status) {
        console.log(data, status);
        window.localStorage.setItem('routesRequest', JSON.stringify(data));
        displayRoutes(data);
    })
} else {
    let data = JSON.parse(routes);
    displayRoutes(data);
}

function displayRoutes(data) {
    let table = document.querySelector("#route-list");
    const urlRoute = new URL("http://localhost:3000/route_detail");
    let contents = "";

    for (let route of data) {
    urlRoute.search = new URLSearchParams({id:`${route.id}`});
        contents += `<tr><td><a href=${urlRoute}>${route.description}</a></td></tr>\n`;
    }
    table.innerHTML = contents;
}