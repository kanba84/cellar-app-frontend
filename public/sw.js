const CACHE_NAME = 'cellar-app-cache-v2';
const STATIC_CACHE = 'static-cache-v1';
const API_CACHE = 'api-cache-v1';

const staticUrlsToCache = ['/', '/index.html', '/manifest.json'];

// APIのベースURLを設定（config.jsonから読み込む予定）
let API_BASE_URL = '';

// ビルド時に配置されたconfig.jsonを読み込む
fetch('/config.json')
  .then(response => response.json())
  .then(config => {
    API_BASE_URL = config.REACT_APP_API_BASE_URL;
  })
  .catch(error => {
    console.error('Failed to load config:', error);
    // デフォルトの設定をフォールバックとして使用
    API_BASE_URL = 'https://192.168.11.26:8443';
  });

self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => cache.addAll(staticUrlsToCache)),
      caches.open(API_CACHE)
    ])
  );
  console.log('Service Worker installed');
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // APIリクエストの場合
  if (API_BASE_URL && url.origin === new URL(API_BASE_URL).origin) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // レスポンスのクローンを作成してキャッシュに保存
          const responseToCache = response.clone();
          caches.open(API_CACHE)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        })
        .catch(() => {
          // オフライン時はキャッシュから返す
          return caches.match(event.request);
        })
    );
  } else {
    // 静的アセットの場合
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // 古いキャッシュを削除
      caches.keys().then(keys => Promise.all(
        keys.map(key => {
          if (key !== STATIC_CACHE && key !== API_CACHE) {
            return caches.delete(key);
          }
        })
      ))
    ])
  );
  console.log('Service Worker activated');
});
