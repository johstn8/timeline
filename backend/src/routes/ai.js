// backend/src/routes/ai.js

const express = require('express');
const router = express.Router();
const { suggestEvents } = require('../controllers/aiController');
const { authMiddleware, adminOnly } = require('../middlewares/authMiddleware');

// console.log('suggestEvents:', suggestEvents);
// console.log('authMiddleware:', authMiddleware);
// console.log('adminOnly:', adminOnly);

// Nur für angemeldete Admins: KI‑Vorschläge erzeugen
router.post('/suggest', authMiddleware, adminOnly, suggestEvents);

module.exports = router;
