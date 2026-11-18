/* =========================================================
   Maroon Café — حفظ الموقع بموبايل الزبون (Service Worker)
   - الصفحة والمنيو (menu.js): تنزل من النت أولاً حتى الأسعار تبقى محدّثة،
     وإذا النت بطيء (أكثر من 3 ثواني) أو مقطوع، تطلع النسخة المحفوظة.
   - التصميم والخطوط والصور: من النسخة المحفوظة مباشرة (فوري).
   بعد أي تعديل على الموقع: غيّر VERSION هنا، وغيّر ?v= بملف index.html.
   ========================================================= */
const VERSION = "v9";
const CACHE = "maroon-" + VERSION;

const CORE = [
  "./",
  "styles.css?v=9",
  "app.js?v=9",
  "menu.js?v=9",
  "fonts/cinzel-latin-500.woff2",
  "fonts/greatvibes-latin-400.woff2",
  "fonts/elmessiri-arabic-700.woff2",
  "fonts/tajawal-arabic-400.woff2",
  "fonts/tajawal-arabic-700.woff2",
  "fonts/tajawal-latin-400.woff2",
  "fonts/tajawal-latin-700.woff2",
  "images/karkadeh.webp",
];

const NETWORK_TIMEOUT = 3000;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("maroon-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// النت أولاً، وإذا تأخر أو انقطع: النسخة المحفوظة
async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  const isPage = request.mode === "navigate";
  const network = fetch(request).then((res) => {
    if (res && res.ok) cache.put(isPage ? "./" : request, res.clone());
    return res;
  });
  const cached = await cache.match(isPage ? "./" : request);
  if (!cached) return network;
  const timeout = new Promise((resolve) => setTimeout(() => resolve(cached), NETWORK_TIMEOUT));
  return Promise.race([network.catch(() => cached), timeout]);
}

// المحفوظ أولاً، وإذا ما موجود: من النت ونحفظه
async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const res = await fetch(request);
  if (res && res.ok) cache.put(request, res.clone());
  return res;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // واتساب وإنستغرام ما نلمسهم

  const isMenu = url.pathname.endsWith("/menu.js");
  if (request.mode === "navigate" || isMenu) {
    event.respondWith(networkFirst(request));
  } else {
    event.respondWith(cacheFirst(request));
  }
});
