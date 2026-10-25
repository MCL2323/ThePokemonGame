// ===== Pages en plus : tâches du jour et « Rate das Pokémon » =====

// ---------- Tâches du jour ----------
// Chaque jour, 3 tâches tirées au hasard (les mêmes toute la journée), + un bonus si les 3 sont faites.
const QUESTS = [
  { id: "boosters", icon: "🎴", target: 3, reward: 60 },
  { id: "box",      icon: "📦", target: 1, reward: 80 },
  { id: "sell",     icon: "💰", target: 5, reward: 40 },
  { id: "newcards", icon: "✨", target: 5, reward: 60 },
  { id: "rare",     icon: "🌟", target: 1, reward: 80 },
  { id: "wheel",    icon: "🎡", target: 1, reward: 30 },
  { id: "decor",    icon: "🛋️", target: 1, reward: 40 },
  { id: "guess",    icon: "❓", target: 5, reward: 50 },
  { id: "guessHard", icon: "🔴", target: 2, reward: 70 },
];
const QUEST_BONUS = 100;
// tirage « au hasard » mais toujours le même pour une date donnée
function seeded(str) { let h = 2166136261; for (const ch of str) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296; }
function ensureQuests() {
  if (S.quests && S.quests.date === today()) return;
  const r = seeded(today()), pool = QUESTS.slice();
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  S.quests = { date: today(), list: pool.slice(0, 3).map(q => ({ id: q.id, prog: 0, claimed: false })), bonus: false };
  save();
}
// appelée par le jeu à chaque action (ouvrir un booster, vendre, deviner…)
function questProgress(id, n = 1) {
  ensureQuests();
  let changed = false;
  for (const q of S.quests.list) {
    const def = QUESTS.find(x => x.id === q.id);
    if (q.id === id && q.prog < def.target) { q.prog = Math.min(def.target, q.prog + n); changed = true; if (q.prog >= def.target) toast(t("q.doneToast", { txt: questText(def) })); }
  }
  if (changed) { save(); questBadge(); if (tab === "quests") renderQuests(); }
}
const questText = def => t("q." + def.id, { n: def.target });
function questBadge() {
  ensureQuests();
  const ready = S.quests.list.some(q => !q.claimed && q.prog >= QUESTS.find(x => x.id === q.id).target) || (!S.quests.bonus && S.quests.list.every(q => q.claimed));
  document.querySelector('[data-tab="quests"]').classList.toggle("badge", ready);
}
function renderQuests() {
  ensureQuests();
  const now = new Date(), mid = new Date(now); mid.setHours(24, 0, 0, 0);
  const left = Math.max(0, mid - now), hh = Math.floor(left / 3600000), mm = Math.floor(left / 60000) % 60;
  const allDone = S.quests.list.every(q => q.claimed);
  $("questList").innerHTML = S.quests.list.map((q, i) => {
    const def = QUESTS.find(x => x.id === q.id), pct = Math.round(q.prog / def.target * 100), ok = q.prog >= def.target;
    return `<div class="quest ${q.claimed ? "claimed" : ok ? "ready" : ""}">
      <div class="qicon">${def.icon}</div>
      <div class="qbody"><b>${questText(def)}</b>
        <div class="qbar"><div style="width:${pct}%"></div><span>${q.prog} / ${def.target}</span></div></div>
      <div class="qreward">${q.claimed ? "✅" : ok ? `<button class="gold" data-claim="${i}">+${def.reward} pts</button>` : `+${def.reward} pts`}</div>
    </div>`;
  }).join("") + `<div class="quest bonus ${S.quests.bonus ? "claimed" : allDone ? "ready" : ""}">
      <div class="qicon">🏆</div><div class="qbody"><b>${t("q.bonus")}</b></div>
      <div class="qreward">${S.quests.bonus ? "✅" : allDone ? `<button class="gold" data-claim="bonus">+${QUEST_BONUS} pts</button>` : `+${QUEST_BONUS} pts`}</div></div>`;
  $("questTimer").textContent = t("q.timer", { h: hh, m: String(mm).padStart(2, "0") });
  $("questList").querySelectorAll("[data-claim]").forEach(b => b.onclick = () => {
    if (b.dataset.claim === "bonus") { if (!allDone || S.quests.bonus) return; S.quests.bonus = true; S.points += QUEST_BONUS; SFX.win(); }
    else {
      const q = S.quests.list[+b.dataset.claim], def = QUESTS.find(x => x.id === q.id);
      if (q.claimed || q.prog < def.target) return;
      q.claimed = true; S.points += def.reward; SFX.coin();
    }
    save(); renderHeader(); renderQuests(); questBadge();
  });
}

