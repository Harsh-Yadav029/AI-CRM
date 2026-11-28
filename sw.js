// Future Tech Minds - Service Worker (v4)
// Network-first for HTML/JSON (fresh deploys), cache-first for vendor JS & 359 WebP frames

const CACHE_NAME = 'ftm3-v4';

const CORE_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vendor/gsap.min.js',
  '/vendor/ScrollTrigger.min.js',
  '/vendor/lenis.min.js',
  '/data/class-3.json',
  '/data/class-6.json',
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_FILES))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Network-first for page navigation & curriculum JSON
  if (event.request.mode === 'navigate' || url.pathname.startsWith('/data/')) {
    event.respondWith(
      fetch(event.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          const cacheKey = event.request.mode === 'navigate' ? '/index.html' : event.request;
          caches.open(CACHE_NAME).then(c => c.put(cacheKey, clone));
        }
        return res;
      }).catch(() => caches.match(event.request.mode === 'navigate' ? '/index.html' : event.request, { ignoreSearch: true }))
    );
    return;
  }

  // Cache-first for vendor scripts & 359 animation frames
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
