// sw.js
const CACHE_NAME = 'dynamic-cache-v1';

// 安装 Service Worker 时的操作
self.addEventListener('install', (event) => {
    // 此示例中不执行特定安装步骤，但可以在此添加预缓存资源等
    console.log('Service Worker 安装成功');
});

// 激活 Service Worker 时的操作
self.addEventListener('activate', (event) => {
    console.log('Service Worker 激活成功');
    // 清理旧缓存
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((cacheName) => {
                    // 清除不属于当前版本的缓存
                    return cacheName !== CACHE_NAME;
                }).map((cacheName) => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return fetch(event.request)
                .then((response) => {
                    // 复制一份响应并存储在缓存中
                    cache.put(event.request, response.clone());
                    return response;
                })
                .catch(() => {
                    // 当网络请求失败时，尝试从缓存中获取
                    return cache.match(event.request);
                });
        })
    );
});
