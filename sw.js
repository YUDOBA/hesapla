const CACHE = "hesapla-v1";
const CORE = ["./index.html", "style.css", "app.js", "manifest.webmanifest", "icon.svg"];
const EXTRA = ["icon-192.png", "icon-512.png", "apple-touch-icon.png", "./"];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(CORE).then(function () {
        return Promise.all(EXTRA.map(function (u) { return c.add(u).catch(function () {}); }));
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (e) {
  if (e.request.mode === "navigate") {
    e.respondWith(
      caches.match("index.html").then(function (r) { return r || fetch(e.request); })
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function (r) { return r || fetch(e.request); })
  );
});
