// ===== Réglages du jeu (modifiables) =====
const SELL_RATIO = 0.5;     // une carte se revend à 50 % de sa valeur
const START_POINTS = 300;   // points au tout début

const TIERS = [
  { name: "Commune",     icon: "●",   value: 10 },
  { name: "Peu commune", icon: "◆",   value: 20 },
  { name: "Rare",        icon: "★",   value: 50 },
  { name: "Ultra rare",  icon: "★★",  value: 200 },
  { name: "Secrète",     icon: "★★★", value: 500 },
];

// Chaque emplacement d'un booster = chances de tirer chaque rareté
// [Commune, Peu commune, Rare, Ultra rare, Secrète]
const C = [1, 0, 0, 0, 0], U = [0, 1, 0, 0, 0];
const REVERSE = [50, 30, 15, 4, 1];
const RARE = [0, 0, 80, 16, 4];
const RARE_PLUS = [0, 0, 55, 35, 10];
const ULTRA = [0, 0, 0, 70, 30];
const SECRET = [0, 0, 0, 0, 1];
const rep = (slot, n) => Array(n).fill(slot);

// Les 4 qualités de booster (chaque extension existe dans les 4 qualités)
const QUALITIES = [
  { id: "classique", name: "Classique", price: 50,   icon: "●",   color: "#2f80ed", desc: "1 Rare ou mieux",
    slots: [...rep(C, 5), ...rep(U, 3), REVERSE, RARE] },
  { id: "premium",   name: "Premium",   price: 125,  icon: "★",   color: "#e8590c", desc: "2 Rares ou mieux, plus d'Ultra rares",
    slots: [...rep(C, 4), ...rep(U, 3), REVERSE, RARE_PLUS, RARE_PLUS] },
  { id: "elite",     name: "Élite",     price: 300,  icon: "★★",  color: "#8a2be2", desc: "1 Ultra rare ou Secrète garantie",
    slots: [...rep(C, 3), ...rep(U, 3), REVERSE, RARE_PLUS, RARE_PLUS, ULTRA] },
  { id: "legende",   name: "Légende",   price: 750,  icon: "★★★", color: "#d4a000", desc: "2 Ultra rares + 1 Secrète garanties",
    slots: [...rep(C, 2), ...rep(U, 2), ...rep(RARE_PLUS, 3), ULTRA, ULTRA, SECRET] },
];
const SET_COLORS = {
  "swsh1": ["#1f5fae", "#c0392b"], "swsh3": ["#2b0f0f", "#e8590c"], "swsh4": ["#e0a800", "#e67e22"],
  "swsh7": ["#0b6e4f", "#2ecc71"], "swsh9": ["#1b1f4a", "#7f8cff"], "swsh12.5": ["#6b4f00", "#ffd23f"],
  "sv01": ["#b0182b", "#6a1fb0"], "sv03.5": ["#e3350d", "#2a75bb"], "sv08.5": ["#6a3fb5", "#f8a5c2"], "me01": ["#14213d", "#00b4d8"],
};

// La roue du jour (w = poids : plus il est grand, plus la case est grande)
const WHEEL = [
  { kind: "pts", n: 50,   w: 20, label: "50 pts",       color: "#4fa3ff" },
  { kind: "booster", q: "classique", w: 16, label: "🎴 Booster", color: "#3fbf6f" },
  { kind: "pts", n: 100,  w: 18, label: "100 pts",      color: "#f2b705" },
  { kind: "card", tier: 2, w: 11, label: "⭐ Carte rare", color: "#c77dff" },
  { kind: "pts", n: 200,  w: 12, label: "200 pts",      color: "#ff7a3d" },
  { kind: "booster", q: "premium", w: 7, label: "🎴 Premium", color: "#2a9d8f" },
  { kind: "pts", n: 500,  w: 6,  label: "500 pts",      color: "#e5484d" },
  { kind: "card", tier: 3, w: 4, label: "🌟 Ultra rare", color: "#7b2cbf" },
  { kind: "pts", n: 1000, w: 2,  label: "1000 !",       color: "#111" },
];

const DECOR = [
  { id: "bureau",   kind: "meuble", name: "Bureau en bois",     price: 800, emo: "🗄️", desc: "Un vrai bureau pour ouvrir tes boosters comme un pro." },
  { id: "tapis",    kind: "meuble", name: "Tapis de jeu",       price: 300, emo: "🟦", req: "bureau", desc: "Un playmat bleu : tes cartes seront ouvertes dessus." },
  { id: "lampe",    kind: "meuble", name: "Lampe de bureau",    price: 250, emo: "💡", req: "bureau", desc: "Une belle lumière pour admirer les cartes brillantes." },
  { id: "etagere",  kind: "meuble", name: "Étagère murale",     price: 400, emo: "📚", desc: "Indispensable pour exposer figurines et statuettes Pop." },
  { id: "poster",   kind: "meuble", name: "Poster Lugia",       price: 200, emo: "🖼️", desc: "Un grand poster pour le mur." },
  { id: "papier",   kind: "meuble", name: "Papier peint Poké Ball", price: 500, emo: "🎨", desc: "Des Poké Balls sur tous les murs !" },
  { id: "tapisSol", kind: "meuble", name: "Tapis de sol",       price: 250, emo: "⭕", desc: "Un grand tapis rond et coloré." },
  { id: "plante",   kind: "meuble", name: "Plante verte",       price: 100, emo: "🪴", desc: "Un peu de nature dans la chambre." },
  { id: "fig1",   kind: "figurine", name: "Bulbizarre", art: 1,   price: 150, req: "etagere" },
  { id: "fig4",   kind: "figurine", name: "Salamèche",  art: 4,   price: 150, req: "etagere" },
  { id: "fig7",   kind: "figurine", name: "Carapuce",   art: 7,   price: 150, req: "etagere" },
  { id: "fig133", kind: "figurine", name: "Évoli",      art: 133, price: 150, req: "etagere" },
  { id: "fig448", kind: "figurine", name: "Lucario",    art: 448, price: 200, req: "etagere" },
  { id: "pop25",  kind: "pop", name: "Pikachu",    art: 25,  price: 400, color: "#ffcb05", req: "etagere" },
  { id: "pop143", kind: "pop", name: "Ronflex",    art: 143, price: 400, color: "#3b8ea5", req: "etagere" },
  { id: "pop94",  kind: "pop", name: "Ectoplasma", art: 94,  price: 450, color: "#7b4fa0", req: "etagere" },
  { id: "pop6",   kind: "pop", name: "Dracaufeu",  art: 6,   price: 600, color: "#f08030", req: "etagere" },
  { id: "pop150", kind: "pop", name: "Mewtwo",     art: 150, price: 700, color: "#b07cc6", req: "etagere" },
  { id: "pop151", kind: "pop", name: "Mew",        art: 151, price: 700, color: "#f8a5c2", req: "etagere" },
];
DECOR.forEach(d => { if (!d.desc) d.desc = d.kind === "pop" ? `Statuette Pop de ${d.name} dans sa boîte.` : `Figurine de ${d.name} à poser où tu veux.`; });

