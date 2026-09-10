const CACHE_NAME = "rental-cache-v3";

// 認証状態に依存しない静的アセットのみを対象にする。ルートHTML（"/"）は
// Access のセッション状態によって内容が変わり得るため対象に含めない。
const APP_SHELL_URLS = [
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL_URLS))
      .catch(() => {})
  );
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

function isCacheableRequest(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    APP_SHELL_URLS.includes(url.pathname)
  );
}

// Network-first, falling back to cache when offline. キャッシュ対象は
// ビルド時静的アセット(/_next/static/*)と認証状態に依存しない静的ファイル
// (manifest・icons)のみ。ページのHTML/RSCはここでは扱わないため、Access
// のセッション終了後に閲覧済みの画面がキャッシュ経由で残り続けることはない。
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin ||
    !isCacheableRequest(url)
  ) {
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
