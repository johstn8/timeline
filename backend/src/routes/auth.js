/**
 * auth.js – Auth‑Endpoints
 */
const express = require('express');
const router = express.Router();

const { register, login, me } = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, me);

// Logout‑Endpunkt optional (Client löscht i.d.R. nur Token)
router.post('/logout', (req, res) => res.json({ message: 'OK' }));

module.exports = router;
