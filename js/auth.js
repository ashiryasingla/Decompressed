// ─── auth.js ────────────────────────────────────────────────────────────────
// Handles signup, login, logout, and session persistence.
// Uses sessionStorage as a simulated backend — swap getDB/saveDB for real API calls.

import { showScreen } from './screens.js';
import { randName, randNameRandom } from './names.js';
import { db, addDoc, collection, serverTimestamp } from './firebase.js';

// ── Simulated user database (sessionStorage) ──────────────────────────────
function getDB() {
  try { return JSON.parse(sessionStorage.getItem('dcDB') || '{}'); } catch (e) { return {}; }
}
function saveDB(db) { sessionStorage.setItem('dcDB', JSON.stringify(db)); }

// ── Exported current user ────────────────────────────────────────────────
export let currentUser = null;

// ── Startup: restore existing session or go to signup ───────────────────
export function initAuth() {
  document.getElementById('namePreview').textContent = randNameRandom();
  const saved = sessionStorage.getItem('dcUser');
  if (saved) {
    currentUser = JSON.parse(saved);
    enterApp();
  } else {
    showScreen('signup');
  }
}

// ── Signup ───────────────────────────────────────────────────────────────
export async function doSignup() {
  const emailEl = document.getElementById('signupEmail');
  const errEl   = document.getElementById('signupErr');
  const email   = emailEl.value.trim().toLowerCase();

  if (!isValidEmail(email)) {
    emailEl.classList.add('error');
    errEl.classList.add('show');
    return;
  }
  emailEl.classList.remove('error');
  errEl.classList.remove('show');

  const localDB = getDB();  // renamed from db to localDB
  if (localDB[email]) {
    currentUser = localDB[email];
  } else {
    const name = randName(email);
    currentUser = { email, name, joined: Date.now() };
    localDB[email] = currentUser;
    saveDB(localDB);

    // Save new user to Firebase
    await addDoc(collection(db, "users"), {
      email: email,
      name: name,
      joined: serverTimestamp()
    });
  }

  sessionStorage.setItem('dcUser', JSON.stringify(currentUser));
  enterApp();
}


// ── Login ────────────────────────────────────────────────────────────────
export function doLogin() {
  const emailEl = document.getElementById('loginEmail');
  const errEl   = document.getElementById('loginErr');
  const email   = emailEl.value.trim().toLowerCase();

  if (!isValidEmail(email)) {
    emailEl.classList.add('error');
    errEl.classList.add('show');
    return;
  }

  const localDB = getDB();
  if (!localDB[email]) {
    emailEl.classList.add('error');
    errEl.textContent = "We couldn't find that email. Try signing up instead.";
    errEl.classList.add('show');
    return;
  }

  emailEl.classList.remove('error');
  errEl.classList.remove('show');
  currentUser = localDB[email];
  sessionStorage.setItem('dcUser', JSON.stringify(currentUser));
  enterApp();
}


// ── Logout ───────────────────────────────────────────────────────────────
export function logout() {
  sessionStorage.removeItem('dcUser');
  currentUser = null;
  document.getElementById('namePreview').textContent = randNameRandom();
  showScreen('signup');
}

// ── Internal helpers ──────────────────────────────────────────────────────
function enterApp() {
  document.getElementById('chipName').textContent = currentUser.name;
  document.getElementById('displayNamePreview').textContent = currentUser.name;
  showScreen('landing');
}

function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}
