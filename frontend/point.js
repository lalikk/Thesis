const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
//console.log(id);
let count = 0;

$.getJSON(`http://localhost:8080/rest/points/${id}`, function(data, status) {
    //console.log(data, status);
    let div = document.querySelector("#point-contents");
    let contents = "";
    contents += `<div class="title-simple"><h1>${data.title}</h1></div>\n`;
    contents += `<div class="text-body"><div class="clearfix"><h4>${data.description}</h4></div></div>\n`
    contents += `<div class="row">\n`
    for (let photo of data.photos) {
        contents += `<div class="col-lg-3 col-md-4 col-xs-6 thumb">\n
                     <a href="${photo.image}" rel="ligthbox" class="fancybox">\n
                     <img src="${photo.image}" class="zoom img-fluid" alt="">\n         
                     </a></div>`
    }
    contents += `</div>`;
    //document.querySelector('#more-pictures').innerHTML="+"+`${count}`;
    div.innerHTML = contents;

    $(".fancybox").fancybox({
        openEffect: "none",
        closeEffect: "none"
    });
})



