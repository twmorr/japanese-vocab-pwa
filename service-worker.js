const CACHE_NAME = 'vocab-drill-v1';
const APP_SHELL = [
  './index.html',
  './app.jsx',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Only manage caching for our own same-origin files.
  // Let cross-origin requests (React/Babel CDN scripts) pass straight through
  // to the browser's normal network handling — intercepting them here was
  // causing the CDN scripts to fail to load.
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          // No cache and network failed: let the browser show its own
          // offline error instead of crashing with an invalid response.
          return new Response('Offline and not cached.', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        });
    })
  );
});
