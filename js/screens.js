// ─── screens.js ──────────────────────────────────────────────────────────────
// Central screen router. Calls per-screen init/teardown hooks as needed.

import { resetBreathing }  from './breathing.js';
import { setPrompt }       from './journal.js';
import { initSand, stopSand } from './sand.js';
import { stopSound }       from './sound.js';

/**
 * Show a named screen and hide all others.
 * @param {string} id - The id of the target <div class="screen">.
 */
export function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  // Per-screen setup
  if (id === 'breathe') resetBreathing();
  if (id === 'journal') setPrompt();
  if (id === 'sand')    initSand();

  // Teardown when leaving sand
  if (id !== 'sand') stopSand();

  window.scrollTo(0, 0);
}

/** Shared "finished an activity" handler. */
export function finishActivity() {
  stopSound();
  stopSand();
  showScreen('done');
}
