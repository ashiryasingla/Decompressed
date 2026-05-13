// ─── sound.js ────────────────────────────────────────────────────────────────
// Web Audio API soundscapes: rain, ocean, forest, café.

let audioCtx     = null;
let currentSound = null;
const soundNodes = {};

// ── AudioContext (lazy init, avoids autoplay policy issues) ───────────────
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

// ── Noise synthesis ───────────────────────────────────────────────────────
/**
 * Creates a looping noise node tailored to each soundscape type.
 * Returns { src, gain } so callers can stop/adjust later.
 */
function makeNoise(type) {
  const ctx  = getCtx();
  const gain = ctx.createGain();
  gain.gain.value = parseFloat(document.getElementById('volSlider').value) * 0.3;
  gain.connect(ctx.destination);

  const src = ctx.createBufferSource();
  const sz  = ctx.sampleRate * 4;
  const buf = ctx.createBuffer(1, sz, ctx.sampleRate);
  const d   = buf.getChannelData(0);

  if (type === 'rain') {
    for (let i = 0; i < sz; i++) d[i] = (Math.random() * 2 - 1) * 0.8;
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1200; f.Q.value = 0.5;
    src.connect(f); f.connect(gain);

  } else if (type === 'ocean') {
    for (let i = 0; i < sz; i++) {
      const w = Math.sin(i / ctx.sampleRate * Math.PI * 0.3) * 0.5 + 0.5;
      d[i] = (Math.random() * 2 - 1) * w;
    }
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 600;
    src.connect(f); f.connect(gain);

  } else if (type === 'forest') {
    for (let i = 0; i < sz; i++) {
      const chirp = (i % Math.floor(ctx.sampleRate * 0.8)) < 400 ? Math.sin(i * 0.05) * 0.4 : 0;
      d[i] = (Math.random() * 2 - 1) * 0.15 + chirp;
    }
    src.connect(gain);

  } else { // café
    for (let i = 0; i < sz; i++) d[i] = (Math.random() * 2 - 1) * 0.3;
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 300; f.Q.value = 0.3;
    src.connect(f); f.connect(gain);
  }

  src.buffer = buf;
  src.loop   = true;
  src.start();
  return { src, gain };
}

// ── Public API ────────────────────────────────────────────────────────────
export function playSound(type) {
  stopSound();
  currentSound = type;
  document.querySelectorAll('.sound-card').forEach(c => c.classList.remove('active'));
  document.getElementById(`sc-${type}`).classList.add('active');
  soundNodes[type] = makeNoise(type);
}

export function stopSound() {
  if (currentSound && soundNodes[currentSound]) {
    try { soundNodes[currentSound].src.stop(); } catch (_) {}
    delete soundNodes[currentSound];
  }
  currentSound = null;
  document.querySelectorAll('.sound-card').forEach(c => c.classList.remove('active'));
}

export function setVolume(v) {
  if (currentSound && soundNodes[currentSound]) {
    soundNodes[currentSound].gain.gain.value = parseFloat(v) * 0.3;
  }
}
