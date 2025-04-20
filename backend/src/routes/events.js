// backend/src/routes/events.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const {
    getEvents,
    createEvent,
    uploadEventsFile
} = require('../controllers/eventController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Public: nur freigegebene Events
router.get('/', getEvents);

// Auth-geschützt: neues Event anlegen oder Datei importieren
router.post('/', authMiddleware, createEvent);
router.post('/upload', authMiddleware, upload.single('file'), uploadEventsFile);

module.exports = router;
