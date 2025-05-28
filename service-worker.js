const CACHE_NAME = 'graulhet-eau-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.js', 
  '/manifest.json',
  '/App.js',
  '/components/InterventionForm.js',
  '/components/InterventionItem.js',
  '/components/icons.js',
  '/services/geocodingService.js',
  '/services/interventionService.js',
  '/constants.js',
  '/types.js', // Even if mostly comments, good to cache if it's part of the structure
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
        // Using new Request with mode: 'cors' for external resources
        // For local resources, it might not be strictly necessary but doesn't hurt.
        const cachePromises = ASSETS_TO_CACHE.map(assetUrl => {
          const request = new Request(assetUrl, {mode: 'cors'});
          return cache.add(request).catch(err => {
            console.warn(`Failed to cache ${assetUrl} during install:`, err);
          });
        });
        return Promise.all(cachePromises);
      })
      .then(() => {
        console.log('All specified assets processed for caching during install.');
        return self.skipWaiting(); // Activate the new service worker immediately
      })
      .catch(error => {
          console.error('Service Worker installation failed:', error);
      })
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
  // For navigation requests (HTML), try network first, then cache, then fallback.
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
              // Fallback to /index.html for any navigation request not found in cache
              return cachedResponse || caches.match('/index.html'); 
            });
        })
    );
  } else {
    // For static assets (CSS, JS, images, fonts), use a cache-first strategy
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          // Return cached response if found
          if (cachedResponse) {
            return cachedResponse;
          }
          // Not in cache, fetch from network, then cache it
          return fetch(event.request).then(networkResponse => {
            // Check if we received a valid response
            if (networkResponse && networkResponse.status === 200 && networkResponse.type !== 'opaque') {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            } else if (networkResponse.type === 'opaque') {
              // Opaque responses (e.g. from no-cors requests to third-party CDNs) can't be cloned or inspected,
              // but they are cached as is. This is fine for CDNs.
            }
            return networkResponse;
          }).catch(error => {
            console.warn('Fetching asset failed, no cache hit:', event.request.url, error);
            // Optionally return a placeholder for images or a generic error for other assets
            // For now, just let the browser handle the fetch error (e.g. show broken image).
          });
        })
    );
  }
});