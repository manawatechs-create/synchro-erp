// Service Worker - Synchro ERP
const CACHE_NAME = 'synchro-erp-v4';
const OFFLINE_URL = '/login';

const urlsToCache = [
  '/',
  '/login',
  '/register',
  '/dashboard',
  '/manifest.json',
  '/logo.png',
  '/favicon.png',
  '/apple-touch-icon.png',
];

// Installation
self.addEventListener('install', (event: any) => {
  console.log('📦 Installation du Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Mise en cache des fichiers...');
        return cache.addAll(urlsToCache).catch(err => {
          console.log('⚠️ Certains fichiers non mis en cache:', err);
        });
      })
      .then(() => {
        console.log('✅ Service Worker installé !');
        return self.skipWaiting();
      })
  );
});

// Activation
self.addEventListener('activate', (event: any) => {
  console.log('✅ Service Worker activé !');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Stratégie : Network First, puis Cache
self.addEventListener('fetch', (event: any) => {
  // Ne pas intercepter les requêtes API
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response: any) => {
        // Mettre en cache les réponses réussies
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si pas de réseau, servir depuis le cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Retourner la page d'accueil pour les pages non trouvées
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            return new Response('Mode hors-ligne - Synchro ERP', {
              status: 503,
              headers: { 'Content-Type': 'text/plain; charset=utf-8' }
            });
          });
      })
  );
});

// Message de statut
self.addEventListener('message', (event: any) => {
  if (event.data === 'check-status') {
    event.ports[0].postMessage({
      status: 'active',
      version: CACHE_NAME
    });
  }
});