const CAT_NAMES = { "Pokémon": "Pokémon", "Trainer": "Dresseur", "Energie": "Énergie" };
const SAVE_KEY = "pokecollection-save-v3";
const N = CARDS.length;
const SET_IDS = Object.keys(SETS);
const BY_ID = Object.fromEntries(CARDS.map(c => [c.id, c]));
const BY_TIER = TIERS.map((_, t) => CARDS.filter(c => c.tier === t));
const BY_SET_TIER = Object.fromEntries(SET_IDS.map(s => [s, TIERS.map((_, t) => CARDS.filter(c => c.set === s && c.tier === t))]));
const Q = Object.fromEntries(QUALITIES.map(q => [q.id, q]));
const $ = id => document.getElementById(id);
const hd = c => `cartes/hd/${c.id}.webp`;
const mini = c => `cartes/mini/${c.id}.webp`;
const rnd = a => a[Math.floor(Math.random() * a.length)];
const setName = s => SETS[s].name;

// ===== Sauvegarde =====
function newSave() { return { points: START_POINTS, owned: {}, packs: {}, decor: {}, pos: {}, lastSpin: null, spins: 0, opened: 0, sold: 0 }; }
let S, migrated = false;
try { S = JSON.parse(localStorage.getItem(SAVE_KEY)); } catch {}
if (!S) {
  S = newSave();
  // version précédente (100 cartes) : on garde la déco, les cartes communes aux deux versions,
  // et le reste est remboursé en points
  try {
    const old = JSON.parse(localStorage.getItem("pokecollection-save-v2")) || JSON.parse(localStorage.getItem("pokecollection-save-v1"));
    if (old) {
      migrated = true;
      S.points = old.points || 0;
      S.decor = old.decor || {};
      for (const [id, n] of Object.entries(old.owned || {})) {
        if (BY_ID[id]) S.owned[id] = n; else S.points += 25 * n;
      }
      for (const [q, n] of Object.entries(old.packs || {})) if (Q[q] && n > 0) S.packs[rnd(SET_IDS) + "|" + q] = n;
    }
  } catch {}
}
S = Object.assign(newSave(), S);
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch {} }
save();

const today = () => new Date().toLocaleDateString("sv"); // AAAA-MM-JJ
const count = id => S.owned[id] || 0;
const has = k => !!S.decor[k];
const ownedCount = () => CARDS.filter(c => count(c.id) > 0).length;
const sellPrice = c => Math.round(TIERS[c.tier].value * SELL_RATIO);
const packsLeft = () => Object.values(S.packs).reduce((a, b) => a + b, 0);
const addPack = key => S.packs[key] = (S.packs[key] || 0) + 1;

function toast(msg) { const t = $("toast"); t.innerHTML = msg; t.classList.add("on"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("on"), 2600); }

// ===== Petits morceaux d'affichage =====
function packHTML(set, q) {
  const [c1, c2] = SET_COLORS[set] || ["#2a75bb", "#7cc4ff"];
  const label = q ? `<div class="pname" style="background:${Q[q].color}">${Q[q].icon} ${Q[q].name}</div>` : `<div class="pname">${SETS[set].year}</div>`;
  return `<div class="pack" style="--c1:${c1};--c2:${c2}"><div class="sheen"></div><img class="plogo" src="logos/${set}.png" alt="${setName(set)}"><img class="part" src="art/${SETS[set].art}.png" alt="">${label}</div>`;
}
function figHTML(d) { return `<div class="figurine" title="${d.name}"><img src="art/${d.art}.png" alt=""></div>`; }
function popHTML(d) { return `<div class="pop" style="--popc:${d.color}" title="${d.name}"><div class="win"><img src="art/${d.art}.png" alt=""></div><div class="lbl">${d.name}<small>POP! Vinyl</small></div></div>`; }
function decorVisual(d) {
  if (d.kind === "figurine") return figHTML(d);
  if (d.kind === "pop") return popHTML(d);
  return `<div class="emo">${d.emo}</div>`;
}
function chips(c) {
  return `<div class="badges">${c.mech ? `<span class="chip mech">${c.mech}</span>` : "<span></span>"}<span class="chip" style="background:var(--t${c.tier})" title="${TIERS[c.tier].name}">${TIERS[c.tier].icon}</span></div>`;
}
function tileHTML(c, opts = {}) {
  if (!opts.force && !count(c.id))
    return `<div class="tile missing" title="Carte manquante"><div class="cardback"><div class="lab">${setName(c.set)}<br>n° ${c.num}</div></div></div>`;
  const q = !opts.force && count(c.id) > 1 ? `<div class="qty">×${count(c.id)}</div>` : "";
  const n = opts.isNew ? `<div class="newb">NOUVEAU</div>` : "";
  const sel = opts.sel ? `<div class="selb">🏷️ ${opts.sel}${count(c.id) > 1 ? ` / ${count(c.id)}` : ""}</div>` : "";
  return `<div class="tile t${c.tier} ${opts.sel ? "picked" : ""}" data-id="${c.id}">${q}${n}${sel}<img loading="lazy" src="${mini(c)}" alt="${c.name}">${chips(c)}</div>`;
}

// ===== En-tête =====
function renderHeader() {
  $("points").textContent = S.points;
  const n = ownedCount();
  $("bar").style.width = (n / N * 100) + "%";
  $("barText").textContent = `${n} / ${N} cartes`;
  const can = S.lastSpin !== today();
  $("wheelBtn").disabled = !can;
  $("wheelBtn").classList.toggle("pulse", can);
  $("wheelBtn").textContent = can ? "🎡 Roue du jour" : "🎡 Reviens demain !";
}

