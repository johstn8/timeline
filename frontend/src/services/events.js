// Eine einfache API‑Schicht für alle Event‑Operationen

const API_BASE = '/api/events';

/**
 * Lädt Events mit optionalen Query-Parametern.
 * @param {{ categories?: string[], minImportance?: number }} filters
 */
export async function getEvents(filters = {}) {
    const params = new URLSearchParams();
    if (filters.categories?.length) params.append('categories', filters.categories.join(','));
    if (filters.minImportance) params.append('minImportance', filters.minImportance);
    const res = await fetch(`${API_BASE}?${params.toString()}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
    });
    if (!res.ok) throw new Error(`Error fetching events: ${res.status}`);
    return res.json();
}

/**
 * Reicht ein neues Event via JSON-Body ein (wird Admin-Freigabe benötigen).
 * @param {Object} eventData – Muss dem Event-Schema entsprechen.
 */
export async function submitEvent(eventData) {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(eventData),
    });
    if (!res.ok) throw new Error(`Error submitting event: ${res.status}`);
    return res.json();
}

/**
 * Lädt eine JSON-Datei mit Events per Drag&Drop hoch.
 * @param {File} file – JSON-Datei mit Array von Events.
 */
export async function uploadEventsFile(file) {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: form,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
    });
    if (!res.ok) throw new Error(`Error uploading file: ${res.status}`);
    return res.json();
}
