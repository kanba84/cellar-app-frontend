// sw.js (React build版 + Safari対応)
const STATIC_CACHE = 'static-cache-v3';
const API_CACHE = 'api-cache-v1';
const MANIFEST_URL = '/asset-manifest.json';

// --- Install ---
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      try {
        // asset-manifest.json からキャッシュ対象を自動取得
        const res = await fetch(MANIFEST_URL, { cache: 'no-store' });
        const manifest = await res.json();

        const files = [
          '/',
          '/index.html',
          '/manifest.json',
          '/favicon.ico',
          '/logo192.png',
          '/logo512.png',
          manifest.files['main.js'],
          manifest.files['main.css'],
        ].filter(Boolean); // undefinedを除外

        const cache = await caches.open(STATIC_CACHE);
        for (const url of files) {
          try {
            await cache.add(url);
            console.log('[SW] Cached:', url);
          } catch (e) {
            console.warn('[SW] Cache failed:', url, e);
          }
        }
      } catch (err) {
        console.error('[SW] asset-manifest.json load failed:', err);
      }
    })()
  );
  self.skipWaiting();
});

// --- Fetch ---
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // APIキャッシュ
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

  // 静的ファイル（オフライン対応）
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// --- Activate ---
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (![STATIC_CACHE, API_CACHE].includes(key)) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});
