// Service worker for Buncasiukay. Generated into dist/sw.js by vite.config.ts.
const CACHE = 'buncasiukay-mw88gjkr'
const STROKES = 'buncasiukay-strokes' // stroke-order data from jsDelivr, kept across versions
const PRECACHE = ["./","apple-touch-icon.png","assets/index-BStC3vJ9.css","assets/index-DKVh0pRr.js","favicon-32.png","icon-192.png","icon-512.png","icon-maskable-512.png","index.html","manifest.webmanifest","words.json"]

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== STROKES).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)

  // Character stroke data: cache on first use so writing practice works offline later
  if (url.hostname === 'cdn.jsdelivr.net' && url.pathname.includes('hanzi-writer-data')) {
    event.respondWith(
      caches.open(STROKES).then(async (c) => {
        const hit = await c.match(req)
        if (hit) return hit
        const res = await fetch(req)
        if (res.ok) c.put(req, res.clone())
        return res
      }),
    )
    return
  }

  if (url.origin !== self.location.origin) return

  // Pages: try the network first so updates show up, fall back to the cached app offline
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match('./', { ignoreSearch: true })))
    return
  }

  // Everything else (scripts, styles, words.json, icons): cache first
  event.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req)))
})
