// ─── journal.js ──────────────────────────────────────────────────────────────
// Quick-vent journaling with rotating prompts.
// Content is intentionally never saved or sent anywhere.

const PROMPTS = [
  '"Right now I feel..."',
  '"The thing that\'s really bothering me is..."',
  '"If I could press pause on one thing..."',
  '"Something I\'m proud of this week..."',
  '"I wish someone knew that I..."',
  '"The best thing about today, even if small..."',
  '"I\'m letting go of..."',
];

function randomPrompt() {
  return PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
}

/** Called by the screen router when the journal screen becomes active. */
export function setPrompt() {
  document.getElementById('journalPrompt').textContent = randomPrompt();
  document.getElementById('journalText').value = '';
}

/** Called by the "new prompt" button. */
export function newPrompt() {
  document.getElementById('journalPrompt').textContent = randomPrompt();
}