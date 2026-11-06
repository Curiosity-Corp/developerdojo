/* Opt-in offline practice only. This worker controls /offline/, not the rest of the site. */
const CACHE = 'dojo-pocket-v1';
const PAGE = '/offline/pocket.html';
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.add(PAGE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('dojo-pocket-') && key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method === 'GET' && url.origin === self.location.origin && url.pathname === PAGE) {
    event.respondWith(caches.open(CACHE).then((cache) => cache.match(PAGE)).then((response) => response || fetch(event.request)));
  }
});
