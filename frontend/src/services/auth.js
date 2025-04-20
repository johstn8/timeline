// frontend/src/services/auth.js

const API_BASE = '/api/auth';

/**
 * Meldet einen Benutzer mit E-Mail/Passwort an.
 * Speichert das erhaltene JWT im localStorage.
 * @param {{ email: string, password: string }} credentials
 */
export async function login({ email, password }) {
    const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Login failed: ${res.status}`);
    }
    const { token, user } = await res.json();
    localStorage.setItem('token', token);
    return user;
}

/**
 * Registriert einen neuen Benutzer.
 * @param {{ email: string, password: string }} credentials
 */
export async function register({ email, password }) {
    const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Registration failed: ${res.status}`);
    }
    const { user } = await res.json();
    return user;
}

/**
 * Fordert das aktuelle Benutzerprofil vom Backend an.
 * @returns {Promise<Object|null>}
 */
export async function getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const res = await fetch(`${API_BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return res.json();
}

/**
 * Meldet den Benutzer ab und entfernt das Token.
 */
export function logout() {
    localStorage.removeItem('token');
    // Optional: Backend über Logout informieren
    fetch(`${API_BASE}/logout`, { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
}
