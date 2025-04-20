import { useState, useEffect, useCallback } from 'react';

/**
 * Hook zum Laden von Events aus dem Backend mit optionalen Filtern.
 * @param {Object} options
 * @param {string[]} options.categories – Array von Kategorien, die angezeigt werden sollen.
 * @param {number} options.minImportance – Minimale Wichtigkeit (1–5) für die Darstellung.
 */
export default function useFetchEvents({ categories = [], minImportance = 1 } = {}) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (categories.length) params.append('categories', categories.join(','));
            if (minImportance) params.append('minImportance', minImportance);
            const res = await fetch(`/api/events?${params.toString()}`, {
                headers: {
                    'Content-Type': 'application/json',
                    // falls JWT-Auth genutzt wird:
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                },
            });
            if (!res.ok) throw new Error(`Fehler ${res.status}`);
            const data = await res.json();
            console.log(data);
            setEvents(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [categories, minImportance]);
    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);
    return { events, loading, error, refetch: fetchEvents };
}
