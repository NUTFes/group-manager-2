const CACHE_NAME = "rental-cache-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Network-first, falling back to cache when offline. Successful GET
// responses are cached opportunistically so previously visited pages/assets
// stay available offline. This is a lightweight runtime cache, not a
// build-time precache manifest (no bundler plugin is involved).
self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET" || !request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          event.waitUntil(
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(request, clone))
              .catch(() => {})
          );
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || Response.error()))
  );
});
