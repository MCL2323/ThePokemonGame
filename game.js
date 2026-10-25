// ===== Réglages du jeu (modifiables) =====
const SELL_RATIO = 0.5;     // une carte se revend à 50 % de sa valeur
const START_POINTS = 300;   // points au tout début

const TIER_VALUES = [10, 20, 50, 200, 500];      // Commune, Peu commune, Rare, Ultra rare, Secrète
const TIER_ICONS = ["●", "◆", "★", "★★", "★★★"];

// Prix d'un booster selon l'extension (les autres : PACK_PRICE)
const PACK_PRICE = 50;
const SET_PRICES = { "sv03.5": 100, "sv08.5": 80, "me02.5": 90, "30th": 100 };
// God Packs : seulement dans ces extensions, toutes les cartes sont ultra rares ou secrètes
const GOD_SETS = ["sv03.5", "sv08.5"];
const GOD_CHANCE = 0.02; // 2 % = environ 1 booster sur 50

// Un booster = 10 emplacements ; chaque emplacement = chances de tirer chaque rareté
// [Commune, Peu commune, Rare, Ultra rare, Secrète]
const C = [1, 0, 0, 0, 0], U = [0, 1, 0, 0, 0];
const REVERSE = [50, 30, 15, 4, 1];
const RARE = [0, 0, 80, 16, 4];
const rep = (slot, n) => Array(n).fill(slot);
const PACK_SLOTS = [...rep(C, 5), ...rep(U, 3), REVERSE, RARE];
// booster « 30 Jahre » : 5 cartes, dont 1 Pikachu du jubilé (une des 30 illustrations de Pikachu) et 1 rare
const PIKA = "pika";
const PACK30_SLOTS = [C, C, [60, 0, 30, 8, 2], PIKA, [0, 0, 65, 28, 7]];

// Les produits en boîte (vitrine du magasin)
const BOXES = [
  { id: "bundle", perSet: true, packs: 6, promo: null, acc: [], price: p => Math.round(6 * p * 0.9 / 5) * 5,
    name: { fr: "Bundle de boosters", de: "Booster-Bundle", en: "Booster Bundle" },
    desc: { fr: "6 boosters dans leur banderole (10 % moins cher)", de: "6 Booster in einer Banderole (10 % billiger)", en: "6 boosters in a sleeve (10% cheaper)" } },
  { id: "tin", perSet: true, packs: 2, promo: 2, acc: ["tincoin"], price: p => 2 * p + 30,
    name: { fr: "Mini-Tin", de: "Mini-Tin", en: "Mini Tin" },
    desc: { fr: "Boîte en métal : 2 boosters + 1 carte promo Rare + 1 pièce", de: "Metalldose: 2 Booster + 1 seltene Promo-Karte + 1 Münze", en: "Metal tin: 2 boosters + 1 Rare promo card + 1 coin" } },
  { id: "etb", perSet: true, packs: 9, promo: 3, acc: ["dice", "sleeves"], price: p => Math.round(9 * p * 0.85 / 5) * 5 + 40,
    name: { fr: "Coffret Dresseur d'élite", de: "Top-Trainer-Box", en: "Elite Trainer Box" },
    desc: { fr: "9 boosters + 1 promo Ultra rare + dés + protège-cartes", de: "9 Booster + 1 ultra seltene Promo + Würfel + Kartenhüllen", en: "9 boosters + 1 Ultra rare promo + dice + sleeves" } },
  { id: "anniv30", perSet: false, packs: 9, promo: 4, acc: ["dice", "sleeves", "coin"], gift: "figGold", price: () => 750,
    name: { fr: "Coffret 30e anniversaire", de: "Box zum 30. Jubiläum", en: "30th Anniversary Box" },
    desc: { fr: "9 boosters « 30ᵉ Anniversaire » (5 cartes chacun, avec un Pikachu du jubilé) + 1 promo Secrète + pièce dorée + figurine Pikachu dorée !", de: "9 „30 Jahre“-Booster (je 5 Karten, mit Jubiläums-Pikachu) + 1 geheime Promo + goldene Münze + goldene Pikachu-Figur!", en: "9 “30th Celebration” boosters (5 cards each, with an anniversary Pikachu) + 1 Secret promo + gold coin + golden Pikachu figure!" } },
];
const ACC_ICONS = { dice: "🎲", sleeves: "🛡️", coin: "🪙", tincoin: "🥈" };

const SET_COLORS = {
  "swsh1": ["#1f5fae", "#c0392b"], "swsh3": ["#2b0f0f", "#e8590c"], "swsh4": ["#e0a800", "#e67e22"],
  "swsh7": ["#0b6e4f", "#2ecc71"], "swsh9": ["#1b1f4a", "#7f8cff"], "swsh12.5": ["#6b4f00", "#ffd23f"],
  "sv01": ["#b0182b", "#6a1fb0"], "sv03.5": ["#e3350d", "#2a75bb"], "sv08.5": ["#6a3fb5", "#f8a5c2"], "me01": ["#14213d", "#00b4d8"],
  "me02.5": ["#3a0d5c", "#ff8a00"], "30th": ["#1a1a1a", "#d4a000"],
};

// La roue du jour (w = poids : plus il est grand, plus la case est grande)
const WHEEL = [
  { kind: "pts", n: 50,   w: 20, color: "#4fa3ff" },
  { kind: "booster", n: 1, w: 16, label: "wl.booster", color: "#3fbf6f" },
  { kind: "pts", n: 100,  w: 18, color: "#f2b705" },
  { kind: "card", tier: 2, w: 11, label: "wl.rare", color: "#c77dff" },
  { kind: "pts", n: 200,  w: 12, color: "#ff7a3d" },
  { kind: "booster", n: 2, w: 7, label: "wl.two", color: "#2a9d8f" },
  { kind: "pts", n: 500,  w: 6,  color: "#e5484d" },
  { kind: "card", tier: 3, w: 4, label: "wl.ultra", color: "#7b2cbf" },
  { kind: "pts", n: 1000, w: 2,  color: "#111" },
];

