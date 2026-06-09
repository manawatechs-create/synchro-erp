// Service Worker - Synchro ERP - Mode Hors-Ligne
const CACHE_NAME = 'synchro-erp-v3';
const OFFLINE_URL = '/';

// Fichiers à mettre en cache pour le mode hors-ligne
const urlsToCache = [
  '/',
  '/login',
  '/register',
  '/dashboard',
  '/manifest.json',
  '/logo.png',
  '/icons/dashboard.svg',
  '/icons/users.svg',
  '/icons/box.svg',
  '/icons/cart.svg',
  '/icons/truck.svg',
  '/icons/file.svg',
  '/icons/wallet.svg',
  '/icons/calculator.svg',
  '/icons/coins.svg',
  '/icons/leaf.svg',
  '/icons/map-pin.svg',
  '/icons/chart.svg',
  '/icons/calendar.svg',
  '/icons/award.svg',
  '/icons/heart.svg',
  '/icons/star.svg',
  '/icons/shield.svg',
  '/icons/settings.svg',
  '/icons/download.svg',
  '/icons/bell.svg',
  '/icons/search.svg',
  '/icons/plus.svg',
  '/icons/edit.svg',
  '/icons/trash.svg',
  '/icons/eye.svg',
  '/icons/logout.svg',
  '/icons/menu.svg',
  '/icons/arrow-left.svg',
  '/icons/arrow-right.svg',
  '/icons/check.svg',
  '/icons/x.svg',
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Mise en cache des fichiers...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Tous les fichiers sont en cache !');
        return self.skipWaiting();
      })
  );
});

// Activation - Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      console.log('✅ Service Worker activé !');
      return self.clients.claim();
    })
  );
});

// Stratégie : Network First, puis Cache (mode hors-ligne)
self.addEventListener('fetch', (event) => {
  // Ne pas intercepter les requêtes API
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Mettre en cache la réponse pour le mode hors-ligne
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Si pas de réseau, servir depuis le cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Si la page n'est pas en cache, renvoyer la page d'accueil
            return caches.match(OFFLINE_URL);
          });
      })
  );
});

// Message de statut
self.addEventListener('message', (event) => {
  if (event.data === 'check-status') {
    event.ports[0].postMessage({
      status: 'active',
      version: CACHE_NAME,
      cachedFiles: urlsToCache.length
    });
  }
});
