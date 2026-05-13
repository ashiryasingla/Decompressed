<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyB2hLSS-5kPYpV_Q8a61SdlXVsWY2Nt_AM",
    authDomain: "decompressed-ash.firebaseapp.com",
    projectId: "decompressed-ash",
    storageBucket: "decompressed-ash.firebasestorage.app",
    messagingSenderId: "264406149393",
    appId: "1:264406149393:web:c31a3e0ac87568f51244b0",
    measurementId: "G-37Z234V2P6"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