// ---------- Rate das Pokémon ----------
// Leicht : le Pokémon entier en ombre (1re génération). Mittel : un morceau en couleur (gén. 1 à 4).
// Schwer : un petit morceau en couleur (toutes les générations).
const GUESS_LEVELS = {
  easy:   { icon: "🟢", reward: 5,  maxGen: 1, zoom: 1,   shadow: true },
  medium: { icon: "🟡", reward: 10, maxGen: 4, zoom: 2.6, shadow: false },
  hard:   { icon: "🔴", reward: 20, maxGen: 9, zoom: 3.8, shadow: false },
};
const GQ = { level: "easy", cur: null, answered: false, streak: 0 };
const pokeName = p => ({ de: p[2], fr: p[3], en: p[4] })[lang()] || p[2];
function newGuess() {
  const L = GUESS_LEVELS[GQ.level];
  const pool = POKE.filter(p => p[1] <= L.maxGen);
  const ans = rnd(pool);
  const others = shuffle(pool.filter(p => p[0] !== ans[0] && pokeName(p) !== pokeName(ans))).slice(0, 2);
  const pt = ans[5].length ? rnd(ans[5]) : [0.5, 0.5];
  GQ.cur = { ans, choices: shuffle([ans, ...others]), pt };
  GQ.answered = false;
  renderGuess();
}
function picStyle(L, pt, reveal) {
  if (reveal || L.zoom === 1) return `width:100%;left:0;top:0;`;
  // on centre la vue sur un point du Pokémon, sans sortir de l'image
  const z = L.zoom, clamp = v => Math.min(0, Math.max(100 - z * 100, v));
  return `width:${z * 100}%;left:${clamp(50 - pt[0] * z * 100)}%;top:${clamp(50 - pt[1] * z * 100)}%;`;
}
function renderGuess() {
  const L = GUESS_LEVELS[GQ.level];
  document.querySelectorAll("#guessLevels button").forEach(b => b.classList.toggle("on", b.dataset.level === GQ.level));
  if (!GQ.cur) return newGuess();
  const { ans, choices, pt } = GQ.cur, rev = GQ.answered;
  $("guessPic").innerHTML = `<img src="poke/${ans[0]}.webp" alt="" class="${L.shadow && !rev ? "shadow" : ""}" style="${picStyle(L, pt, rev)}">`;
  $("guessChoices").innerHTML = choices.map(p => {
    let cls = "";
    if (rev) cls = p[0] === ans[0] ? "right" : (GQ.picked === p[0] ? "wrong" : "dim");
    return `<button class="gchoice ${cls}" data-p="${p[0]}" ${rev ? "disabled" : ""}>${pokeName(p)}</button>`;
  }).join("");
  $("guessInfo").innerHTML = rev
    ? (GQ.picked === ans[0] ? t("g.right", { name: pokeName(ans), p: L.reward }) : t("g.wrong", { name: pokeName(ans) }))
    : t("g.question");
  $("guessNext").style.visibility = rev ? "visible" : "hidden";
  $("guessStreak").textContent = t("g.streak", { n: GQ.streak, best: S.guessBest || 0 });
  $("guessChoices").querySelectorAll(".gchoice").forEach(b => b.onclick = () => answerGuess(+b.dataset.p));
}
function answerGuess(id) {
  if (GQ.answered) return;
  GQ.answered = true; GQ.picked = id;
  const L = GUESS_LEVELS[GQ.level], ok = id === GQ.cur.ans[0];
  if (ok) {
    S.points += L.reward; GQ.streak++; S.guessBest = Math.max(S.guessBest || 0, GQ.streak);
    S.guessRight = (S.guessRight || 0) + 1;
    SFX.rare(); questProgress("guess", 1); if (GQ.level === "hard") questProgress("guessHard", 1);
  } else { GQ.streak = 0; SFX.place(); }
  save(); renderHeader(); renderGuess();
}
document.querySelectorAll("#guessLevels button").forEach(b => b.onclick = () => { GQ.level = b.dataset.level; GQ.streak = 0; newGuess(); });
$("guessNext").onclick = newGuess;

// ---------- branchement sur les onglets ----------
const _refreshTab = refreshTab;
refreshTab = function () {
  _refreshTab();
  if (tab === "quests") renderQuests();
  if (tab === "guess") renderGuess();
  questBadge();
};
questBadge();
setInterval(() => { if (tab === "quests") renderQuests(); else questBadge(); }, 60000);
