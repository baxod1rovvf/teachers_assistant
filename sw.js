/* Teacher's Assistant service worker: lets the app be installed and open
   quickly (or without a connection) from what it has already loaded.
   - Pages, the app manifest and icons: the network first, so a teacher
     always gets the newest version; the saved copy only when offline.
   - Styles, scripts, images: the saved copy at once, refreshed in the
     background. Their addresses carry ?v=… so a new version is a new file;
     older versions of the same file are dropped when a new one is saved.
   Only this site's own files are handled; the cloud (Firebase) and every
   other site go straight to the network. */
const CACHE = 'ta-app-v3'; // v3: new logo and icons, manifest always fresh
const PAGES = ['./', 'index.html', 'create.html', 'statistics.html', 'my-exercises.html', 'students.html',
  'results.html', 'points.html', 'settings.html'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(PAGES)).catch(() => { /* offline install: pages get saved as they're opened */ }));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('ta-app-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

async function saveCopy(request, response) {
  if (!response || !response.ok || response.type !== 'basic') return;
  const cache = await caches.open(CACHE);
  const url = new URL(request.url);
  if (url.search) {
    // drop older versions of this file (same path, different ?v=)
    const old = await cache.keys();
    await Promise.all(old.filter(r => { const u = new URL(r.url); return u.pathname === url.pathname && u.search !== url.search; }).map(r => cache.delete(r)));
  }
  await cache.put(request, response);
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Pages, the app manifest and the app icons: always the newest from the network, so an
  // installed app notices a new name or icon (the saved copy is only for offline use).
  if (req.mode === 'navigate' || /\.(html|webmanifest)$/.test(url.pathname) || url.pathname.indexOf('/images/app/') !== -1) {
    event.respondWith(fetch(req).then(res => {
      const copy = res.clone();
      event.waitUntil(saveCopy(new Request(url.origin + url.pathname), copy));
      return res;
    }).catch(async () => {
      const cache = await caches.open(CACHE);
      const path = url.pathname;
      // GitHub Pages serves /students for students.html
      return (await cache.match(url.origin + path)) ||
        (await cache.match(url.origin + path + '.html')) ||
        (await cache.match(new URL('index.html', self.registration.scope).href)) ||
        Response.error();
    }));
    return;
  }

  event.respondWith(caches.open(CACHE).then(async cache => {
    const saved = await cache.match(req);
    const fresh = fetch(req).then(res => { event.waitUntil(saveCopy(req, res.clone())); return res; });
    if (saved) { fresh.catch(() => {}); return saved; }
    return fresh;
  }));
});
