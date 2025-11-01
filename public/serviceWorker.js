const CACHE_NAME = 'my-kitchen-cache-v2';
// Resolve assets relative to the service worker scope so it works under subpaths (e.g., GitHub Pages)
const SCOPE = self.registration?.scope || '/';
const toURL = (p) => new URL(p, SCOPE).toString();
const CORE_ASSETS = [
  toURL('./'),
  toURL('./index.html'),
  toURL('./manifest.json'),
  toURL('./icons/kitchen-icon.svg'),
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => k !== CACHE_NAME && caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
  .catch(() => caches.match(req).then((res) => res || caches.match(toURL('./index.html'))))
    );
  } else {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        });
      })
    );
  }
});
