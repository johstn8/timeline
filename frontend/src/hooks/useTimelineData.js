import { useState, useEffect } from 'react';
import timelineService from '@/services/timelineService';

/**
 * Lädt Timeline‑Events vom Backend und liefert:
 *   • events         – komplette Event‑Liste
 *   • categories     – deduplizierte, alphabetisch sortierte Kategorien
 *   • loading / error – Statusflags für UI‑Feedback
 *   • timelineStart  – fixer Startwert (Urknall ≈ Jahr 0)
 */
export default function useTimelineData() {
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const timelineStart = new Date('0000-01-01').getTime();

    useEffect(() => {
        const abort = new AbortController();

        (async () => {
            try {
                const data = await timelineService.getEvents({ signal: abort.signal });
                setEvents(data);
                const allCats = data.flatMap(e =>
                    Array.isArray(e.categories)
                        ? e.categories
                        : e.category
                            ? [e.category]
                            : []
                );
                const uniqueCats = [...new Set(allCats)].sort();
                setCategories(uniqueCats);
            } catch (err) {
                if (err.name !== 'AbortError') setError(err);
            } finally {
                setLoading(false);
            }
        })();

        return () => abort.abort();
    }, []);
    return { events, categories, loading, error, timelineStart };
}