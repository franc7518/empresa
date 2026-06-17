/**
 * Cafe Ancestral - Service Worker for PWA
 */

const CACHE_NAME = 'cafe-ancestral-cache-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './index.css',
    './app.js',
    './manifest.json',
    './assets/hero_bar.png',
    './assets/latte.png',
    './assets/croissant.png'
];

// Install Event
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching files...');
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

// Activate Event
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[Service Worker] Removing old cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event (Cache-First / Network Fallback)
self.addEventListener('fetch', (e) => {
    // If it's a request to an external resource (fonts, icons CDN)
    if (e.request.url.startsWith('http')) {
        e.respondWith(
            caches.match(e.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                // Fallback to fetch and cache dynamic assets
                return fetch(e.request).then((response) => {
                    if (!response || response.status !== 200) {
                        return response;
                    }
                    
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(e.request, responseToCache);
                    });
                    
                    return response;
                }).catch(() => {
                    // Fail silently
                });
            })
        );
    } else {
        // Local assets
        e.respondWith(
            caches.match(e.request).then((cachedResponse) => {
                return cachedResponse || fetch(e.request);
            })
        );
    }
});
