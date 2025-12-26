// Unregister old service worker to force reload with new configuration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (let registration of registrations) {
      registration.unregister().then(function(success) {
        console.log('Service Worker unregistered:', success);
      });
    }
  });
  
  // Clear all caches
  caches.keys().then(function(names) {
    for (let name of names) {
      caches.delete(name);
    }
  });
  
  console.log('Service worker and caches cleared. Please refresh the page.');
}
