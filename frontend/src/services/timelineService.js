const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:4000';

export default {
    getEvents: async () => {
        const res = await fetch(`${API_URL}/api/events`);
        if (!res.ok) throw new Error('Fehler beim Laden der Events');
        return res.json();
    },
};