// Déco : prix bas pour donner envie d'acheter
const DECOR = [
  { id: "bureau",   kind: "meuble", price: 150, emo: "🪵", name: { fr: "Table en bois", de: "Holztisch", en: "Wooden table" },
    desc: { fr: "Une vraie table pour ouvrir tes boosters comme un pro.", de: "Ein echter Tisch, um Booster wie ein Profi zu öffnen.", en: "A real table to open your boosters like a pro." } },
  { id: "tapis",    kind: "meuble", price: 100, emo: "🟦", req: "bureau", name: { fr: "Tapis de jeu Pokémon", de: "Pokémon-Spielmatte", en: "Pokémon playmat" },
    desc: { fr: "Un vrai tapis de jeu avec les zones Actif, Banc, Récompenses… Tes cartes seront ouvertes dessus.", de: "Eine echte Spielmatte mit Aktiv-, Bank- und Preiskarten-Zonen… Deine Karten werden darauf geöffnet.", en: "A real playmat with Active, Bench and Prize zones… Your cards will be opened on it." } },
  { id: "lampe",    kind: "meuble", price: 80, emo: "💡", req: "bureau", name: { fr: "Lampe de bureau", de: "Schreibtischlampe", en: "Desk lamp" },
    desc: { fr: "Une belle lumière pour admirer les cartes brillantes.", de: "Schönes Licht, um glänzende Karten zu bewundern.", en: "Nice light to admire shiny cards." } },
  { id: "etagere",  kind: "meuble", price: 120, emo: "📚", name: { fr: "Étagère murale", de: "Wandregal", en: "Wall shelf" },
    desc: { fr: "Indispensable pour exposer figurines et statuettes Pop.", de: "Unverzichtbar, um Figuren und Pop-Figuren auszustellen.", en: "A must to display figures and Pop figures." } },
  { id: "poster",   kind: "meuble", price: 60, emo: "🖼️", name: { fr: "Poster Lugia", de: "Lugia-Poster", en: "Lugia poster" },
    desc: { fr: "Un grand poster pour le mur.", de: "Ein großes Poster für die Wand.", en: "A big poster for the wall." } },
  { id: "papier",   kind: "meuble", price: 120, emo: "🎨", name: { fr: "Papier peint Poké Ball", de: "Poké-Ball-Tapete", en: "Poké Ball wallpaper" },
    desc: { fr: "Des Poké Balls sur tous les murs !", de: "Poké Bälle an allen Wänden!", en: "Poké Balls on every wall!" } },
  { id: "tapisSol", kind: "meuble", price: 80, emo: "⭕", name: { fr: "Tapis de sol", de: "Teppich", en: "Rug" },
    desc: { fr: "Un grand tapis rond et coloré.", de: "Ein großer, runder, bunter Teppich.", en: "A big, round, colorful rug." } },
  { id: "plante",   kind: "meuble", price: 40, emo: "🪴", name: { fr: "Plante verte", de: "Grünpflanze", en: "Plant" },
    desc: { fr: "Un peu de nature dans la chambre.", de: "Ein bisschen Natur im Zimmer.", en: "A bit of nature in the room." } },
  { id: "rideaux", kind: "deko", price: 40, name: { fr: "Rideaux", de: "Vorhänge", en: "Curtains" },
    desc: { fr: "De jolis rideaux rouges pour la fenêtre.", de: "Schöne rote Vorhänge für das Fenster.", en: "Nice red curtains for the window." },
    r3: { mount: "lwall", w: 36, h: 32, def: { z: -30, y: 14 } }, draw: () => `<div class="curtains"><i></i><i></i></div>` },
  { id: "horloge", kind: "deko", price: 50, name: { fr: "Horloge Poké Ball", de: "Poké-Ball-Uhr", en: "Poké Ball clock" },
    desc: { fr: "Une horloge murale qui donne la vraie heure !", de: "Eine Wanduhr, die die echte Uhrzeit zeigt!", en: "A wall clock that shows the real time!" },
    r3: { mount: "wall", w: 6, def: { x: -14, y: 44 } }, draw: clockHTML },
  { id: "guirlande", kind: "deko", price: 60, name: { fr: "Guirlande lumineuse", de: "Lichterkette", en: "Fairy lights" },
    desc: { fr: "Des petites lumières de toutes les couleurs.", de: "Kleine bunte Lichter.", en: "Little colorful lights." },
    r3: { mount: "wall", w: 100, h: 5, def: { x: 0, y: 56 } }, draw: () => `<div class="lights">${Array.from({ length: 22 }, (_, i) => `<i style="--d:${i * 0.17}s;--c:${["#ff4d6d", "#ffcb05", "#3fbf6f", "#4fa3ff", "#c77dff"][i % 5]}"></i>`).join("")}</div>` },
  { id: "posterPika", kind: "deko", price: 60, name: { fr: "Poster Pikachu", de: "Pikachu-Poster", en: "Pikachu poster" },
    desc: { fr: "Un poster de Pikachu pour le mur.", de: "Ein Pikachu-Poster für die Wand.", en: "A Pikachu poster for the wall." },
    r3: { mount: "wall", w: 10, h: 17, def: { x: 44, y: 24 } }, draw: () => posterHTML(25, "PIKACHU", "#ffcb05", "#f08030") },
  { id: "posterGlurak", kind: "deko", price: 60, name: { fr: "Poster Dracaufeu", de: "Glurak-Poster", en: "Charizard poster" },
    desc: { fr: "Un poster de Dracaufeu pour le mur.", de: "Ein Glurak-Poster für die Wand.", en: "A Charizard poster for the wall." },
    r3: { mount: "wall", w: 10, h: 17, def: { x: -43, y: 24 } }, draw: () => posterHTML(6, "GLURAK", "#e8590c", "#7a1d00") },
  { id: "neon", kind: "deko", price: 150, name: { fr: "Enseigne néon", de: "Neon-Schild", en: "Neon sign" },
    desc: { fr: "Un néon « Pokémon » qui brille sur le mur.", de: "Ein leuchtendes „Pokémon“-Neonschild für die Wand.", en: "A glowing “Pokémon” neon sign for the wall." },
    r3: { mount: "wall", w: 24, h: 7, def: { x: -4, y: 48 } }, draw: () => `<div class="neon">Pokémon</div>` },
  { id: "cadre", kind: "deko", price: 180, name: { fr: "Cadre « Ma meilleure carte »", de: "Rahmen „Meine beste Karte“", en: "“My best card” frame" },
    desc: { fr: "Un cadre au mur qui montre automatiquement ta carte la plus rare !", de: "Ein Bilderrahmen, der automatisch deine seltenste Karte zeigt!", en: "A wall frame that automatically shows your rarest card!" },
    r3: { mount: "wall", w: 6, h: 13, def: { x: 3, y: 25 } }, draw: frameHTML },
  { id: "tele", kind: "deko", price: 200, name: { fr: "Télé + console", de: "Fernseher + Konsole", en: "TV + console" },
    desc: { fr: "Une télé avec une console de jeu.", de: "Ein Fernseher mit Spielkonsole.", en: "A TV with a game console." },
    r3: { mount: "floor", w: 20, h: 18, def: { x: -36, z: -48 } }, draw: () => `<div class="tv"><div class="screen"><img src="art/25.png" alt=""></div><div class="stand"></div><div class="console"></div></div>` },
  { id: "pouf", kind: "deko", price: 90, name: { fr: "Pouf Poké Ball", de: "Poké-Ball-Sitzsack", en: "Poké Ball beanbag" },
    desc: { fr: "Un gros pouf tout mou en forme de Poké Ball.", de: "Ein großer, weicher Sitzsack wie ein Poké Ball.", en: "A big soft Poké Ball beanbag." },
    r3: { mount: "floor", w: 15, h: 13, def: { x: 34, z: -10 } }, draw: () => `<div class="beanbag"></div>` },
  { id: "plushPika", kind: "deko", price: 60, art: 25, name: { fr: "Peluche Pikachu", de: "Pikachu-Kuscheltier", en: "Pikachu plush" },
    desc: { fr: "Une peluche Pikachu toute douce.", de: "Ein ganz weiches Pikachu-Kuscheltier.", en: "A super soft Pikachu plush." },
    r3: { mount: "floor", w: 8, def: { x: -38, z: -9 } }, draw: () => `<div class="plush"><img src="art/25.png" alt=""></div>` },
  { id: "plushEvoli", kind: "deko", price: 60, art: 133, name: { fr: "Peluche Évoli", de: "Evoli-Kuscheltier", en: "Eevee plush" },
    desc: { fr: "Une peluche Évoli toute douce.", de: "Ein ganz weiches Evoli-Kuscheltier.", en: "A super soft Eevee plush." },
    r3: { mount: "floor", w: 7, def: { x: -30, z: -7 } }, draw: () => `<div class="plush"><img src="art/133.png" alt=""></div>` },
  { id: "plushRelaxo", kind: "deko", price: 150, art: 143, name: { fr: "Peluche géante Ronflex", de: "Riesen-Relaxo-Kuscheltier", en: "Giant Snorlax plush" },
    desc: { fr: "Une peluche Ronflex géante pour faire la sieste.", de: "Ein riesiges Relaxo-Kuscheltier zum Kuscheln.", en: "A giant Snorlax plush for naps." },
    r3: { mount: "floor", w: 13, def: { x: 34, z: -10.6, e: 6 } }, draw: () => `<div class="plush"><img src="art/143.png" alt=""></div>` },
  { id: "fig1",   kind: "figurine", art: 1,   price: 50, req: "etagere", name: { fr: "Bulbizarre", de: "Bisasam", en: "Bulbasaur" } },
  { id: "fig4",   kind: "figurine", art: 4,   price: 50, req: "etagere", name: { fr: "Salamèche", de: "Glumanda", en: "Charmander" } },
  { id: "fig7",   kind: "figurine", art: 7,   price: 50, req: "etagere", name: { fr: "Carapuce", de: "Schiggy", en: "Squirtle" } },
  { id: "fig133", kind: "figurine", art: 133, price: 50, req: "etagere", name: { fr: "Évoli", de: "Evoli", en: "Eevee" } },
  { id: "fig448", kind: "figurine", art: 448, price: 70, req: "etagere", name: { fr: "Lucario", de: "Lucario", en: "Lucario" } },
  { id: "figGold", kind: "figurine", art: 25, price: 0, special: true, gold: true, name: { fr: "Pikachu doré", de: "Goldener Pikachu", en: "Golden Pikachu" } },
  { id: "pop25",  kind: "pop", art: 25,  price: 120, color: "#ffcb05", req: "etagere", name: { fr: "Pikachu", de: "Pikachu", en: "Pikachu" } },
  { id: "pop143", kind: "pop", art: 143, price: 120, color: "#3b8ea5", req: "etagere", name: { fr: "Ronflex", de: "Relaxo", en: "Snorlax" } },
  { id: "pop94",  kind: "pop", art: 94,  price: 140, color: "#7b4fa0", req: "etagere", name: { fr: "Ectoplasma", de: "Gengar", en: "Gengar" } },
  { id: "pop6",   kind: "pop", art: 6,   price: 180, color: "#f08030", req: "etagere", name: { fr: "Dracaufeu", de: "Glurak", en: "Charizard" } },
  { id: "pop150", kind: "pop", art: 150, price: 200, color: "#b07cc6", req: "etagere", name: { fr: "Mewtwo", de: "Mewtu", en: "Mewtwo" } },
  { id: "pop151", kind: "pop", art: 151, price: 200, color: "#f8a5c2", req: "etagere", name: { fr: "Mew", de: "Mew", en: "Mew" } },
];
DECOR.forEach(d => {
  if (d.desc) return;
  const n = d.name;
  d.desc = d.kind === "pop"
    ? { fr: `Statuette Pop de ${n.fr} dans sa boîte.`, de: `Pop-Figur von ${n.de} in ihrer Box.`, en: `${n.en} Pop figure in its box.` }
    : { fr: `Figurine de ${n.fr} à poser où tu veux.`, de: `Figur von ${n.de} zum Hinstellen, wo du willst.`, en: `${n.en} figure to put wherever you like.` };
});

const SAVE_KEY = "pokecollection-save-v3";
const N = CARDS.length;
const SET_IDS = Object.keys(SETS);
// extensions vendues en booster (les reprints ne se vendent pas en booster)
const PACK_SET_IDS = SET_IDS.filter(s => !SETS[s].noPack);
const BY_ID = Object.fromEntries(CARDS.map(c => [c.id, c]));
const BY_TIER = TIER_VALUES.map((_, t) => CARDS.filter(c => c.tier === t));
const BY_SET_TIER = Object.fromEntries(SET_IDS.map(s => [s, TIER_VALUES.map((_, t) => CARDS.filter(c => c.set === s && c.tier === t && c.rar !== "Pikachu Rare" && c.rar !== "RGB Rare"))]));
const PIKA_POOL = CARDS.filter(c => c.rar === "Pikachu Rare");
// les 3 Mew RGB (rouge, vert, bleu) : 1 chance sur 500 par booster 30 Jahre
const RGB_POOL = CARDS.filter(c => c.rar === "RGB Rare");
const RGB_CHANCE = 1 / 500;
// les 30 reprints de la Collection Classique : petite chance (1 booster 30 Jahre sur 10)
const REPRINT_POOL = CARDS.filter(c => c.set === "30th-c");
const REPRINT_CHANCE = 1 / 10;
const BX = Object.fromEntries(BOXES.map(b => [b.id, b]));
const DC = Object.fromEntries(DECOR.map(d => [d.id, d]));
const $ = id => document.getElementById(id);
const hd = c => c.svg ? `cartes/hd/${c.id}.svg` : `cartes/hd/${c.id}.webp`;
const mini = c => c.svg ? `cartes/hd/${c.id}.svg` : `cartes/mini/${c.id}.webp`;
const rnd = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const packPrice = s => SET_PRICES[s] || PACK_PRICE;
const boxPrice = (bid, s) => BX[bid].price(s ? packPrice(s) : PACK_PRICE);

// ===== Sauvegarde (la partie ET les réglages) =====
function defaultLang() { const l = (navigator.language || "fr").slice(0, 2); return LANGS[l] ? l : "fr"; }
function newSave() { return { points: START_POINTS, owned: {}, packs: {}, boxes: {}, decor: {}, pos: {}, pos3: {}, gallery: {}, acc: {}, lastSpin: null, spins: 0, opened: 0, boxesOpened: 0, godPacks: 0, sold: 0, settings: { lang: defaultLang(), sound: true } }; }
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
      for (const n of Object.values(old.packs || {})) for (let i = 0; i < n; i++) { const s = rnd(PACK_SET_IDS); S.packs[s] = (S.packs[s] || 0) + 1; }
    }
  } catch {}
}
function normalize(s) {
  s = Object.assign(newSave(), s);
  s.settings = Object.assign(newSave().settings, s.settings || {});
  // anciens boosters « extension|qualité » → un seul type de booster par extension
  const packs = {};
  for (const [k, n] of Object.entries(s.packs)) { const set = k.split("|")[0]; if (SETS[set] && n > 0) packs[set] = (packs[set] || 0) + n; }
  s.packs = packs;
  // anciens coffrets : le « mini coffret » devient un Mini-Tin
  const boxes = {};
  for (const [k, n] of Object.entries(s.boxes)) {
    const [b, set] = k.split("|"), nb = b === "mini" ? "tin" : b;
    if (BX[nb] && n > 0) { const key = BX[nb].perSet ? `${nb}|${set}` : nb; boxes[key] = (boxes[key] || 0) + n; }
  }
  s.boxes = boxes;
  return s;
}
S = normalize(S);
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch {} }
save();

// ===== Langue =====
const lang = () => S.settings.lang;
function t(key, vars = {}) {
  let s = I18N[lang()][key] ?? I18N.fr[key] ?? key;
  if (typeof s === "function") return s(vars);
  if (typeof s !== "string") return s;
  return s.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m);
}
const L = obj => obj[lang()] ?? obj.fr;
const cardName = c => lang() === "de" ? c.name : (c.n[lang()] || c.name);
const setName = s => SETS[s].names[lang()];
const logo = s => lang() === "de" ? `logos/${s}.png` : `logos/${lang()}/${s}.png`;
const logoImg = (s, cls = "plogo") => s === "30th" ? `<span class="logo30 ${cls}">30<small>${setName(s)}</small></span>`
  : `<img class="${cls}" src="${logo(s)}" onerror="this.onerror=null;this.src='logos/${s}.png'" alt="${setName(s)}">`;
const tierName = k => t("tiers")[k];
const catName = c => t("cats")[c];

// ===== Petites fonctions =====
const today = () => new Date().toLocaleDateString("sv"); // AAAA-MM-JJ
const count = id => S.owned[id] || 0;
const has = k => !!S.decor[k];
const ownedCount = () => CARDS.filter(c => count(c.id) > 0).length;
const sellPrice = c => Math.round(TIER_VALUES[c.tier] * SELL_RATIO);
const packsLeft = () => Object.values(S.packs).reduce((a, b) => a + b, 0);
const addPack = set => S.packs[set] = (S.packs[set] || 0) + 1;
const boxLabel = key => { const [b, s] = key.split("|"); return L(BX[b].name) + (s ? ` ${setName(s)}` : ""); };

