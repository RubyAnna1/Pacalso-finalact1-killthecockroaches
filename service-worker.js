const CACHE_NAME = "cockroach-cache-v1";
const urlsToCache = [
  "index.html",
  "style.css",
  "script.js",
  "manifest.json",
  "assets/cockroach.png",
  "assets/cockroach-dead.png",
  "assets/slipper-cursor.png",
  "assets/background-music.mp3",
  "assets/splat.mp3"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
