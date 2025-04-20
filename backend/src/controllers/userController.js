/**
 * userController.js
 *  – Registrierung, Login (via Firebase Auth REST) und Profil‑Abruf
 */

const admin = require('firebase-admin');
const fetch = require('node-fetch');

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

/* ───────────── Helper ───────────── */
function buildFirebaseAuthUrl(endpoint) {
    return `https://identitytoolkit.googleapis.com/v1/accounts:${endpoint}?key=${FIREBASE_API_KEY}`;
}

/* ───────────── Controller ───────────── */

/**
 * POST /api/auth/register
 * Body: { email, password }
 */
exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: 'E‑Mail und Passwort erforderlich.' });

        const userRecord = await admin.auth().createUser({ email, password });
        // optional: Rolle 'user' als Custom‑Claim setzen
        await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'user' });

        res.status(201).json({ user: { uid: userRecord.uid, email } });
    } catch (err) {
        console.error('register error:', err);
        res.status(500).json({ message: 'Registrierung fehlgeschlagen.' });
    }
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Antwort: { token, user }
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const resp = await fetch(buildFirebaseAuthUrl('signInWithPassword'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, returnSecureToken: true }),
        });
        if (!resp.ok) {
            const err = await resp.json();
            return res.status(401).json({ message: err.error?.message || 'Login fehlgeschlagen.' });
        }
        const data = await resp.json();              // idToken, localId, …
        const decoded = await admin.auth().verifyIdToken(data.idToken);
        res.json({
            token: data.idToken,
            user: { uid: decoded.uid, email: decoded.email, role: decoded.role || 'user' },
        });
    } catch (err) {
        console.error('login error:', err);
        res.status(500).json({ message: 'Login fehlgeschlagen.' });
    }
};

/**
 * GET /api/auth/me
 * Header: Authorization: Bearer <JWT>
 * Liefert das aktuelle Benutzerprofil.
 */
exports.me = async (req, res) => {
    try {
        // req.user kommt aus authMiddleware
        const { uid, email, role } = req.user;
        res.json({ uid, email, role });
    } catch {
        res.status(401).json({ message: 'Nicht authentifiziert.' });
    }
};