function toast(msg) { const el = $("toast"); el.innerHTML = msg; el.classList.add("on"); clearTimeout(el._h); el._h = setTimeout(() => el.classList.remove("on"), 2800); }
// le premier clic débloque le son (règle des navigateurs)
// on réessaie à chaque geste tant que le son n'est pas actif (sur téléphone, seuls certains gestes comptent)
["pointerup", "touchend", "click", "keydown"].forEach(ev => document.addEventListener(ev, () => { if (!SFX.running()) SFX.unlock(); }, { passive: true }));
// en revenant dans le jeu (téléphone verrouillé, autre appli…), on relance le son
document.addEventListener("visibilitychange", () => { if (!document.hidden) SFX.unlock(); });
document.addEventListener("click", e => { if (e.target.closest("button")) SFX.click(); });

// ===== Petits morceaux d'affichage =====
// un booster réaliste : bords sertis, logo de l'extension, grande illustration, reflet métallisé
function packHTML(set) {
  if (set === "30th") return `<div class="pack realpack"><img src="art/booster30.png" alt="30 Jahre"><div class="sheen"></div></div>`;
  const [c1, c2] = SET_COLORS[set] || ["#2a75bb", "#7cc4ff"];
  return `<div class="pack" style="--c1:${c1};--c2:${c2}"><div class="pbg"></div><div class="prays"></div>
    <div class="ptop"><div class="pbrand">Pokémon</div><div class="ptcg">TRADING CARD GAME</div></div><div class="page">6+</div>
    <img class="part" src="art/${SETS[set].art}.png" alt="">${logoImg(set)}
    <div class="pfoot"><b>10</b>${t("pack.cards")}</div><div class="foil"></div><div class="sheen"></div></div>`;
}
// les produits en boîte
// ----- Boîtes en 3D : chaque boîte est faite de pavés (cuboïdes) à 6 faces -----
// tailles en unités (1 unité = 1 % de la largeur de la scène) ; x, y, z = décalage depuis le centre
function cuboid(cls, w, h, d, faces, x = 0, y = 0, z = 0) {
  const f = ["front", "back", "right", "left", "top", "bottom"].map(k => faces[k] === null ? "" : `<div class="f ${k}">${faces[k] || ""}</div>`).join("");
  return `<div class="cuboid ${cls}" style="--w:${w};--h:${h};--d:${d};--x:${x};--y:${y};--z:${z}">${f}</div>`;
}
// un booster vu comme une feuille plate dans l'espace (pour l'intérieur des boîtes)
const packPlane = (set, i, x, y, z, w = 34) => `<div class="pplane" style="--i:${i};--x:${x};--y:${y};--z:${z};--pw:${w}">${packHTML(set)}</div>`;
function boxHTML(bid, set) {
  const [c1, c2] = set ? SET_COLORS[set] : ["#2a75bb", "#7cc4ff"];
  const art = set ? SETS[set].art : 25;
  const ps = set || SET_IDS[0];
  const lg = set ? logoImg(set, "lidlogo") : `<span class="genlogo">Pokémon</span>`;
  const brand = `<span class="brandv">Pokémon</span>`;
  let parts;
  if (bid === "tin") {
    // boîte en métal : corps bas et large, couvercle à charnière avec le dessin en relief
    const emb = `<div class="emboss" style="background:linear-gradient(150deg,${c1},${c2})"><img class="part" src="art/${art}.png" alt="">${lg}</div>`;
    parts = cuboid("body metal", 70, 30, 46, { front: `<span class="stamp">Pokémon</span>`, top: "", bottom: "" }, 0, 12)
      + packPlane(ps, 0, -9, 12, -6, 18) + packPlane(ps, 1, 9, 12, 6, 18)
      + cuboid("lid metal", 73, 8, 49, { top: emb, bottom: "" }, 0, -5.5);
  } else if (bid === "bundle") {
    // 6 boosters empilés + une banderole en carton autour
    parts = [0, 1, 2, 3, 4, 5].map(i => packPlane(ps, i, 0, -4, -12 + i * 4.8, 44)).join("")
      + cuboid("sleeve", 48, 20, 30, { front: `${lg}<b>6 × BOOSTER</b>`, back: `<b>6 × BOOSTER</b>`, right: brand, left: brand, top: null, bottom: null }, 0, 16);
  } else {
    // carton : Top-Trainer-Box ou coffret 30 ans (corps ouvert en haut + couvercle)
    const gold = bid === "anniv30";
    const front = gold
      ? `<div class="big30">30</div><img class="part" src="art/25.png" alt=""><div class="fname">${L(BX.anniv30.name)}</div>`
      : `<img class="part" src="art/${art}.png" alt=""><div class="fname">${L(BX.etb.name)}</div>`;
    const lidTop = gold ? `<div class="lid30"><b>30</b><span>1996 – 2026</span></div>` : lg;
    const lidFront = gold ? `<span class="lidtxt">★ 1996 – 2026 ★</span>` : `<span class="lidtxt">${L(BX.etb.name)}</span>`;
    parts = cuboid("body cbx", 56, 58, 30, { front, back: brand, right: brand, left: brand, top: `<div class="boxinside"></div>`, bottom: "" }, 0, 8)
      + [0, 1, 2, 3].map(i => packPlane(gold ? "30th" : ps, i, -12 + i * 8, 9, -8 + i * 5)).join("")
      + cuboid("lid cbx", 59, 18, 33, { front: lidFront, back: lidFront, right: "", left: "", top: lidTop, bottom: null }, 0, -15);
  }
  return `<div class="scene3d b3-${bid} ${bid === "anniv30" ? "s30" : ""}" style="--c1:${c1};--c2:${c2}"><div class="obj3d">${parts}</div></div>`;
}
// présentoir de boosters (carton ouvert avec des boosters dedans)
function displayHTML(set) {
  const [c1, c2] = SET_COLORS[set];
  const pk = packHTML(set);
  return `<div class="display" style="--c1:${c1};--c2:${c2}"><div class="dpacks"><div>${pk}</div><div>${pk}</div><div>${pk}</div><div>${pk}</div></div><div class="dfront">${logoImg(set, "dlogo")}</div>${GOD_SETS.includes(set) ? `<div class="godsticker">✨ God Packs</div>` : ""}</div>`;
}
function posterHTML(art, label, c1, c2) { return `<div class="poster" style="background:linear-gradient(160deg,${c1},${c2})"><b>${label}</b><img src="art/${art}.png" alt=""><b>★ ★ ★</b></div>`; }
function clockHTML() {
  const d = new Date(), h = (d.getHours() % 12 + d.getMinutes() / 60) * 30, m = d.getMinutes() * 6;
  return `<div class="pclock"><i class="hh" style="transform:rotate(${h}deg)"></i><i class="mm" style="transform:rotate(${m}deg)"></i></div>`;
}
function frameHTML() {
  const best = CARDS.filter(c => count(c.id)).sort((a, b) => b.tier - a.tier)[0];
  return `<div class="cframe">${best ? `<img src="${mini(best)}" alt="">` : `<div class="cardback"></div>`}</div>`;
}
// statuette Pop sortie de sa boîte (pour la chambre : on voit le mur derrière)
function popFigHTML(d) { return `<div class="popfig" title="${L(d.name)}"><img src="art/${d.art}.png" alt=""><div class="popbase">POP!</div></div>`; }
function figHTML(d) { return `<div class="figurine ${d.gold ? "golden" : ""}" title="${L(d.name)}"><img src="art/${d.art}.png" alt=""></div>`; }
function popHTML(d) { return `<div class="pop" style="--popc:${d.color}" title="${L(d.name)}"><div class="win"><img src="art/${d.art}.png" alt=""></div><div class="lbl">${L(d.name)}<small>POP! Vinyl</small></div></div>`; }
function decorVisual(d) {
  if (d.kind === "figurine") return figHTML(d);
  if (d.kind === "pop") return popHTML(d);
  if (d.id === "bureau") return `<div class="minitable"><div class="top"></div><i></i><i></i></div>`;
  if (d.id === "tapis") return `<div class="minimat">${matZones()}</div>`;
  if (d.draw) return `<div class="decoprev d-${d.id}">${d.draw()}</div>`;
  return `<div class="emo">${d.emo}</div>`;
}
function chips(c) {
  return `<div class="badges">${c.mech ? `<span class="chip mech">${c.mech}</span>` : "<span></span>"}<span class="chip" style="background:var(--t${c.tier})" title="${tierName(c.tier)}">${TIER_ICONS[c.tier]}</span></div>`;
}
function tileHTML(c, opts = {}) {
  if (!opts.force && !count(c.id))
    return `<div class="tile missing" title="${t("coll.missing")}"><div class="cardback"><div class="lab">${setName(c.set)}<br>n° ${c.num}</div></div></div>`;
  const q = !opts.force && count(c.id) > 1 ? `<div class="qty">×${count(c.id)}</div>` : "";
  const n = opts.isNew ? `<div class="newb">${t("newBadge")}</div>` : "";
  const sel = opts.sel ? `<div class="selb">🏷️ ${opts.sel}${count(c.id) > 1 ? ` / ${count(c.id)}` : ""}</div>` : "";
  return `<div class="tile t${c.tier} ${opts.sel ? "picked" : ""}" data-id="${c.id}">${q}${n}${sel}<img loading="lazy" src="${mini(c)}" alt="${cardName(c)}">${chips(c)}</div>`;
}
// le tapis de jeu : zones dessinées comme sur un vrai playmat
function matZones() {
  const m = t("mat");
  const slot = (cls, label = "") => `<div class="z ${cls}"><span>${label}</span></div>`;
  return `<div class="matart"></div><div class="matball"></div>
    <div class="zprize">${slot("p", m.prize)}${slot("p")}${slot("p")}${slot("p")}${slot("p")}${slot("p")}</div>
    ${slot("zactive", m.active)}
    <div class="zbench">${slot("b", m.bench)}${slot("b")}${slot("b")}${slot("b")}${slot("b")}</div>
    <div class="zright">${slot("d", m.deck)}${slot("d", m.discard)}</div>`;
}

// ===== Langue et sons : application =====
function applyStatic() {
  document.documentElement.lang = lang();
  document.querySelectorAll("[data-t]").forEach(el => el.innerHTML = t(el.dataset.t));
  document.querySelectorAll("[data-t-ph]").forEach(el => el.placeholder = t(el.dataset.tPh));
  const opts = Object.entries(LANGS).map(([k, v]) => `<option value="${k}" ${k === lang() ? "selected" : ""}>${v}</option>`).join("");
  $("langSel").innerHTML = opts; $("optLang").innerHTML = opts;
  $("soundBtn").textContent = S.settings.sound ? "🔊" : "🔇";
  $("optSound").textContent = S.settings.sound ? "🔊 " + t("opt.on") : "🔇 " + t("opt.off");
  $("rules").innerHTML = t("rules").map(r => `<li>${r.replace("{N}", N)}</li>`).join("");
  fillFilters();
  SFX.setEnabled(S.settings.sound);
}
function setLang(l) { S.settings.lang = l; save(); applyStatic(); refreshTab(); }
$("langSel").onchange = e => setLang(e.target.value);
$("optLang").onchange = e => setLang(e.target.value);
function toggleSound() { S.settings.sound = !S.settings.sound; save(); applyStatic(); if (S.settings.sound) SFX.coin(); }
$("soundBtn").onclick = toggleSound;
$("optSound").onclick = toggleSound;

// ===== En-tête =====
function renderHeader() {
  $("points").textContent = S.points;
  const n = ownedCount();
  $("bar").style.width = (n / N * 100) + "%";
  $("barText").textContent = t("cardsCount", { n, N });
  const can = S.lastSpin !== today();
  $("wheelBtn").disabled = !can;
  $("wheelBtn").classList.toggle("pulse", can);
  $("wheelBtn").textContent = can ? t("wheel.btn") : t("wheel.tomorrow");
  if ($("regScreen")) $("regScreen").textContent = S.points;
}

