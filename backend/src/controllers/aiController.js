// backend/src/controllers/aiController.js

const OpenAI = require('openai');
const admin = require('firebase-admin');
const db = admin.firestore();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * POST /api/ai/suggest
 * Generiert Event‑Vorschläge via OpenAI und speichert sie unapproved in Firestore.
 * Body (optional): { categories?: string[], dateRange?: { start: string, end: string } }
 */
exports.suggestEvents = async (req, res) => {
    try {
        const { categories, dateRange } = req.body || {};
        // Prompt zusammenbauen
        let prompt = 'Erstelle ein JSON‑Array historischer Events mit Feldern: title, description, startDate (ISO), endDate (optional), categories, importance (1–5).';
        if (categories) prompt += ` Beschränke dich auf Kategorien: ${categories.join(', ')}.`;
        if (dateRange) prompt += ` Zeitraum zwischen ${dateRange.start} und ${dateRange.end}.`;
        prompt += ' Gib nur reines JSON zurück.';

        // Anfrage an OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: 'Du bist ein historischer Assistent.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7
        });

        const text = completion.choices[0].message.content;
        const suggestions = JSON.parse(text);

        // In Firestore speichern (approved: false, type: 'ki')
        const batch = db.batch();
        const now = new Date().toISOString();
        suggestions.forEach(item => {
            const docRef = db.collection('events').doc();
            batch.set(docRef, {
                id: docRef.id,
                ...item,
                source: {
                    type: 'ki',
                    submittedBy: null,
                    approved: false,
                    approvedBy: null
                },
                createdAt: now,
                updatedAt: now
            });
        });
        await batch.commit();

        res.status(200).json({ message: 'KI‑Vorschläge generiert und gespeichert.', count: suggestions.length });
    } catch (error) {
        console.error('AI suggest error:', error);
        res.status(500).json({ message: 'Fehler bei der Generierung der KI‑Vorschläge.' });
    }
};
