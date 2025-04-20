// frontend/src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// VITE_ Umgebungsvariablen (werden von Vite im Build ins Frontend gebündelt)
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

// Validierung der Konfiguration
if (!apiKey || !authDomain || !projectId) {
    console.error('Fehler: Firebase-Konfiguration unvollständig:', {
        apiKey,
        authDomain,
        projectId,
    });
    throw new Error('Firebase-Konfiguration unvollständig. Bitte .env prüfen.');
}

// Firebase-Konfiguration zusammenstellen
const firebaseConfig = {
    apiKey,
    authDomain,
    projectId,
    // Optional: messagingSenderId, appId, measurementId
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);

// Auth-Modul exportieren
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;