const CACHE_NAME = 'graulhet-eau-cache-v2'; // Increment cache version
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
  '/types.js', 
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  '/assets/icons/apple-touch-icon.png',
  // External assets (CDNs)
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap',
  // Potentially add specific font files if Google Fonts API resolves to them and they are critical for offline
];

// Install event: Cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache:', CACHE_NAME);
        const cachePromises = ASSETS_TO_CACHE.map(assetUrl => {
          // For external resources, ensure CORS mode. For local, not strictly needed but harmless.
          const request = new Request(assetUrl, assetUrl.startsWith('http') ? { mode: 'cors' } : {});
          return cache.add(request).catch(err => {
            console.warn(`Failed to cache ${assetUrl} during install:`, err);
            // Don't let one failed asset (especially external CDN) fail the entire SW install
            // if it's not critical for core app shell.
          });
        });
        // Promise.allSettled might be better if some non-critical assets can fail caching
        return Promise.all(cachePromises);
      })
      .then(() => {
        console.log('All specified assets processed for caching during install.');
        return self.skipWaiting(); 
      })
      .catch(error => {
          console.error('Service Worker installation failed significantly:', error);
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
    }).then(() => self.clients.claim()) 
  );
});

// Fetch event: Serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', event => {
  // For navigation requests (HTML), try network first, then cache, then fallback.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
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
          return caches.match(event.request)
            .then(cachedResponse => {
              return cachedResponse || caches.match('/index.html'); 
            });
        })
    );
  } else if (ASSETS_TO_CACHE.includes(event.request.url) || ASSETS_TO_CACHE.includes(new URL(event.request.url).pathname)) {
    // For static assets explicitly listed in ASSETS_TO_CACHE, use cache-first
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
               // Check for opaque responses from CDNs if not using mode: 'cors' in cache.add during install
              if (networkResponse.type === 'opaque' && !event.request.url.startsWith(self.location.origin)) {
                // Just return opaque response, don't try to cache it again if it's already handled by install
              } else if (networkResponse.type !== 'opaque'){ // Cache non-opaque responses
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then(cache => {
                    cache.put(event.request, responseToCache);
                  });
              }
            }
            return networkResponse;
          }).catch(error => {
            console.warn('Fetching asset failed, no cache hit:', event.request.url, error);
            // For an offline fallback for images, you could return a placeholder here:
            // if (event.request.destination === 'image') {
            //   return caches.match('/assets/icons/placeholder.png');
            // }
          });
        })
    );
  } else {
    // For other requests not in ASSETS_TO_CACHE (e.g. API calls not meant to be cached by SW),
    // just fetch from network. Or apply a network-first strategy if appropriate.
    event.respondWith(fetch(event.request));
  }
});