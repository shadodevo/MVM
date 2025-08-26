const CACHE_NAME = 'mvm-studio-cache-v1';
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&family=Inter:wght@400;500;600;700&display=swap',
  'https://i.imgur.com/K7IfH2s.png' // Main logo
];

// On install, cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

// On activate, clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// On fetch, use a cache-first strategy, falling back to network
self.addEventListener('fetch', (event) => {
    // We only want to cache GET requests.
    if (event.request.method !== 'GET') {
        return;
    }
    
    // For navigation requests, use a network-first strategy to ensure the user gets the latest HTML.
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => caches.match('/index.html'))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Return the cached response if it exists.
            if (cachedResponse) {
                return cachedResponse;
            }

            // If not in cache, fetch from the network.
            return fetch(event.request).then((networkResponse) => {
                // Clone the response because it's a one-time-use stream.
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    // Cache the new response. We don't cache chrome extensions.
                    if (!event.request.url.startsWith('chrome-extension://')) {
                        cache.put(event.request, responseToCache);
                    }
                });
                return networkResponse;
            }).catch(() => {
                // If the network fails and there's no cache, you could return a fallback offline page.
                // For now, we'll just let the browser's default error handling take over.
            });
        })
    );
});
