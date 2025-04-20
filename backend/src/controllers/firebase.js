const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../config/.env') });

const admin = require('firebase-admin');

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
console.log(serviceAccountPath);
if (!serviceAccountPath) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_PATH ist nicht definiert – bitte .env prüfen!');
}

const serviceAccount = require(path.resolve(__dirname, '../../../', serviceAccountPath));

// 4. Firebase Admin SDK initialisieren
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
console.log('Firebase Admin SDK erfolgreich initialisiert.');

const db = admin.firestore();
module.exports = { db };