// ===== Roue du jour =====
const WTOTAL = WHEEL.reduce((a, s) => a + s.w, 0);
const wLabel = s => s.kind === "pts" ? (s.n >= 1000 ? `${s.n} !` : `${s.n} pts`) : t(s.label);
let wheelAngle = 0;
function wheelSVG() {
  let a = 0, h = "";
  const pt = (deg, r) => [Math.sin(deg * Math.PI / 180) * r, -Math.cos(deg * Math.PI / 180) * r];
  WHEEL.forEach(s => {
    const a1 = a + s.w / WTOTAL * 360, mid = (a + a1) / 2;
    const [x0, y0] = pt(a, 100), [x1, y1] = pt(a1, 100);
    h += `<path d="M0 0 L${x0} ${y0} A100 100 0 ${a1 - a > 180 ? 1 : 0} 1 ${x1} ${y1} Z" fill="${s.color}" stroke="#fff" stroke-width="1.5"/>`;
    const fs = s.w >= 6 ? 9 : 7;
    h += `<text transform="rotate(${mid}) translate(0 -58) rotate(${mid > 180 ? 90 : -90})" font-size="${fs}" font-weight="bold" fill="#fff" text-anchor="middle" dominant-baseline="middle" style="paint-order:stroke" stroke="#0006" stroke-width="2">${wLabel(s)}</text>`;
    a = a1;
  });
  return `<svg viewBox="-104 -104 208 208" class="wheel" id="wheelSvg" style="transform:rotate(${wheelAngle}deg)"><circle r="103" fill="#222"/>${h}<circle r="14" fill="#fff" stroke="#222" stroke-width="3"/><circle r="5" fill="#e3350d"/></svg>`;
}
function openWheel() {
  const can = S.lastSpin !== today();
  $("wheelPanel").innerHTML = `
    <h2 style="margin:0">${t("wheel.title")}</h2>
    <p class="muted" style="margin:0">${t("wheel.sub")}</p>
    <div class="wheelwrap"><div class="wpointer"></div>${wheelSVG()}</div>
    <div id="wheelResult" style="min-height:30px"></div>
    <div style="display:flex;gap:10px"><button class="gold" id="spinBtn" ${can ? "" : "disabled"}>${can ? t("wheel.spin") : t("wheel.later")}</button><button id="wheelClose">${t("close")}</button></div>`;
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
  let html = "", firstPack = null, big = false;
  if (seg.kind === "pts") { S.points += seg.n; html = `<h3 style="margin:0">${t("wheel.pts", { n: seg.n })}</h3>`; big = seg.n >= 500; }
  if (seg.kind === "booster") {
    const sets = Array.from({ length: seg.n }, () => rnd(PACK_SET_IDS));
    sets.forEach(addPack); firstPack = sets[0];
    html = `<h3 style="margin:0">${t("wheel.pack", { name: sets.map(setName).join(" + ") })}</h3><p style="margin:4px 0">${t("wheel.waits")}</p><button class="gold" id="wOpen">${t("buy.openNow")}</button>`;
  }
  if (seg.kind === "card") {
    const pool = BY_TIER[seg.tier], missing = pool.filter(c => !count(c.id));
    const card = missing.length && Math.random() < 0.6 ? rnd(missing) : rnd(pool);
    const isNew = !count(card.id); S.owned[card.id] = count(card.id) + 1; big = true;
    html = `<h3 style="margin:0">${t("wheel.card", { label: t(seg.label), name: cardName(card) })}</h3><div style="width:180px;margin:8px auto">${tileHTML(card, { force: true, isNew })}</div>`;
  }
  S.lastSpin = today(); S.spins++; save();
  spinning = true;
  $("spinBtn").disabled = true; $("wheelClose").disabled = true;
  wheelAngle = wheelAngle - (wheelAngle % 360) + 360 * 6 + (360 - mid);
  $("wheelSvg").style.transform = `rotate(${wheelAngle}deg)`;
  // tic-tic de la roue qui ralentit
  let delay = 35, elapsed = 0;
  (function tickLoop() { if (elapsed > 4700) return; SFX.tick(); elapsed += delay; delay *= 1.09; setTimeout(tickLoop, delay); })();
  setTimeout(() => {
    spinning = false; $("wheelClose").disabled = false;
    $("spinBtn").textContent = t("wheel.later");
    $("wheelResult").innerHTML = html;
    big ? SFX.ultra() : SFX.win();
    if ($("wOpen")) $("wOpen").onclick = () => { $("wheelModal").classList.remove("on"); showTab("room"); startOpening(firstPack); };
    const tl = $("wheelResult").querySelector(".tile[data-id]"); if (tl) tl.onclick = () => openCard(tl.dataset.id);
    renderHeader(); refreshTab();
  }, 5200);
}

// ===== Les pièces en 3D (chambre et galerie) =====
// Pièce de 100 × 62,5 unités, profondeur 60 (1 unité = 1 % de la largeur de l'écran de la pièce).
// Un objet est posé : au sol (x, z, e = hauteur s'il est posé sur la table), à plat sur le sol (tapis),
// sur le mur du fond (x, y), ou sur le mur de gauche / droite (z, y).
const RW = 100, RD = 60;
let RH = 62.5, PERSP = 900;
function roomDims() { const st = getComputedStyle($("roomScene")); RH = parseFloat(st.getPropertyValue("--rh")) || 62.5; PERSP = parseFloat(st.perspective) || 900; }
function shellHTML(cls) {
  return `<div class="pl floor"></div><div class="pl ceil"><div class="ceillight"></div></div><div class="pl back"><div class="baseb"></div></div><div class="pl left"><div class="baseb"></div></div><div class="pl right"><div class="baseb"></div></div>`;
}
function objHTML(o, pos, extra = "") {
  const p = Object.assign({ x: 0, y: 0, z: -30, e: 0 }, pos);
  return `<div class="o3 m-${o.mount} ${o.h ? "hasH" : ""} ${o.cls || ""} ${extra}" data-o="${o.id}" style="--w:${o.w};width:calc(${o.w} * 1cqw);${o.h ? `height:calc(${o.h} * 1cqw);` : ""}--x:${p.x};--y:${p.y};--z:${p.z};--e:${p.e}">${o.html}</div>`
    + (o.mount === "floor" && !o.noShadow && !p.e ? `<div class="o3 m-flat shadow3" data-sh="${o.id}" style="--w:${o.w * 0.9};width:calc(${o.w * 0.9} * 1cqw);height:calc(${o.w * 0.3} * 1cqw);--x:${p.x};--z:${p.z - 0.5}"></div>` : "");
}
function deskItems() {
  const packs = Object.entries(S.packs).filter(([, n]) => n > 0).map(([set, n]) => {
    const [c1, c2] = SET_COLORS[set];
    return `<div class="minipack" data-pack="${set}" title="Booster ${setName(set)}" style="--c1:${c1};--c2:${c2}">${set === "30th" ? `<img class="full" src="art/booster30.png" alt="">` : `<img src="art/${SETS[set].art}.png" alt="">`}${n > 1 ? `<span>×${n}</span>` : ""}</div>`;
  });
  const boxes = Object.entries(S.boxes).filter(([, n]) => n > 0).map(([key, n]) => {
    const [bid, set] = key.split("|");
    return `<div class="minibox mb-${bid}" data-box="${key}" title="${boxLabel(key)}">${boxHTML(bid, set)}${n > 1 ? `<span>×${n}</span>` : ""}</div>`;
  });
  return boxes.join("") + packs.join("");
}
// tous les objets de la chambre avec leur place par défaut
function roomObjects() {
  const o = [], items = deskItems();
  const T = has("bureau");           // posé sur la table ?
  const onTable = (x) => T ? { x, z: -29, e: 15.5 } : { x: x * 0.6, z: -12, e: 0 };
  o.push({ id: "fenetre", mount: "lwall", fixed: true, w: 26, h: 24, def: { z: -30, y: 21 }, html: `<div class="window3"><i></i></div>` });
  o.push({ id: "soleil", mount: "flat", fixed: true, w: 34, h: 22, def: { x: -32, z: -24 }, html: `<div class="sunpatch"></div>`, cls: "nohit" });
  if (has("tapisSol")) o.push({ id: "tapisSol", mount: "flat", w: 64, h: 34, def: { x: 0, z: -20 }, html: `<div class="rug"></div>` });
  if (has("poster")) o.push({ id: "poster", mount: "wall", w: 12, h: 20, def: { x: -28, y: 24 }, html: posterHTML(249, "LUGIA", "#1b3a8a", "#5ab2ff") });
  if (has("etagere")) o.push({ id: "etagere", mount: "wall", w: 34, h: 17, def: { x: 26, y: 21 }, html: `<div class="etagere"><div class="plank p1"></div><div class="plank p2"></div></div>` });
  if (T) o.push({ id: "bureau", mount: "floor", w: 56, h: 22, def: { x: 0, z: -30 }, html: `<div class="table"><div class="leg bl"></div><div class="leg br"></div><div class="top">${has("tapis") ? `<div class="mat">${matZones()}</div>` : ""}</div><div class="edge"></div><div class="leg fl"></div><div class="leg fr"></div><div class="packs">${items}</div></div>` });
  else o.push({ id: "carton", mount: "floor", w: 22, h: 13, def: { x: 0, z: -14 }, html: `<div class="carton"><b>FRAGILE</b><div class="packs">${items}</div></div>` });
  if (has("plante")) o.push({ id: "plante", mount: "floor", w: 9, def: { x: 44, z: -44 }, html: `<div class="plant">🪴</div>` });
  if (has("lampe")) o.push({ id: "lampe", mount: "floor", w: 5, h: 13, def: onTable(22), html: `<div class="lamp"><div class="base"></div><div class="arm"></div><div class="head"></div></div>`, noShadow: T });
  o.push({ id: "binder", mount: "floor", w: 4.5, def: onTable(-21), html: `<div class="binder" title="${t("binder.title")}">${t("binder")}</div>`, noShadow: T });
  DECOR.filter(d => d.kind === "figurine").forEach((d, i) => {
    if (has(d.id)) o.push(d.gold ? { id: d.id, mount: "floor", w: 6, def: onTable(-12), html: figHTML(d), noShadow: T }
      : { id: d.id, mount: "wall", w: 6, def: { x: 13 + i * 6.5, y: 37.2 }, html: figHTML(d) });
  });
  DECOR.filter(d => d.kind === "pop").forEach((d, i) => { if (has(d.id)) o.push({ id: d.id, mount: "wall", w: 5, def: { x: 12 + i * 5.3, y: 21.9 }, html: popFigHTML(d) }); });
  DECOR.filter(d => d.r3 && has(d.id)).forEach(d => o.push(Object.assign({ id: d.id, html: d.draw() }, d.r3)));
  return { o, items };
}
let roomPos = (id) => S.pos3[id];
function renderRoom() {
  const { o, items } = roomObjects();
  const hint = items ? t("room.hint.open") : (Object.keys(S.decor).length ? t("room.hint.none") : t("room.hint.empty"));
  $("roomScene").className = "room r3 bedroom" + (has("papier") ? " paper" : "") + (has("lampe") ? " lit" : "");
  $("roomScene").innerHTML = `<div class="shell">${shellHTML()}${o.map(x => objHTML(x, S.pos3[x.id] || x.def, x.fixed ? "fixed" : "")).join("")}</div><div class="roomhint">${hint}</div><div class="vignette"></div>`;
}
// déplacer un objet dans la pièce 3D
let drag = null;
function depthScale(z) { return PERSP / (PERSP - z * $("roomScene").clientWidth / 100); }
$("roomScene").addEventListener("pointerdown", e => {
  const el = e.target.closest(".o3[data-o]"); if (!el || el.classList.contains("nohit")) return;
  e.preventDefault();
  const id = el.dataset.o, obj = roomObjects().o.find(x => x.id === id); if (!obj) return;
  const p = Object.assign({ x: 0, y: 0, z: -30, e: 0 }, S.pos3[id] || obj.def);
  roomDims();
  drag = { el, id, obj, p, sx: e.clientX, sy: e.clientY, target: e.target, moved: false, u: $("roomScene").clientWidth / 100 };
  el.setPointerCapture(e.pointerId);
});
$("roomScene").addEventListener("pointermove", e => {
  if (!drag) return;
  const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
  if (!drag.moved && Math.hypot(dx, dy) < 6) return;
  if (drag.obj.fixed) return;
  drag.moved = true; drag.el.classList.add("dragging");
  drag.sx = e.clientX; drag.sy = e.clientY;
  const { obj, p, u } = drag, s = depthScale(p.z), ddx = dx / u / s, ddy = dy / u / s;
  const hw = obj.w / 2;
  if (obj.mount === "floor" || obj.mount === "flat") {
    p.x = Math.max(-RW / 2 + hw, Math.min(RW / 2 - hw, p.x + ddx));
    p.z = Math.max(-RD + 3, Math.min(-3, p.z + ddy * 2.4));
    if (p.e) p.e = 0; // on le pose par terre quand on le déplace
  } else if (obj.mount === "wall") {
    p.x = Math.max(-RW / 2 + hw, Math.min(RW / 2 - hw, p.x + ddx));
    p.y = Math.max(0, Math.min(RH - (obj.h || obj.w), p.y - ddy));
  } else {
    p.z = Math.max(-RD + hw, Math.min(-hw, p.z + (obj.mount === "lwall" ? -ddx : ddx)));
    p.y = Math.max(0, Math.min(RH - (obj.h || obj.w), p.y - ddy));
  }
  for (const k of ["x", "y", "z", "e"]) drag.el.style.setProperty("--" + k, p[k]);
  const sh = $("roomScene").querySelector(`[data-sh="${drag.id}"]`);
  if (sh) { sh.style.setProperty("--x", p.x); sh.style.setProperty("--z", p.z - 0.5); }
});
$("roomScene").addEventListener("pointerup", () => {
  if (!drag) return;
  const d = drag; drag = null;
  d.el.classList.remove("dragging");
  if (d.moved) { S.pos3[d.id] = d.p; save(); SFX.place(); }
  else {
    const pk = d.target.closest(".minipack"), bx = d.target.closest(".minibox");
    if (bx) startUnboxing(bx.dataset.box);
    else if (pk) startOpening(pk.dataset.pack);
    else if (d.id === "binder") showTab("coll");
  }
});
$("resetPos").onclick = () => { if (confirm(t("room.resetConfirm"))) { S.pos3 = {}; save(); renderRoom(); } };