// ===== Roue du jour =====
const WTOTAL = WHEEL.reduce((a, s) => a + s.w, 0);
let wheelAngle = 0;
function wheelSVG() {
  let a = 0, h = "";
  const pt = (deg, r) => [Math.sin(deg * Math.PI / 180) * r, -Math.cos(deg * Math.PI / 180) * r];
  WHEEL.forEach(s => {
    const a1 = a + s.w / WTOTAL * 360, mid = (a + a1) / 2;
    const [x0, y0] = pt(a, 100), [x1, y1] = pt(a1, 100);
    h += `<path d="M0 0 L${x0} ${y0} A100 100 0 ${a1 - a > 180 ? 1 : 0} 1 ${x1} ${y1} Z" fill="${s.color}" stroke="#fff" stroke-width="1.5"/>`;
    const fs = s.w >= 6 ? 9 : 7;
    h += `<text transform="rotate(${mid}) translate(0 -58) rotate(${mid > 180 ? 90 : -90})" font-size="${fs}" font-weight="bold" fill="#fff" text-anchor="middle" dominant-baseline="middle" style="paint-order:stroke" stroke="#0006" stroke-width="2">${s.label}</text>`;
    a = a1;
  });
  return `<svg viewBox="-104 -104 208 208" class="wheel" id="wheelSvg" style="transform:rotate(${wheelAngle}deg)"><circle r="103" fill="#222"/>${h}<circle r="14" fill="#fff" stroke="#222" stroke-width="3"/><circle r="5" fill="#e3350d"/></svg>`;
}
function openWheel() {
  const can = S.lastSpin !== today();
  $("wheelPanel").innerHTML = `
    <h2 style="margin:0">🎡 Roue du jour</h2>
    <p class="muted" style="margin:0">Un tour par jour : des points, un booster ou même une carte rare !</p>
    <div class="wheelwrap"><div class="wpointer"></div>${wheelSVG()}</div>
    <div id="wheelResult" style="min-height:30px"></div>
    <div style="display:flex;gap:10px"><button class="gold" id="spinBtn" ${can ? "" : "disabled"}>${can ? "Tourner !" : "Reviens demain !"}</button><button id="wheelClose">Fermer</button></div>`;
  $("wheelModal").classList.add("on");
  $("wheelClose").onclick = closeWheel;
  $("spinBtn").onclick = spin;
}
function closeWheel() { if (!spinning) $("wheelModal").classList.remove("on"); }
$("wheelModal").addEventListener("click", e => { if (e.target.id === "wheelModal") closeWheel(); });
$("wheelBtn").onclick = openWheel;
let spinning = false;
function spin() {
  if (S.lastSpin === today() || spinning) return;
  // tirage
  let r = Math.random() * WTOTAL, k = 0;
  while (r >= WHEEL[k].w) { r -= WHEEL[k].w; k++; }
  const seg = WHEEL[k];
  const start = WHEEL.slice(0, k).reduce((a, s) => a + s.w, 0) / WTOTAL * 360;
  const mid = start + seg.w / WTOTAL * 360 * (0.2 + Math.random() * 0.6);
  // on donne le gain tout de suite (au cas où la page serait fermée pendant que la roue tourne)
  let html = "", card = null, isNew = false, packKey = null;
  if (seg.kind === "pts") { S.points += seg.n; html = `<h3 style="margin:0">💰 +${seg.n} points !</h3>`; }
  if (seg.kind === "booster") {
    packKey = rnd(SET_IDS) + "|" + seg.q; addPack(packKey);
    const [set, q] = packKey.split("|");
    html = `<h3 style="margin:0">🎴 Un booster ${setName(set)} (${Q[q].name}) !</h3><p style="margin:4px 0">Il t'attend dans ta chambre.</p><button class="gold" id="wOpen">✂️ L'ouvrir maintenant</button>`;
  }
  if (seg.kind === "card") {
    const pool = BY_TIER[seg.tier], missing = pool.filter(c => !count(c.id));
    card = missing.length && Math.random() < 0.6 ? rnd(missing) : rnd(pool);
    isNew = !count(card.id); S.owned[card.id] = count(card.id) + 1;
    html = `<h3 style="margin:0">${seg.label} : ${card.name} !</h3><div style="width:180px;margin:8px auto">${tileHTML(card, { force: true, isNew })}</div>`;
  }
  S.lastSpin = today(); S.spins++; save();
  spinning = true;
  $("spinBtn").disabled = true; $("wheelClose").disabled = true;
  wheelAngle = wheelAngle - (wheelAngle % 360) + 360 * 6 + (360 - mid);
  $("wheelSvg").style.transform = `rotate(${wheelAngle}deg)`;
  setTimeout(() => {
    spinning = false; $("wheelClose").disabled = false;
    $("spinBtn").textContent = "Reviens demain !";
    $("wheelResult").innerHTML = html;
    if ($("wOpen")) $("wOpen").onclick = () => { $("wheelModal").classList.remove("on"); showTab("room"); startOpening(packKey); };
    const t = $("wheelResult").querySelector(".tile[data-id]"); if (t) t.onclick = () => openCard(t.dataset.id);
    renderHeader(); refreshTab();
  }, 5200);
}

