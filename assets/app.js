(function () {
  const CFG = window.MILOCK_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  // Al abrir o recargar, la página empieza arriba (el navegador no recuerda el scroll anterior).
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  scrollTo(0, 0);
  const WA = CFG.whatsapp || "573128544398";
  const wa = (msg) => "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg);
  ["wa-top", "wa-foot", "wa-float"].forEach((id) => {
    const a = document.getElementById(id);
    if (a) a.href = wa("Hola MILOCK, quiero información sobre sus relojes.");
  });

  // Decoración del tema de temporada (se activa con "tema" en config.js).
  if (CFG.tema === "halloween") {
    const bat = (x, y, s, d) => `<svg class="bat" style="left:${x}%;top:${y}%;width:${s}px;animation-delay:${d}s" viewBox="0 0 64 32" aria-hidden="true"><path fill="currentColor" d="M32 10c-2-4-1-7-1-7l-2 4c-3-1-6 0-6 0s1 3 3 5c-6-3-14-2-19 3 4-1 8 1 9 4 2-3 6-3 8-1 1-3 4-4 6-3 1 3 2 5 2 5s1-2 2-5c2-1 5 0 6 3 2-2 6-2 8 1 1-3 5-5 9-4-5-5-13-6-19-3 2-2 3-5 3-5s-3-1-6 0l-2-4s1 3-1 7z"/></svg>`;
    const pumpkin = `<svg class="pumpkin" viewBox="0 0 64 60" aria-hidden="true"><path d="M30 6c0-4 4-6 7-5-3 2-4 4-4 8z" fill="#5b7a2e"/><ellipse cx="32" cy="36" rx="28" ry="22" fill="#ff7a1a"/><ellipse cx="32" cy="36" rx="12" ry="22" fill="#ff8f3d"/><path d="M18 30l6 6h-8zM46 30l-6 6h8zM20 46c6 5 18 5 24 0l-4 1-2-3-3 3-3-3-3 3-3-3-2 3z" fill="#2a1200"/></svg>`;
    const hero = document.querySelector(".hero");
    if (hero) {
      hero.insertAdjacentHTML("afterbegin", `<div class="hw-deco" aria-hidden="true"><div class="moon"></div>${bat(56, 12, 70, 0)}${bat(70, 34, 48, 1.2)}${bat(84, 20, 60, 2.1)}${bat(62, 66, 40, .6)}</div>`);
      // Logos en blanco y negro durante Halloween.
      document.querySelectorAll('img[src$="logo-vertical-oscuro.png"]').forEach((img) => { img.src = "assets/logos/logo-vertical-blanco.png"; });
      const eb = hero.querySelector(".eyebrow");
      if (eb) eb.textContent = "Especial Halloween · Cali, Colombia";
      const ctas = hero.querySelector(".ctas");
      if (ctas) ctas.insertAdjacentHTML("afterend", `<div class="hw-pumpkins" aria-hidden="true">${pumpkin}${pumpkin}${pumpkin}</div>`);
    }
    document.body.insertAdjacentHTML("afterbegin", `<div class="hw-banner">${pumpkin}<span>Temporada de Halloween en MILOCK · Escríbenos y te asesoramos por WhatsApp</span>${pumpkin}</div>`);
  }


  const fmt = (n) => "$" + n.toLocaleString("es-CO");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function light(hex) {
    const h = hex.replace("#", "");
    const f = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const n = parseInt(f, 16);
    return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 > 150;
  }

  // Ilustración de reloj para productos sin foto.
  function watchSVG(p) {
    const dial = p.dial || "#24364a", strap = p.strap || "#3a3d41";
    const ink = light(dial) ? "#2B4250" : "#E9EDF0";
    const hand = light(dial) ? "#1F2F3A" : "#F3F5F6";
    const ticks = Array.from({ length: 12 }, (_, i) => {
      const a = (i * 30 * Math.PI) / 180, r1 = i % 3 ? 33 : 30, r2 = 37;
      return `<line x1="${50 + r1 * Math.sin(a)}" y1="${50 - r1 * Math.cos(a)}" x2="${50 + r2 * Math.sin(a)}" y2="${50 - r2 * Math.cos(a)}" stroke="${ink}" stroke-width="${i % 3 ? 1.4 : 2.6}" stroke-linecap="round"/>`;
    }).join("");
    const caseShape = p.round === false
      ? `<rect x="7" y="7" width="86" height="86" rx="26" fill="#2a2c2f"/><polygon points="50,12 84,28 88,50 84,72 50,88 16,72 12,50 16,28" fill="#3a3d41"/><circle cx="50" cy="50" r="39" fill="${dial}"/>`
      : `<circle cx="50" cy="50" r="44" fill="#c7ccd0"/><circle cx="50" cy="50" r="41" fill="#8a9298"/><circle cx="50" cy="50" r="39" fill="${dial}"/>`;
    return `<svg viewBox="0 -40 100 180" role="img" aria-label="Ilustración del ${esc(p.brand)} ${esc(p.model)}">
      <rect x="32" y="-40" width="36" height="52" rx="4" fill="${strap}"/>
      <rect x="32" y="88" width="36" height="52" rx="4" fill="${strap}"/>
      ${caseShape}${ticks}
      <rect x="93" y="46" width="5" height="8" rx="1.5" fill="#8a9298"/>
      <text x="50" y="35" text-anchor="middle" font-family="Montserrat,sans-serif" font-size="5.5" font-weight="700" letter-spacing=".6" fill="${hand}" opacity=".85">${esc(p.brand.toUpperCase())}</text>
      <line x1="50" y1="50" x2="50" y2="27" stroke="${hand}" stroke-width="2.4" stroke-linecap="round" transform="rotate(305 50 50)"/>
      <line x1="50" y1="50" x2="50" y2="20" stroke="${hand}" stroke-width="1.6" stroke-linecap="round" transform="rotate(60 50 50)"/>
      <line x1="50" y1="56" x2="50" y2="18" stroke="#E4B54D" stroke-width=".8" stroke-linecap="round" transform="rotate(160 50 50)"/>
      <circle cx="50" cy="50" r="2.2" fill="#E4B54D"/>
    </svg>`;
  }

  // --- Google Sheet (CSV publicado) ---
  function parseCSV(text) {
    const rows = []; let row = [], cell = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) {
        if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
        else if (c === '"') q = false;
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ",") { row.push(cell); cell = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(cell); rows.push(row); row = []; cell = "";
      } else cell += c;
    }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    return rows.filter((r) => r.some((x) => x.trim()));
  }

  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "");
  const COLS = { marca: "brand", modelo: "model", referencia: "ref", ref: "ref", precio: "price", diasdeentrega: "days", dias: "days", entrega: "days", tiempodeentrega: "days", genero: "gender", para: "gender", mecanismo: "movement", material: "material", correa: "material", materialdelpulso: "material", pulso: "material", materialdelacaja: "caseMaterial", caja: "caseMaterial", color: "color", descripcion: "desc", movimiento: "movement", tipo: "movement", video: "video", foto: "photo", imagen: "photo", disponible: "available", etiqueta: "tag", top: "top", entregainmediata: "immediate", inmediata: "immediate", inmediato: "immediate", destacado: "featured", destacados: "featured", destacar: "featured", descuento: "discount", dcto: "discount", oferta: "discount" };

  // Convierte enlaces de Google Drive a una imagen directa.
  function photoUrl(u) {
    u = (u || "").trim();
    const m = u.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]+)/);
    // Sin tamaño, Google entrega la foto reducida; "=w2000" pide la versión grande para la ficha.
    if (m) return "https://lh3.googleusercontent.com/d/" + m[1] + "=w2000";
    if (/^https:\/\/lh3\.googleusercontent\.com\/d\/[\w-]+$/.test(u)) return u + "=w2000";
    return u;
  }

  // Muchas fotos traen espacio transparente de más hacia un lado. Se recorta ese borde
  // para que el reloj quede centrado. Si el servidor de la foto no lo permite, se deja la foto tal cual.
  const trimCache = new Map();
  function trimmed(src) {
    if (!trimCache.has(src)) trimCache.set(src, new Promise((ok) => {
      const im = new Image();
      im.crossOrigin = "anonymous";
      im.onload = () => { try { ok(trimImage(im)); } catch (e) { ok(null); } };
      im.onerror = () => ok(null);
      im.src = src;
    }));
    return trimCache.get(src);
  }
  function trimImage(im) {
    const W = im.naturalWidth, H = im.naturalHeight, k = Math.min(1, 240 / Math.max(W, H));
    const w = Math.max(1, Math.round(W * k)), h = Math.max(1, Math.round(H * k));
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    ctx.drawImage(im, 0, 0, w, h);
    const d = ctx.getImageData(0, 0, w, h).data;
    let l = w, t = h, r = -1, b = -1;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (d[(y * w + x) * 4 + 3] > 12) { if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > b) b = y; }
    }
    if (r < 0) return null;
    l = Math.max(0, l - 1); t = Math.max(0, t - 1); r = Math.min(w - 1, r + 1); b = Math.min(h - 1, b + 1);
    if (l === 0 && t === 0 && r === w - 1 && b === h - 1) return null;
    const sx = l / k, sy = t / k, sw = (r - l + 1) / k, sh = (b - t + 1) / k, m = Math.min(1, 1800 / Math.max(sw, sh));
    const o = document.createElement("canvas");
    o.width = Math.round(sw * m); o.height = Math.round(sh * m);
    const oc = o.getContext("2d");
    oc.imageSmoothingQuality = "high";
    oc.drawImage(im, sx, sy, sw, sh, 0, 0, o.width, o.height);
    return o.toDataURL("image/webp", 0.95);
  }
  function centerImages(root) {
    root.querySelectorAll("img[data-trim]").forEach((img) => {
      const src = img.getAttribute("src");
      const go = () => trimmed(src).then((u) => { if (u && img.getAttribute("src") === src) img.src = u; });
      if (img.complete && img.naturalWidth) go(); else img.addEventListener("load", go, { once: true });
    });
  }

  function fromSheet(text) {
    const [header, ...rows] = parseCSV(text);
    LAST_HEADER = header;
    // Acepta variaciones del encabezado como "Videos", "Link del video" o "Fotos".
    const keys = header.map((h) => { const n = norm(h); return COLS[n] || (/video/.test(n) ? "video" : /foto|imagen/.test(n) ? "photo" : undefined); });
    return rows.map((r) => {
      const p = {};
      // Si dos columnas apuntan al mismo dato (por ejemplo "Video" y "Link del video"), se juntan en vez de pisarse.
      keys.forEach((k, i) => { const v = (r[i] || "").trim(); if (k && v) p[k] = p[k] ? p[k] + "\n" + v : v; });
      p.price = parseInt((p.price || "").replace(/[^\d]/g, ""), 10) || 0;
      // Descuento en %: acepta "20", "20%" o "0,2". El precio mostrado ya va rebajado.
      let d = parseFloat((p.discount || "").replace(",", ".").replace(/[^\d.]/g, "")) || 0;
      if (d > 0 && d < 1 && !/%/.test(p.discount)) d *= 100;
      p.discount = d > 0 && d < 100 && p.price ? Math.round(d) : 0;
      p.listPrice = p.price;
      if (p.discount) p.price = Math.round(p.price * (1 - p.discount / 100));
      // Varias fotos en la misma celda: una por línea, o separadas por coma, espacio o punto y coma.
      p.photos = (p.photo || "").split(/[\s,;|]+/).map(photoUrl).filter(Boolean);
      p.photo = p.photos[0] || "";
      // Varios videos en la misma celda, igual que las fotos.
      p.videoRaw = p.video || "";
      // Solo enlaces o nombres de archivo de video (.mp4, .mov, .webm); se ignora texto suelto.
      p.videos = (p.video || "").split(/[\s,;|]+/).map((v) => v.trim())
        .map((v) => !/^https?:\/\//i.test(v) && /^(www\.|m\.)?(youtube\.com|youtu\.be|drive\.google\.com|instagram\.com|tiktok\.com|vimeo\.com)\//i.test(v) ? "https://" + v : v)
        .filter((v) => /^https?:\/\//i.test(v) || /\.(mp4|m4v|mov|webm)$/i.test(v));
      p.video = p.videos[0] || "";
      p.gender = p.gender || "Unisex";
      p.movement = movementName(p.movement);
      const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
      p.material = cap(p.material);
      p.caseMaterial = cap(p.caseMaterial);
      p.color = cap(p.color);
      const av = norm(p.available || "si");
      p.soldOut = av === "no" || av === "agotado";
      const im = norm(p.immediate || "");
      p.immediate = !!im && im !== "no";
      const tp = norm(p.top || "");
      p.top = !!tp && tp !== "no";
      const ft = norm(p.featured || "");
      p.featured = !!ft && ft !== "no";
      return p;
    }).map((p) => { if (!p.model) p.model = p.ref || ""; return p; })
      .filter((p) => p.brand && p.model).map((p, _, all) => {
      // Une marcas escritas distinto ("CASIO", "casio ") bajo el primer nombre que aparece.
      p.brand = all.find((o) => norm(o.brand) === norm(p.brand)).brand;
      if (p.material) p.material = all.find((o) => norm(o.material || "") === norm(p.material)).material;
      return p;
    });
  }

  // "automatico", "AUTOMÁTICO" -> "Automático"; "pila", "cuarzo", "batería" -> "Pila"
  function movementName(v) {
    const n = norm(v || "");
    if (!n) return "";
    if (n.startsWith("auto")) return "Automático";
    if (n.startsWith("pila") || n.startsWith("cuarzo") || n.startsWith("bateria") || n === "quartz") return "Pila";
    if (n.startsWith("solar") || n.includes("ecodrive")) return "Solar";
    v = v.trim(); return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
  }

  // --- Catálogo ---
  let PRODUCTS = [], active = "Todas", gender = "Todos", movement = "Todos", material = "Todos";
  const chips = document.getElementById("chips"), grid = document.getElementById("grid"), q = document.getElementById("q");

  function renderChips() {
    const brands = ["Todas", ...new Set(PRODUCTS.map((p) => p.brand))];
    chips.innerHTML = brands.map((b) => `<button class="chip" type="button" aria-pressed="${b === active}" data-b="${esc(b)}">${esc(b)}</button>`).join("");
  }
  chips.addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    active = b.dataset.b;
    chips.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c.dataset.b === active));
    render();
  });
  q.addEventListener("input", render);
  // Filtro "Top": solo los relojes con Sí en la columna Top. El botón aparece si hay al menos uno.
  let onlyTop = false;
  const topChip = document.getElementById("top-chip");
  topChip.addEventListener("click", () => { onlyTop = !onlyTop; topChip.setAttribute("aria-pressed", onlyTop); render(); });
  const genderEl = document.getElementById("gender");
  genderEl.addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    gender = b.dataset.g;
    genderEl.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c.dataset.g === gender));
    render();
  });
  const movementEl = document.getElementById("movement");
  movementEl.addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    movement = b.dataset.m;
    movementEl.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c.dataset.m === movement));
    render();
  });
  function renderMovement() {
    const kinds = [...new Set(PRODUCTS.map((p) => p.movement).filter(Boolean))];
    document.getElementById("g-movement").hidden = kinds.length < 2;
    movementEl.innerHTML = ["Todos", ...kinds].map((k) => `<button class="chip" type="button" aria-pressed="${k === movement}" data-m="${esc(k)}">${esc(k)}</button>`).join("");
  }
  const matchMovement = (p) => movement === "Todos" || p.movement === movement;
  const materialEl = document.getElementById("material");
  materialEl.addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    material = b.dataset.m;
    materialEl.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c.dataset.m === material));
    render();
  });
  function renderMaterial() {
    const kinds = [...new Set(PRODUCTS.map((p) => p.material).filter(Boolean))];
    document.getElementById("g-material").hidden = kinds.length < 2;
    materialEl.innerHTML = ["Todos", ...kinds].map((k) => `<button class="chip" type="button" aria-pressed="${k === material}" data-m="${esc(k)}">${esc(k)}</button>`).join("");
  }
  const matchMaterial = (p) => material === "Todos" || p.material === material;
  // "Unisex", "Ambos" o "Caballero y Dama" aparecen en los dos filtros.
  const isUnisex = (g) => { const n = norm(g || "unisex"); return n === "unisex" || n === "ambos" || (n.includes("caballero") && n.includes("dama")); };
  const matchGender = (p) => gender === "Todos" || isUnisex(p.gender) || norm(p.gender) === norm(gender);

  // --- Videos: archivo en la carpeta videos/, YouTube (y Shorts), Google Drive, Instagram, TikTok o Vimeo ---
  const PLAY = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`;
  function videoInfo(v) {
    let m = v.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/);
    if (m) return { embed: `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0&playsinline=1&modestbranding=1`,
      thumb: `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg`, vertical: /shorts\//.test(v) };
    m = v.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]+)/);
    if (m) return { embed: `https://drive.google.com/file/d/${m[1]}/preview`, thumb: `https://drive.google.com/thumbnail?id=${m[1]}&sz=w800`, vertical: true, fit: true, direct: `https://drive.google.com/uc?export=download&id=${m[1]}` };
    m = v.match(/instagram\.com\/(?:[\w.]+\/)?(reels?|p|tv)\/([\w-]+)/);
    if (m) return { embed: `https://www.instagram.com/${m[1] === "p" ? "p" : "reel"}/${m[2]}/embed`, vertical: true, social: true };
    m = v.match(/tiktok\.com\/.*video\/(\d+)/);
    if (m) return { embed: `https://www.tiktok.com/embed/v2/${m[1]}`, vertical: true, social: true };
    m = v.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (m) return { embed: `https://player.vimeo.com/video/${m[1]}?autoplay=1`, vertical: false };
    return { file: /^https?:\/\//.test(v) ? v : "videos/" + v.replace(/^\/?(videos\/)?/, "") };
  }
  function videoHTML(v) {
    const info = videoInfo(v);
    if (info.file) return `<video src="${esc(info.file)}" controls autoplay playsinline></video>`;
    // Instagram y TikTok ponen encabezado y pie alrededor del video: se deja desplazar para que el reproductor nunca quede cortado.
    return `<iframe src="${esc(info.embed)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen; clipboard-write" allowfullscreen title="Video"${info.social ? "" : ' scrolling="no"'}></iframe>`;
  }
  // Miniatura del video: imagen del servicio, primer cuadro del archivo o la foto del reloj.
  function videoThumb(v, p) {
    const info = videoInfo(v);
    if (info.file) return `<video src="${esc(info.file)}#t=0.5" muted playsinline preload="metadata"></video>`;
    if (info.thumb) return `<img src="${esc(info.thumb)}" alt="" loading="lazy" onerror="this.remove()">`;
    return p.photo ? `<img src="${esc(p.photo)}" alt="" loading="lazy">` : "";
  }

  // --- Sala de video: pantalla completa oscura, con el reloj y sus botones debajo ---
  const cine = document.getElementById("cine");
  let cineP = null, cineI = 0;
  function openCine(p, i) {
    cineP = p;
    cine.querySelector(".cine-bg").style.backgroundImage = p.photo ? `url("${p.photo.replace(/"/g, "%22")}")` : "";
    $("cine-brand").textContent = p.brand + (p.ref ? " · Ref. " + p.ref : "");
    $("cine-title").textContent = p.model + (p.color ? " · " + p.color : "");
    $("cine-price").innerHTML = p.soldOut ? "Agotado" : priceHTML(p);
    $("cine-add").hidden = p.soldOut;
    $("cine-wa").href = wa(p.soldOut ? `Hola MILOCK, vi que el ${p.brand} ${p.model} está agotado. ¿Me avisan cuando vuelva?` : orderMsg(p));
    $("cine-wa").textContent = p.soldOut ? "Avísame cuando llegue" : "Pedir por WhatsApp";
    const many = p.videos.length > 1;
    $("cine-prev").hidden = $("cine-next").hidden = !many;
    $("cine-list").innerHTML = many ? p.videos.map((v, j) => `<button type="button" data-cv="${j}" aria-label="Video ${j + 1}">${videoThumb(v, p)}<span>${PLAY}</span></button>`).join("") : "";
    if (!cine.open) cine.showModal();
    cineGo(i || 0);
  }
  function cineGo(i) {
    const n = cineP.videos.length;
    cineI = (i + n) % n;
    const v = cineP.videos[cineI], info = videoInfo(v);
    const stage = $("cine-stage");
    stage.className = "cine-stage " + (info.file ? "is-file" : info.vertical ? "is-vertical" : "is-wide") + (info.social ? " is-social" : "");
    stage.style.aspectRatio = "";
    // Drive: primero se intenta el reproductor propio del navegador (botones de pausa, adelantar y pantalla completa,
    // centrado y del tamaño real del video). Si Drive no entrega el archivo, se usa su reproductor de vista previa.
    if (info.direct) {
      stage.className = "cine-stage is-file";
      stage.innerHTML = `<video src="${esc(info.direct)}" controls autoplay playsinline preload="auto"></video>`;
      const vid = stage.querySelector("video");
      let done = false;
      const fallback = () => {
        if (done || cineP.videos[cineI] !== v || !cine.open) return;
        done = true;
        stage.className = "cine-stage is-vertical";
        drivePreview(stage, v, info);
      };
      vid.addEventListener("loadedmetadata", () => { done = true; });
      vid.addEventListener("error", fallback);
      setTimeout(fallback, 7000);
    } else {
      drivePreview(stage, v, info);
    }
    $("cine-count").textContent = n > 1 ? `${cineI + 1} / ${n}` : "";
    $("cine-list").querySelectorAll("button").forEach((b, j) => b.setAttribute("aria-current", j === cineI));
  }
  function drivePreview(stage, v, info) {
    stage.innerHTML = videoHTML(v);
    // Drive no avisa la forma del video: se toma de su miniatura para que el marco quede justo, sin franjas.
    if (info.fit) {
      const im = new Image();
      im.onload = () => {
        if (cineP.videos[cineI] !== v || !im.naturalWidth) return;
        const r = im.naturalWidth / im.naturalHeight;
        stage.classList.toggle("is-vertical", r < 1);
        stage.classList.toggle("is-wide", r >= 1);
        stage.style.aspectRatio = `${im.naturalWidth} / ${im.naturalHeight}`;
      };
      im.src = info.thumb;
    }
  }
  $("cine-prev").addEventListener("click", () => cineGo(cineI - 1));
  $("cine-next").addEventListener("click", () => cineGo(cineI + 1));
  $("cine-list").addEventListener("click", (e) => { const b = e.target.closest("[data-cv]"); if (b) cineGo(+b.dataset.cv); });
  $("cine-close").addEventListener("click", () => cine.close());
  $("cine-add").addEventListener("click", (e) => { if (cineP) addToCart(cineP, e.currentTarget); });
  cine.addEventListener("click", (e) => { if (e.target === cine || e.target.classList.contains("cine-wrap")) cine.close(); });
  cine.addEventListener("keydown", (e) => {
    if (!cineP || cineP.videos.length < 2) return;
    if (e.key === "ArrowLeft") cineGo(cineI - 1);
    if (e.key === "ArrowRight") cineGo(cineI + 1);
  });
  cine.addEventListener("close", () => { $("cine-stage").innerHTML = ""; });

  // En computador, al pasar el mouse por una tarjeta con video subido como archivo, se ve un adelanto sin sonido.
  function cardPreviews(root) {
    if (!matchMedia("(hover: hover)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.querySelectorAll(".img[data-prev]").forEach((box) => {
      let vid;
      box.addEventListener("mouseenter", () => {
        vid = document.createElement("video");
        Object.assign(vid, { src: box.dataset.prev, muted: true, loop: true, playsInline: true, autoplay: true });
        vid.className = "prev";
        vid.addEventListener("playing", () => vid.classList.add("on"));
        box.appendChild(vid);
      });
      box.addEventListener("mouseleave", () => { if (vid) vid.remove(); vid = null; });
    });
  }

  // --- Ficha de detalle (foto o video, características y descripción) ---
  const modal = document.getElementById("video-modal"), media = document.getElementById("vm-media");
  let current = null;
  // Galería de la ficha: fotos y, si hay, el video como última miniatura.
  let slides = [], slide = 0;
  function showSlide(i) {
    slide = (i + slides.length) % slides.length;
    const s = slides[slide];
    media.classList.toggle("is-video", s.type === "video");
    media.innerHTML = s.type === "video" ? `<button class="vposter" type="button" data-cine="${s.i}" aria-label="Reproducir video">${videoThumb(current.videos[s.i], current)}<span class="vbig">${PLAY}</span><span class="vlabel">Ver video${current.videos.length > 1 ? " " + (s.i + 1) : ""}</span></button>`
      : s.type === "photo" ? `<img data-trim src="${esc(s.src)}" alt="${esc(current.brand + " " + current.model)}">` : watchSVG(current);
    centerImages(media);
    $("vm-thumbs").querySelectorAll("button").forEach((b, j) => b.setAttribute("aria-current", j === slide));
  }
  function showMedia(p, video) {
    slides = (p.photos && p.photos.length ? p.photos.map((src) => ({ type: "photo", src })) : [{ type: "svg" }]);
    p.videos.forEach((v, i) => slides.push({ type: "video", i }));
    const many = slides.length > 1;
    $("vm-prev").hidden = $("vm-next").hidden = $("vm-thumbs").hidden = !many;
    $("vm-thumbs").innerHTML = many ? slides.map((s, j) => `<button type="button" data-s="${j}" aria-label="${s.type === "video" ? "Ver video " + (s.i + 1) : "Ver foto " + (j + 1)}">${
      s.type === "photo" ? `<img data-trim src="${esc(s.src)}" alt="" loading="lazy">` : s.type === "video" ? `${videoThumb(p.videos[s.i], p)}<span class="tplay">${PLAY}</span>` : ""}</button>`).join("") : "";
    centerImages($("vm-thumbs"));
    showSlide(0);
  }
  $("vm-prev").addEventListener("click", () => showSlide(slide - 1));
  $("vm-next").addEventListener("click", () => showSlide(slide + 1));
  $("vm-thumbs").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) showSlide(+b.dataset.s); });
  modal.addEventListener("keydown", (e) => {
    if (slides.length < 2) return;
    if (e.key === "ArrowLeft") showSlide(slide - 1);
    if (e.key === "ArrowRight") showSlide(slide + 1);
  });
  function openDetail(p, video) {
    current = p;
    showMedia(p, video && p.video);
    $("vm-brand").innerHTML = esc(p.brand) + (p.movement ? ` · <span class="mov">${esc(p.movement)}</span>` : "");
    $("vm-title").textContent = p.model;
    $("vm-price").innerHTML = priceHTML(p);
    $("vm-eta").innerHTML = eta(p.days);
    const specs = [["Referencia", p.ref], ["Color", p.color], ["Para", p.gender], ["Mecanismo", p.movement],
      ["Material de la caja", p.caseMaterial], ["Material del pulso", p.material]].filter((s) => s[1]);
    $("vm-specs").innerHTML = specs.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join("");
    $("vm-specs").hidden = !specs.length;
    $("vm-desc").textContent = p.desc || "";
    const w = $("vm-wa");
    w.href = wa(p.soldOut ? `Hola MILOCK, vi que el ${p.brand} ${p.model} está agotado. ¿Me avisan cuando vuelva?` : orderMsg(p));
    w.textContent = p.soldOut ? "Avísame cuando llegue" : "Pedir por WhatsApp";
    $("vm-add").hidden = p.soldOut;
    modal.showModal();
  }
  function closeDetail() { media.innerHTML = ""; if (modal.open) modal.close(); }
  $("vm-close").addEventListener("click", closeDetail);
  media.addEventListener("click", (e) => { const b = e.target.closest("[data-cine]"); if (b && current) openCine(current, +b.dataset.cine); });
  modal.addEventListener("click", (e) => { if (e.target === modal) closeDetail(); });
  modal.addEventListener("close", () => { media.innerHTML = ""; });
  grid.addEventListener("click", (e) => {
    const v = e.target.closest("[data-v]");
    if (v) { const p = SHOWN[+v.dataset.v]; if (p) openCine(p, 0); return; }
    const add = e.target.closest("[data-add]");
    if (add) { const p = SHOWN[+add.dataset.add]; if (p) addToCart(p, add); return; }
    const b = e.target.closest("[data-i]"); if (!b) return;
    const p = SHOWN[+b.dataset.i]; if (!p) return;
    openDetail(p, b.classList.contains("play"));
  });

  const orderMsg = (p) => `Hola MILOCK, me interesa el ${p.brand} ${p.model}${p.ref ? " (Ref. " + p.ref + ")" : ""}${p.price ? " de " + fmt(p.price) : ""}${p.discount ? " (con el " + p.discount + "% de descuento)" : ""}. ¿Me das más información?`;
  function eta(d) {
    if (!d) return "";
    const icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`;
    if (/inmediat/i.test(d)) return `<span class="eta now">${icon}Entrega inmediata</span>`;
    return `<span class="eta">${icon}${esc(d)}${/^[\d\s–-]+$/.test(d) ? " días" : ""}</span>`;
  }
  const priceHTML = (p) => !p.price ? "Consultar"
    : fmt(p.price) + (p.discount ? ` <s class="was">${fmt(p.listPrice)}</s>` : "");
  const isLast = (t) => /ultimaunidad|ultimasunidades/.test(norm(t || ""));
  const CHECK = {
    destacado: (p) => p.featured,
    inmediata: (p) => p.immediate,
    maspedido: (p) => /maspedid/.test(norm(p.tag || "")),
    ultimaunidad: (p) => isLast(p.tag),
    top: (p) => p.top,
  };
  const RULES = (CFG.orden || ["destacado + inmediata", "destacado", "maspedido + inmediata", "maspedido", "ultimaunidad", "top"])
    .map((r) => String(r).split("+").map(norm).filter(Boolean));
  let SHOWN = [];
  function card(p, i) {
    const img = p.photo ? `<img data-trim src="${esc(p.photo)}" alt="${esc(p.brand + " " + p.model)}" loading="lazy">` : watchSVG(p);
    const count = p.photos && p.photos.length > 1 ? `<span class="pcount">${p.photos.length} fotos</span>` : "";
    const tag = p.soldOut ? "Agotado" : p.tag;
    const sv = SELLER ? `<span class="sv-badge ${p.immediate ? "yes" : "no"}">${p.immediate ? "Entrega inmediata" : "Sin stock inmediato"}</span>` : "";
    const msg = orderMsg(p);
    const play = p.videos.length ? `<button class="play" type="button" data-v="${i}" aria-label="Ver video del ${esc(p.brand + " " + p.model)}">${PLAY}${p.videos.length > 1 ? p.videos.length + " videos" : "Ver video"}</button>` : "";
    const file = p.videos.map(videoInfo).find((x) => x.file);
    return `<article class="card${p.soldOut ? " agotado" : ""}">
      ${sv}<div class="img" data-i="${i}"${file ? ` data-prev="${esc(file.file)}"` : ""}>${tag ? `<span class="tag${isLast(tag) ? " last" : ""}">${esc(tag)}</span>` : ""}${p.discount && !p.soldOut ? `<span class="off">-${p.discount}%</span>` : ""}${img}${count}${play}</div>
      <div class="body">
        <div class="brandname">${esc(p.brand)}${p.movement ? ` · <span class="mov">${esc(p.movement)}</span>` : ""}</div>
        <h3 data-i="${i}">${esc(p.model)}</h3>
        ${p.ref || p.color ? `<div class="ref">${[p.color, p.ref && "Ref. " + p.ref].filter(Boolean).map(esc).join(" · ")}</div>` : ""}
        <div class="row">
          <span class="price">${priceHTML(p)}</span>
          ${eta(p.days)}
        </div>
        <button class="more" type="button" data-i="${i}">Ver detalles</button>
        ${p.soldOut ? "" : `<button class="btn btn-line add" type="button" data-add="${i}">Agregar al carrito</button>`}
        <a class="btn btn-gold" target="_blank" rel="noopener" href="${wa(p.soldOut ? `Hola MILOCK, vi que el ${p.brand} ${p.model} está agotado. ¿Me avisan cuando vuelva?` : msg)}">${p.soldOut ? "Avísame cuando llegue" : "Pedir por WhatsApp"}</a>
      </div>
    </article>`;
  }

  // --- Panel de filtros plegable y orden por precio ---
  const panel = document.getElementById("filter-panel"), toggle = document.getElementById("filter-toggle");
  const sortEl = document.getElementById("sort");
  toggle.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    toggle.setAttribute("aria-expanded", !panel.hidden);
  });
  sortEl.addEventListener("change", render);
  document.getElementById("filter-clear").addEventListener("click", () => {
    active = "Todas"; movement = "Todos"; material = "Todos";
    renderChips(); renderMovement(); renderMaterial(); render();
  });
  function updateCount() {
    const n = (active !== "Todas") + (movement !== "Todos") + (material !== "Todos");
    const c = document.getElementById("filter-count");
    c.hidden = !n; c.textContent = n;
  }

  // --- Paginación: 12, 24 o 48 relojes por página (múltiplos de 2, 3 y 4 columnas) (se recuerda en el navegador) ---
  let page = 1, perPage = 24;
  try { perPage = [12, 24, 48].includes(+localStorage.getItem("milock-por-pagina")) ? +localStorage.getItem("milock-por-pagina") : 24; } catch (e) {}
  function pagerHTML(total, pages) {
    const from = (page - 1) * perPage + 1, to = Math.min(total, page * perPage);
    const nums = [];
    for (let n = 1; n <= pages; n++) {
      if (n === 1 || n === pages || Math.abs(n - page) <= 1) nums.push(n);
      else if (nums[nums.length - 1] !== "…") nums.push("…");
    }
    return `<p class="pg-info">Mostrando ${from}–${to} de ${total} relojes</p>
      ${pages > 1 ? `<div class="pg-nums">
        <button type="button" data-pg="${page - 1}" aria-label="Página anterior"${page <= 1 ? " disabled" : ""}>‹</button>
        ${nums.map((n) => n === "…" ? `<span>…</span>` : `<button type="button" data-pg="${n}"${n === page ? ' aria-current="page"' : ""}>${n}</button>`).join("")}
        <button type="button" data-pg="${page + 1}" aria-label="Página siguiente"${page >= pages ? " disabled" : ""}>›</button>
      </div>` : ""}
      <label class="pg-size">Ver <select id="pg-size">${[12, 24, 48].map((n) => `<option value="${n}"${n === perPage ? " selected" : ""}>${n}</option>`).join("")}</select> por página</label>`;
  }
  const pager = $("pager");
  pager.addEventListener("click", (e) => {
    const b = e.target.closest("[data-pg]"); if (!b || b.disabled) return;
    page = +b.dataset.pg; render(true);
    document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
  });
  pager.addEventListener("change", (e) => {
    if (e.target.id !== "pg-size") return;
    perPage = +e.target.value;
    try { localStorage.setItem("milock-por-pagina", perPage); } catch (er) {}
    render();
  });

  // keepPage: true solo al cambiar de página; cualquier filtro u orden vuelve a la página 1.
  function render(keepPage) {
    if (keepPage !== true) page = 1;
    updateCount();
    const term = q.value.trim().toLowerCase();
    let list = PRODUCTS.filter((p) => (!onlyTop || p.top) && matchGender(p) && matchMovement(p) && matchMaterial(p) && (active === "Todas" || p.brand === active) &&
      (!term || [p.brand, p.model, p.ref, p.material, p.caseMaterial, p.color, p.movement].join(" ").toLowerCase().includes(term)));
    const dir = sortEl.value === "asc" ? 1 : sortEl.value === "desc" ? -1 : 0;
    // "Consultar" (sin precio) siempre al final.
    if (dir) list = list.slice().sort((a, b) => (!a.price) - (!b.price) || dir * (a.price - b.price));
    // Orden "Recomendados": grupos de prioridad de config.js (orden), luego el resto; los agotados al final.
    // Dentro de cada grupo se respeta el orden de la hoja.
    else {
      const rank = (p) => {
        if (p.soldOut) return RULES.length + 1;
        const i = RULES.findIndex((r) => r.every((c) => CHECK[c] && CHECK[c](p)));
        return i < 0 ? RULES.length : i;
      };
      list = list.map((p, i) => [p, i]).sort((a, b) => rank(a[0]) - rank(b[0]) || a[1] - b[1]).map((x) => x[0]);
    }
    if (SELLER && sellerOnly) list = list.filter((p) => p.immediate && !p.soldOut);
    const pages = Math.max(1, Math.ceil(list.length / perPage));
    page = Math.min(Math.max(1, page), pages);
    pager.hidden = !list.length;
    if (list.length) pager.innerHTML = pagerHTML(list.length, pages);
    list = list.slice((page - 1) * perPage, page * perPage);
    SHOWN = list;
    if (SELLER) $("sv-count").textContent = `${PRODUCTS.filter((p) => p.immediate && !p.soldOut).length} relojes para entrega inmediata`;
    grid.innerHTML = list.length ? list.map((p, i) => card(p, i)).join("")
      : `<p class="empty">No encontramos relojes con ese nombre. Prueba con otra marca o escríbenos y lo buscamos por ti.</p>`;
    centerImages(grid);
    cardPreviews(grid);
  }

  // Lee la hoja. Para un enlace de Google Sheets prueba primero la exportación CSV completa,
  // que copia cada celda tal cual; el modo "gviz" adivina el tipo de cada columna y deja
  // vacías las celdas que no encajan (por ejemplo un modelo "5" en una columna de texto).
  // Modo revisión: abrir la página con ?revisar muestra qué leyó de la hoja en la columna Video.
  let LAST_HEADER = [];
  function showCheck() {
    const rows = PRODUCTS.map((p) => `<tr><td>${esc(p.brand)} ${esc(p.model)}</td><td>${esc(p.ref || "")}</td><td>${esc(p.videoRaw || "(vacío)")}</td><td>${p.videos.length}</td></tr>`).join("");
    document.body.insertAdjacentHTML("afterbegin", `<div class="check"><b>Revisión de la hoja</b>
      <p>Columnas leídas: ${LAST_HEADER.map((h) => esc(h || "(sin nombre)")).join(" · ")}</p>
      <table><tr><th>Reloj</th><th>Ref.</th><th>Lo que dice la celda Video</th><th>Videos</th></tr>${rows}</table></div>`);
  }

  async function fetchSheet() {
    const id = (CFG.sheetCsvUrl.match(/spreadsheets\/d\/([\w-]{20,})/) || [])[1];
    // 1) La primera pestaña completa (export). 2) La pestaña del catálogo por su nombre. 3) El enlace de config.js.
    // Solo se acepta una respuesta que tenga la columna Marca, por si la primera pestaña no es la del catálogo.
    const tab = CFG.catalogoPestana || "LISTA";
    const urls = id && !/\/pub\?|output=csv/.test(CFG.sheetCsvUrl)
      ? [`https://docs.google.com/spreadsheets/d/${id}/export?format=csv`,
         `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(tab)}`, CFG.sheetCsvUrl]
      : [CFG.sheetCsvUrl];
    let last;
    for (const u of urls) {
      try {
        const res = await fetch(u, { cache: "no-store" });
        if (!res.ok) throw new Error(res.status);
        const text = await res.text();
        if (/^\s*</.test(text)) throw new Error("La respuesta no es CSV");
        if (!(parseCSV(text)[0] || []).some((h) => norm(h) === "marca")) throw new Error("Esta pestaña no tiene la columna Marca");
        return text;
      } catch (err) { last = err; console.warn("No se pudo leer", u, err); }
    }
    throw last;
  }

  // --- Carrito: hasta 5 unidades por reloj, se guarda en el navegador y se envía completo por WhatsApp ---
  const MAX = 5, CART_KEY = "milock-carrito";
  // Cada combinación de reloj y color es una línea distinta del carrito.
  const keyOf = (p) => [p.brand, p.model, p.ref, p.color].map((s) => norm(s || "")).join("|");
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { cart = []; }
  const saveCart = () => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart.map(({ k, q }) => ({ k, q })))); } catch (e) {} };
  const cartDlg = $("cart");
  // Une lo guardado con el catálogo actual (precios al día; quita relojes que ya no están o se agotaron).
  function syncCart() {
    cart = cart.map((it) => {
      // Carritos guardados antes de separar por color (sin color en la clave): se asocian al primer color.
      const p = PRODUCTS.find((p) => keyOf(p) === it.k) || PRODUCTS.find((p) => keyOf(p).startsWith(it.k + "|"));
      return { k: p ? keyOf(p) : it.k, q: Math.min(MAX, Math.max(1, it.q | 0)), p };
    }).filter((it, i, all) => it.p && !it.p.soldOut && all.findIndex((o) => o.k === it.k) === i);
    saveCart();
    renderCart();
  }
  function addToCart(p, btn) {
    const k = keyOf(p);
    let it = cart.find((x) => x.k === k);
    let msg = "Agregado ✓";
    if (!it) cart.push(it = { k, q: 1, p });
    else if (it.q < MAX) it.q++;
    else msg = "Máximo " + MAX;
    saveCart();
    renderCart();
    if (btn) {
      const old = btn.textContent;
      btn.textContent = msg; btn.disabled = true;
      setTimeout(() => { btn.textContent = old; btn.disabled = false; }, 1300);
    }
  }
  // --- Códigos de descuento: pestaña "Codigos" de la misma hoja (Código, Descuento, Activo) ---
  // El % del código se aplica sobre el total del carrito, que ya tiene los descuentos de cada reloj.
  const PROMO_KEY = "milock-codigo";
  let promo = null, CODES = null, savedCode = "";
  try { savedCode = (JSON.parse(localStorage.getItem(PROMO_KEY)) || {}).code || ""; } catch (e) {}
  // Se pide una sola vez (lo usan el carrito y la barra de promoción).
  function loadCodes() { return CODES || (CODES = fetchCodes().catch((e) => { CODES = null; throw e; })); }
  async function fetchCodes() {
    const id = (CFG.sheetCsvUrl.match(/spreadsheets\/d\/([\w-]{20,})/) || [])[1];
    if (!id) return [];
    const tab = CFG.codigosPestana || "CODIGOS";
    const res = await fetch(`https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(tab)}`, { cache: "no-store" });
    if (!res.ok) throw new Error(res.status);
    const [header, ...rows] = parseCSV(await res.text());
    const h = header.map(norm);
    const ci = h.findIndex((x) => /codigo|cupon/.test(x)), di = h.findIndex((x) => /descuento|porcentaje/.test(x)), ai = h.findIndex((x) => /activo|vigente/.test(x));
    // Si la pestaña no existe, Google devuelve la del catálogo: sin columna Código no hay códigos.
    if (ci < 0 || di < 0) return [];
    return (rows.map((r) => {
      const raw = (r[di] || "").trim();
      let d = parseFloat(raw.replace(",", ".").replace(/[^\d.]/g, "")) || 0;
      if (d > 0 && d < 1 && !/%/.test(raw)) d *= 100;
      const act = ai < 0 ? "si" : norm(r[ai] || "");
      return { code: (r[ci] || "").trim().toUpperCase(), pct: Math.round(d), on: act !== "no" && act !== "" && act !== "false" };
    }).filter((c) => c.code && c.pct > 0 && c.pct < 100 && c.on));
  }
  const promoMsg = (t, bad) => { const m = $("promo-msg"); m.textContent = t; m.classList.toggle("bad", !!bad); };
  async function applyCode(code, quiet) {
    code = (code || "").trim().toUpperCase().replace(/\s+/g, "");
    if (!code) return;
    $("promo-apply").disabled = true;
    try {
      const found = (await loadCodes()).find((c) => c.code.replace(/\s+/g, "") === code);
      if (found) { promo = { code: found.code, pct: found.pct }; if (!quiet) promoMsg(`¡Listo! Tu código te da ${found.pct}% de descuento.`); }
      else { promo = null; if (!quiet) promoMsg("Ese código no es válido o ya no está vigente.", true); }
    } catch (e) {
      if (!quiet) promoMsg("No pudimos revisar el código ahora. Inténtalo de nuevo o escríbenos por WhatsApp.", true);
    }
    $("promo-apply").disabled = false;
    try { promo ? localStorage.setItem(PROMO_KEY, JSON.stringify({ code: promo.code })) : localStorage.removeItem(PROMO_KEY); } catch (e) {}
    renderCart();
  }
  $("promo-form").addEventListener("submit", (e) => { e.preventDefault(); applyCode($("promo-input").value); });
  $("promo-remove").addEventListener("click", () => { promo = null; try { localStorage.removeItem(PROMO_KEY); } catch (e) {} promoMsg(""); renderCart(); });
  // Barra de promoción arriba de la página con el código vigente. Al tocarla se copia el código.
  async function promoBar() {
    let c;
    try { c = (await loadCodes())[0]; } catch (e) { return; }
    if (!c) return;
    const html = `<button type="button" class="promo-bar" id="promo-bar" aria-label="Copiar el código ${esc(c.code)}">
      <span>Usa el código <b>${esc(c.code)}</b> y obtén <b>${c.pct}% de descuento</b> en tu pedido</span><span class="pb-copy" id="pb-copy">Copiar</span></button>`;
    const hw = document.querySelector(".hw-banner");
    hw ? hw.insertAdjacentHTML("afterend", html) : document.body.insertAdjacentHTML("afterbegin", html);
    $("promo-bar").addEventListener("click", () => {
      try { navigator.clipboard.writeText(c.code); } catch (e) {}
      $("promo-input").value = c.code;
      $("pb-copy").textContent = "¡Copiado!";
      setTimeout(() => { $("pb-copy").textContent = "Copiar"; }, 1800);
    });
  }
  function totals() {
    const sub = cart.reduce((n, it) => n + it.p.price * it.q, 0);
    const off = promo ? Math.round(sub * promo.pct / 100) : 0;
    return { sub, off, total: sub - off };
  }

  function cartMsg() {
    const lines = cart.map((it) => {
      const p = it.p, ref = [p.ref && "Ref. " + p.ref, p.color && "color " + p.color.toLowerCase()].filter(Boolean).join(", ");
      const val = p.price ? ` = ${fmt(p.price * it.q)}${p.discount ? ` (con ${p.discount}% de descuento)` : ""}` : " = precio por consultar";
      return `• ${it.q} x ${p.brand} ${p.model}${ref ? ` (${ref})` : ""}${val}`;
    });
    const units = cart.reduce((n, it) => n + it.q, 0), t = totals();
    const promoLines = promo && t.off ? `Subtotal: ${fmt(t.sub)}\nCódigo de descuento ${promo.code} (${promo.pct}%): -${fmt(t.off)}\n` : "";
    return `Hola MILOCK, quiero hacer este pedido:\n\n${lines.join("\n")}\n\n${promoLines}Total: ${fmt(t.total)} (${units} ${units === 1 ? "reloj" : "relojes"})` +
      (cart.some((it) => !it.p.price) ? "\nAlgunos precios están por consultar." : "") + "\n\n¿Me ayudan con el pedido?";
  }
  function renderCart() {
    if (cart.some((it) => !it.p)) cart = cart.filter((it) => it.p);
    const units = cart.reduce((n, it) => n + it.q, 0);
    const n = $("cart-n");
    n.textContent = units; n.hidden = !units;
    $("cart-open").setAttribute("aria-label", units ? `Ver carrito (${units})` : "Ver carrito");
    const list = $("cart-list");
    $("cart-foot").hidden = !cart.length;
    if (!cart.length) { list.innerHTML = `<li class="cart-empty">Tu carrito está vacío. Agrega los relojes que te gusten y nos envías el pedido completo por WhatsApp.</li>`; return; }
    list.innerHTML = cart.map((it, j) => {
      const p = it.p;
      const pic = p.photo ? `<img data-trim src="${esc(p.photo)}" alt="">` : watchSVG(p);
      return `<li class="cart-item">
        <div class="ci-img">${pic}</div>
        <div class="ci-info">
          <div class="brandname">${esc(p.brand)}</div>
          <div class="ci-name">${esc(p.model)}${p.ref ? ` <span>Ref. ${esc(p.ref)}</span>` : ""}</div>
          ${p.color ? `<div class="ci-color">Color: ${esc(p.color)}</div>` : ""}
          <div class="ci-row">
            <div class="qty" role="group" aria-label="Cantidad">
              <button type="button" data-q="${j}" data-d="-1" aria-label="Quitar uno"${it.q <= 1 ? " disabled" : ""}>−</button>
              <span>${it.q}</span>
              <button type="button" data-q="${j}" data-d="1" aria-label="Agregar uno"${it.q >= MAX ? " disabled" : ""}>+</button>
            </div>
            <b>${p.price ? fmt(p.price * it.q) : "Consultar"}</b>
          </div>
          ${it.q >= MAX ? `<div class="ci-max">Máximo ${MAX} unidades por reloj</div>` : ""}
        </div>
        <button class="ci-del" type="button" data-del="${j}" aria-label="Quitar ${esc(p.brand + " " + p.model)}">×</button>
      </li>`;
    }).join("");
    centerImages(list);
    $("cart-units").textContent = `${units} ${units === 1 ? "reloj" : "relojes"}`;
    const t = totals();
    $("cart-total").textContent = fmt(t.total);
    $("promo-form").hidden = !!promo;
    $("promo-on").hidden = !promo;
    if (promo) $("promo-label").textContent = `Código ${promo.code} · -${promo.pct}%`;
    $("cart-sub").hidden = $("cart-off").hidden = !(promo && t.off);
    $("cart-subtotal").textContent = fmt(t.sub);
    $("cart-off-label").textContent = promo ? `Descuento (${promo.pct}%)` : "";
    $("cart-off-value").textContent = "-" + fmt(t.off);
    $("cart-send").href = wa(cartMsg());
  }
  $("cart-list").addEventListener("click", (e) => {
    const q = e.target.closest("[data-q]"), d = e.target.closest("[data-del]");
    if (q) { const it = cart[+q.dataset.q]; it.q = Math.min(MAX, Math.max(1, it.q + +q.dataset.d)); }
    else if (d) cart.splice(+d.dataset.del, 1);
    else return;
    saveCart(); renderCart();
  });
  $("cart-open").addEventListener("click", () => {
    renderCart(); cartDlg.showModal();
    // Revisa que el código siga vigente (la hoja pudo cambiar).
    if (promo) { CODES = null; applyCode(promo.code, true); }
  });
  $("cart-close").addEventListener("click", () => cartDlg.close());
  cartDlg.addEventListener("click", (e) => { if (e.target === cartDlg) cartDlg.close(); });
  $("cart-clear").addEventListener("click", () => { cart = []; saveCart(); renderCart(); });
  $("vm-add").addEventListener("click", (e) => { if (current) addToCart(current, e.currentTarget); });

  // --- Banner de destacados: relojes con "Sí" en la columna Destacado ---
  let FEAT = [], featI = 0, featTimer = null;
  const track = $("feat-track");
  function renderFeatured() {
    FEAT = PRODUCTS.filter((p) => p.featured);
    $("destacados").hidden = !FEAT.length;
    if (!FEAT.length) return;
    track.innerHTML = FEAT.map((p, i) => `<article class="feat-slide">
      <div class="feat-img" data-fd="${i}">${p.discount && !p.soldOut ? `<span class="off">-${p.discount}%</span>` : ""}${p.photo ? `<img data-trim src="${esc(p.photo)}" alt="${esc(p.brand + " " + p.model)}">` : watchSVG(p)}</div>
      <div class="feat-txt">
        <div class="eyebrow">Recomendado de la semana${p.tag && !isLast(p.tag) ? " · " + esc(p.tag) : ""}</div>${p.tag && isLast(p.tag) && !p.soldOut ? `<span class="tag last feat-last">${esc(p.tag)}</span>` : ""}
        <div class="feat-brand">${esc(p.brand)}${p.movement ? ` · ${esc(p.movement)}` : ""}</div>
        <h2>${esc(p.model)}</h2>
        <div class="price">${p.soldOut ? "Agotado" : priceHTML(p)}</div>
        <div class="feat-actions">
          <button class="btn btn-gold" type="button" data-fd="${i}">Ver detalles</button>
          ${p.soldOut ? "" : `<button class="btn btn-ghost" type="button" data-fa="${i}">Agregar al carrito</button>`}
        </div>
      </div>
    </article>`).join("");
    centerImages(track);
    const many = FEAT.length > 1;
    $("feat-prev").hidden = $("feat-next").hidden = !many;
    $("feat-dots").innerHTML = many ? FEAT.map((p, i) => `<button type="button" data-fi="${i}" aria-label="Ver ${esc(p.brand + " " + p.model)}"></button>`).join("") : "";
    featGo(0);
    autoFeat();
  }
  function featGo(i, smooth) {
    featI = (i + FEAT.length) % FEAT.length;
    track.scrollTo({ left: featI * track.clientWidth, behavior: smooth ? "smooth" : "auto" });
    $("feat-dots").querySelectorAll("button").forEach((b, j) => b.setAttribute("aria-current", j === featI));
  }
  function autoFeat() {
    clearInterval(featTimer);
    if (FEAT.length > 1 && !matchMedia("(prefers-reduced-motion: reduce)").matches) featTimer = setInterval(() => featGo(featI + 1, true), 6000);
  }
  $("feat-prev").addEventListener("click", () => { featGo(featI - 1, true); autoFeat(); });
  $("feat-next").addEventListener("click", () => { featGo(featI + 1, true); autoFeat(); });
  $("destacados").addEventListener("click", (e) => {
    const d = e.target.closest("[data-fd]"), a = e.target.closest("[data-fa]"), dot = e.target.closest("[data-fi]");
    if (d) openDetail(FEAT[+d.dataset.fd]);
    else if (a) addToCart(FEAT[+a.dataset.fa], a);
    else if (dot) { featGo(+dot.dataset.fi, true); autoFeat(); }
  });
  // Al deslizar con el dedo, actualiza el punto activo y reinicia el avance automático.
  let featScroll;
  track.addEventListener("scroll", () => {
    clearTimeout(featScroll);
    featScroll = setTimeout(() => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      if (i !== featI) { featI = i; $("feat-dots").querySelectorAll("button").forEach((b, j) => b.setAttribute("aria-current", j === featI)); autoFeat(); }
    }, 120);
  });
  ["mouseenter", "focusin"].forEach((ev) => $("destacados").addEventListener(ev, () => clearInterval(featTimer)));
  ["mouseleave", "focusout"].forEach((ev) => $("destacados").addEventListener(ev, autoFeat));
  addEventListener("resize", () => FEAT.length && featGo(featI));

  // --- Vista de vendedores: solo con ?vendedores en la dirección y la clave. No hay ningún enlace público a ella. ---
  let SELLER = false, sellerOnly = true;
  async function sha(t) {
    const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("milock:" + t));
    return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
  }
  async function sellerGate() {
    if (!/[?&]vendedores\b/.test(location.search) || !CFG.claveVendedores) return;
    let ok = false;
    try { ok = sessionStorage.getItem("milock-vend") === CFG.claveVendedores; } catch (e) {}
    if (!ok) {
      document.body.insertAdjacentHTML("beforeend", `<div class="sv-gate" id="sv-gate"><form id="sv-form"><b>Vista de vendedores</b>
        <input type="password" id="sv-pass" placeholder="Clave" autocomplete="current-password" aria-label="Clave"><button class="btn btn-gold">Entrar</button>
        <p id="sv-err" role="status"></p></form></div>`);
      ok = await new Promise((done) => {
        $("sv-form").addEventListener("submit", async (e) => {
          e.preventDefault();
          if (await sha($("sv-pass").value.trim()) === CFG.claveVendedores) done(true);
          else $("sv-err").textContent = "Clave incorrecta.";
        });
      });
      $("sv-gate").remove();
      try { sessionStorage.setItem("milock-vend", CFG.claveVendedores); } catch (e) {}
    }
    SELLER = true;
    document.documentElement.classList.add("vendedores");
    document.querySelector("#catalogo .wrap").insertAdjacentHTML("afterbegin", `<div class="sv-bar">
      <div><b>Vista de vendedores</b><span id="sv-count"></span></div>
      <label><input type="checkbox" id="sv-only" checked> Solo entrega inmediata</label></div>`);
    $("sv-only").addEventListener("change", (e) => { sellerOnly = e.target.checked; render(); });
    document.getElementById("catalogo").scrollIntoView();
  }

  async function load() {
    await sellerGate();
    try {
      if (!CFG.sheetCsvUrl) throw new Error("Falta sheetCsvUrl en config.js");
      PRODUCTS = fromSheet(await fetchSheet());
    } catch (err) {
      console.error("No se pudo leer la Google Sheet:", err);
      grid.innerHTML = `<p class="empty">No pudimos cargar el catálogo en este momento. <a href="${wa("Hola MILOCK, quiero ver los relojes disponibles.")}" target="_blank" rel="noopener">Escríbenos por WhatsApp</a> y te mostramos los relojes disponibles.</p>`;
      return;
    }
    syncCart();
    if (savedCode) applyCode(savedCode, true);
    promoBar();
    renderFeatured();
    topChip.hidden = !PRODUCTS.some((p) => p.top);
    if (/[?&]revisar\b/.test(location.search)) showCheck();
    renderChips();
    renderMovement();
    renderMaterial();
    render();
  }
  load();
})();