// ===== La galerie : une salle d'exposition pour tes plus belles cartes =====
// 11 cadres aux murs + 2 vitrines de 3 cartes ; S.gallery = { emplacement: idCarte }
const GALLERY = [
  ...[-36, -18, 0, 18, 36].map((x, i) => ({ slot: "b" + i, mount: "wall", w: 11, h: 15.5, def: { x, y: 22 } })),
  ...[-14, -30, -46].map((z, i) => ({ slot: "l" + i, mount: "lwall", w: 11, h: 15.5, def: { z, y: 22 } })),
  ...[-14, -30, -46].map((z, i) => ({ slot: "r" + i, mount: "rwall", w: 11, h: 15.5, def: { z, y: 22 } })),
];
const VITRINES = [{ id: "v0", x: -22, z: -24 }, { id: "v1", x: 22, z: -24 }];
function galleryCard(slot) { const id = S.gallery[slot]; return id && count(id) ? BY_ID[id] : null; }
function frameSlotHTML(slot) {
  const c = galleryCard(slot);
  return `<div class="gframe ${c ? "t" + c.tier : "empty"}" data-slot="${slot}"><div class="spot"></div><div class="gmat">${c ? `<img src="${hd(c)}" alt="">` : `<span>＋</span>`}<div class="glass"></div></div>${c ? `<div class="plaque">${cardName(c)}<small>${setName(c.set)} · ${TIER_ICONS[c.tier]}</small></div>` : ""}</div>`;
}
function renderGallery() {
  const objs = GALLERY.map(g => objHTML({ id: g.slot, mount: g.mount, w: g.w, h: g.h, html: frameSlotHTML(g.slot) }, g.def, "fixed"));
  VITRINES.forEach(v => {
    const slots = [0, 1, 2].map(i => v.id + "-" + i);
    objs.push(objHTML({ id: v.id, mount: "floor", w: 20, h: 21, html: `<div class="vitrine3"><div class="vtop">${slots.map(sl => { const c = galleryCard(sl); return `<div class="vslot" data-slot="${sl}">${c ? `<img src="${mini(c)}" alt="">` : "＋"}</div>`; }).join("")}</div><div class="vglass"></div><div class="vbase"></div></div>` }, { x: v.x, z: v.z }, "fixed"));
  });
  objs.push(objHTML({ id: "banc", mount: "floor", w: 26, h: 7, html: `<div class="bench"></div>` }, { x: 0, z: -9 }, "fixed"));
  const n = Object.keys(S.gallery).filter(k => galleryCard(k)).length;
  $("galleryScene").innerHTML = `<div class="shell">${shellHTML()}${objs.join("")}</div><div class="roomhint">${t("gal.hint", { n, N: GALLERY.length + VITRINES.length * 3 })}</div><div class="vignette"></div>`;
}
$("galleryScene").addEventListener("click", e => { const s = e.target.closest("[data-slot]"); if (s) pickGalleryCard(s.dataset.slot); });
function pickGalleryCard(slot) {
  const cur = galleryCard(slot);
  const owned = CARDS.filter(c => count(c.id)).sort((a, b) => b.tier - a.tier || a.set.localeCompare(b.set));
  $("buyPanel").innerHTML = `
    <h2 style="margin:0">${t("gal.pick")}</h2>
    ${cur ? `<button class="red" id="galRemove">${t("gal.remove")}</button>` : ""}
    ${owned.length ? `<div class="grid galpick">${owned.map(c => tileHTML(c, { force: true })).join("")}</div>` : `<p class="muted">${t("gal.none")}</p>`}
    <button id="galClose">${t("close")}</button>`;
  $("buyModal").classList.add("on");
  $("galClose").onclick = closeBuy;
  if ($("galRemove")) $("galRemove").onclick = () => { delete S.gallery[slot]; save(); closeBuy(); renderGallery(); };
  $("buyPanel").querySelectorAll(".tile[data-id]").forEach(tl => tl.onclick = () => { S.gallery[slot] = tl.dataset.id; save(); SFX.place(); closeBuy(); renderGallery(); });
}

// ===== Le magasin : on entre par la porte, puis on se promène entre les rayons =====
const WALLS = ["wall.boosters", "wall.boxes", "wall.furniture", "wall.figures"];
let shopInside = false, shopWall = 0;
function itemHTML(kind, id, visual, name, tag, cls = "", ribbon = "") {
  return `<div class="item ${cls}" data-kind="${kind}" data-id="${id}" title="${name}">${ribbon ? `<div class="ribbon">${ribbon}</div>` : ""}<div class="visual">${visual}</div><div class="tag ${cls.includes("owned") ? "owned" : ""}">${tag}</div></div>`;
}
function decoItems(kinds) {
  return DECOR.filter(d => kinds.includes(d.kind)).map(d => {
    const owned = has(d.id), locked = d.req && !has(d.req);
    const tag = owned ? t("shop.bought") : d.special ? t("shop.only30") : locked ? t("shop.needs", { p: d.price, item: L(DC[d.req].name) }) : `${d.price} pts`;
    return itemHTML("decor", d.id, decorVisual(d), L(d.name), tag, owned ? "owned" : (locked || d.special) ? "locked" : "");
  }).join("");
}
function renderShop() {
  $("shopWrap").classList.toggle("inside", shopInside);
  // mur 1 : les présentoirs de boosters
  $("shelfBoosters").innerHTML = PACK_SET_IDS.map(s => itemHTML("booster", s, displayHTML(s), setName(s), `${packPrice(s)} pts`)).join("");
  // mur 2 : la vitrine des boîtes + la caisse
  $("shelfBoxes").innerHTML = BOXES.map(b => itemHTML("box", b.id, `<div class="boxwrap bw-${b.id}">${boxHTML(b.id, null)}</div>`,
    L(b.name), b.perSet ? t("shop.from", { p: boxPrice(b.id, null) }) : `${boxPrice(b.id)} pts`, "boxitem", b.id === "anniv30" ? t("shop.new") : "")).join("");
  // murs 3 et 4 : la déco
  $("shelfFurniture").innerHTML = decoItems(["meuble", "deko"]);
  $("shelfFigures").innerHTML = decoItems(["figurine", "pop"]);
  $("pano").style.transform = `translateX(${-shopWall * 100}%)`;
  $("wallName").textContent = `${shopWall + 1} / ${WALLS.length} · ${t(WALLS[shopWall])}`;
  $("wallPrev").disabled = shopWall === 0;
  $("wallNext").disabled = shopWall === WALLS.length - 1;
  renderHeader();
}
function enterShop() {
  if (shopInside) return;
  SFX.door();
  $("shopWrap").classList.add("entering");
  setTimeout(() => { shopInside = true; shopWall = 0; $("shopWrap").classList.remove("entering"); renderShop(); $("shopTalk").textContent = rnd(t("talk")); }, 900);
}
function leaveShop() { SFX.door(); shopInside = false; renderShop(); }
function walk(dir) {
  const nw = Math.max(0, Math.min(WALLS.length - 1, shopWall + dir));
  if (nw === shopWall) return;
  shopWall = nw; SFX.steps();
  const ins = $("inside");
  ins.classList.remove("walking", "walk-next", "walk-prev"); ins.offsetWidth;
  ins.classList.add("walking", dir > 0 ? "walk-next" : "walk-prev");
  clearTimeout(ins._t); ins._t = setTimeout(() => ins.classList.remove("walk-next", "walk-prev"), 700);
  renderShop();
}
$("shopDoor").onclick = enterShop;
$("exitShop").onclick = leaveShop;
$("wallPrev").onclick = () => walk(-1);
$("wallNext").onclick = () => walk(1);
// glisser le doigt dans le magasin = marcher vers la gauche / la droite
(() => {
  let x0 = null;
  $("inside").addEventListener("pointerdown", e => { if (!e.target.closest(".item, button")) x0 = e.clientX; });
  $("inside").addEventListener("pointerup", e => { if (x0 !== null && Math.abs(e.clientX - x0) > 60) walk(e.clientX < x0 ? 1 : -1); x0 = null; });
})();
document.querySelector(".store").addEventListener("click", e => {
  const it = e.target.closest(".item"); if (!it) return;
  if (it.dataset.kind === "booster") openBuyBooster(it.dataset.id);
  else if (it.dataset.kind === "box") openBuyBox(it.dataset.id);
  else openBuyDecor(DC[it.dataset.id]);
});
function closeBuy() { $("buyModal").classList.remove("on"); }
$("buyModal").addEventListener("click", e => { if (e.target.id === "buyModal") closeBuy(); });
function afterBuy(label, openFn) {
  SFX.buy(); renderHeader(); renderShop();
  $("shopTalk").textContent = t("talk.thanks", { name: label });
  $("buyPanel").innerHTML = `<h2 style="margin:0">${t("buy.done")}</h2><p>${t("buy.placed", { name: label })}</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="gold" id="openNow">${t("buy.openNow")}</button><button id="keepShop">${t("buy.keep")}</button></div>`;
  $("openNow").onclick = () => { closeBuy(); showTab("room"); openFn(); };
  $("keepShop").onclick = closeBuy;
}
const priceLine = p => `<p style="margin:0">${t("buy.price", { p, have: S.points })}</p>${S.points < p ? `<p class="muted" style="margin:0">${t("buy.missing", { n: p - S.points })}</p>` : ""}`;

