'use strict';

// 1. Definição do nome do cache e lista de assets
const CACHE_NAME = 'eotempo-cache-v1';

// Lista de arquivos estáticos essenciais (App Shell)
const urlsToCache = [
    '/eotempo/', // Necessário para a URL raiz do GitHub Pages
    '/eotempo/index.html',
    '/eotempo/styles/main.css',
    '/eotempo/styles/tailwindcss.css',
    '/eotempo/scripts/main.js',
    '/eotempo/scripts/api.js',
    '/eotempo/scripts/cache.js',
    '/eotempo/scripts/dom.js',
    '/eotempo/scripts/utils.js',
    '/eotempo/scripts/weather.js',
    '/eotempo/images/favicon.ico',
    '/eotempo/images/icon-192x192.png', 
    '/eotempo/images/icon-512x512.png'
];

// 2. Evento 'install': Cacheia todos os assets estáticos (App Shell)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Cacheando App Shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// 3. Evento 'fetch': Intercepta requisições e serve do cache, se possível
self.addEventListener('fetch', event => {
  // Ignora requisições da nossa API (pois já temos cache local no JS)
  if (event.request.url.includes('api.hgbrasil.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna o asset do cache se ele existir
        if (response) {
          return response;
        }
        
        // Se não estiver no cache, faz a requisição normal
        return fetch(event.request);
      })
  );
});

// 4. Evento 'activate': Limpa caches antigos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