// ===== La chambre (objets déplaçables) =====
function roomObjects() {
  const o = [];
  const packs = Object.entries(S.packs).filter(([, n]) => n > 0).map(([key, n]) => {
    const [set, q] = key.split("|"), [c1, c2] = SET_COLORS[set];
    return `<div class="minipack" data-pack="${key}" title="Booster ${setName(set)} — ${Q[q].name}" style="--c1:${c1};--c2:${c2};border-color:${Q[q].color}"><img src="art/${SETS[set].art}.png" alt="">${n > 1 ? `<span>×${n}</span>` : ""}</div>`;
  }).join("");
  if (has("tapisSol")) o.push({ id: "tapisSol", layer: 1, def: [14, 2], w: 72, h: 22, html: `<div class="rug"></div>` });
  if (has("poster")) o.push({ id: "poster", layer: 2, def: [29, 56], w: 13, h: 36, html: `<div class="poster"><b>LUGIA</b><img src="art/249.png" alt=""><b>★ ★ ★</b></div>` });
  if (has("etagere")) o.push({ id: "etagere", layer: 2, def: [61, 46], w: 36, h: 30, html: `<div class="etagere"><div class="plank p1"></div><div class="plank p2"></div></div>` });
  if (has("bureau")) o.push({ id: "bureau", layer: 3, def: [22, 7], w: 56, h: 40, html: `<div class="desk"><div class="top"></div>${has("tapis") ? `<div class="mat"></div>` : ""}<div class="edge"></div><div class="leg l"></div><div class="leg r"></div><div class="drawer"></div><div class="packs">${packs}</div></div>` });
  else o.push({ id: "carton", layer: 3, def: [39, 8], w: 22, h: 22, html: `<div class="carton"><b>FRAGILE</b><div class="packs">${packs}</div></div>` });
  if (has("plante")) o.push({ id: "plante", layer: 4, def: [88, 10], w: 9, html: `<div class="plant">🪴</div>` });
  if (has("lampe")) o.push({ id: "lampe", layer: 4, def: [72, 40], w: 5, h: 17, html: `<div class="lamp"><div class="base"></div><div class="arm"></div><div class="head"></div></div>` });
  o.push({ id: "binder", layer: 5, def: has("bureau") ? [24, 44] : [27, 7], w: 5.5, html: `<div class="binder" title="Mon classeur">CLAS-<br>SEUR</div>` });
  DECOR.filter(d => d.kind === "figurine").forEach((d, i) => { if (has(d.id)) o.push({ id: d.id, layer: 5, def: [62 + i * 7, 74.4], w: 8, html: figHTML(d) }); });
  DECOR.filter(d => d.kind === "pop").forEach((d, i) => { if (has(d.id)) o.push({ id: d.id, layer: 5, def: [61.6 + i * 5.8, 47.4], w: 6, html: popHTML(d) }); });
  return { o, packs };
}
function renderRoom() {
  const { o, packs } = roomObjects();
  let h = `<div class="wall ${has("papier") ? "paper" : ""}"></div><div class="floor"></div><div class="baseboard"></div><div class="window"><i></i></div><div class="bulb"></div>`;
  for (const it of o) {
    const [x, y] = S.pos[it.id] || it.def;
    h += `<div class="mv L${it.layer}" data-mv="${it.id}" style="left:${x}%;bottom:${y}%;width:${it.w}%;${it.h ? `height:${it.h}%;` : ""}">${it.html}</div>`;
  }
  if (has("lampe")) h += `<div class="lampglow"></div>`;
  const hint = packs ? "Clique sur un booster pour l'ouvrir !" : (Object.keys(S.decor).length ? "Plus de boosters… Va au Poké Shop ou fais tourner la roue !" : "Ta chambre est encore vide… Va au Poké Shop !");
  h += `<div class="roomhint">${hint}</div>`;
  $("roomScene").innerHTML = h;
}
let drag = null;
$("roomScene").addEventListener("pointerdown", e => {
  const mv = e.target.closest(".mv"); if (!mv) return;
  e.preventDefault();
  const r = $("roomScene").getBoundingClientRect();
  drag = { el: mv, target: e.target, sx: e.clientX, sy: e.clientY, x0: parseFloat(mv.style.left), y0: parseFloat(mv.style.bottom), r, moved: false };
  mv.setPointerCapture(e.pointerId);
});
$("roomScene").addEventListener("pointermove", e => {
  if (!drag) return;
  const { el, r } = drag;
  if (!drag.moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 6) return;
  drag.moved = true; el.classList.add("dragging");
  const w = el.offsetWidth / r.width * 100, h = el.offsetHeight / r.height * 100;
  const x = Math.max(0, Math.min(100 - w, drag.x0 + (e.clientX - drag.sx) / r.width * 100));
  const y = Math.max(0, Math.min(100 - h, drag.y0 - (e.clientY - drag.sy) / r.height * 100));
  el.style.left = x + "%"; el.style.bottom = y + "%";
});
$("roomScene").addEventListener("pointerup", () => {
  if (!drag) return;
  const d = drag; drag = null;
  d.el.classList.remove("dragging");
  if (d.moved) {
    S.pos[d.el.dataset.mv] = [+parseFloat(d.el.style.left).toFixed(2), +parseFloat(d.el.style.bottom).toFixed(2)];
    save();
  } else {
    const p = d.target.closest(".minipack");
    if (p) startOpening(p.dataset.pack);
    else if (d.el.dataset.mv === "binder") showTab("coll");
  }
});
$("resetPos").onclick = () => { if (confirm("Remettre tous les objets à leur place d'origine ?")) { S.pos = {}; save(); renderRoom(); } };

// ===== Boutique =====
const TALK = ["Bienvenue au Poké Shop ! Clique sur un article pour l'acheter.", "Chaque extension a son booster. Les boosters Élite et Légende ont plein de cartes rares !", "Une étagère, c'est parfait pour exposer des statuettes Pop.", "N'oublie pas de faire tourner la roue chaque jour !"];
function itemHTML(kind, id, visual, name, tag, cls = "") {
  return `<div class="item ${cls}" data-kind="${kind}" data-id="${id}" title="${name}"><div class="visual">${visual}</div><div class="tag ${cls.includes("owned") ? "owned" : ""}">${tag}</div></div>`;
}
function renderShop() {
  $("shelfBoosters").innerHTML = SET_IDS.map(s => itemHTML("booster", s, `<div style="width:84px">${packHTML(s)}</div>`, "Booster " + setName(s), `dès ${QUALITIES[0].price} pts`)).join("");
  const deco = kind => DECOR.filter(d => d.kind === kind).map(d => {
    const owned = has(d.id), locked = d.req && !has(d.req);
    const tag = owned ? "✔ Acheté" : locked ? `🔒 ${d.price} pts · ${d.req === "bureau" ? "bureau" : "étagère"} d'abord` : `${d.price} pts`;
    return itemHTML("decor", d.id, decorVisual(d), d.name, tag, owned ? "owned" : locked ? "locked" : "");
  }).join("");
  $("shelfFurniture").innerHTML = deco("meuble");
  $("shelfFigurines").innerHTML = deco("figurine");
  $("shelfPops").innerHTML = deco("pop");
}
document.querySelector(".store").addEventListener("click", e => {
  const it = e.target.closest(".item"); if (!it) return;
  if (it.dataset.kind === "booster") openBuyBooster(it.dataset.id);
  else openBuyDecor(DECOR.find(d => d.id === it.dataset.id));
});
function closeBuy() { $("buyModal").classList.remove("on"); }
$("buyModal").addEventListener("click", e => { if (e.target.id === "buyModal") closeBuy(); });