function openBuyBooster(set) {
  const price = packPrice(set);
  const avg = TIER_VALUES.map((_, k) => PACK_SLOTS.reduce((a, s) => a + s[k] / s.reduce((x, y) => x + y, 0), 0))
    .map((x, k) => x >= 0.01 ? `<span style="color:var(--t${k})">${TIER_ICONS[k]} ${x >= 1 ? x.toFixed(1).replace(".0", "") : "~" + Math.round(x * 100) + " %"}</span>` : "").filter(Boolean).join(" · ");
  const ownedInSet = CARDS.filter(c => c.set === set && count(c.id)).length, inSet = CARDS.filter(c => c.set === set).length;
  $("buyPanel").innerHTML = `
    <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;justify-content:center;text-align:left">
      <div style="width:120px;container-type:inline-size">${packHTML(set)}</div>
      <div style="flex:1;min-width:200px">
        <h2 style="margin:0">Booster ${setName(set)}</h2>
        <div class="muted">${SETS[set].year} · ${t("buy.owned", { n: ownedInSet, N: inSet })}</div>
        ${S.packs[set] ? `<div class="muted">${t("buy.waiting", { list: S.packs[set] + " Booster" })}</div>` : ""}
        <div style="font-size:14px;margin-top:6px">${set === "30th" ? t("pack30.info") : `<b>${t("buy.avg")}</b><br>${avg}`}</div>
        ${GOD_SETS.includes(set) ? `<div class="godinfo">${t("god.info", { p: Math.round(1 / GOD_CHANCE) })}</div>` : ""}
      </div>
    </div>
    ${priceLine(price)}
    <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">
      <button class="gold" id="doBuy" ${S.points < price ? "disabled" : ""}>${t("buy.buy")} (${price} pts)</button>
      <button class="gold" id="doBuy3" ${S.points < price * 3 ? "disabled" : ""}>${t("buy.buy")} ×3 (${price * 3} pts)</button>
      <button id="cancelBuy">${t("buy.cancel")}</button>
    </div>`;
  $("buyModal").classList.add("on");
  $("cancelBuy").onclick = closeBuy;
  const buy = n => {
    if (S.points < price * n) return;
    S.points -= price * n; for (let i = 0; i < n; i++) addPack(set); save();
    afterBuy(`${n} × Booster ${setName(set)}`, () => startOpening(set));
  };
  $("doBuy").onclick = () => buy(1);
  $("doBuy3").onclick = () => buy(3);
}
function openBuyBox(bid, set = PACK_SET_IDS[0]) {
  const b = BX[bid], price = boxPrice(bid, b.perSet ? set : null);
  $("buyPanel").innerHTML = `
    <div class="buyboxvis bw-${bid}">${boxHTML(bid, b.perSet ? set : undefined)}</div>
    <h2 style="margin:0">${L(b.name)}${b.perSet ? ` · ${setName(set)}` : ""}</h2>
    <p style="margin:0"><b>${t("buy.contains")}</b> ${L(b.desc)}</p>
    ${b.perSet ? `<div style="width:100%"><b>${t("buy.chooseSet")}</b><div class="setpick">${PACK_SET_IDS.map(s => `<button class="${s === set ? "on" : ""}" data-s="${s}" title="${setName(s)}">${logoImg(s, "")}</button>`).join("")}</div></div>` : ""}
    ${priceLine(price)}
    <div style="display:flex;gap:10px"><button class="gold" id="doBuy" ${S.points < price ? "disabled" : ""}>${t("buy.buy")}</button><button id="cancelBuy">${t("buy.cancel")}</button></div>`;
  $("buyModal").classList.add("on");
  $("buyPanel").querySelectorAll(".setpick button").forEach(x => x.onclick = () => openBuyBox(bid, x.dataset.s));
  $("cancelBuy").onclick = closeBuy;
  $("doBuy").onclick = () => {
    if (S.points < price) return;
    const key = b.perSet ? `${bid}|${set}` : bid;
    S.points -= price; S.boxes[key] = (S.boxes[key] || 0) + 1; save();
    afterBuy(boxLabel(key), () => startUnboxing(key));
  };
}
function openBuyDecor(d) {
  const owned = has(d.id), locked = d.req && !has(d.req);
  $("buyPanel").innerHTML = `
    <div class="item" style="cursor:default;transform:none;width:140px"><div class="visual">${decorVisual(d)}</div></div>
    <h2 style="margin:0">${L(d.name)}</h2>
    <p style="margin:0">${L(d.desc)}</p>
    ${d.special ? `<p style="margin:0;color:var(--gold)">${t("buy.special")}</p>` : ""}
    ${locked ? `<p style="margin:0;color:var(--gold)">${t("buy.lockedNeed", { item: L(DC[d.req].name) })}</p>` : ""}
    ${d.special ? "" : priceLine(d.price)}
    <div style="display:flex;gap:10px"><button class="gold" id="doBuy" ${owned || locked || d.special || S.points < d.price ? "disabled" : ""}>${owned ? t("buy.already") : t("buy.buy")}</button><button id="cancelBuy">${t("close")}</button></div>`;
  $("buyModal").classList.add("on");
  $("cancelBuy").onclick = closeBuy;
  $("doBuy").onclick = () => {
    if (owned || locked || d.special || S.points < d.price) return;
    S.points -= d.price; S.decor[d.id] = true; save(); SFX.buy(); renderHeader(); renderShop(); closeBuy();
    $("shopTalk").textContent = t("talk.decor", { name: L(d.name) });
    toast(t("toast.decor", { name: L(d.name) }));
  };
}

// ===== Décor de l'écran d'ouverture (table, tapis, lampe, figurines) =====
function openingScene(title, sub) {
  const el = $("opening");
  el.className = "on " + (has("tapis") ? "bg-mat" : has("bureau") ? "bg-desk" : "bg-carton") + (has("lampe") ? " bg-lamp" : "");
  const deco = DECOR.filter(d => (d.kind === "figurine" || d.kind === "pop") && has(d.id));
  const half = Math.ceil(deco.length / 2);
  const side = list => `<div class="specside">${list.map(d => d.kind === "pop" ? popFigHTML(d) : figHTML(d)).join("")}</div>`;
  el.innerHTML = `${has("tapis") ? `<div class="playmat">${matZones()}</div>` : ""}
    <button class="op-close" id="opClose" title="${t("close")}">✖</button>
    <div class="op-top"><h2 id="opTitle">${title}</h2><p id="opSub">${sub}</p></div>
    <div class="spectators">${side(deco.slice(0, half))}${side(deco.slice(half))}</div>`;
  $("opClose").onclick = closeOpening;
  return el;
}
function closeOpening() {
  $("opening").className = ""; $("opening").innerHTML = ""; OP = null;
  renderHeader(); refreshTab();
}

// ===== Ouverture d'un booster =====
let OP = null;
function pickTier(w) {
  let r = Math.random() * w.reduce((a, b) => a + b, 0);
  for (let k = 0; k < w.length; k++) { r -= w[k]; if (r < 0) return k; }
  return 0;
}
function drawPack(set) {
  const pools = BY_SET_TIER[set];
  // God Pack : 10 cartes toutes ultra rares ou secrètes (les secrètes au fond)
  if (GOD_SETS.includes(set) && Math.random() < GOD_CHANCE) {
    let best = shuffle(pools[3]).concat(shuffle(pools[4]));
    if (best.length < 10) best = shuffle(pools[2]).slice(0, 10 - best.length).concat(best);
    return { cards: best.slice(-10), god: true };
  }
  const cards = [];
  for (const slot of set === "30th" ? PACK30_SLOTS : PACK_SLOTS) {
    if (slot === PIKA) { cards.push(rnd(PIKA_POOL)); continue; }
    let tr = pickTier(slot);
    while (tr > 0 && !pools[tr].length) tr--; // au cas où une rareté manquerait dans l'extension
    const pool = pools[tr];
    let c, tries = 0;
    do { c = rnd(pool); } while (cards.includes(c) && ++tries < 15);
    cards.push(c);
  }
  // 30 Jahre : très rarement, la dernière carte est un Mew RGB
  if (set === "30th" && Math.random() < RGB_CHANCE) cards[cards.length - 1] = rnd(RGB_POOL);
  if (set === "30th" && Math.random() < REPRINT_CHANCE) cards[2] = rnd(REPRINT_POOL);
  return { cards, god: false }; // comme en vrai : les communes devant, les rares au fond du paquet
}
function startOpening(set) {
  if (!S.packs[set]) return;
  const el = openingScene("Booster " + setName(set), t("op.tearHint"));
  el.insertAdjacentHTML("beforeend", `
    <div class="stage" id="stage">
      <div class="tear-pack" id="tearPack">
        <div class="body">${packHTML(set)}</div>
        <div class="strip">${packHTML(set)}</div>
        <div class="tear-line" id="tearLine"></div><div class="tear-progress" id="tearProg"></div>
      </div>
    </div>
    <div class="seen" id="seen" hidden><div class="seen-label">${t("op.seen")}</div></div>
    <div class="op-controls" id="opCtl"><button id="tearBtn">${t("op.tearBtn")}</button></div>`);
  OP = { set, phase: "pack", busy: false };
  $("tearBtn").onclick = tearPack;
  setupTear();
}
function setupTear() {
  const tp = $("tearPack");
  let active = false, minX = 0, maxX = 0, lastSnd = 0;
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
    if (Date.now() - lastSnd > 60) { SFX.scratch(); lastSnd = Date.now(); }
    if (prog >= 0.8) { active = false; tearPack(); }
  });
  tp.addEventListener("pointerup", () => active = false);
}
function tearPack() {
  if (!OP || OP.phase !== "pack") return;
  OP.phase = "torn";
  SFX.tear();
  // le booster est consommé, les cartes vont dans la collection
  S.packs[OP.set]--; if (!S.packs[OP.set]) delete S.packs[OP.set];
  S.opened++;
  const { cards, god } = drawPack(OP.set);
  OP.cards = cards; OP.god = god;
  if (god) S.godPacks++;
  const seenNow = new Set();
  OP.isNew = OP.cards.map(c => { const n = !count(c.id) && !seenNow.has(c.id); seenNow.add(c.id); return n; });
  OP.cards.forEach(c => S.owned[c.id] = count(c.id) + 1);
  save(); renderHeader();
  OP.order = OP.cards.map((_, i) => i); // index 0 = carte du dessus
  $("tearBtn").remove();
  $("opSub").textContent = t("op.crack");
  $("tearPack").classList.add("torn");
  if (god) {
    // lumière dorée qui sort du booster
    $("opening").classList.add("godpack");
    $("stage").insertAdjacentHTML("beforeend", `<div class="godrays"></div>`);
    setTimeout(() => { SFX.god(); sparkles(60, "#ffd700"); $("opTitle").innerHTML = t("god.title"); $("opSub").textContent = t("god.sub"); }, 300);
  }
  setTimeout(() => $("tearPack").classList.add("out"), god ? 1600 : 650);
  setTimeout(() => { $("tearPack").remove(); OP.phase = "stack"; renderStack(true); SFX.slide(); }, god ? 2300 : 1250);
}
function stackControls() {
  const left = OP.order.length;
  $("opTitle").innerHTML = (OP.god ? t("god.title") + " · " : "") + t("op.left", { n: left });
  $("opSub").textContent = t("op.stackHint");
  $("opCtl").innerHTML = `<button id="toBottom" ${left < 2 ? "disabled" : ""}>${t("op.toBottom")}</button><button class="gold" id="flipBtn">${t("op.flip")}</button>`;
  $("toBottom").onclick = () => moveToBottom(-1);
  $("flipBtn").onclick = flipTop;
}
function renderStack(rise) {
  const st = $("stage");
  st.innerHTML = `<div class="counter-left">${t("op.pile", { n: OP.order.length, t: OP.cards.length })}</div><div class="stack" id="stack"></div>`;
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
  OP.busy = true; SFX.slide();
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
function revealSound(c, isNew) {
  if (c.tier === 4) SFX.secret(); else if (c.tier === 3) SFX.ultra(); else if (c.tier === 2 || isNew) SFX.rare();
}
function flipTop() {
  if (!OP || OP.phase !== "stack" || OP.busy) return;
  OP.busy = true; OP.phase = "shown";
  const el = topEl(), ci = OP.order[0], c = OP.cards[ci], isNew = OP.isNew[ci];
  el.classList.add("flipped"); SFX.flip();
  $("opCtl").innerHTML = "";
  setTimeout(() => {
    const parts = [isNew ? t("op.new") : t("op.double", { n: count(c.id) }), `<span style="color:var(--t${c.tier})">${TIER_ICONS[c.tier]} ${tierName(c.tier)}</span>`];
    if (c.mech) parts.push(`<span class="chip mech">${c.mech}</span>`);
    $("stage").insertAdjacentHTML("beforeend", `<div class="reveal-label">${parts.join(" · ")}</div>`);
    $("opTitle").textContent = cardName(c);
    $("opSub").textContent = `${setName(c.set)} · n° ${c.num}`;
    if (c.rar === "RGB Rare") {
      // Mew RGB : arc-en-ciel et grande fanfare
      ["#ff2a2a", "#2aff6a", "#2a7bff"].forEach((col, i) => setTimeout(() => sparkles(30, col), i * 200));
      $("opening").classList.add("rgbflash"); SFX.god();
      $("opTitle").innerHTML = t("rgb.title");
    } else {
      if (c.tier >= 2 || isNew) sparkles(c.tier >= 3 ? 40 : 18, `var(--t${Math.max(c.tier, 2)})`);
      revealSound(c, isNew);
    }
    const last = OP.order.length === 1;
    $("opCtl").innerHTML = `<button class="gold" id="nextBtn">${last ? t("op.summary") : t("op.next")}</button>`;
    $("nextBtn").onclick = nextCard;
    OP.busy = false;
  }, 600);
}
function sparkles(n, color, host = $("stage")) {
  if (!host) return;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("div");
    s.className = "sparkle";
    const a = Math.random() * Math.PI * 2, d = 120 + Math.random() * 180;
    s.style.cssText = `left:50%;top:50%;background:${color};--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px;animation-delay:${Math.random() * .2}s`;
    host.appendChild(s);
    setTimeout(() => s.remove(), 1300);
  }
}
function nextCard() {
  if (!OP || OP.phase !== "shown" || OP.busy) return;
  OP.busy = true; SFX.slide();
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
  const value = OP.cards.reduce((a, c) => a + TIER_VALUES[c.tier], 0);
  $("opTitle").innerHTML = (OP.god ? t("god.title") + " " : "") + (nb ? t("op.sumNew", { n: nb }) : t("op.sumNone"));
  $("opSub").textContent = t("op.sumSub", { v: value, n: ownedCount(), N });
  if (nb) SFX.win();
  $("opening").insertAdjacentHTML("beforeend", `<div class="summary"><div class="grid">${OP.cards.map((c, i) => tileHTML(c, { force: true, isNew: OP.isNew[i] })).join("")}</div></div>`);
  $("opening").querySelector(".summary").addEventListener("click", e => { const tl = e.target.closest(".tile[data-id]"); if (tl) openCard(tl.dataset.id); });
  const next = S.packs[OP.set] ? OP.set : Object.keys(S.packs).find(k => S.packs[k] > 0);
  $("opCtl").innerHTML = `${next ? `<button class="gold" id="again">${t("op.again", { n: packsLeft() })}</button>` : ""}<button id="toBinder">${t("op.binder")}</button><button id="toRoom">${t("op.room")}</button>`;
  if (next) $("again").onclick = () => startOpening(next);
  $("toBinder").onclick = () => { closeOpening(); showTab("coll"); };
  $("toRoom").onclick = () => { closeOpening(); showTab("room"); };
}

