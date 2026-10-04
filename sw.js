/* Muscle Stretch Map service worker: works offline once it has loaded one time. */
const VERSION = 'stretch-map-v2';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION)
      // one bad URL must not sink the whole install
      .then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const cacheFirst = req => caches.match(req).then(hit => hit || fetch(req).then(res => {
  const copy = res.clone();
  caches.open(VERSION).then(c => c.put(req, copy)).catch(() => {});
  return res;
}));

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (err) { return; }

  // Web fonts: cache them so the app keeps its look offline.
  if (FONT_HOSTS.includes(url.hostname)) { e.respondWith(cacheFirst(req)); return; }
  // Anything else off-origin goes straight to the network.
  if (url.origin !== self.location.origin) return;

  // The page itself: network first, so a new upload shows up as soon as you have signal.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put('./', copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match('./').then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // Icons and manifest: cache first, fall back to the network.
  e.respondWith(cacheFirst(req));
});
