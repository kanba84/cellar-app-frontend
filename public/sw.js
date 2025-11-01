// sw.js (同一オリジン用シンプル版)
const STATIC_CACHE = 'static-cache-v1';
const API_CACHE = 'api-cache-v1';
const STATIC_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/static/js/main.js',
  '/static/css/main.css'
];

// --- Install ---
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_URLS))
  );
  self.skipWaiting();
});

// --- Fetch ---
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(API_CACHE).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 静的ファイル
  event.respondWith(
    caches.match(event.request).then(r => r || fetch(event.request))
  );
});

// --- Activate ---
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (![STATIC_CACHE, API_CACHE].includes(key)) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});
