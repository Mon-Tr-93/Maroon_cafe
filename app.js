/* =========================================================
   Maroon Café — المنيو + زر الطلب عبر واتساب
   الزبون يختار الكمية بـ + / −، والزر العام يفتح واتساب
   ورسالة جاهزة بيها المنتجات والمجموع.
   ========================================================= */
(function () {
  "use strict";

  const CAFE = window.CAFE;
  const MENU = window.MENU;
  const FEATURED = window.FEATURED;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // ---------- أدوات ----------
  const fmt = (n) => Number(n).toLocaleString("en-US");
  const money = (n) => `${fmt(n)} ${CAFE.currency}`;
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const store = {
    get(k, fallback) {
      try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
    },
    set(k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* تجاهل */ }
    },
  };

  // كل الأصناف بترتيب العرض (المميز أولاً)
  const ITEMS = {};
  const ORDER = [];
  if (FEATURED) { ITEMS[FEATURED.id] = FEATURED; ORDER.push(FEATURED.id); }
  MENU.forEach((cat) => cat.items.forEach((it) => { ITEMS[it.id] = it; ORDER.push(it.id); }));

  const waLink = (text) => `https://wa.me/${CAFE.whatsapp}?text=${encodeURIComponent(text)}`;
  const igLink = `https://instagram.com/${CAFE.instagram}`;
  const GREETING = `مرحباً ${CAFE.name} 👋`;

  // ---------- الحالة: { id: qty } ----------
  let sel = store.get("maroon.sel", {});
  Object.keys(sel).forEach((k) => { if (!ITEMS[k] || !(sel[k] > 0)) delete sel[k]; });

  const count = () => Object.values(sel).reduce((a, b) => a + b, 0);
  const total = () => Object.entries(sel).reduce((s, [id, q]) => s + ITEMS[id].price * q, 0);

  function setQty(id, q) {
    if (q > 0) sel[id] = Math.min(q, 99);
    else delete sel[id];
    store.set("maroon.sel", sel);
  }

  // ---------- رسالة الواتساب ----------
  function orderMessage() {
    const ids = ORDER.filter((id) => sel[id]);
    if (!ids.length) return `${GREETING}\nأريد أطلب`;
    const lines = ids.map((id) => `• ${sel[id]}× ${ITEMS[id].name} — ${fmt(ITEMS[id].price * sel[id])}`);
    return [GREETING, "أريد أطلب:", ...lines, "", `المجموع: ${money(total())}`].join("\n");
  }

  // ---------- عناصر التحكم بالكمية ----------
  function controlHTML(id, gold) {
    const q = sel[id] || 0;
    const name = esc(ITEMS[id].name);
    if (!q) {
      return `<button class="add${gold ? " add--gold" : ""}" type="button" data-act="inc" data-id="${id}" aria-label="أضف ${name}"><svg><use href="#i-plus"/></svg></button>`;
    }
    return `<div class="stepper${gold ? " stepper--gold" : ""}" role="group" aria-label="كمية ${name}">
        <button type="button" data-act="inc" data-id="${id}" aria-label="زيادة"><svg><use href="#i-plus"/></svg></button>
        <output aria-live="polite">${q}</output>
        <button type="button" data-act="dec" data-id="${id}" aria-label="تقليل"><svg><use href="#i-minus"/></svg></button>
      </div>`;
  }

  function priceHTML(price) {
    return `<span class="price">${fmt(price)}<small>${CAFE.currency}</small></span>`;
  }

  // ---------- عرض المنيو ----------
  // الصنف المميز: بطاقة عرضية مثل باقي الأصناف، بس ماروني غامق ويا علامة ذهبية
  function renderFeatured() {
    if (!FEATURED) return;
    const f = FEATURED;
    $("#featured").innerHTML = `
      <article class="item item--feature reveal" id="item-${f.id}">
        <span class="item__badge"><svg><use href="#i-star"/></svg> ${esc(f.label)}</span>
        <div class="item__img"><img src="images/${f.img}" alt="${esc(f.name)}" width="400" height="500"></div>
        <div class="item__body">
          <h3 class="item__name">${esc(f.name)}</h3>
          <p class="item__desc">${esc(f.desc)}</p>
          <div class="item__foot" data-foot="${f.id}">${priceHTML(f.price)}${controlHTML(f.id, true)}</div>
        </div>
      </article>`;
  }

  function itemHTML(it, i) {
    return `
      <article class="item reveal" id="item-${it.id}" style="transition-delay:${Math.min(i, 4) * 60}ms">
        <div class="item__img"><img src="images/${it.img}" alt="${esc(it.name)}" loading="lazy" width="400" height="500"></div>
        <div class="item__body">
          <h4 class="item__name">${esc(it.name)}</h4>
          <p class="item__desc">${esc(it.desc)}</p>
          <div class="item__foot" data-foot="${it.id}">${priceHTML(it.price)}${controlHTML(it.id)}</div>
        </div>
      </article>`;
  }

  function renderMenu() {
    $("#tabs").innerHTML = MENU.map(
      (c, i) => `<button type="button" class="tab${i === 0 ? " is-active" : ""}" data-cat="${c.id}">${esc(c.title)}</button>`
    ).join("");

    $("#menuList").innerHTML = MENU.map(
      (c) => `
      <section class="cat" id="cat-${c.id}" aria-labelledby="cat-t-${c.id}">
        <div class="cat__head">
          <h3 class="cat__title" id="cat-t-${c.id}">${esc(c.title)}</h3>
          ${c.subtitle ? `<span class="cat__sub">${esc(c.subtitle)}</span>` : ""}
        </div>
        <div class="cat__rule"></div>
        ${c.note ? `<p class="cat__note">${esc(c.note)}</p>` : ""}
        <div class="items">${c.items.map(itemHTML).join("")}</div>
      </section>`
    ).join("");
  }

  // قسم "من نحن": القصة، وشنو يوصلك ويا الطلب، وعرض الكوب الخامس
  function renderAbout() {
    const A = window.ABOUT;
    const box = $("#aboutBody");
    if (!A || !box) { const s = $("#about"); if (s) s.hidden = true; return; }
    const perks = (A.perks || []).map((p, i) => `
      <div class="perk reveal" style="transition-delay:${i * 70}ms">
        <span class="perk__icon"><svg><use href="#${esc(p.icon)}"/></svg></span>
        <h4>${esc(p.title)}</h4>
        <p>${esc(p.text)}</p>
      </div>`).join("");
    const L = A.loyalty;
    const stamps = L ? Array.from({ length: L.cups + 1 }, (_, i) => {
      const free = i === L.cups;
      return `<span class="stamp${free ? " stamp--free" : ""}"><svg><use href="#i-cup"/></svg>${free ? "<small>مجاناً</small>" : ""}</span>`;
    }).join("") : "";
    box.innerHTML = `
      <div class="story reveal">
        <p class="story__quote">${esc(A.quote)}</p>
        <p class="story__text">${esc(A.text)}</p>
      </div>
      ${perks ? `<h3 class="perks__title reveal">${esc(A.perksTitle)}</h3><div class="perks">${perks}</div>` : ""}
      ${L ? `
      <div class="loyalty reveal">
        <h3>${esc(L.title)}</h3>
        <div class="stamps" aria-hidden="true">${stamps}</div>
        <p>${esc(L.text)}</p>
      </div>` : ""}`;
  }

  function refreshFoot(id) {
    const el = $(`[data-foot="${id}"]`);
    if (el) el.innerHTML = priceHTML(ITEMS[id].price) + controlHTML(id, FEATURED && id === FEATURED.id);
  }

  // ---------- زر الطلب العام ----------
  let lastCount = count();
  function renderOrderBar() {
    const n = count();
    const btn = $("#orderBtn");
    btn.href = waLink(orderMessage());
    $("#orderSum").hidden = n === 0;
    $("#orderCount").textContent = n;
    $("#orderTotal").textContent = money(total());
    btn.classList.toggle("has-items", n > 0);
    if (n > lastCount) { btn.classList.remove("pulse"); void btn.offsetWidth; btn.classList.add("pulse"); }
    lastCount = n;
  }

  // ---------- الأحداث ----------
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const id = b.dataset.id;
    const q = sel[id] || 0;
    setQty(id, b.dataset.act === "inc" ? q + 1 : q - 1);
    refreshFoot(id);
    renderOrderBar();
    const again = $(`[data-foot="${id}"] [data-act="${b.dataset.act}"]`) || $(`[data-foot="${id}"] [data-act]`);
    if (again) again.focus({ preventScroll: true });
  });

  $("#orderBtn").addEventListener("click", () => {
    $("#orderBtn").href = waLink(orderMessage());
    if (count()) toast("تم فتح واتساب، اضغط إرسال لإتمام الطلب");
  });

  $("#tabs").addEventListener("click", (e) => {
    const t = e.target.closest(".tab");
    if (t) $(`#cat-${t.dataset.cat}`).scrollIntoView({ behavior: "smooth", block: "start" });
  });

  function initSpy() {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const id = en.target.id.replace("cat-", "");
        $$(".tab").forEach((t) => t.classList.toggle("is-active", t.dataset.cat === id));
      }),
      { rootMargin: "-35% 0px -60% 0px" }
    );
    $$(".cat").forEach((c) => io.observe(c));
  }

  function initReveal() {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }),
      { rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((e) => io.observe(e));
  }

  // دائرة الواجهة تتحول للوغو النصي بالشريط العلوي وهي تطلع لفوق:
  // تصغر لحد ما تصير كتابتها بحجم اللوغو النصي، وتتحرك نحو مكانه (يمين الشريط)،
  // وخلفية الدائرة تختفي بالطريق، وبالنهاية تتبادل بنعومة ويا اللوغو النصي.
  function initEmblemDock() {
    const bar = $("#topbar");
    const hero = $("#heroEmblem");
    const brand = $("#brand");
    const heroMain = $(".wordmark__main", hero);
    const brandMain = $(".wordmark__main", brand);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let travel = 1; // مسافة النزول اللي توصل بيها الدائرة للشريط
    let dx = 0;     // المسافة الأفقية لمكان اللوغو النصي
    let k = 0.4;    // المقياس اللي تصير بيه الكتابة بحجم اللوغو النصي

    const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

    function measure() {
      const old = hero.style.transform;
      hero.style.transform = "none";
      const r = hero.getBoundingClientRect();
      hero.style.transform = old;
      const b = brand.getBoundingClientRect(); // الشريط ثابت، فهذا مكانه على الشاشة دائماً
      travel = Math.max(1, r.top + window.scrollY + r.height / 2 - (b.top + b.height / 2));
      dx = (b.left + b.width / 2) - (r.left + r.width / 2);
      k = parseFloat(getComputedStyle(brandMain).fontSize) / parseFloat(getComputedStyle(heroMain).fontSize);
    }

    function update() {
      ticking = false;
      const p = Math.min(1, Math.max(0, window.scrollY / travel));
      if (!reduce) hero.style.transform = `translateX(${(dx * p).toFixed(1)}px) scale(${(1 - (1 - k) * p).toFixed(4)})`;
      hero.style.setProperty("--disc", (1 - smooth(0.2, 0.75, p)).toFixed(3));
      const swap = smooth(0.8, 1, p);
      hero.style.opacity = (1 - swap).toFixed(3);
      hero.style.visibility = p >= 1 ? "hidden" : "";
      brand.style.opacity = swap.toFixed(3);
      brand.style.pointerEvents = swap > 0.5 ? "auto" : "none";
      bar.classList.toggle("is-solid", p > 0.75);
    }

    let ticking = false;
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    const remeasure = () => { measure(); update(); };

    remeasure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);
    window.addEventListener("load", remeasure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);
  }

  let toastTimer;
  function toast(text) {
    const t = $("#toast");
    t.textContent = text;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
  }

  // ---------- معلومات التواصل ----------
  function fillInfo() {
    $("#infoWa").textContent = CAFE.whatsappDisplay;
    $("#infoIg").textContent = `@${CAFE.instagram}`;
    $("#year").textContent = new Date().getFullYear();
    ["#igTop", "#igInfo"].forEach((s) => ($(s).href = igLink));
    ["#waTop", "#waInfo"].forEach((s) => ($(s).href = waLink(GREETING)));
  }

  // ---------- تشغيل ----------
  fillInfo();
  renderFeatured();
  renderMenu();
  renderAbout();
  renderOrderBar();
  initEmblemDock();
  initSpy();
  initReveal();

  // حفظ الموقع بالموبايل حتى يفتح فوراً بالزيارات الجاية (بعد ما تكمل الصفحة تحميلها)
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => { /* تجاهل */ });
    });
  }
})();
