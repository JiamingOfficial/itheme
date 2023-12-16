self.addEventListener('install', event => {
    // 这里不进行任何缓存操作
    console.log('Service Worker installing.');
  });
  
self.addEventListener('fetch', event => {
  // 只处理 HTTP/HTTPS 请求
  if (!event.request.url.startsWith('http')) {
    return; // 直接返回，不处理非 HTTP/HTTPS 请求
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // 如果缓存中有匹配的响应，则返回缓存的内容
          return cachedResponse;
        }

        // 尝试从网络获取资源
        return fetch(event.request)
          .then(response => {
            // 检查是否获取到了有效的响应
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 克隆响应以便缓存和浏览器都能使用
            let responseToCache = response.clone();

            // 确保只缓存 HTTP/HTTPS 请求
            if (response.url.startsWith('http') || response.url.startsWith('https')) {
              caches.open('dynamic-cache')
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          })
          .catch(error => {
            console.error('Fetch failed for', event.request.url, ':', error);
            throw error; // 重新抛出错误或返回备用响应
          });
      })
  );
});
  