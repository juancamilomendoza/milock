(function () {
  const CFG = window.MILOCK_CONFIG || {};
  const WA = CFG.whatsapp || "573128544398";
  const wa = (msg) => "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg);
  ["wa-top", "wa-foot", "wa-float"].forEach((id) => {
    const a = document.getElementById(id);
    if (a) a.href = wa("Hola MILOCK, quiero información sobre sus relojes.");
  });

  // Productos de ejemplo: se muestran solo mientras no haya Google Sheet configurada.
  const SAMPLE = [
    { brand: "Casio", model: "G-Shock GA-2100", material: "Resina", movement: "Pila", ref: "GA-2100-1A1", price: 520000, days: "Inmediata", gender: "Caballero", dial: "#1d1f22", strap: "#1d1f22", round: false, tag: "Más pedido" },
    { brand: "Seiko", model: "5 Sports Automático", material: "Acero", movement: "Automático", ref: "SRPD55", price: 1350000, days: "8–12", gender: "Caballero", dial: "#24364a", strap: "#8f969c", round: true },
    { brand: "Citizen", model: "Eco-Drive Chandler", material: "Cuero", movement: "Solar", ref: "BM8180-03E", price: 890000, days: "Inmediata", gender: "Caballero", dial: "#2f3a2a", strap: "#5a3d26", round: true },
    { brand: "Fossil", model: "Grant Cronógrafo", material: "Cuero", movement: "Pila", ref: "FS4735", price: 760000, days: "Inmediata", gender: "Dama", dial: "#f1ede4", strap: "#6b4528", round: true },
    { brand: "MVMT", model: "Classic Black Tan", material: "Cuero", movement: "Pila", ref: "D-MM01-BLBR", price: 690000, days: "8–12", gender: "Unisex", dial: "#111111", strap: "#9a6a3c", round: true, tag: "Nuevo" },
    { brand: "Bulova", model: "Marine Star", material: "Acero", movement: "Pila", ref: "98B300", price: 1180000, days: "8–12", gender: "Caballero", dial: "#173a63", strap: "#a9b0b5", round: true },
    { brand: "Pagani Design", model: "PD-1661 Diver", material: "Acero", movement: "Automático", ref: "PD-1661", price: 450000, days: "Inmediata", gender: "Caballero", dial: "#0f4a3c", strap: "#a9b0b5", round: true },
    { brand: "Timex", model: "Weekender", material: "Tela", movement: "Pila", ref: "TW2R42500", price: 340000, days: "8–12", gender: "Dama", dial: "#e9e4d6", strap: "#3b4d3a", round: true },
  ];

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
  const COLS = { marca: "brand", modelo: "model", referencia: "ref", ref: "ref", precio: "price", diasdeentrega: "days", dias: "days", entrega: "days", tiempodeentrega: "days", genero: "gender", para: "gender", mecanismo: "movement", material: "material", correa: "material", movimiento: "movement", tipo: "movement", video: "video", foto: "photo", imagen: "photo", disponible: "available", etiqueta: "tag" };

  // Convierte enlaces de Google Drive a una imagen directa.
  function photoUrl(u) {
    u = (u || "").trim();
    const m = u.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]+)/);
    return m ? "https://lh3.googleusercontent.com/d/" + m[1] : u;
  }

  function fromSheet(text) {
    const [header, ...rows] = parseCSV(text);
    const keys = header.map((h) => COLS[norm(h)]);
    return rows.map((r) => {
      const p = {};
      keys.forEach((k, i) => { if (k) p[k] = (r[i] || "").trim(); });
      p.price = parseInt((p.price || "").replace(/[^\d]/g, ""), 10) || 0;
      p.photo = photoUrl(p.photo);
      p.gender = p.gender || "Unisex";
      p.movement = movementName(p.movement);
      p.material = p.material ? p.material.charAt(0).toUpperCase() + p.material.slice(1).toLowerCase() : "";
      const av = norm(p.available || "si");
      p.soldOut = av === "no" || av === "agotado";
      return p;
    }).filter((p) => p.brand && p.model).map((p, _, all) => {
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
    movementEl.hidden = kinds.length < 2;
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
    materialEl.hidden = kinds.length < 2;
    materialEl.innerHTML = ["Todos", ...kinds].map((k) => `<button class="chip" type="button" aria-pressed="${k === material}" data-m="${esc(k)}">${esc(k)}</button>`).join("");
  }
  const matchMaterial = (p) => material === "Todos" || p.material === material;
  const matchGender = (p) => gender === "Todos" || norm(p.gender || "unisex") === "unisex" || norm(p.gender) === norm(gender);

  // --- Videos: archivo en la carpeta videos/, enlace de YouTube o de Google Drive ---
  function videoHTML(v) {
    v = (v || "").trim();
    let m = v.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
    if (m) return `<iframe src="https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="Video"></iframe>`;
    m = v.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]+)/);
    if (m) return `<iframe src="https://drive.google.com/file/d/${m[1]}/preview" allow="autoplay" allowfullscreen title="Video"></iframe>`;
    const src = /^https?:\/\//.test(v) ? v : "videos/" + v.replace(/^\/?(videos\/)?/, "");
    return `<video src="${esc(src)}" controls autoplay playsinline></video>`;
  }
  const modal = document.getElementById("video-modal"), media = document.getElementById("vm-media");
  function closeVideo() { media.innerHTML = ""; if (modal.open) modal.close(); }
  document.getElementById("vm-close").addEventListener("click", closeVideo);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeVideo(); });
  modal.addEventListener("close", () => { media.innerHTML = ""; });
  grid.addEventListener("click", (e) => {
    const b = e.target.closest(".play"); if (!b) return;
    const p = SHOWN[+b.dataset.i]; if (!p) return;
    media.innerHTML = videoHTML(p.video);
    document.getElementById("vm-title").textContent = p.brand + " " + p.model;
    document.getElementById("vm-wa").href = wa(orderMsg(p));
    modal.showModal();
  });

  const orderMsg = (p) => `Hola MILOCK, me interesa el ${p.brand} ${p.model}${p.ref ? " (Ref. " + p.ref + ")" : ""}${p.price ? " de " + fmt(p.price) : ""}. ¿Me das más información?`;
  function eta(d) {
    if (!d) return "";
    const icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`;
    if (/inmediat/i.test(d)) return `<span class="eta now">${icon}Entrega inmediata</span>`;
    return `<span class="eta">${icon}${esc(d)}${/^[\d\s–-]+$/.test(d) ? " días" : ""}</span>`;
  }
  let SHOWN = [];
  function card(p, i) {
    const img = p.photo ? `<img src="${esc(p.photo)}" alt="${esc(p.brand + " " + p.model)}" loading="lazy">` : watchSVG(p);
    const tag = p.soldOut ? "Agotado" : p.tag;
    const msg = orderMsg(p);
    const play = p.video ? `<button class="play" type="button" data-i="${i}" aria-label="Ver video del ${esc(p.brand + " " + p.model)}"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>Ver video</button>` : "";
    return `<article class="card${p.soldOut ? " agotado" : ""}">
      <div class="img">${tag ? `<span class="tag">${esc(tag)}</span>` : ""}${img}${play}</div>
      <div class="body">
        <div class="brandname">${esc(p.brand)}${p.movement ? ` · <span class="mov">${esc(p.movement)}</span>` : ""}</div>
        <h3>${esc(p.model)}</h3>
        ${p.ref || p.material ? `<div class="ref">${[p.material, p.ref && "Ref. " + p.ref].filter(Boolean).map(esc).join(" · ")}</div>` : ""}
        <div class="row">
          <span class="price">${p.price ? fmt(p.price) : "Consultar"}</span>
          ${eta(p.days)}
        </div>
        <a class="btn btn-gold" target="_blank" rel="noopener" href="${wa(p.soldOut ? `Hola MILOCK, vi que el ${p.brand} ${p.model} está agotado. ¿Me avisan cuando vuelva?` : msg)}">${p.soldOut ? "Avísame cuando llegue" : "Pedir por WhatsApp"}</a>
      </div>
    </article>`;
  }

  function render() {
    const term = q.value.trim().toLowerCase();
    const list = SHOWN = PRODUCTS.filter((p) => matchGender(p) && matchMovement(p) && matchMaterial(p) && (active === "Todas" || p.brand === active) &&
      (!term || [p.brand, p.model, p.ref, p.material, p.movement].join(" ").toLowerCase().includes(term)));
    grid.innerHTML = list.length ? list.map((p, i) => card(p, i)).join("")
      : `<p class="empty">No encontramos relojes con ese nombre. Prueba con otra marca o escríbenos y lo buscamos por ti.</p>`;
  }

  function useSamples() {
    PRODUCTS = SAMPLE;
    document.getElementById("preview-banner").hidden = false;
  }

  async function load() {
    if (CFG.sheetCsvUrl) {
      try {
        const res = await fetch(CFG.sheetCsvUrl, { cache: "no-store" });
        if (!res.ok) throw new Error(res.status);
        PRODUCTS = fromSheet(await res.text());
        if (!PRODUCTS.length) useSamples();
      } catch (err) {
        console.error("No se pudo leer la Google Sheet:", err);
        useSamples();
      }
    } else useSamples();
    renderChips();
    renderMovement();
    renderMaterial();
    render();
  }
  load();
})();
