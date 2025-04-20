// backend/setAdminClaim.js

/**
 * Skript, um eine Liste von UIDs als Admins zu markieren.
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../config/.env') });
const admin = require('firebase-admin');
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
if (!serviceAccountPath) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_PATH ist nicht definiert – bitte .env prüfen!');
}

const serviceAccount = require(path.resolve(__dirname, '../../../', serviceAccountPath));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// 2) UIDs aus der .env einlesen und als Array parsen
const raw = process.env.ADMIN_UIDS || '';
const uids = raw.split(',').map(s => s.trim()).filter(Boolean);
if (uids.length === 0) {
    console.error('Keine ADMIN_UIDS in der .env gefunden.');
    process.exit(1);
}

// 3) Für jede UID den Claim setzen
Promise.all(
    uids.map(uid =>
        admin
            .auth()
            .setCustomUserClaims(uid, { role: 'admin' })
            .then(() => console.log(`✔️  ${uid} ist jetzt Admin`))
            .catch(err => console.error(`❌ Fehler bei ${uid}:`, err))
    )
)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
