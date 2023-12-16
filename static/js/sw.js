self.addEventListener('install', event => {
    // 这里不进行任何缓存操作
    console.log('Service Worker installing.');
  });
  
  self.addEventListener('fetch', event => {
    // 只处理来自 HTTP/HTTPS 的请求
    if (!event.request.url.startsWith('http')) {
      return; // 不处理非 http/https 的请求（如 chrome-extension://）
    }
  
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          // 如果缓存中有匹配的响应，则返回缓存的内容
          return cachedResponse;
        }
  
        // 否则，从网络获取资源，并将其动态添加到缓存中
        return fetch(event.request).then(response => {
          // 要检查是否获取到了有效的响应
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
  
          // 克隆响应以便缓存和浏览器都能使用
          let responseToCache = response.clone();
  
          caches.open('dynamic-cache').then(cache => {
            cache.put(event.request, responseToCache);
          });
  
          return response;
        });
      })
    );
  });
  