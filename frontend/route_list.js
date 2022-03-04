import ROUTE_DATA from './js-modules/route-data.js';
import { MAKE_ROUTE_URL } from './js-modules/constants.js';

$(async () => {
    let routes = await ROUTE_DATA.getAllRoutes();

    let table = "";
    for (let id in routes) {
        let route = routes[id];
        console.log(route)
        if (route.points.length >= 1) {
            table += renderCardRow(route);
        }
    }

    document.querySelector("#route-cards").innerHTML = table;
})

function renderCardRow(route) {
    return `
    <div data-route="${route.id}" class="card-planning" style="background-image: url('${route.points[0].photos[0].image}');">
      <div class="inner-planning" style="padding-right:2rem;">
        <span style="display: inline-block;">      
        <a href=${MAKE_ROUTE_URL(route.id)}><h3>${route.description}</h3></a>
        </span>
      </div>
    </div>`;
  }
  