function avgPerPack(q) {
  return TIERS.map((t, k) => q.slots.reduce((a, s) => a + s[k] / s.reduce((x, y) => x + y, 0), 0));
}
function openBuyBooster(set, chosen = "classique") {
  const q = Q[chosen];
  const avg = avgPerPack(q).map((x, k) => x >= 0.01 ? `<span style="color:var(--t${k})">${TIERS[k].icon} ${x >= 1 ? x.toFixed(1).replace(".0", "") : "~" + Math.round(x * 100) + " %"}</span>` : "").filter(Boolean).join(" · ");
  const inSet = BY_SET_TIER[set].map(a => a.length);
  const ownedInSet = CARDS.filter(c => c.set === set && count(c.id)).length;
  const waiting = QUALITIES.map(x => S.packs[set + "|" + x.id] ? `${S.packs[set + "|" + x.id]} ${x.name}` : "").filter(Boolean).join(", ");
  $("buyPanel").innerHTML = `
    <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;justify-content:center;text-align:left">
      <div style="width:130px;container-type:inline-size">${packHTML(set, chosen)}</div>
      <div style="flex:1;min-width:200px">
        <h2 style="margin:0">Booster ${setName(set)}</h2>
        <div class="muted">${SETS[set].year} · Tu as <b>${ownedInSet} / ${inSet.reduce((a, b) => a + b, 0)}</b> cartes de cette extension</div>
        ${waiting ? `<div class="muted">Déjà dans ta chambre : ${waiting}</div>` : ""}
      </div>
    </div>
    <div class="qualities">${QUALITIES.map(x => `<button class="qbtn ${x.id === chosen ? "on" : ""}" data-q="${x.id}" style="--qc:${x.color}"><b>${x.icon} ${x.name}</b><span>${x.price} pts</span><small>${x.desc}</small></button>`).join("")}</div>
    <div style="font-size:14px"><b>En moyenne par booster ${q.name} :</b><br>${avg}</div>
    <p style="margin:0">Prix : <b>${q.price} pts</b> — Tu as <b>${S.points} pts</b></p>
    <div style="display:flex;gap:10px"><button class="gold" id="doBuy" ${S.points < q.price ? "disabled" : ""}>Acheter</button><button id="cancelBuy">Annuler</button></div>
    ${S.points < q.price ? `<p class="muted" style="margin:0">Il te manque ${q.price - S.points} points.</p>` : ""}`;
  $("buyModal").classList.add("on");
  $("buyPanel").querySelectorAll(".qbtn").forEach(b => b.onclick = () => openBuyBooster(set, b.dataset.q));
  $("cancelBuy").onclick = closeBuy;
  $("doBuy").onclick = () => {
    if (S.points < q.price) return;
    const key = set + "|" + q.id;
    S.points -= q.price; addPack(key); save(); renderHeader(); renderShop();
    $("shopTalk").textContent = `Merci ! Ton booster ${setName(set)} t'attend dans ta chambre.`;
    $("buyPanel").innerHTML = `<h2 style="margin:0">🎉 Acheté !</h2><p>Le booster ${setName(set)} (${q.name}) est posé ${has("bureau") ? "sur ton bureau" : "sur ton carton"}.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="gold" id="openNow">✂️ L'ouvrir maintenant</button><button id="keepShop">Continuer mes achats</button></div>`;
    $("openNow").onclick = () => { closeBuy(); showTab("room"); startOpening(key); };
    $("keepShop").onclick = closeBuy;
  };
}
function openBuyDecor(d) {
  const owned = has(d.id), locked = d.req && !has(d.req);
  const reqName = d.req ? DECOR.find(x => x.id === d.req).name : "";
  $("buyPanel").innerHTML = `
    <div class="item" style="cursor:default;transform:none;width:140px"><div class="visual">${decorVisual(d)}</div></div>
    <h2 style="margin:0">${d.name}</h2>
    <p style="margin:0">${d.desc}</p>
    ${locked ? `<p style="margin:0;color:var(--gold)">🔒 Il faut d'abord acheter : ${reqName}</p>` : ""}
    <p style="margin:0">Prix : <b>${d.price} pts</b> — Tu as <b>${S.points} pts</b></p>
    <div style="display:flex;gap:10px"><button class="gold" id="doBuy" ${owned || locked || S.points < d.price ? "disabled" : ""}>${owned ? "Déjà acheté" : "Acheter"}</button><button id="cancelBuy">Fermer</button></div>`;
  $("buyModal").classList.add("on");
  $("cancelBuy").onclick = closeBuy;
  $("doBuy").onclick = () => {
    if (owned || locked || S.points < d.price) return;
    S.points -= d.price; S.decor[d.id] = true; save(); renderHeader(); renderShop(); closeBuy();
    $("shopTalk").textContent = `Excellent choix ! ${d.name} a été livré dans ta chambre.`;
    toast(`🏠 ${d.name} installé dans ta chambre ! (tu peux le déplacer)`);
  };
}

// ===== Ouverture d'un booster =====
let OP = null;
function pickTier(w) {
  let r = Math.random() * w.reduce((a, b) => a + b, 0);
  for (let k = 0; k < w.length; k++) { r -= w[k]; if (r < 0) return k; }
  return 0;
}
function drawPack(set, q) {
  const cards = [], pools = BY_SET_TIER[set];
  for (const slot of Q[q].slots) {
    let t = pickTier(slot);
    while (t > 0 && !pools[t].length) t--; // au cas où une rareté manquerait dans l'extension
    const pool = pools[t];
    let c, tries = 0;
    do { c = rnd(pool); } while (cards.includes(c) && ++tries < 15);
    cards.push(c);
  }
  return cards; // comme en vrai : les communes devant, les rares au fond du paquet
}
function startOpening(key) {
  if (!S.packs[key]) return;
  const [set, q] = key.split("|");
  const el = $("opening");
  el.className = "on " + (has("tapis") ? "bg-mat" : has("bureau") ? "bg-desk" : "bg-carton") + (has("lampe") ? " bg-lamp" : "");
  const deco = DECOR.filter(d => (d.kind === "figurine" || d.kind === "pop") && has(d.id));
  const half = Math.ceil(deco.length / 2);
  const side = list => `<div class="specside">${list.map(d => d.kind === "pop" ? popHTML(d) : figHTML(d)).join("")}</div>`;
  el.innerHTML = `
    <button class="op-close" id="opClose" title="Fermer">✖</button>
    <div class="op-top"><h2 id="opTitle">Booster ${setName(set)} · ${Q[q].name}</h2><p id="opSub">Glisse le doigt (ou la souris) le long des pointillés pour déchirer l'emballage ✂️</p></div>
    <div class="spectators">${side(deco.slice(0, half))}${side(deco.slice(half))}</div>
    <div class="stage" id="stage">
      <div class="tear-pack" id="tearPack">
        <div class="body">${packHTML(set, q)}</div>
        <div class="strip">${packHTML(set, q)}</div>
        <div class="tear-line" id="tearLine"></div><div class="tear-progress" id="tearProg"></div>
      </div>
    </div>
    <div class="seen" id="seen" hidden><div class="seen-label">Déjà vues</div></div>
    <div class="op-controls" id="opCtl"><button id="tearBtn">✂️ Déchirer d'un coup</button></div>`;
  OP = { key, set, q, phase: "pack", busy: false };
  $("opClose").onclick = closeOpening;
  $("tearBtn").onclick = tearPack;
  setupTear();
}
function closeOpening() {
  $("opening").className = ""; $("opening").innerHTML = ""; OP = null;
  renderHeader(); refreshTab();
}
function setupTear() {
  const tp = $("tearPack");
  let active = false, minX = 0, maxX = 0;
  tp.addEventListener("pointerdown", e => {
    const r = tp.getBoundingClientRect();
    if (e.clientY - r.top > r.height * 0.3) return; // il faut attraper le haut du booster
    active = true; minX = maxX = e.clientX; tp.setPointerCapture(e.pointerId);
  });
  tp.addEventListener("pointermove", e => {
    if (!active || OP.phase !== "pack") return;
    const r = tp.getBoundingClientRect();
    minX = Math.min(minX, e.clientX); maxX = Math.max(maxX, e.clientX);
    const prog = Math.min(1, (maxX - minX) / (r.width * 0.92));
    $("tearProg").style.width = (prog * 92) + "%";
    $("tearProg").style.left = (4 + ((minX - r.left) / r.width - 0.04) * 100) + "%";
    $("tearLine").style.setProperty("--cut", ((e.clientX - r.left) / r.width * 100 - 4) / 0.92 + "%");
    if (prog >= 0.8) { active = false; tearPack(); }
  });
  tp.addEventListener("pointerup", () => active = false);
}
function tearPack() {
  if (!OP || OP.phase !== "pack") return;
  OP.phase = "torn";
  // le booster est consommé, les cartes vont dans la collection
  S.packs[OP.key]--; if (!S.packs[OP.key]) delete S.packs[OP.key];
  S.opened++;
  OP.cards = drawPack(OP.set, OP.q);
  const seenNow = new Set();
  OP.isNew = OP.cards.map(c => { const n = !count(c.id) && !seenNow.has(c.id); seenNow.add(c.id); return n; });
  OP.cards.forEach(c => S.owned[c.id] = count(c.id) + 1);
  save(); renderHeader();
  OP.order = OP.cards.map((_, i) => i); // index 0 = carte du dessus
  $("tearBtn").remove();
  $("opSub").textContent = "Crrrraaac ! 🎉";
  $("tearPack").classList.add("torn");
  setTimeout(() => $("tearPack").classList.add("out"), 650);
  setTimeout(() => { $("tearPack").remove(); OP.phase = "stack"; renderStack(true); }, 1250);
}
function stackControls() {
  const left = OP.order.length;
  $("opTitle").textContent = `${left} carte${left > 1 ? "s" : ""} dans la pile`;
  $("opSub").textContent = "Clique sur la carte pour la retourner, ou glisse-la sur le côté pour la mettre sous la pile sans la regarder.";
  $("opCtl").innerHTML = `<button id="toBottom" ${left < 2 ? "disabled" : ""}>⤵️ Mettre dessous</button><button class="gold" id="flipBtn">👀 Retourner</button>`;
  $("toBottom").onclick = () => moveToBottom(-1);
  $("flipBtn").onclick = flipTop;
}
function renderStack(rise) {
  const st = $("stage");
  st.innerHTML = `<div class="counter-left">Pile : ${OP.order.length} / 10</div><div class="stack" id="stack"></div>`;
  const n = OP.order.length;
  // le dessous de la pile d'abord dans le HTML, le dessus en dernier
  $("stack").innerHTML = OP.order.slice().reverse().map((ci, k) => {
    const d = n - 1 - k, c = OP.cards[ci];
    return `<div class="scard t${c.tier} ${d === 0 ? "top" : ""} ${rise ? "rise" : ""}" data-ci="${ci}" style="top:${-d * 2}px;left:${d * 2}px;right:${-d * 2}px;bottom:${d * 2}px;${rise ? `animation-delay:${k * 0.04}s` : ""}">
      <div class="inner"><div class="cardback"></div><div class="face"><img src="${hd(c)}" alt=""></div></div></div>`;
  }).join("");
  stackControls();
  setupDrag();
}
const topEl = () => $("stack") && $("stack").lastElementChild;
function setupDrag() {
  const el = topEl(); if (!el) return;
  let x0 = null, dx = 0;
  el.addEventListener("pointerdown", e => { if (OP.busy) return; x0 = e.clientX; dx = 0; el.setPointerCapture(e.pointerId); el.style.transition = "none"; });
  el.addEventListener("pointermove", e => {
    if (x0 === null) return;
    dx = e.clientX - x0;
    if (OP.phase === "stack") el.style.transform = `translateX(${dx}px) rotate(${dx / 20}deg)`;
  });
  el.addEventListener("pointerup", () => {
    if (x0 === null) return;
    x0 = null; el.style.transition = "";
    if (OP.phase === "stack" && Math.abs(dx) > 70 && OP.order.length > 1) moveToBottom(Math.sign(dx));
    else if (Math.abs(dx) < 8) { el.style.transform = ""; OP.phase === "stack" ? flipTop() : nextCard(); }
    else el.style.transform = "";
  });
}
function moveToBottom(dir) {
  if (!OP || OP.phase !== "stack" || OP.busy || OP.order.length < 2) return;
  OP.busy = true;
  const el = topEl();
  el.style.transition = "transform .25s ease-in";
  el.style.transform = `translateX(${dir * 115}%) rotate(${dir * 10}deg)`;
  setTimeout(() => {
    OP.order.push(OP.order.shift());
    renderStack(false);
    const moved = $("stack").firstElementChild; // maintenant tout en dessous
    moved.style.transition = "none";
    moved.style.transform = `translateX(${dir * 115}%) rotate(${dir * 10}deg)`;
    moved.offsetWidth;
    moved.style.transition = "transform .3s ease-out";
    moved.style.transform = "";
    setTimeout(() => OP.busy = false, 300);
  }, 250);
}
function flipTop() {
  if (!OP || OP.phase !== "stack" || OP.busy) return;
  OP.busy = true; OP.phase = "shown";
  const el = topEl(), ci = OP.order[0], c = OP.cards[ci], isNew = OP.isNew[ci];
  el.classList.add("flipped");
  $("opCtl").innerHTML = "";
  setTimeout(() => {
    const parts = [isNew ? "✨ NOUVEAU !" : `Double (×${count(c.id)})`, `<span style="color:var(--t${c.tier})">${TIERS[c.tier].icon} ${TIERS[c.tier].name}</span>`];
    if (c.mech) parts.push(`<span class="chip mech">${c.mech}</span>`);
    $("stage").insertAdjacentHTML("beforeend", `<div class="reveal-label">${parts.join(" · ")}</div>`);
    $("opTitle").textContent = c.name;
    $("opSub").textContent = `${setName(c.set)} · n° ${c.num}`;
    if (c.tier >= 2 || isNew) sparkles(c.tier >= 3 ? 40 : 18, `var(--t${Math.max(c.tier, 2)})`);
    const last = OP.order.length === 1;
    $("opCtl").innerHTML = `<button class="gold" id="nextBtn">${last ? "✅ Voir le résumé" : "➡️ Carte suivante"}</button>`;
    $("nextBtn").onclick = nextCard;
    OP.busy = false;
  }, 600);
}
function sparkles(n, color) {
  const st = $("stage");
  for (let i = 0; i < n; i++) {
    const s = document.createElement("div");
    s.className = "sparkle";
    const a = Math.random() * Math.PI * 2, d = 120 + Math.random() * 180;
    s.style.cssText = `left:50%;top:50%;background:${color};--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px;animation-delay:${Math.random() * .2}s`;
    st.appendChild(s);
    setTimeout(() => s.remove(), 1300);
  }
}
function nextCard() {
  if (!OP || OP.phase !== "shown" || OP.busy) return;
  OP.busy = true;
  const el = topEl(), ci = OP.order.shift(), c = OP.cards[ci];
  const seen = $("seen"); seen.hidden = false;
  const r1 = el.getBoundingClientRect(), r2 = seen.getBoundingClientRect();
  const lbl = $("stage").querySelector(".reveal-label"); if (lbl) lbl.remove();
  el.style.transition = "transform .45s ease-in";
  el.style.transform = `translate(${r2.left + r2.width / 2 - (r1.left + r1.width / 2)}px, ${r2.top + r2.height / 2 - (r1.top + r1.height / 2)}px) scale(${r2.width / r1.width}) rotate(${Math.random() * 10 - 5}deg)`;
  setTimeout(() => {
    seen.insertAdjacentHTML("beforeend", `<img src="${mini(c)}" alt="" style="transform:rotate(${Math.random() * 12 - 6}deg)">`);
    OP.busy = false;
    if (OP.order.length) { OP.phase = "stack"; renderStack(false); }
    else showSummary();
  }, 450);
}
function showSummary() {
  OP.phase = "done";
  $("stage").remove(); $("seen").remove();
  const nb = OP.isNew.filter(Boolean).length;
  const value = OP.cards.reduce((a, c) => a + TIERS[c.tier].value, 0);
  $("opTitle").textContent = nb ? `🎉 ${nb} nouvelle${nb > 1 ? "s" : ""} carte${nb > 1 ? "s" : ""} !` : "Que des doubles cette fois… 😅";
  $("opSub").textContent = `Valeur du booster : ${value} pts · Collection : ${ownedCount()} / ${N}`;
  $("opening").insertAdjacentHTML("beforeend", `<div class="summary"><div class="grid">${OP.cards.map((c, i) => tileHTML(c, { force: true, isNew: OP.isNew[i] })).join("")}</div></div>`);
  $("opening").querySelector(".summary").addEventListener("click", e => { const t = e.target.closest(".tile[data-id]"); if (t) openCard(t.dataset.id); });
  const next = S.packs[OP.key] ? OP.key : Object.keys(S.packs).find(k => S.packs[k] > 0);
  $("opCtl").innerHTML = `${next ? `<button class="gold" id="again">✂️ Ouvrir un autre booster (${packsLeft()})</button>` : ""}<button id="toBinder">📒 Mon classeur</button><button id="toRoom">🏠 Ma chambre</button>`;
  if (next) $("again").onclick = () => startOpening(next);
  $("toBinder").onclick = () => { closeOpening(); showTab("coll"); };
  $("toRoom").onclick = () => { closeOpening(); showTab("room"); };
}
document.addEventListener("keydown", e => {
  if (!OP || $("cardModal").classList.contains("on")) return;
  if (e.key === "Escape") return closeOpening();
  if (OP.phase === "pack" && (e.key === " " || e.key === "Enter")) { e.preventDefault(); tearPack(); }
  else if (OP.phase === "stack") {
    if (e.key === "ArrowLeft") moveToBottom(-1);
    else if (e.key === "ArrowRight") moveToBottom(1);
    else if (e.key === " " || e.key === "Enter") { e.preventDefault(); flipTop(); }
  } else if (OP.phase === "shown" && (e.key === " " || e.key === "Enter" || e.key === "ArrowRight")) { e.preventDefault(); nextCard(); }
});

