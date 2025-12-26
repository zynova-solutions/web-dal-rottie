// Service Worker for Dal Rotti Website
// Implements caching strategies for better performance

const CACHE_NAME = 'dal-rotti-v1';
const STATIC_CACHE = 'dal-rotti-static-v1';
const DYNAMIC_CACHE = 'dal-rotti-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/en',
  '/de',
  '/images/logo.png',
  '/images/primary-version.png',
  '/hero-image.jpg',
  '/indian-food-spread.jpg',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Skip external domains - don't intercept external APIs and scripts
  const externalDomains = [
    'static.elfsight.com',
    'www.googletagmanager.com',
    'www.google-analytics.com',
    'dalrotti-backend.onrender.com',
    'dal-rotti-backend-prod-production.up.railway.app',
    'fonts.googleapis.com',
    'fonts.gstatic.com'
  ];
  
  if (externalDomains.some(domain => url.hostname.includes(domain))) {
    return; // Let browser handle these requests normally
  }

  // Skip backend API calls - let them go directly without SW interference
  if (url.pathname.includes('/api/')) {
    return;
  }

  // Skip OAuth callback pages - don't cache auth flows
  if (url.pathname.includes('/auth/google/callback') || 
      url.pathname.includes('/signin') ||
      url.pathname.includes('/signup')) {
    return;
  }

  // Only cache same-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Handle different resource types with different strategies
  if (request.destination === 'image') {
    // Cache First strategy for images
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
  } else if (request.destination === 'script' || request.destination === 'style') {
    // Stale While Revalidate for JS/CSS
    event.respondWith(staleWhileRevalidateStrategy(request, STATIC_CACHE));
  } else {
    // Network First for HTML pages
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
  }
});

// Cache First Strategy
async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Return fallback for images if available
    return cache.match('/images/placeholder.jpg') || new Response('Image not available');
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  const networkResponse = fetch(request).then((response) => {
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);
  
  return cached || networkResponse;
}

// Network First Strategy
async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}
