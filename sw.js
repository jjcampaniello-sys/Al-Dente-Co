const CACHE_NAME = 'PastaWatts-v12'; //
const ASSETS_TO_CACHE = [ //
  './', //
  './index.html', //
  './readme.html', //
  './app.js', //
  './manifest.json', //
  './icon-192.png',//
  './icon-512.png'//
]; //

// Installation du Service Worker
self.addEventListener('install', (event) => { //
  event.waitUntil( //
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)) //
  ); //
  self.skipWaiting(); //
}); //

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => { //
  event.waitUntil( //
    caches.keys().then((keys) => //
      Promise.all(keys.map((key) => key !== CACHE_NAME ? caches.delete(key) : null)) //
    ) //
  ); //
  self.clients.claim(); //
}); //

// Stratégie réseau d'abord, secours sur le cache
self.addEventListener('fetch', (event) => { //
  event.respondWith( //
    fetch(event.request) //
      .then((networkResponse) => { //
        const clone = networkResponse.clone(); //
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)); //
        return networkResponse; //
      }) //
      .catch(() => caches.match(event.request)) //
  ); //
}); //

// ==========================================
// AJOUT : Gestionnaire de minuteur en tâche de fond
// ==========================================
let minuteursCuisson = [];

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'ANNULER_ALERTE') {
    minuteursCuisson.forEach(id => clearTimeout(id));
    minuteursCuisson = [];
    console.log("Alertes arrière-plan annulées.");
  }

  if (event.data && event.data.type === 'PROGRAMMER_ALERTES') {
    minuteursCuisson.forEach(id => clearTimeout(id));
    minuteursCuisson = [];

    event.data.alertes.forEach(alerte => {
      const id = setTimeout(() => {
        self.registration.showNotification(alerte.titre, {
          body: alerte.message,
          icon: './icon-192.png',
          badge: './icon-192.png',
          vibrate: [200, 100, 200, 100, 400],
          requireInteraction: true,
          tag: 'fin-cuisson-pastawatts',
          renotify: true,
          data: { url: './' }
        });
      }, alerte.delaiMs);
      minuteursCuisson.push(id);
    });

    console.log(`${event.data.alertes.length} alerte(s) programmée(s).`);
  }
});
