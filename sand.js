// ─── sand.js ─────────────────────────────────────────────────────────────────
// Meditative canvas drawing with a slow fade effect.

let sandFadeInterval = null;
let sandDrawing      = false;
let sandColor        = '#a78bfa';

// ── Init (called each time the sand screen becomes active) ────────────────
export function initSand() {
  stopSand(); // clear any existing interval first

  const canvas = document.getElementById('sandCanvas');
  const ctx    = canvas.getContext('2d');

  // Fit canvas width to viewport on mobile
  const maxW = Math.min(460, window.innerWidth - 48);
  canvas.width  = maxW;
  canvas.height = Math.round(maxW * 0.7);

  // Dark background
  ctx.fillStyle = '#0e0e18';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ── Input helpers ──────────────────────────────────────────────────────
  function getPos(e) {
    const rect   = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    const src    = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top)  * scaleY,
    };
  }

  function drawSand(x, y, px, py) {
    if (px === null) { px = x; py = y; }
    const dist  = Math.hypot(x - px, y - py);
    const steps = Math.max(1, Math.floor(dist / 2));

    for (let s = 0; s <= steps; s++) {
      const t  = steps === 0 ? 0 : s / steps;
      const cx = px + (x - px) * t;
      const cy = py + (y - py) * t;

      // Soft radial stroke
      const r    = 5 + Math.random() * 4;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, sandColor + 'cc');
      grad.addColorStop(1, sandColor + '00');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Scatter particles
      for (let p = 0; p < 4; p++) {
        const angle = Math.random() * Math.PI * 2;
        const dist2 = Math.random() * 12;
        const px2   = cx + Math.cos(angle) * dist2;
        const py2   = cy + Math.sin(angle) * dist2;
        const pr    = 0.5 + Math.random() * 1.5;
        const alpha = Math.floor(Math.random() * 80 + 40).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(px2, py2, pr, 0, Math.PI * 2);
        ctx.fillStyle = sandColor + alpha;
        ctx.fill();
      }
    }
  }

  // ── Event handlers ─────────────────────────────────────────────────────
  let lastX = null, lastY = null;

  function onStart(e) { e.preventDefault(); sandDrawing = true; const { x, y } = getPos(e); lastX = x; lastY = y; drawSand(x, y, null, null); }
  function onMove(e)  { e.preventDefault(); if (!sandDrawing) return; const { x, y } = getPos(e); drawSand(x, y, lastX, lastY); lastX = x; lastY = y; }
  function onEnd()    { sandDrawing = false; lastX = null; lastY = null; }

  canvas.addEventListener('mousedown',  onStart);
  canvas.addEventListener('mousemove',  onMove);
  canvas.addEventListener('mouseup',    onEnd);
  canvas.addEventListener('mouseleave', onEnd);
  canvas.addEventListener('touchstart', onStart, { passive: false });
  canvas.addEventListener('touchmove',  onMove,  { passive: false });
  canvas.addEventListener('touchend',   onEnd);

  // ── Slow fade (like sand smoothing out) ────────────────────────────────
  sandFadeInterval = setInterval(() => {
    ctx.save();
    ctx.globalAlpha = 0.012;
    ctx.fillStyle   = '#0e0e18';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }, 80);
}

// ── Public API ────────────────────────────────────────────────────────────
export function setSandColor(btn) {
  document.querySelectorAll('.sand-color-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  sandColor = btn.dataset.color;
}

export function clearSand() {
  const canvas = document.getElementById('sandCanvas');
  const ctx    = canvas.getContext('2d');
  ctx.fillStyle = '#0e0e18';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function stopSand() {
  clearInterval(sandFadeInterval);
  sandFadeInterval = null;
  sandDrawing      = false;
}