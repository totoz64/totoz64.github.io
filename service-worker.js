const CACHE_NAME = 'graulhet-eau-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.js', // Changed from index.tsx
  '/manifest.json',
  // Add paths to your actual icon files here if they are different
  // Ensure these files exist in your repository under /assets/icons/
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  '/assets/icons/apple-touch-icon.png',
  // External assets (CDNs)
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap',
];

// Install event: Cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache:', CACHE_NAME);
        // Add all assets to cache. If any fail, the SW installation fails.
        return cache.addAll(ASSETS_TO_CACHE.map(url => new Request(url, { mode: 'cors' })))
          .catch(error => {
            console.error('Failed to cache one or more assets during install:', error, ASSETS_TO_CACHE);
            // It's important to understand why caching failed.
            // For external resources, ensure CORS is handled.
            // For local resources, ensure paths are correct.
          });
      })
      .then(() => self.skipWaiting()) // Activate the new service worker immediately
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of uncontrolled clients
  );
});

// Fetch event: Serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', event => {
  // For navigation requests, try network first, then cache, then fallback (e.g. index.html)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If successful, clone and cache the response for future offline use.
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
          }
          return response;
        })
        .catch(() => {
          // Network failed, try to serve from cache
          return caches.match(event.request)
            .then(cachedResponse => {
              return cachedResponse || caches.match('/index.html'); // Fallback to home page
            });
        })
    );
  } else {
    // For static assets (CSS, JS, images), use a cache-first strategy
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          // Return cached response if found
          if (cachedResponse) {
            return cachedResponse;
          }
          // Not in cache, fetch from network, then cache it
          return fetch(event.request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type !== 'opaque') {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          }).catch(error => {
            console.error('Fetching asset failed:', event.request.url, error);
            // Optionally return a placeholder for images or a generic error for other assets
          });
        })
    );
  }
});