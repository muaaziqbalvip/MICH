const CACHE = 'mich-v1';
const ASSETS = ['/', '/index.html', '/admin.html', '/css/style.css', '/css/admin.css', '/js/firebase-config.js', '/js/main.js', '/js/chat.js', '/js/projects.js', '/js/pwa.js', '/js/admin.js', '/manifest.json'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => { e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('/index.html')))); });
