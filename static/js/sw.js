self.addEventListener('install', function(e) {
    e.waitUntil(
      caches.open('your-cache-name').then(function(cache) {
        return cache.addAll([
          '/',
          '/path/to/other/resources...'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });