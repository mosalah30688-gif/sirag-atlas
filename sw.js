const CACHE_NAME = 'sirag-atlas-stage-10';
const CORE_ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './assets/seal.svg',
  './manifest.json',
  './js/audio.js',
  './js/data/seerah-events.js',
  './js/data/hijrah-quiz.js',
  './js/data/battles.js',
  './js/data/scenarios.js',
  './js/data/companions.js',
  './js/data/lineage.js',
  './js/data/guidance.js',
  './js/data/relics.js',
  './js/atlas.js',
  './js/hijrah-quiz.js',
  './js/battles.js',
  './js/scenarios.js',
  './js/constellation.js',
  './js/lineage.js',
  './js/guidance-search.js',
  './js/museum.js',
  './js/poster.js',
  './js/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