// ===== Classeur (collection) =====
function fillSelect(sel, label, items) { $(sel).innerHTML = `<option value="">${label}</option>` + items.map(([v, t]) => `<option value="${v}">${t}</option>`).join(""); }
fillSelect("fSet", "Toutes les extensions", SET_IDS.map(s => [s, `${setName(s)} (${SETS[s].year})`]));
fillSelect("fTier", "Toutes les raretés", TIERS.map((t, k) => [k, t.icon + " " + t.name]));
fillSelect("fMech", "V, VMAX, ex…", [...new Set(CARDS.map(c => c.mech).filter(Boolean))].map(m => [m, m]));
fillSelect("fCat", "Toutes catégories", Object.entries(CAT_NAMES));
fillSelect("fGen", "Toutes générations", [...new Set(CARDS.map(c => c.gen).filter(Boolean))].sort().map(g => [g, "Génération " + g]));
["search", "fOwn", "fSet", "fTier", "fMech", "fCat", "fGen"].forEach(id => $(id).addEventListener("input", renderColl));

// vente de plusieurs cartes : SELL.sel = { idCarte: nombre à vendre }
const SELL = { on: false, sel: {} };
function renderColl() {
  const q = $("search").value.trim().toLowerCase();
  const own = $("fOwn").value, set = $("fSet").value, tier = $("fTier").value, mech = $("fMech").value, cat = $("fCat").value, gen = $("fGen").value;
  const list = CARDS.filter(c => {
    const n = count(c.id);
    if (own === "own" && !n) return false;
    if (own === "miss" && n) return false;
    if (own === "dup" && n < 2) return false;
    if (set && c.set !== set) return false;
    if (tier !== "" && c.tier != tier) return false;
    if (mech && c.mech !== mech) return false;
    if (cat && c.cat !== cat) return false;
    if (gen && c.gen != gen) return false;
    if (q && !(n && c.name.toLowerCase().includes(q))) return false;
    return true;
  });
  $("collInfo").textContent = `${list.length} cartes affichées — ${list.filter(c => count(c.id)).length} possédées`;
  $("collGrid").innerHTML = list.map(c => tileHTML(c, { sel: SELL.on ? SELL.sel[c.id] : 0 })).join("");
  $("collGrid").classList.toggle("selling", SELL.on);
  renderSellBar();
}
function renderSellBar() {
  $("sellBar").classList.toggle("on", SELL.on);
  $("sellMode").classList.toggle("on", SELL.on);
  let n = 0, gain = 0;
  for (const [id, k] of Object.entries(SELL.sel)) { n += k; gain += k * sellPrice(BY_ID[id]); }
  $("sellCount").textContent = `${n} carte${n > 1 ? "s" : ""}`;
  $("sellGain").textContent = `+${gain} pts`;
  $("sellGo").disabled = !n;
}
$("collGrid").addEventListener("click", e => {
  const t = e.target.closest(".tile[data-id]"); if (!t) return;
  const id = t.dataset.id;
  if (!SELL.on) return openCard(id);
  // chaque clic ajoute un exemplaire ; après le dernier, on revient à zéro
  const k = (SELL.sel[id] || 0) + 1;
  if (k > count(id)) delete SELL.sel[id]; else SELL.sel[id] = k;
  t.outerHTML = tileHTML(BY_ID[id], { sel: SELL.sel[id] || 0 });
  renderSellBar();
});
$("sellMode").onclick = () => { SELL.on = !SELL.on; SELL.sel = {}; renderColl(); };
$("sellExit").onclick = () => { SELL.on = false; SELL.sel = {}; renderColl(); };
$("selClear").onclick = () => { SELL.sel = {}; renderColl(); };
$("selDups").onclick = () => { CARDS.forEach(c => { if (count(c.id) > 1) SELL.sel[c.id] = count(c.id) - 1; }); renderColl(); };
$("sellGo").onclick = () => {
  let n = 0, gain = 0, lost = 0;
  for (const [id, k] of Object.entries(SELL.sel)) { n += k; gain += k * sellPrice(BY_ID[id]); if (k >= count(id)) lost++; }
  if (!n) return;
  const warn = lost ? `\n\nAttention : ${lost} carte${lost > 1 ? "s" : ""} va quitter ton classeur (tu n'en auras plus aucun exemplaire).` : "";
  if (!confirm(`Vendre ${n} carte${n > 1 ? "s" : ""} pour ${gain} points ?${warn}`)) return;
  for (const [id, k] of Object.entries(SELL.sel)) { S.owned[id] -= k; if (S.owned[id] <= 0) delete S.owned[id]; S.sold += k; }
  S.points += gain; SELL.sel = {}; save(); renderHeader(); renderColl();
  toast(`💰 ${n} carte${n > 1 ? "s" : ""} vendue${n > 1 ? "s" : ""} : +${gain} points !`);
};

