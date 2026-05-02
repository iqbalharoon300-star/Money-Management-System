self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("money-app").then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/style.css",
        "/app.js"
      ]);
    })
  );
});