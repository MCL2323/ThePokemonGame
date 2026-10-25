// Effets sonores synthétisés avec Web Audio (aucun fichier son nécessaire).
const SFX = (() => {
  let ctx = null, master = null;
  let enabled = true;
  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0.5; master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  // une note : fréquence, durée, forme d'onde, volume, décalage, glissando
  function tone(freq, dur, { type = "sine", vol = 0.25, at = 0, to = null, attack = 0.01 } = {}) {
    const c = ac(); if (!c || !enabled) return;
    const t0 = c.currentTime + at;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t0);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }
  // un bruit filtré (déchirure, papier, plastique…)
  function noise(dur, { vol = 0.3, at = 0, freq = 2000, q = 1, type = "bandpass", sweep = null } = {}) {
    const c = ac(); if (!c || !enabled) return;
    const t0 = c.currentTime + at;
    const buf = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * dur)), c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource(); src.buffer = buf;
    const f = c.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(freq, t0); f.Q.value = q;
    if (sweep) f.frequency.exponentialRampToValueAtTime(sweep, t0 + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t0);
  }
  const arp = (notes, step, opts) => notes.forEach((n, i) => tone(n, opts.dur || 0.25, { ...opts, at: (opts.at || 0) + i * step }));

  return {
    setEnabled(v) { enabled = v; },
    unlock() { ac(); },
    click() { tone(660, 0.06, { type: "triangle", vol: 0.12 }); },
    tick() { tone(1400, 0.03, { type: "square", vol: 0.05 }); },
    tear() { noise(0.45, { vol: 0.5, freq: 1800, sweep: 5000, q: 0.8 }); noise(0.25, { vol: 0.3, at: 0.15, freq: 3500, q: 2 }); },
    scratch() { noise(0.05, { vol: 0.08, freq: 3000, q: 3 }); },
    flip() { noise(0.12, { vol: 0.25, freq: 2500, sweep: 900, q: 1.5 }); tone(880, 0.08, { type: "triangle", vol: 0.08, at: 0.05 }); },
    slide() { noise(0.18, { vol: 0.18, freq: 1200, sweep: 600, q: 1 }); },
    place() { tone(180, 0.12, { type: "sine", vol: 0.2, to: 90 }); },
    rare() { arp([784, 988, 1175], 0.07, { type: "triangle", vol: 0.15, dur: 0.3 }); },
    ultra() { arp([659, 831, 988, 1319], 0.08, { type: "triangle", vol: 0.18, dur: 0.4 }); arp([2637, 3136, 3951], 0.06, { type: "sine", vol: 0.05, at: 0.35, dur: 0.3 }); },
    secret() {
      arp([523, 659, 784, 1047], 0.1, { type: "square", vol: 0.08, dur: 0.25 });
      tone(1047, 0.9, { type: "triangle", vol: 0.18, at: 0.42 }); tone(1319, 0.9, { type: "triangle", vol: 0.12, at: 0.42 }); tone(1568, 0.9, { type: "triangle", vol: 0.1, at: 0.42 });
      arp([3136, 3520, 3951, 4699], 0.07, { type: "sine", vol: 0.04, at: 0.5, dur: 0.25 });
    },
    coin() { tone(988, 0.08, { type: "square", vol: 0.08 }); tone(1319, 0.35, { type: "square", vol: 0.08, at: 0.08 }); },
    buy() { noise(0.08, { vol: 0.2, freq: 5000, q: 2 }); tone(1568, 0.15, { type: "triangle", vol: 0.15, at: 0.05 }); tone(2093, 0.4, { type: "triangle", vol: 0.15, at: 0.15 }); },
    win() { arp([523, 659, 784, 1047, 784, 1047], 0.09, { type: "square", vol: 0.07, dur: 0.2 }); },
    film() { for (let i = 0; i < 6; i++) noise(0.06, { vol: 0.2, at: i * 0.05 + Math.random() * 0.03, freq: 4000 + Math.random() * 3000, q: 4 }); },
    lid() { noise(0.3, { vol: 0.2, freq: 400, sweep: 1500, q: 0.7 }); tone(140, 0.25, { vol: 0.15, to: 220, at: 0.05 }); },
    pop() { tone(500, 0.12, { type: "sine", vol: 0.15, to: 900 }); },
  };
})();
