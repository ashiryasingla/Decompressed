import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2hLSS-5kPYpV_Q8a61SdlXVsWY2Nt_AM",
  authDomain: "decompressed-ash.firebaseapp.com",
  projectId: "decompressed-ash",
  storageBucket: "decompressed-ash.firebasestorage.app",
  messagingSenderId: "264406149393",
  appId: "1:264406149393:web:c31a3e0ac87568f51244b0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, addDoc, collection, serverTimestamp };
