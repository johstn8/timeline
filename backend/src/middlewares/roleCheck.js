/**
 * Rolle‑Middleware(n)
 * – adminOnly  : erlaubt Zugriff nur für Benutzer mit role === 'admin'
 * – allowRoles : generische Factory für beliebige Rollen‑Arrays
 *
 * Die Rolle kann
 *   1) im JWT‑Custom‑Claim `role`
 *   2) oder (Fallback) im Firestore‑Dokument `users/{uid}.role`
 * stehen.
 */

const admin = require('firebase-admin');

async function fetchRoleFromFirestore(uid) {
    try {
        const doc = await admin.firestore().collection('users').doc(uid).get();
        if (!doc.exists) return null;
        return doc.data().role || null;
    } catch {
        return null;
    }
}

async function resolveRole(req) {
    // 1) Custom‑Claim (empfohlen)
    if (req.user?.role) return req.user.role;

    // 2) Fallback Firestore
    if (req.user?.uid) return await fetchRoleFromFirestore(req.user.uid);

    return null;
}

exports.allowRoles = (...roles) => {
    return async (req, res, next) => {
        const userRole = await resolveRole(req);

        if (!userRole || !roles.includes(userRole)) {
            return res
                .status(403)
                .json({ message: 'Zugriff verweigert: unzureichende Berechtigungen.' });
        }
        next();
    };
};

// Kurzform nur für Admins
exports.adminOnly = exports.allowRoles('admin');
