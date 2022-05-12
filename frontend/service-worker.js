// give your cache a name
const cacheName = 'my-cache';

// put the static assets and routes you want to cache here
const filesToCache = [
  '/',
  // HTML Files
  '/index.html',
  '/about.html',
  '/contact.html',
  '/location.html',
  '/point_detail.html',
  '/point_list.html',
  '/route_detail.html',
  '/route_list.html',
  '/route_navigation.html',
  '/route_planning.html',
  // HTML-specific JS
  //'/index.js',
  '/location.js',
  '/point_detail.js',
  '/point_list.js',
  '/route_detail.js',
  '/route_list.js',
  '/route_navigation.js',
  '/route_planning.js',
  // General JS
  '/collect.js',
  '/js-modules/authorisation-check.js',
  '/js-modules/constants.js',
  '/js-modules/current-route.js',
  '/js-modules/map-utils.js',
  '/js-modules/navigation.js',
  '/js-modules/point-data.js',
  '/js-modules/point-tag-data.js',
  '/js-modules/route-data.js',
  // CSS
  '/headers.css',
  '/gallery.css',
  '/css_elements.css',
  '/footers.css',
  '/sidebars.css',
  '/assets/css/starter.css',
  // Dependencies
  '/node_modules/jquery/dist/jquery.min.js',
  '/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
  '/node_modules/masonry-layout/dist/masonry.pkgd.min.js',
  '/assets/fancyapps/fancybox/dist/jquery.fancybox.min.js',
];

// the event handler for the activate event
self.addEventListener('activate', e => self.clients.claim());

// the event handler for the install event 
// typically used to cache assets
self.addEventListener('install', e => {
    console.log("Installing...");
  e.waitUntil(
    caches.open(cacheName)
    .then(cache => cache.addAll(filesToCache))
  );
});

// the fetch event handler, to intercept requests and serve all 
// static assets from the cache
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request, {
        'ignoreSearch': true,
        'ignoreVary': true,
    })
    .then(response => {
        //console.log("SW fetch:", e);
        //console.log("Response:", response);
        return response ? response : fetch(e.request);
    })
  )
});