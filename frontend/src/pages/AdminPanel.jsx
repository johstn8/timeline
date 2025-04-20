//---------------------------------------------------------------------
// ---------- frontend/src/pages/AdminPanel.jsx ----------
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { getPending, approve, reject } from '../services/adminEvents';

export default function AdminPanel() {
    const [pendingEvents, setPendingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionMsg, setActionMsg] = useState(null);

    /* ---- Daten holen ---- */
    const fetchPending = async () => {
        setLoading(true);
        setError(null);
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('not-authenticated');
            await user.getIdToken(); // nur um sicherzugehen, Token frisch
            const data = await getPending();
            setPendingEvents(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    /* ---- Aktion‑Handler ---- */
    const handleApprove = async (id) => {
        try {
            await approve(id);
            setActionMsg('Event freigegeben ✔️');
            setPendingEvents((prev) => prev.filter((e) => e.id !== id));
        } catch (err) {
            setActionMsg(`Fehler beim Freigeben: ${err.message}`);
        }
    };

    const handleReject = async (id) => {
        try {
            await reject(id);
            setActionMsg('Event abgelehnt ❌');
            setPendingEvents((prev) => prev.filter((e) => e.id !== id));
        } catch (err) {
            setActionMsg(`Fehler beim Ablehnen: ${err.message}`);
        }
    };

    /* ---- UI‑Zustände ---- */
    if (error === 'not-authenticated' || error === 'unauthorized') {
        return <Navigate to="/login" replace />;
    }

    if (loading) return <div>Lade ausstehende Events …</div>;
    if (error) return <div className="text-red-600">Fehler: {error}</div>;

    return (
        <div className="p-4">
            <h2 className="text-2xl mb-4">Ausstehende Events</h2>
            {actionMsg && <p className="mb-4 text-sm">{actionMsg}</p>}

            {pendingEvents.length === 0 ? (
                <div>Keine ausstehenden Events vorhanden.</div>
            ) : (
                <ul className="space-y-3">
                    {pendingEvents.map((ev) => (
                        <li
                            key={ev.id}
                            className="p-3 border rounded dark:border-gray-700"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <strong>{ev.title}</strong>{' '}
                                    <em>({new Date(ev.startDate).toLocaleDateString()})</em>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Eingereicht von: {ev.source.submittedBy}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleApprove(ev.id)}
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                    >
                                        Freigeben
                                    </button>
                                    <button
                                        onClick={() => handleReject(ev.id)}
                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                    >
                                        Ablehnen
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
