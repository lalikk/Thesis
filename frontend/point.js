import Cookies from './node_modules/js-cookie/dist/js.cookie.mjs'
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const present = urlParams.get('present');
let count = 0;

//http://localhost:3000/point_detail?id=1&present=true when accessed from given location

$.getJSON(`http://localhost:8080/rest/points/${id}`, function(data, status) {
    console.log(data, status);
    let div = document.querySelector("#point-contents");
    let contents = "";
    contents += `<div class="title-simple"><h1>${data.title}</h1></div>\n`;
    contents += `<button type="button" id='add-to-planning' class="btn btn-primary btn-lg px-4 gap-3" 
                 style="position: absolute; right: 1rem; top: 8rem;"> Add to planned route
                 </button>`;
    contents += `<div class="text-body"><div class="clearfix"><h4>${data.description}</h4></div></div>\n`;
    contents += `<div class="row" style="position: relative;">\n
                 <div id="more-pictures-info" style="position: absolute; top: 2rem; left: 2rem; pointer-events:none;">
                 </div>\n`;
    for (let photo of data.photos) {
        console.log(photo);
        if (count == 0) {
            contents += `<div class="col-lg-3 col-md-4 col-xs-6 thumb">\n
                         <a href="${photo.image}" rel="ligthbox" class="fancybox">\n
                         <img src="${photo.image}" class="zoom img-fluid" alt="">\n         
                         </a></div>`;           
            ++count;
            continue;
        }
        contents += `<div class="col-lg-3 col-md-4 col-xs-6 thumb"  style="display: none;">\n
                     <a href="${photo.image}" rel="ligthbox" class="fancybox">\n
                     <img src="${photo.image}" class="zoom img-fluid" alt="">\n         
                     </a></div>`;
        ++count;
    }
    contents += `</div>`;
    div.innerHTML = contents;
    --count;
    document.querySelector('#more-pictures-info').innerHTML=`<h1  style="width: fit-content;">+${count}</h1>`;
    document.querySelector("#add-to-planning").onclick = addToPlanning;
    if (present == "true") {
        changeUserLocation();
    }

    $(".fancybox").fancybox({
        openEffect: "none",
        closeEffect: "none"
    });
})

function addToPlanning(e) {
    console.log(e);
    let ids = Cookies.get("route");
    if (typeof ids == 'undefined') {
        console.log(id);
        ids = [parseInt(id)];
    } else {
        let idsArray = JSON.parse(ids);
        if (!idsArray.includes(parseInt(id))) {
            idsArray.push(parseInt(id));
        } else {
            $('#point-route-duplicate').modal('show')
            return
        }
        ids = idsArray;
    }   
    var jsonIds = JSON.stringify(ids);
    Cookies.set('route', jsonIds);
    Cookies.set('navigationRecompute', 'true');
    window.location.href="route_planning.html";
}

function changeUserLocation() {
    changeVisitedCookie();
    changeLocationCookie();
}

function changeVisitedCookie() {
    let visitedIds = Cookies.get('visited');
    console.log(visitedIds);
    if (typeof visitedIds == 'undefined') {
        visitedIds = [parseInt(id)];
        console.log(visitedIds);
    } else {
        visitedIds = JSON.parse(visitedIds);
        if (!visitedIds.includes(parseInt(id))) {
            visitedIds.push(parseInt(id));
        } else {
            return;
        }
    }
    console.log(typeof visitedIds);
    let jsonVisited = JSON.stringify(visitedIds);
    console.log(jsonVisited);
        Cookies.set('visited', jsonVisited);
        console.log(JSON.parse(Cookies.get('visited')))
}

function changeLocationCookie() {
    let userLocation = Cookies.get("userLocation");
    if (typeof userLocation != undefined) {
        Cookies.remove('userLocation');
    }
    $.getJSON(`http://localhost:8080/rest/points/${id}`, function(data, status) {
        let newLocation = {latitude: parseFloat(data.coordinates.latitude), longitude: parseFloat(data.coordinates.longitude)};
        let jsonLocation = JSON.stringify(newLocation);
        Cookies.set('userLocation', jsonLocation);    
    });
}