// ===== Détail d'une carte + revente =====
function openCard(id) {
  const c = BY_ID[id], n = count(c.id);
  $("zoomImg").src = hd(c);
  $("holo").style.display = c.tier >= 2 ? "" : "none";
  $("cardInfo").innerHTML = `
    <h2>${c.name} ${c.mech ? `<span class="chip mech">${c.mech}</span>` : ""}</h2>
    <div class="row muted">${setName(c.set)} (${SETS[c.set].year}) · n° ${c.num}</div>
    <div class="row">Catégorie : <b>${CAT_NAMES[c.cat]}</b>${c.gen ? ` · Génération <b>${c.gen}</b>` : ""}</div>
    <div class="row">Rareté : <b style="color:var(--t${c.tier})">${TIERS[c.tier].icon} ${TIERS[c.tier].name}</b> <span class="muted">(« ${c.rar} »)</span></div>
    ${c.mech ? `<div class="row">Carte spéciale : <b>${c.mech}</b></div>` : ""}
    <div class="row">Valeur : <b>${TIERS[c.tier].value} pts</b> · Revente : <b>${sellPrice(c)} pts</b></div>
    <div class="row">Tu en possèdes : <b>${n}</b></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">
      <button class="green" id="sellOne" ${n ? "" : "disabled"}>💰 Vendre 1 (+${sellPrice(c)} pts)</button>
      <button id="closeCard">Fermer</button>
    </div>
    ${n === 1 ? `<p class="muted" style="font-size:13px">Attention : c'est ton seul exemplaire, la carte quittera ton classeur.</p>` : ""}`;
  $("cardModal").classList.add("on");
  $("closeCard").onclick = closeCard;
  $("sellOne").onclick = () => {
    if (!count(c.id)) return;
    if (count(c.id) === 1 && !confirm(`Vendre ton seul exemplaire de ${c.name} ? Elle disparaîtra de ta collection.`)) return;
    S.owned[c.id]--; if (!S.owned[c.id]) delete S.owned[c.id];
    S.points += sellPrice(c); S.sold++; save(); renderHeader();
    toast(`💰 +${sellPrice(c)} points`);
    if (tab === "coll") renderColl();
    count(c.id) ? openCard(c.id) : closeCard();
  };
}
function closeCard() { $("cardModal").classList.remove("on"); }
$("cardModal").addEventListener("click", e => { if (e.target.id === "cardModal") closeCard(); });
// effet 3D + reflet holographique en bougeant la souris sur la carte
$("zoom").addEventListener("pointermove", e => {
  const r = $("zoom").getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
  $("tilt").style.transform = `rotateY(${(px - .5) * 24}deg) rotateX(${(.5 - py) * 24}deg)`;
  $("holo").style.setProperty("--hx", px * 100 + "%"); $("holo").style.setProperty("--hy", py * 100 + "%");
});
$("zoom").addEventListener("pointerleave", () => $("tilt").style.transform = "");

