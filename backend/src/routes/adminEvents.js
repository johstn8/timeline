const express = require('express');
const { authMiddleware, adminOnly } = require('../middlewares/authMiddleware');
const { getPendingEvents } = require('../controllers/eventController');

const router = express.Router();

// GET /api/admin/events/pending
router.get(
    '/pending',
    authMiddleware,
    adminOnly,
    async (req, res) => {
        try {
            const pending = await getPendingEvents();     // dein DB‑Call
            res.json(pending);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    }
);

module.exports = router;
