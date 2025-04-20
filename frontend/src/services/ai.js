// frontend/src/services/ai.js
// Client‑Wrapper für die Admin‑Funktion “KI‑Vorschläge erzeugen”

const API_BASE = '/api/ai';

/**
 * Fordert von der KI neue Event‑Vorschläge an.
 * Nur Admin‑User dürfen diesen Call ausführen!
 *
 * @param {{ categories?: string[], dateRange?: { start: string, end: string } }} [options]
 * @returns {Promise<{ message: string, count: number }>}
 */
export async function requestAiSuggestions(options = {}) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Nicht angemeldet.');

    const res = await fetch(`${API_BASE}/suggest`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(options),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `AI request failed: ${res.status}`);
    }
    return res.json();
}
