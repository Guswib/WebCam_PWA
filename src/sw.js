

var file_cashe = [
//    '/',
    './manifest.webmanifest',
    './index.html', 
    './css/styles.css', //Add any other assets your web page needs
    './js/app_main.js',
    './js/app_webcam.js',
    './js/app_ini.js'
   
   
];


var icons_cashe = [
    './bild_ico/EC4_WebCam.svg',
    './bild_ico/EC4_WebCam_144_mask.png',
    './bild_ico/EC4_WebCam_144.png'];


importScripts('./sw-toolbox/sw-toolbox.js');


toolbox.precache([
  
    './sw-toolbox/companion.js'
  ]);

  toolbox.precache(file_cashe);
  //toolbox.precache(bilder_cashe);
  toolbox.precache(icons_cashe);
  
  toolbox.router.default = toolbox.networkFirst;
  toolbox.options.networkTimeoutSeconds = 5;
  
  //toolbox.router.get('bild/*', toolbox.fastest);


//install serivce worker

self.addEventListener('install', function(event) {
    
    self.skipWaiting();


    

    console.log('service worker has been installed');
});

//activate serivce worker
self.addEventListener('activate', evt => {
    console.log('service worker has been activated');
});

//self.addEventListener('install', function(e) {
//    
//});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});

