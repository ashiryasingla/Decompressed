// ─── chat.js ─────────────────────────────────────────────────────────────────
// Anonymous mood-based chat rooms with simulated peer messages.

import { currentUser }  from './auth.js';
import { currentMood }  from './mood.js';
import { MOODS }        from './mood.js';
import { showScreen, finishActivity } from './screens.js';
import { randNameRandom } from './names.js';

// ── Scripted room messages keyed by mood ─────────────────────────────────
const SCRIPTS = {
  anxious: [
    "just got here. can't stop my brain today",
    "same. my heart's been racing since this morning 😮‍💨",
    "it honestly helps just to type it out",
    "anyone else get anxious about being anxious? lol",
    "yes that's literally me rn 😭",
    "the breathing exercise helped a little btw",
    "i keep thinking about everything that could go wrong",
    "me too. just trying to take it one minute at a time",
    "you're doing ok. seriously. 💛",
    "we got this. one breath at a time.",
  ],
  burnt: [
    "i have zero energy for anything right now",
    "same. been running on coffee and stress for weeks",
    "when did rest stop feeling restful",
    "i feel guilty for being tired which makes it worse",
    "that guilt thing is SO real omg",
    "you're allowed to be tired. full stop.",
    "i just need one day where nothing is expected of me",
    "honestly just being here feels like enough for today",
    "💛 slow down. you're doing enough.",
    "rest is not laziness. rest is survival.",
  ],
  overwhelmed: [
    "i don't even know where to start with everything",
    "i made a to-do list and then just stared at it",
    "sometimes i close all my tabs and pretend tasks don't exist",
    "that's so valid honestly",
    "my brain is doing that thing where everything feels urgent",
    "pick ONE thing. just one. the rest can wait.",
    "that actually helps to hear, thank you",
    "you're not behind. you're human. 💛",
    "progress not perfection",
    "you're going to be ok. for real.",
  ],
  numb: [
    "i feel like i'm watching my life from outside my body",
    "yes. like nothing feels real. everything is muted.",
    "i don't feel sad exactly. just… flat.",
    "flat is exactly the word i was looking for",
    "sometimes i just need someone to acknowledge i exist lol",
    "you exist. i see you. 💙",
    "that actually helped more than i expected",
    "same. thank you for being here.",
    "being seen matters even through a screen",
    "💙 you're not invisible.",
  ],
};

const WARM_REPLIES = [
  "that makes sense. you're not alone in that 💛",
  "i feel that", "thank you for sharing", "same honestly",
  "sending you calm energy 🌿", "you're doing better than you think",
  "it takes courage to say that", "yeah… it really is like that sometimes",
  "we've got you", "💙", "💛", "🌿", "that means a lot",
  "you're not invisible here",
];

const BOT_NAMES = [
  'Quiet Harbor', 'Soft Ember', 'Still Candle', 'Warm Shore',
  'Pale Cedar', 'Free Tide', 'Calm Moss', 'Tender Leaf',
];

// ── Module state ──────────────────────────────────────────────────────────
let chatTimers     = [];
let chatOnlineTimer  = null;
let chatClearTimer   = null;

// ── Entry modal ───────────────────────────────────────────────────────────
export function openChatEntry() {
  const name = currentUser ? currentUser.name : randNameRandom();
  document.getElementById('displayNamePreview').textContent = name;
  document.getElementById('kindnessOverlay').classList.remove('hidden');
}

export function enterChat() {
  document.getElementById('kindnessOverlay').classList.add('hidden');
  const m = MOODS[currentMood];
  document.getElementById('chatRoomEmoji').textContent = m.emoji;
  document.getElementById('chatRoomName').textContent  = m.room;
  showScreen('chat');
  initChatRoom();
}

// ── Room setup ────────────────────────────────────────────────────────────
function initChatRoom() {
  chatTimers.forEach(clearTimeout); chatTimers = [];
  clearInterval(chatOnlineTimer);
  clearInterval(chatClearTimer);

  const msgs = document.getElementById('chatMessages');
  msgs.innerHTML = '<div class="autoclear-notice">messages clear every 10 min · you appear as your anonymous name</div>';

  // Build a small pool of fake peers with unique names
  const pool = [];
  const used = new Set([currentUser?.name]);
  for (let i = 0; i < 4; i++) {
    let n;
    do { n = randNameRandom(); } while (used.has(n));
    used.add(n);
    pool.push(n);
  }

  // System join message
  chatTimers.push(setTimeout(() => addMsg('system', `${currentUser?.name || 'Someone'} joined the room`), 500));

  // Drip in scripted messages
  const script = (SCRIPTS[currentMood] || SCRIPTS.overwhelmed).slice();
  let delay = 1400;
  script.forEach(text => {
    delay += 2200 + Math.random() * 3500;
    const name = pool[Math.floor(Math.random() * pool.length)];
    chatTimers.push(setTimeout(() => {
      if (document.getElementById('chat').classList.contains('active')) addMsg('theirs', text, name);
    }, delay));
  });

  // Simulated online count
  let base = 2 + Math.floor(Math.random() * 3);
  document.getElementById('onlineCount').textContent = countStr(base + 1);
  chatOnlineTimer = setInterval(() => {
    base = Math.max(1, base + (Math.random() > 0.5 ? 1 : -1));
    document.getElementById('onlineCount').textContent = countStr(base + 1);
  }, 9000);

  // Auto-clear every 10 minutes
  chatClearTimer = setInterval(() => {
    msgs.innerHTML = '<div class="autoclear-notice">messages cleared · fresh start 🌱</div>';
  }, 10 * 60 * 1000);
}

// ── Messaging ─────────────────────────────────────────────────────────────
export function sendMessage() {
  const inp  = document.getElementById('chatInput');
  const text = inp.value.trim();
  if (!text) return;
  inp.value = '';
  inp.style.height = '';
  addMsg('mine', text);

  // Occasional warm reply from a bot peer
  if (Math.random() > 0.38) {
    const t = setTimeout(() => {
      if (document.getElementById('chat').classList.contains('active')) {
        const reply = WARM_REPLIES[Math.floor(Math.random() * WARM_REPLIES.length)];
        const name  = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
        addMsg('theirs', reply, name);
      }
    }, 1100 + Math.random() * 2400);
    chatTimers.push(t);
  }
}

export function leaveChat() {
  addMsg('system', `${currentUser?.name || 'Someone'} is feeling better and left 💚`);
  chatTimers.forEach(clearTimeout); chatTimers = [];
  clearInterval(chatOnlineTimer);
  clearInterval(chatClearTimer);
  setTimeout(finishActivity, 700);
}

export function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
}

export function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

// ── Internal helpers ──────────────────────────────────────────────────────
function countStr(n) { return n === 1 ? '1 person' : `${n} people`; }

function addMsg(type, text, name) {
  const msgs = document.getElementById('chatMessages');
  const d    = document.createElement('div');
  d.className = `chat-msg ${type}`;

  if (type === 'system') {
    d.innerHTML = `<div class="msg-bubble">${esc(text)}</div>`;
  } else if (type === 'mine') {
    d.innerHTML = `<div class="msg-bubble">${esc(text)}</div>
                   <div class="msg-name" style="color:var(--accent)">${esc(currentUser?.name || 'you')}</div>`;
  } else {
    d.innerHTML = `<div class="msg-name">${esc(name || '')}</div>
                   <div class="msg-bubble">${esc(text)}</div>`;
  }

  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}