const CACHE_NAME = 'ideal-day-shell-v2'
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icons/pwa-192.png',
  '/icons/pwa-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME)
    await Promise.all(APP_SHELL.map(async (url) => {
      try { await cache.add(url) } catch { /* A resource can be cached on first visit. */ }
    }))
    await self.skipWaiting()
  })())
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys.filter((key) => key.startsWith('ideal-day-shell-') && key !== CACHE_NAME).map((key) => caches.delete(key)))
    await self.clients.claim()
  })())
})

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'PRECACHE_URLS') return
  const urls = Array.isArray(event.data.urls) ? event.data.urls.slice(0, 80) : []
  const task = (async () => {
    const cache = await caches.open(CACHE_NAME)
    let cached = 0
    for (const value of urls) {
      try {
        const url = new URL(value, self.location.origin)
        if (url.origin !== self.location.origin) continue
        const response = await fetch(url.href, { cache: 'reload' })
        if (response.ok && response.type === 'basic') {
          await cache.put(url.href, response.clone())
          cached += 1
        }
      } catch { /* Continue caching the remaining assets. */ }
    }
    return { ok: true, cached }
  })()
  event.waitUntil(task)
  task.then((result) => event.ports?.[0]?.postMessage(result)).catch((error) => {
    event.ports?.[0]?.postMessage({ ok: false, message: error.message })
  })
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin || url.pathname === '/sw.js') return

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request)
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME)
          await cache.put('/index.html', response.clone())
        }
        return response
      } catch {
        return (await caches.match('/index.html')) || (await caches.match('/')) || Response.error()
      }
    })())
    return
  }

  event.respondWith((async () => {
    const cached = await caches.match(request)
    if (cached) return cached
    try {
      const response = await fetch(request)
      if (response.ok && response.type === 'basic') {
        const cache = await caches.open(CACHE_NAME)
        cache.put(request, response.clone()).catch(() => {})
      }
      return response
    } catch {
      return cached || Response.error()
    }
  })())
})
