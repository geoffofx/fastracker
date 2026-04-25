self.addEventListener('install', (e) => {
    e.waitUntil(caches.open('fast-store').then((cache) => cache.addAll(['./index.html', './app.js'])));
});

self.addEventListener('fetch', (e) => {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});