// backend/src/models/UserModel.js
const { db } = require('../firebaseAdmin');
const usersCollection = db.collection('users');

class UserModel {
    static async getAll() {
        const snapshot = await usersCollection.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    static async getById(id) {
        const doc = await usersCollection.doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    }

    static async create(userData) {
        const { id, email, role } = userData;
        const timestamp = new Date().toISOString();
        const newUser = { email, role, createdAt: timestamp };
        await usersCollection.doc(id).set(newUser);
        return { id, ...newUser };
    }

    static async updateRole(id, newRole) {
        const timestamp = new Date().toISOString();
        await usersCollection.doc(id).update({ role: newRole, updatedAt: timestamp });
        return await UserModel.getById(id);
    }

    static async delete(id) {
        await usersCollection.doc(id).delete();
        return { id };
    }
}

module.exports = UserModel;