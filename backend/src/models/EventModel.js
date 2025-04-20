// backend/src/models/EventModel.js
const { db } = require('../firebaseAdmin');
const { v4: uuidv4 } = require('uuid');
const eventsCollection = db.collection('events');

class EventModel {
    static async getAll() {
        const snapshot = await eventsCollection.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    static async getPending() {
        const snapshot = await eventsCollection.where('source.approved', '==', false).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    static async getById(id) {
        const doc = await eventsCollection.doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    }

    static async create(eventData) {
        const id = uuidv4();
        const timestamp = new Date().toISOString();
        const newEvent = {
            id,
            ...eventData,
            source: { ...eventData.source, approved: false },
            createdAt: timestamp,
            updatedAt: timestamp,
        };
        await eventsCollection.doc(id).set(newEvent);
        return newEvent;
    }

    static async update(id, updates) {
        const timestamp = new Date().toISOString();
        await eventsCollection.doc(id).update({
            ...updates,
            'source.approved': updates.source?.approved ?? undefined,
            updatedAt: timestamp,
        });
        return await EventModel.getById(id);
    }

    static async approve(id, adminId) {
        const timestamp = new Date().toISOString();
        await eventsCollection.doc(id).update({
            'source.approved': true,
            'source.approvedBy': adminId,
            updatedAt: timestamp,
        });
        return await EventModel.getById(id);
    }

    static async delete(id) {
        await eventsCollection.doc(id).delete();
        return { id };
    }
}

module.exports = EventModel;