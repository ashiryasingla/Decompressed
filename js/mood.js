// ─── mood.js ─────────────────────────────────────────────────────────────────
// Mood selection, tool config, and tool-card rendering.

import { showScreen }    from './screens.js';
import { openChatEntry } from './chat.js';

// ── Mood definitions ──────────────────────────────────────────────────────
export const MOODS = {
  anxious: {
    verb: 'slow down',
    color: 'mood-anxious',
    tools: ['breathe', 'journal', 'sound', 'chat'],
    emoji: '😤',
    room: 'Anxious Room',
  },
  burnt: {
    verb: 'recharge',
    color: 'mood-burnt',
    tools: ['sound', 'journal', 'sand', 'chat'],
    emoji: '🔥',
    room: 'Burnt Out Room',
  },
  overwhelmed: {
    verb: 'simplify',
    color: 'mood-overwhelmed',
    tools: ['breathe', 'sound', 'journal', 'chat'],
    emoji: '🌊',
    room: 'Overwhelmed Room',
  },
  numb: {
    verb: 'wake up',
    color: 'mood-numb',
    tools: ['sand', 'sound', 'journal', 'chat'],
    emoji: '🫥',
    room: 'Numb Room',
  },
};

// ── Tool definitions ──────────────────────────────────────────────────────
export const TOOLS = {
  breathe: { icon: '🌬️', name: 'Box Breathing',   time: '~4 min',           bg: '#1a1a2e', fn: () => showScreen('breathe') },
  journal: { icon: '✏️',  name: 'Quick Vent',       time: '~3 min',           bg: '#1a1a22', fn: () => showScreen('journal') },
  sound:   { icon: '🎧', name: 'Soundscape',        time: '~5 min',           bg: '#1a1a2a', fn: () => showScreen('sound')   },
  sand:    { icon: '🌊', name: 'Sand Drawing',      time: 'open-ended · zen', bg: '#111820', fn: () => showScreen('sand')    },
  chat:    { icon: '💬', name: 'Talk to Someone',   time: 'anonymous · live', bg: '#141420', fn: () => openChatEntry()       },
};

// ── Active mood state ─────────────────────────────────────────────────────
export let currentMood = 'overwhelmed';

/**
 * Called when the user taps a mood button on the landing screen.
 * @param {string} mood - One of the MOODS keys.
 */
export function pickMood(mood) {
  currentMood = mood;
  document.body.className = MOODS[mood].color;
  document.getElementById('moodVerb').textContent = MOODS[mood].verb;

  document.getElementById('toolCards').innerHTML = MOODS[mood].tools
    .map(k => {
      const t = TOOLS[k];
      return `
        <div class="tool-card" onclick="TOOLS['${k}'].fn()">
          <div class="tool-icon" style="background:${t.bg}">${t.icon}</div>
          <div class="tool-info">
            <div class="tool-name">${t.name}</div>
            <div class="tool-time">${t.time}</div>
          </div>
          <div class="tool-arrow">›</div>
        </div>`;
    })
    .join('');

  showScreen('tools');
}