// ===== Sauvegarde / stats =====
function renderOpt() {
  const perSet = SET_IDS.map(s => `${setName(s)} : ${CARDS.filter(c => c.set === s && count(c.id)).length} / ${CARDS.filter(c => c.set === s).length}`);
  const perTier = TIERS.map((t, k) => `<span style="color:var(--t${k})">${t.icon} ${t.name}</span> : ${BY_TIER[k].filter(c => count(c.id)).length} / ${BY_TIER[k].length}`);
  $("stats").innerHTML = [
    `Boosters ouverts : <b>${S.opened}</b>`,
    `Cartes vendues : <b>${S.sold}</b>`,
    `Tours de roue : <b>${S.spins}</b>`,
    `Objets de déco : <b>${Object.keys(S.decor).length} / ${DECOR.length}</b>`,
    ...perTier, ...perSet,
  ].map(x => `<div>${x}</div>`).join("");
}
function exportSave() {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(S)], { type: "application/json" }));
  a.download = `sauvegarde-pokemon-${today()}.json`; a.click();
  toast("💾 Sauvegarde exportée (regarde dans tes Téléchargements)");
}
function importSave() {
  if (!confirm("Charger une sauvegarde ? La partie actuelle sur cet appareil sera remplacée.")) return;
  $("importFile").click();
}
$("exportBtn").onclick = $("hdrExport").onclick = exportSave;
$("importBtn").onclick = $("hdrImport").onclick = importSave;
$("importFile").onchange = async e => {
  try {
    const d = JSON.parse(await e.target.files[0].text());
    if (typeof d.points !== "number" || typeof d.owned !== "object" || !d.decor) throw 0;
    S = Object.assign(newSave(), d); save(); refreshTab(); toast("Sauvegarde chargée !");
  } catch { alert("Ce fichier n'est pas une sauvegarde valide."); }
  e.target.value = "";
};
$("resetBtn").onclick = () => { if (confirm("Tout effacer et recommencer ? Ta collection et ta chambre seront perdues !")) { S = newSave(); save(); refreshTab(); } };

// ===== Onglets =====
let tab = "room";
document.querySelectorAll("nav button").forEach(b => b.onclick = () => showTab(b.dataset.tab));
function showTab(t) {
  tab = t;
  if (t !== "coll") { SELL.on = false; SELL.sel = {}; }
  document.querySelectorAll("nav button").forEach(x => x.classList.toggle("on", x.dataset.tab === t));
  document.querySelectorAll("section").forEach(s => s.classList.toggle("on", s.id === t));
  refreshTab();
}
function refreshTab() {
  renderHeader();
  if (tab === "room") renderRoom();
  if (tab === "shop") { renderShop(); $("shopTalk").textContent = rnd(TALK); }
  if (tab === "coll") renderColl();
  if (tab === "opt") renderOpt();
}
refreshTab();
if (migrated) toast(`Nouvelle version : 500 cartes ! Ta déco est gardée et tes anciennes cartes ont été converties : tu as ${S.points} points.`);
