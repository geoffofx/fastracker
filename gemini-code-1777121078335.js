import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, onSnapshot, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// TODO: Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// The dynamic variables
const SIXTEEN_HOURS_MS = 16 * 60 * 60 * 1000;
let fastStartTime = null;

const progressBar = document.getElementById('progress-bar');
const timerDisplay = document.getElementById('timer-display');
const resetBtn = document.getElementById('reset-btn');

// Sync with Database in real-time
// We use a hardcoded document ID 'my-fast' since it's just for you
const fastDocRef = doc(db, 'fasting', 'my-fast');

onSnapshot(fastDocRef, (docSnap) => {
    if (docSnap.exists()) {
        fastStartTime = docSnap.data().startTime;
        updateUI();
    }
});

// Update the Progress Bar and Timer mathematically
function updateUI() {
    if (!fastStartTime) return;

    const now = Date.now();
    const elapsedMs = Math.max(0, now - fastStartTime); // Prevent negative time
    
    // Calculate percentage (capped at 100%)
    const percentage = Math.min((elapsedMs / SIXTEEN_HOURS_MS) * 100, 100);
    progressBar.value = percentage;

    // Calculate HH:MM:SS
    const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);

    timerDisplay.innerText = 
        `${String(hours).padStart(2, '0')}h ` +
        `${String(minutes).padStart(2, '0')}m ` +
        `${String(seconds).padStart(2, '0')}s`;
}

// Reset the timer and push new timestamp to cloud
resetBtn.addEventListener('click', async () => {
    const newStartTime = Date.now();
    await setDoc(fastDocRef, { startTime: newStartTime });
});

// Tick the UI every second
setInterval(updateUI, 1000);

// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}