const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../config/.env') });

const express = require('express');
const cors = require('cors');

// Firebase initialisiert in firebase.js
const { db } = require('./controllers/firebase');
const admin = require('firebase-admin');

const eventsRouter = require('./routes/events');
const adminRouter = require('./routes/admin');
const aiRouter = require('./routes/ai');
const authRouter = require('./routes/auth');
const adminEvents = require('./routes/adminEvents');

const { authMiddleware } = require('./middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 4000;
console.log("PORT: ", process.env.PORT);

// Express‑Middlewares
app.use(cors());
app.use(express.json());

// Routen
app.use('/api/events', eventsRouter);
app.use('/api/admin', authMiddleware, adminRouter);
app.use('/api/ai', authMiddleware, aiRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin/events', adminEvents);

// Health‑Check
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// Produktion: statische Dateien ausliefern
if (process.env.NODE_ENV === 'production') {
    const staticDir = path.join(__dirname, '../../frontend'); // /dist
    app.use(express.static(staticDir));
    app.get('*', (_, res) => res.sendFile(path.join(staticDir, 'index.html')));
}

// Serverstart
app.listen(PORT, () => {
    console.log(`Backend läuft auf http://localhost:${PORT}`);
});
