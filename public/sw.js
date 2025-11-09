// sw.js (React build版 + Safari対応 + IndexedDB)
const STATIC_CACHE = 'static-cache-v4';
const API_CACHE = 'api-cache-v4';
const MANIFEST_URL = '/asset-manifest.json';
const DB_NAME = 'api-response-cache';
const DB_STORE = 'responses';

// --- IndexedDB ヘルパー ---
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveToDB(url, data) {
  try {
    const db = await openDB();
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).put(data, url);
    await tx.done;
  } catch (e) {
    console.warn('[SW] IndexedDB save failed:', e);
  }
}

async function loadFromDB(url) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, 'readonly');
      const req = tx.objectStore(DB_STORE).get(url);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('[SW] IndexedDB load failed:', e);
    return null;
  }
}

// --- Install ---
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      try {
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
        ].filter(Boolean);

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

  // --- API キャッシュ (オンライン優先 + IndexedDBフォールバック) ---
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(event.request);
          const clone = networkResponse.clone();

          // JSONレスポンスをIndexedDBに保存
          const contentType = clone.headers.get('Content-Type') || '';
          if (contentType.includes('application/json')) {
            const json = await clone.json();
            await saveToDB(event.request.url, json);
          }

          return networkResponse;
        } catch (err) {
          console.warn('[SW] Network failed, trying IndexedDB:', err);
          const cachedJson = await loadFromDB(event.request.url);
          if (cachedJson) {
            console.log('[SW] Offline IndexedDB hit for', event.request.url);
            return new Response(JSON.stringify(cachedJson), {
              headers: { 'Content-Type': 'application/json' },
            });
          }

          // IndexedDBにもない場合
          return new Response(
            JSON.stringify({ error: 'Offline and no cached data available' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
          );
        }
      })()
    );
    return;
  }

  // --- 静的ファイル ---
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
