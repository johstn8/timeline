// backend/src/controllers/eventController.js

const admin = require('firebase-admin');
// Stelle sicher, dass admin.initializeApp(...) in index.js aufgerufen wurde
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');

/**
 * GET /api/events
 * Liefert alle freigegebenen Events.
 */
exports.getEvents = async (req, res) => {
    try {
        let query = db.collection('events').where('source.approved', '==', true);

        if (req.query.categories) {
            const cats = req.query.categories.split(',');
            query = query.where('categories', 'array-contains-any', cats);
        }
        if (req.query.minImportance) {
            const minImp = parseInt(req.query.minImportance, 10);
            query = query.where('importance', '>=', minImp);
        }

        const snapshot = await query.orderBy('startDate').get();
        const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(events);
    } catch (error) {
        console.error('getEvents error:', error);
        res.status(500).json({ message: 'Fehler beim Laden der Events.' });
    }
};

/**
 * POST /api/events
 * Einzelnes Event anlegen (wird unapproved gespeichert).
 */
exports.createEvent = async (req, res) => {
    try {
        const data = req.body;
        const id = uuidv4();
        const now = new Date().toISOString();

        const event = {
            id,
            ...data,
            source: {
                type: 'user',
                submittedBy: req.user?.uid || null,
                approved: false,
                approvedBy: null
            },
            createdAt: now,
            updatedAt: now
        };

        await db.collection('events').doc(id).set(event);
        res.status(201).json({ message: 'Event angelegt, wartet auf Freigabe.', id });
    } catch (error) {
        console.error('createEvent error:', error);
        res.status(500).json({ message: 'Fehler beim Anlegen des Events.' });
    }
};

/**
 * POST /api/events/upload
 * JSON‑Datei mit Array von Events per Drag&Drop importieren.
 */
exports.uploadEventsFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Keine Datei hochgeladen.' });
        }
        const text = req.file.buffer.toString('utf-8');
        const list = JSON.parse(text);
        if (!Array.isArray(list)) {
            return res.status(400).json({ message: 'Erwartet JSON-Array.' });
        }

        const batch = db.batch();
        const now = new Date().toISOString();
        list.forEach(item => {
            const id = uuidv4();
            const event = {
                id,
                ...item,
                source: {
                    type: 'user',
                    submittedBy: req.user?.uid || null,
                    approved: false,
                    approvedBy: null
                },
                createdAt: now,
                updatedAt: now
            };
            const ref = db.collection('events').doc(id);
            batch.set(ref, event);
        });
        await batch.commit();
        res.status(201).json({ message: 'Datei importiert, Events warten auf Freigabe.' });
    } catch (error) {
        console.error('uploadEventsFile error:', error);
        res.status(500).json({ message: 'Fehler beim Import der Datei.' });
    }
};

/* ──────────────── Neu für Admin ──────────────── */

/**
 * GET /api/admin/events/pending
 * Liefert alle noch nicht freigegebenen Events.
 */
exports.getPendingEvents = async (req, res) => {
    try {
        const snapshot = await db
            .collection('events')
            .where('source.approved', '==', false)
            .orderBy('createdAt', 'desc')
            .get();

        const pending = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(pending);
    } catch (error) {
        console.error('getPendingEvents error:', error);
        res.status(500).json({ message: 'Fehler beim Laden der ausstehenden Events.' });
    }
};

/**
 * POST /api/admin/events/:id/approve
 * Setzt source.approved auf true und speichert approvedBy.
 */
exports.approveEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const now = new Date().toISOString();

        await db.collection('events').doc(id).update({
            'source.approved': true,
            'source.approvedBy': req.user.uid,
            updatedAt: now
        });

        res.json({ message: 'Event freigegeben.' });
    } catch (error) {
        console.error('approveEvent error:', error);
        res.status(500).json({ message: 'Fehler beim Freigeben des Events.' });
    }
};

/**
 * POST /api/admin/events/:id/reject
 * Löscht das Event (Ablehnung).
 */
exports.rejectEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('events').doc(id).delete();
        res.json({ message: 'Event abgelehnt und gelöscht.' });
    } catch (error) {
        console.error('rejectEvent error:', error);
        res.status(500).json({ message: 'Fehler beim Ablehnen des Events.' });
    }
};
