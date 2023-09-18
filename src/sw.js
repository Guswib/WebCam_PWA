

var file_cashe = [
//    '/',
    './manifest.webmanifest',
    './index.html', 
    './css/styles.css', //Add any other assets your web page needs
    './js/app_main.js',
    './js/app_webcam.js',
    './js/app_ini.js'
   
   
];

var bilder_cashe = [
    './bild/button_ramp.svg',
    './bild/button_swv.svg',
    './bild/button_steps.svg',
    './bild/button_cell_cc.svg',
    './bild/button_cell_oc.svg',
    './bild/button_serial_on.svg',
    './bild/button_serial_off.svg',
    './bild/button_run.svg',
    './bild/img_abort.svg',
    './bild/img_ble.svg',
    './bild/img_clear_plot.svg',
    './bild/img_copy.svg',
    './bild/img_save.svg',
    './bild/img_serial.svg',
    './bild/wButton_Graph_Rescale_Y.png',
    './bild/img_dialog_yes.svg',
    './bild/img_dialog_no.svg'];

var icons_cashe = [
    './bild_ico/EC4_WebCam.svg',
    'Nordic-Electrochemistry-Logo.png',
    './bild_ico/EC4_WebCam_144_mask.png',
    './bild_ico/EC4_WebCam_144.png'];


importScripts('./sw-toolbox/sw-toolbox.js');
toolbox.precache([
    './css/normalize.css',
    './css/BLE_style.css',
    
    './sw-toolbox/companion.js',
    './js/BLE_COM_UI.js',
    './ble.html',
    
    
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

