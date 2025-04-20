// ---------- frontend/src/services/adminEvents.js ----------
// Service‑Layer für Admin‑Aktionen rund um Events

const API_BASE = '/api/admin/events';

/**
 * Holt alle noch nicht freigegebenen Events.
 */
export async function getPending() {
    const res = await fetch(`${API_BASE}/pending`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    if (!res.ok) throw new Error(`Fehler ${res.status}`);
    return res.json();
}

/**
 * Markiert ein Event als approved.
 */
export async function approve(id) {
    const res = await fetch(`${API_BASE}/${id}/approve`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    if (!res.ok) throw new Error(`Approve‑Fehler ${res.status}`);
    return res.json();
}

/**
 * Lehnt ein Event ab.
 */
export async function reject(id) {
    const res = await fetch(`${API_BASE}/${id}/reject`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    if (!res.ok) throw new Error(`Reject‑Fehler ${res.status}`);
    return res.json();
}
