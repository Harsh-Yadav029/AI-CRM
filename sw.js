// Future Tech Minds 3 - Service Worker
// Network-first for HTML (always fresh deploys), cache-first for 359 frames

const CACHE_NAME = 'ftm3-v3';

const CORE_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
];

// INSTALL: cache core shell immediately so SW activates in <1s
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_FILES))
  );
});

// ACTIVATE: delete old caches (clears stale index.html) and take control immediately
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// FETCH: network-first for navigation (HTML), cache-first for frames/assets
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Navigation requests: try network first so updates appear right away, fall back to cache offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put('/index.html', clone));
        }
        return res;
      }).catch(() => caches.match('/index.html', { ignoreSearch: true }))
    );
    return;
  }

  // Frames and other same-origin assets: cache-first, populate cache on first fetch
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
