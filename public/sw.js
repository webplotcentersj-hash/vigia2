// Service Worker simplificado - sin caché agresivo
// Solo cachea recursos esenciales y siempre busca actualizaciones

const CACHE_NAME = 'vigia-plot-v1'

self.addEventListener('install', (event) => {
  // No cachear nada en la instalación - siempre usar versión fresca
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  // Limpiar todos los caches antiguos
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName)
        })
      )
    }).then(() => {
      return self.clients.claim()
    })
  )
})

self.addEventListener('fetch', (event) => {
  // Estrategia: Network First - siempre buscar actualizaciones primero
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la red funciona, usar la respuesta fresca
        return response
      })
      .catch(() => {
        // Solo si falla la red, buscar en caché
        return caches.match(event.request)
      })
  )
})