// ===== Déballage d'un produit (Bundle, Mini-Tin, Top-Trainer-Box, coffret 30 ans) =====
function boxContents(bid, set) {
  const b = BX[bid];
  if (bid === "anniv30") set = "30th";
  const packs = rep(set, b.packs);
  let promo = null;
  if (b.promo !== null) {
    // la carte promo : de préférence une carte qui manque
    let tier = b.promo, pool;
    do { pool = set ? BY_SET_TIER[set][tier] : BY_TIER[tier]; } while (!pool.length && tier-- > 0);
    const missing = pool.filter(c => !count(c.id));
    promo = missing.length && Math.random() < 0.6 ? rnd(missing) : rnd(pool);
  }
  return { packs, promo, acc: b.acc, gift: b.gift };
}
const OPEN_HINT = { bundle: "box.bandHint", tin: "box.tinHint", etb: "box.lidHint", anniv30: "box.lidHint" };
const OPEN_BTN = { bundle: "box.bandBtn", tin: "box.tinBtn", etb: "box.lidBtn", anniv30: "box.lidBtn" };
function startUnboxing(key) {
  if (!S.boxes[key]) return;
  const [bid, set] = key.split("|");
  const el = openingScene(boxLabel(key), t("box.filmHint"));
  el.insertAdjacentHTML("beforeend", `
    <div class="boxstage bs-${bid}" id="boxStage"><div class="bigbox" id="bigbox">${boxHTML(bid, set)}</div></div>
    <div class="op-controls" id="opCtl"><button id="filmBtn">${t("box.filmBtn")}</button></div>`);
  OP = { box: key, bid, set, phase: "film", rub: 0, rx: bid === "tin" ? -32 : -16, ry: -28 };
  const obj = $("bigbox").querySelector(".obj3d");
  obj.classList.add("filmed", "idle");
  $("filmBtn").onclick = removeFilm;
  // glisser = faire tourner la boîte (et frotter le film plastique)
  const bb = $("bigbox");
  let p0 = null, moved = 0, last = 0;
  bb.addEventListener("pointerdown", e => { p0 = { x: e.clientX, y: e.clientY }; moved = 0; bb.setPointerCapture(e.pointerId); obj.classList.remove("idle"); });
  bb.addEventListener("pointermove", e => {
    if (!p0 || !OP) return;
    const dx = e.clientX - p0.x, dy = e.clientY - p0.y;
    p0 = { x: e.clientX, y: e.clientY }; moved += Math.abs(dx) + Math.abs(dy);
    OP.ry += dx * 0.5; OP.rx = Math.max(-60, Math.min(20, OP.rx - dy * 0.4));
    obj.style.setProperty("--rx", OP.rx + "deg"); obj.style.setProperty("--ry", OP.ry + "deg");
    if (OP.phase === "film") {
      OP.rub += Math.abs(dx) + Math.abs(dy);
      if (Date.now() - last > 90) { SFX.scratch(); last = Date.now(); }
      if (OP.rub > 700) removeFilm();
    }
  });
  bb.addEventListener("pointerup", () => {
    if (!p0) return; p0 = null;
    if (moved < 8 && OP && OP.phase === "lid") openLid();
  });
}
function removeFilm() {
  if (!OP || OP.phase !== "film") return;
  OP.phase = "film-off"; SFX.film();
  $("bigbox").querySelector(".obj3d").classList.remove("filmed");
  // le film s'envole en petits morceaux brillants
  for (let i = 0; i < 14; i++) {
    const s = document.createElement("div");
    s.className = "filmbit";
    s.style.cssText = `left:${20 + Math.random() * 60}%;top:${20 + Math.random() * 60}%;--dx:${(Math.random() - .5) * 500}px;--dy:${-150 - Math.random() * 300}px;--rot:${Math.random() * 720}deg;animation-delay:${Math.random() * .2}s`;
    $("boxStage").appendChild(s); setTimeout(() => s.remove(), 1500);
  }
  $("opSub").textContent = t(OPEN_HINT[OP.bid]);
  $("opCtl").innerHTML = `<button class="gold" id="lidBtn">${t(OPEN_BTN[OP.bid])}</button>`;
  $("lidBtn").onclick = openLid;
  setTimeout(() => { if (OP) OP.phase = "lid"; }, 400);
}
function openLid() {
  if (!OP || OP.phase !== "lid") return;
  OP.phase = "open";
  // la boîte est consommée : boosters, carte promo, accessoires
  const { bid, set, box } = OP;
  const ct = boxContents(bid, set);
  S.boxes[box]--; if (!S.boxes[box]) delete S.boxes[box];
  S.boxesOpened++;
  ct.packs.forEach(addPack);
  if (ct.promo) { OP.promoNew = !count(ct.promo.id); S.owned[ct.promo.id] = count(ct.promo.id) + 1; }
  ct.acc.forEach(a => S.acc[a] = (S.acc[a] || 0) + 1);
  if (ct.gift) S.decor[ct.gift] = true;
  save(); renderHeader();
  OP.ct = ct;
  bid === "bundle" ? SFX.tear() : SFX.lid();
  // en 3D : le couvercle se soulève (ou s'ouvre sur sa charnière), les boosters sortent
  const obj = $("bigbox").querySelector(".obj3d");
  obj.classList.remove("idle");
  obj.style.setProperty("--rx", (bid === "tin" ? -38 : -24) + "deg"); obj.style.setProperty("--ry", "-22deg");
  obj.classList.add("opened");
  setTimeout(() => ct.packs.slice(0, 4).forEach((_, i) => setTimeout(SFX.pop, i * 120)), 600);
  $("opCtl").innerHTML = "";
  setTimeout(() => { $("boxStage").classList.add("fadeout"); }, 2000);
  setTimeout(() => { $("boxStage").classList.remove("fadeout"); showBoxContents(); }, 2400);
}
function showBoxContents() {
  const { ct } = OP;
  const packs = ct.packs.map((s, i) => `<div class="cpack" style="animation-delay:${i * 0.08}s;--r:${(i - (ct.packs.length - 1) / 2) * 4}deg">${packHTML(s)}</div>`).join("");
  const acc = ct.acc.map((a, i) => `<div class="acc" style="animation-delay:${0.8 + i * 0.15}s"><span>${ACC_ICONS[a]}</span>${t("acc." + a)}</div>`).join("")
    + (ct.gift ? `<div class="acc gift" style="animation-delay:1.3s">${figHTML(DC[ct.gift])}${L(DC[ct.gift].name)}</div>` : "");
  $("boxStage").innerHTML = `
    <div class="contents">
      <div class="cpacks">${packs}</div>
      ${ct.promo ? `<div class="promo-wrap"><div class="promo-label">${t("box.promo")}</div>
        <div class="scard promo t${ct.promo.tier}" id="promo"><div class="inner"><div class="cardback"></div><div class="face"><img src="${hd(ct.promo)}" alt=""></div></div></div></div>` : ""}
      ${acc ? `<div class="accs">${acc}</div>` : ""}
    </div>`;
  $("opTitle").textContent = t("box.contents");
  ct.packs.forEach((_, i) => setTimeout(SFX.pop, i * 80));
  if (ct.promo) { $("opSub").textContent = t("box.promoHint"); $("promo").onclick = flipPromo; }
  else boxDone();
}
function flipPromo() {
  if (!OP || OP.phase !== "open") return;
  OP.phase = "promo";
  const c = OP.ct.promo;
  $("promo").classList.add("flipped"); SFX.flip();
  setTimeout(() => {
    revealSound(c, OP.promoNew);
    sparkles(c.tier >= 3 ? 40 : 20, `var(--t${Math.max(c.tier, 2)})`, $("promo").parentElement);
    $("opTitle").textContent = cardName(c) + (OP.promoNew ? " · " + t("op.new") : "");
    boxDone();
  }, 600);
}
function boxDone() {
  $("opSub").textContent = t("box.packsAdded", { n: OP.ct.packs.length });
  const first = OP.ct.packs[0];
  $("opCtl").innerHTML = `<button class="gold" id="boxOpenPack">${t("box.openPack")}</button><button id="boxStore">${t("box.store")}</button>`;
  $("boxOpenPack").onclick = () => startOpening(first);
  $("boxStore").onclick = () => { closeOpening(); showTab("room"); };
}

