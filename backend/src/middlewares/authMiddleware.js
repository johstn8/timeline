/**
 * Auth‑Middleware
 *  – Erwartet im Header:  Authorization: Bearer <JWT>
 *  – Verifiziert das Firebase‑JWT und setzt req.user (decodedToken).
 */

const admin = require('firebase-admin');

const authMiddleware = async (req, res, next) => {
    try {
        const auth = req.headers.authorization || '';
        const [, token] = auth.split(' ');           // "Bearer <token>"

        if (!token) {
            return res.status(401).json({ message: 'Kein Token übergeben.' });
        }

        // Firebase‑JWT prüfen
        const decoded = await admin.auth().verifyIdToken(token);
        req.user = decoded;                          // enthält uid, email, role (falls gesetzt)
        next();
    } catch (err) {
        console.error('authMiddleware error:', err);
        res.status(401).json({ message: 'Ungültiges oder abgelaufenes Token.' });
    }
};

// ✨ NEU: Admin‑Middleware
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Nur Admins erlaubt.' });
    }
};

// Beide Funktionen exportieren
module.exports = {
    authMiddleware,
    adminOnly
};
