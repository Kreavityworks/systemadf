/* Only the offline notice and app icons are cached. Never cache team data,
   authentication, screenshots, HTML app shells or downloadable releases. */
const CACHE = 'systemadf-offline-v1';
const OFFLINE_ASSETS = ['/offline.html', '/app-icons/icon-192.png', '/app-icons/icon-512.png'];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(OFFLINE_ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('systemadf-offline-') && key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || event.request.method !== 'GET') return;
  if (OFFLINE_ASSETS.includes(url.pathname)) {
    event.respondWith(fetch(event.request).catch(() => caches.match(url.pathname)));
  } else if (event.request.mode === 'navigate' && !url.pathname.startsWith('/downloads/')) {
    event.respondWith(fetch(event.request).catch(() => caches.match('/offline.html')));
  }
});
