const CACHE = 'freebooks-v1';
const ASSETS = ['index.html','reader.html','css/styles.css','js/app.js','js/reader.js','js/epub.min.js','js/pdf.min.js'];

self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))));
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
