const CACHE_NAME = 'vocab-drill-v3';
const APP_SHELL = [
  './index.html',
  './app.jsx',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// Pinned React/Babel runtime — must match the <script> URLs in index.html.
// These URLs are versioned, so their contents never change and can be served
// straight from cache.
const CDN_ASSETS = [
  'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone@7.26.4/babel.min.js',
];

// Google Fonts (stylesheet + font files) are cached as they're first used.
// They're not essential — without them the app falls back to system fonts.
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // Cached separately so a CDN hiccup doesn't also drop the app shell.
      Promise.all([
        cache.addAll(APP_SHELL).catch(() => {}),
        cache.addAll(CDN_ASSETS).catch(() => {}),
      ])
    )
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

// Cache-first: for URLs whose contents never change (pinned CDN scripts, fonts).
function cacheFirst(request) {
  return caches.match(request).then((cached) => {
    if (cached) return cached;
    return fetch(request).then((response) => {
      // Font stylesheets load without CORS, so their responses are opaque
      // (status 0) — still fine to cache and serve back.
      if (response && (response.ok || response.type === 'opaque')) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
      }
      return response;
    });
  });
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) {
    // Only exact pinned CDN URLs are handled. Unpinned ones (e.g. react@18)
    // redirect to a versioned URL, and serving those redirects from a
    // service worker was what previously broke the CDN scripts.
    if (CDN_ASSETS.includes(event.request.url) || FONT_HOSTS.includes(url.hostname)) {
      event.respondWith(cacheFirst(event.request));
    }
    // Anything else cross-origin passes straight through to the network.
    return;
  }

  // Network-first: always try to fetch the latest version so edits to the app
  // reach installed copies, refreshing the cache as we go. Only fall back to
  // the cached copy when the network is unavailable.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // Offline navigation to "./" (or any page URL) — serve the app shell.
          if (event.request.mode === 'navigate') return caches.match('./index.html');
          // No cache and network failed: let the browser show its own
          // offline error instead of crashing with an invalid response.
          return new Response('Offline and not cached.', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        })
      )
  );
});
