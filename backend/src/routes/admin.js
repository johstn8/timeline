// backend/src/routes/admin.js

const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleCheck');
const {
    getPendingEvents,
    approveEvent,
    rejectEvent
} = require('../controllers/eventController');

// Alle Routen hier nur für eingeloggte Admins
router.get(
    '/events/pending',
    authMiddleware,
    adminOnly,
    getPendingEvents
);

router.post(
    '/events/:id/approve',
    authMiddleware,
    adminOnly,
    approveEvent
);

router.post(
    '/events/:id/reject',
    authMiddleware,
    adminOnly,
    rejectEvent
);

module.exports = router;
