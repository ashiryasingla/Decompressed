// ─── main.js ─────────────────────────────────────────────────────────────────
import { pickMood, TOOLS, trackTool }            from './mood.js';
import { initAuth, doSignup, doLogin, logout }   from './auth.js';
import { showScreen, finishActivity }            from './screens.js';
import { startBreathing }                        from './breathing.js';
import { newPrompt }                             from './journal.js';
import { playSound, stopSound, setVolume }       from './sound.js';
import { setSandColor, clearSand, stopSand }     from './sand.js';
import {
  openChatEntry, enterChat, sendMessage,
  leaveChat, handleChatKey, autoResize,
}                                                from './chat.js';

// ── Boot ─────────────────────────────────────────────────────────────────
initAuth();

// ── Expose to global scope for inline onclick handlers ───────────────────
Object.assign(window, {
  // auth
  doSignup, doLogin, logout,
  // navigation
  showScreen, finishActivity,
  // mood & tools
  pickMood, TOOLS, trackTool,
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