document.addEventListener("keydown", e => {
  if (!OP || $("cardModal").classList.contains("on")) return;
  if (e.key === "Escape") return closeOpening();
  if (OP.box) return;
  if (OP.phase === "pack" && (e.key === " " || e.key === "Enter")) { e.preventDefault(); tearPack(); }
  else if (OP.phase === "stack") {
    if (e.key === "ArrowLeft") moveToBottom(-1);
    else if (e.key === "ArrowRight") moveToBottom(1);
    else if (e.key === " " || e.key === "Enter") { e.preventDefault(); flipTop(); }
  } else if (OP.phase === "shown" && (e.key === " " || e.key === "Enter" || e.key === "ArrowRight")) { e.preventDefault(); nextCard(); }
});

// ===== Classeur (collection) =====
function fillSelect(sel, label, items) {
  const cur = $(sel).value;
  $(sel).innerHTML = (label === null ? "" : `<option value="">${label}</option>`) + items.map(([v, x]) => `<option value="${v}">${x}</option>`).join("");
  $(sel).value = cur;
  if ($(sel).selectedIndex < 0) $(sel).selectedIndex = 0;
}
function fillFilters() {
  fillSelect("fOwn", null, [["all", t("f.all")], ["own", t("f.own")], ["miss", t("f.miss")], ["dup", t("f.dup")]]);
  fillSelect("fSet", t("f.sets"), SET_IDS.map(s => [s, `${setName(s)} (${SETS[s].year})`]));
  fillSelect("fTier", t("f.tiers"), TIER_ICONS.map((ic, k) => [k, ic + " " + tierName(k)]));
  fillSelect("fMech", t("f.mech"), [...new Set(CARDS.map(c => c.mech).filter(Boolean))].map(m => [m, m]));
  fillSelect("fCat", t("f.cats"), Object.keys(t("cats")).map(k => [k, catName(k)]));
  fillSelect("fGen", t("f.gens"), [...new Set(CARDS.map(c => c.gen).filter(Boolean))].sort().map(g => [g, t("gen", { g })]));
}
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
    if (q && !(n && cardName(c).toLowerCase().includes(q))) return false;
    return true;
  });
  $("collInfo").textContent = t("coll.info", { a: list.length, b: list.filter(c => count(c.id)).length });
  $("collGrid").innerHTML = list.map(c => tileHTML(c, { sel: SELL.on ? SELL.sel[c.id] : 0 })).join("");
  $("collGrid").classList.toggle("selling", SELL.on);
  renderSellBar();
}
function renderSellBar() {
  $("sellBar").classList.toggle("on", SELL.on);
  $("sellMode").classList.toggle("on", SELL.on);
  let n = 0, gain = 0;
  for (const [id, k] of Object.entries(SELL.sel)) { n += k; gain += k * sellPrice(BY_ID[id]); }
  $("sellCount").innerHTML = t("sell.count", { n });
  $("sellGain").textContent = `+${gain} pts`;
  $("sellGo").disabled = !n;
}
$("collGrid").addEventListener("click", e => {
  const tl = e.target.closest(".tile[data-id]"); if (!tl) return;
  const id = tl.dataset.id;
  if (!SELL.on) return openCard(id);
  // chaque clic ajoute un exemplaire ; après le dernier, on revient à zéro
  const k = (SELL.sel[id] || 0) + 1;
  if (k > count(id)) delete SELL.sel[id]; else SELL.sel[id] = k;
  tl.outerHTML = tileHTML(BY_ID[id], { sel: SELL.sel[id] || 0 });
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
  if (!confirm(t("sell.confirm", { n, g: gain }) + (lost ? t("sell.lost", { n: lost }) : ""))) return;
  for (const [id, k] of Object.entries(SELL.sel)) { S.owned[id] -= k; if (S.owned[id] <= 0) delete S.owned[id]; S.sold += k; }
  S.points += gain; SELL.sel = {}; save(); renderHeader(); renderColl(); SFX.coin();
  toast(t("sell.done", { n, g: gain }));
};

// ===== Détail d'une carte + revente =====
function openCard(id) {
  const c = BY_ID[id], n = count(c.id);
  $("zoomImg").src = hd(c);
  $("holo").style.display = c.tier >= 2 ? "" : "none";
  $("cardInfo").innerHTML = `
    <h2>${cardName(c)} ${c.mech ? `<span class="chip mech">${c.mech}</span>` : ""}</h2>
    <div class="row muted">${setName(c.set)} (${SETS[c.set].year}) · n° ${c.num}</div>
    <div class="row">${t("card.cat")} : <b>${catName(c.cat)}</b>${c.gen ? ` · ${t("card.gen")} <b>${c.gen}</b>` : ""}</div>
    <div class="row">${t("card.rarity")} : <b style="color:var(--t${c.tier})">${TIER_ICONS[c.tier]} ${tierName(c.tier)}</b></div>
    ${c.mech ? `<div class="row">${t("card.special")} : <b>${c.mech}</b></div>` : ""}
    <div class="row">${t("card.value")} : <b>${TIER_VALUES[c.tier]} pts</b> · ${t("card.resale")} : <b>${sellPrice(c)} pts</b></div>
    <div class="row">${t("card.owned")} : <b>${n}</b></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">
      <button class="green" id="sellOne" ${n ? "" : "disabled"}>${t("card.sellOne", { p: sellPrice(c) })}</button>
      <button id="closeCard">${t("close")}</button>
    </div>
    ${n === 1 ? `<p class="muted" style="font-size:13px">${t("card.onlyOne")}</p>` : ""}`;
  $("cardModal").classList.add("on");
  $("closeCard").onclick = closeCard;
  $("sellOne").onclick = () => {
    if (!count(c.id)) return;
    if (count(c.id) === 1 && !confirm(t("card.sellLast", { name: cardName(c) }))) return;
    S.owned[c.id]--; if (!S.owned[c.id]) delete S.owned[c.id];
    S.points += sellPrice(c); S.sold++; save(); renderHeader(); SFX.coin();
    toast(`💰 +${sellPrice(c)} pts`);
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

// ===== Réglages / sauvegarde / stats =====
function renderOpt() {
  const perSet = SET_IDS.map(s => `${setName(s)} : ${CARDS.filter(c => c.set === s && count(c.id)).length} / ${CARDS.filter(c => c.set === s).length}`);
  const perTier = TIER_ICONS.map((ic, k) => `<span style="color:var(--t${k})">${ic} ${tierName(k)}</span> : ${BY_TIER[k].filter(c => count(c.id)).length} / ${BY_TIER[k].length}`);
  const acc = Object.entries(S.acc).map(([a, n]) => `${ACC_ICONS[a]} ${t("acc." + a)} ×${n}`).join(" · ");
  $("stats").innerHTML = [
    `${t("st.opened")} : <b>${S.opened}</b>`,
    `${t("st.god")} : <b>${S.godPacks}</b>`,
    `${t("st.boxes")} : <b>${S.boxesOpened}</b>`,
    `${t("st.sold")} : <b>${S.sold}</b>`,
    `${t("st.spins")} : <b>${S.spins}</b>`,
    `${t("st.decor")} : <b>${Object.keys(S.decor).length} / ${DECOR.length}</b>`,
    acc ? `${t("st.acc")} : ${acc}` : "",
    ...perTier, ...perSet,
  ].filter(Boolean).map(x => `<div>${x}</div>`).join("");
}
function exportSave() {
  const name = `sauvegarde-pokemon-${today()}.json`, json = JSON.stringify(S);
  // iPad / iPhone : menu de partage d'Apple (AirDrop vers le Mac, Enregistrer dans Fichiers, Messages…)
  try {
    const file = new File([json], name, { type: "application/json" });
    if (navigator.maxTouchPoints > 0 && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: name }).then(() => toast(t("toast.shared"))).catch(() => {});
      return;
    }
  } catch {}
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
  a.download = name; a.click();
  toast(t("toast.export"));
}
// code de sauvegarde : la partie sous forme de texte, à copier-coller (Notes, Messages, Mail…)
const toCode = obj => "PKMN1:" + btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
const fromCode = code => JSON.parse(decodeURIComponent(escape(atob(code.trim().replace(/^PKMN1:/, "").replace(/\s+/g, "")))));
function showSaveCode() {
  const code = toCode(S);
  $("buyPanel").innerHTML = `<h2 style="margin:0">${t("code.title")}</h2><p class="muted" style="margin:0">${t("code.copyHelp")}</p>
    <textarea id="codeBox" class="codebox" readonly>${code}</textarea>
    <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="gold" id="codeCopy">${t("code.copy")}</button><button id="codeClose">${t("close")}</button></div>`;
  $("buyModal").classList.add("on");
  $("codeClose").onclick = closeBuy;
  $("codeCopy").onclick = async () => {
    try { await navigator.clipboard.writeText(code); } catch { $("codeBox").select(); document.execCommand("copy"); }
    toast(t("code.copied"));
  };
}
function pasteSaveCode() {
  $("buyPanel").innerHTML = `<h2 style="margin:0">${t("code.pasteTitle")}</h2><p class="muted" style="margin:0">${t("code.pasteHelp")}</p>
    <textarea id="codeIn" class="codebox" placeholder="PKMN1:..."></textarea>
    <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="gold" id="codeLoad">${t("code.load")}</button><button id="codeClose">${t("close")}</button></div>`;
  $("buyModal").classList.add("on");
  $("codeClose").onclick = closeBuy;
  $("codeLoad").onclick = () => {
    try {
      const d = fromCode($("codeIn").value);
      if (typeof d.points !== "number" || typeof d.owned !== "object" || !d.decor) throw 0;
      if (!confirm(t("import.confirm"))) return;
      S = normalize(d); save(); closeBuy(); applyStatic(); refreshTab(); toast(t("toast.import"));
    } catch { alert(t("code.bad")); }
  };
}
$("codeShow").onclick = showSaveCode;
$("codePaste").onclick = pasteSaveCode;
function importSave() {
  if (!confirm(t("import.confirm"))) return;
  $("importFile").click();
}
$("exportBtn").onclick = $("hdrExport").onclick = exportSave;
$("importBtn").onclick = $("hdrImport").onclick = importSave;
$("importFile").onchange = async e => {
  try {
    const d = JSON.parse(await e.target.files[0].text());
    if (typeof d.points !== "number" || typeof d.owned !== "object" || !d.decor) throw 0;
    S = normalize(d); save(); applyStatic(); refreshTab(); toast(t("toast.import"));
  } catch { alert(t("import.bad")); }
  e.target.value = "";
};
$("resetBtn").onclick = () => { if (confirm(t("opt.resetConfirm"))) { const st = S.settings; S = newSave(); S.settings = st; save(); refreshTab(); } };

// ===== Onglets =====
let tab = "room";
document.querySelectorAll("nav button").forEach(b => b.onclick = () => showTab(b.dataset.tab));
function showTab(x) {
  tab = x;
  if (x !== "coll") { SELL.on = false; SELL.sel = {}; }
  document.querySelectorAll("nav button").forEach(b => b.classList.toggle("on", b.dataset.tab === x));
  document.querySelectorAll("section").forEach(s => s.classList.toggle("on", s.id === x));
  refreshTab();
}
function refreshTab() {
  renderHeader();
  if (tab === "room") renderRoom();
  if (tab === "shop") { renderShop(); $("shopTalk").textContent = rnd(t("talk")); }
  if (tab === "coll") renderColl();
  if (tab === "opt") renderOpt();
  if (tab === "gallery") renderGallery();
}
applyStatic();
refreshTab();
if (migrated) toast(t("migrated", { p: S.points }));
