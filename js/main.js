// ─── main.js ─────────────────────────────────────────────────────────────────
// App entry point. Imports all modules and wires up the global functions
// that HTML onclick attributes call directly.
import { pickMood, TOOLS, trackTool } from './mood.js';
import { initAuth, doSignup, doLogin, logout }  from './auth.js';
import { showScreen, finishActivity }            from './screens.js';
import { pickMood, TOOLS }                       from './mood.js';
import { startBreathing }                        from './breathing.js';
import { newPrompt }                             from './journal.js';
import { playSound, stopSound, setVolume }       from './sound.js';
import { setSandColor, clearSand, stopSand }     from './sand.js';
import {
  openChatEntry, enterChat, sendMessage,
  leaveChat, handleChatKey, autoResize,
}                                                from './chat.js';

// ── Boot ──────────────────────────────────────────────────────────────────
initAuth();

// ── Expose to global scope for inline onclick handlers ────────────────────
// (Replace with addEventListener calls if you prefer no globals.)
Object.assign(window, {
  // auth
  doSignup, doLogin, logout,
  // navigation
  showScreen, finishActivity,
  // mood & tools
  pickMood, TOOLS,
  // breathing
  startBreathing,
  // journal
  newPrompt,
  // sound
  playSound, stopSound, setVolume,
  // sand
  setSandColor, clearSand, stopSand,
  // chat
  openChatEntry, enterChat, sendMessage,
  leaveChat, handleChatKey, autoResize,
});
