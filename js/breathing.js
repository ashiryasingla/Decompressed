// ─── breathing.js ────────────────────────────────────────────────────────────
// Box-breathing exercise: 4-second inhale / hold / exhale / hold, 4 cycles.

import { finishActivity } from './screens.js';

const PHASES = [
  { name: 'inhale',  dur: 4, label: 'breathe in...'  },
  { name: 'hold',    dur: 4, label: 'hold...'         },
  { name: 'exhale',  dur: 4, label: 'breathe out...' },
  { name: 'hold',    dur: 4, label: 'hold...'         },
];
const CYCLE_DUR = PHASES.reduce((a, p) => a + p.dur, 0); // 16 s
const B_TOTAL   = CYCLE_DUR * 4;                          // 64 s (4 cycles)

// ── Module state ──────────────────────────────────────────────────────────
let breathInterval = null;
let bPhase = 0, bPhaseTime = 0, bCycles = 0, bTotal = 0, bRunning = false;

// ── Helpers ───────────────────────────────────────────────────────────────
function fmtTime(s) {
  const m   = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function updateBreathUI() {
  const p = PHASES[bPhase];
  document.getElementById('breathPhaseText').textContent   = p.name;
  document.getElementById('breathInstruction').textContent = p.label;
}

// ── Public API ────────────────────────────────────────────────────────────
export function resetBreathing() {
  clearInterval(breathInterval);
  bRunning = false; bPhase = 0; bCycles = 0; bTotal = 0; bPhaseTime = 0;

  document.getElementById('breathPhaseText').textContent   = 'ready?';
  document.getElementById('breathInstruction').textContent = 'Inhale · Hold · Exhale · Hold — 4 seconds each';
  document.getElementById('breathCyclesText').textContent  = '— cycles —';
  document.getElementById('breathProgress').style.width    = '0%';
  document.getElementById('breathStartBtn').style.display  = 'block';
  document.getElementById('breathCircle').style.transform  = '';
  document.getElementById('breatheTimer').textContent      = fmtTime(B_TOTAL);
}

export function startBreathing() {
  document.getElementById('breathStartBtn').style.display = 'none';
  bRunning = true; bPhase = 0; bPhaseTime = 0; bCycles = 0; bTotal = 0;
  updateBreathUI();
  breathInterval = setInterval(tickBreath, 100);
}

export function stopBreathing() {
  clearInterval(breathInterval);
  bRunning = false;
}

// ── Tick (called every 100 ms) ────────────────────────────────────────────
function tickBreath() {
  bPhaseTime += 0.1;
  bTotal     += 0.1;

  const p      = PHASES[bPhase];
  const ratio  = bPhaseTime / p.dur;
  const circle = document.getElementById('breathCircle');

  if (p.name === 'inhale')  circle.style.transform = `scale(${1 + ratio * 0.35})`;
  if (p.name === 'exhale')  circle.style.transform = `scale(${1.35 - ratio * 0.35})`;

  document.getElementById('breatheTimer').textContent   = fmtTime(Math.max(0, B_TOTAL - bTotal));
  document.getElementById('breathProgress').style.width = `${(bTotal / B_TOTAL) * 100}%`;

  if (bPhaseTime >= p.dur) {
    bPhaseTime = 0;
    bPhase     = (bPhase + 1) % PHASES.length;

    if (bPhase === 0) {
      bCycles++;
      document.getElementById('breathCyclesText').textContent = `cycle ${bCycles} of 4`;
    }

    if (bCycles >= 4) {
      clearInterval(breathInterval);
      document.getElementById('breathPhaseText').textContent   = 'done ✓';
      document.getElementById('breathInstruction').textContent = 'Beautiful. How do you feel?';
      setTimeout(finishActivity, 1500);
      return;
    }

    updateBreathUI();
  }
}
