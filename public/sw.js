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

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // --- API キャッシュ (オンライン優先 + オフラインフォールバック) ---
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      (async () => {
        try {
          // ネットワーク優先で取得
          const networkResponse = await fetch(event.request);
          const clone = networkResponse.clone();
          const cache = await caches.open('api-cache-v1');
          cache.put(event.request, clone);
          return networkResponse;
        } catch (err) {
          // オフライン時はキャッシュ参照
          const cached = await caches.match(event.request);
          if (cached) {
            console.log('[SW] Offline cache hit for', event.request.url);
            return cached;
          }
          // キャッシュにもない場合のエラー応答
          return new Response(
            JSON.stringify({ error: 'Offline and no cache available' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
          );
        }
      })()
    );
    return; // ← ここで処理を終了
  }

  // --- 静的ファイル処理（既存部分） ---
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
