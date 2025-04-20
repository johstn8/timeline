import React, { useState, useEffect } from 'react';
import { requestAiSuggestions } from '../../services/ai';
import { getEvents } from '../../services/events';

/**
 * Übersicht für Admins:
 *  – Statistiken
 *  – Button, um KI‑Vorschläge zu generieren
 */
export default function AdminDashboard() {
    const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 });
    const [loading, setLoading] = useState(true);
    const [aiStatus, setAiStatus] = useState(null);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const all = await getEvents();                 // alle approved
            const resp = await fetch('/api/admin/events/pending', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const pending = resp.ok ? await resp.json() : [];
            setStats({
                total: all.length + pending.length,
                approved: all.length,
                pending: pending.length,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const generateAiEvents = async () => {
        try {
            setAiStatus('running');
            const res = await requestAiSuggestions();
            setAiStatus(`Erstellt: ${res.count} Vorschläge`);
            fetchStats();
        } catch (err) {
            setAiStatus(`Fehler: ${err.message}`);
        }
    };

    return (
        <section className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>

            {loading ? (
                <p>Lade Statistiken…</p>
            ) : (
                <div className="grid grid-cols-2 gap-4 max-w-md">
                    <StatCard label="Gesamt" value={stats.total} />
                    <StatCard label="Freigegeben" value={stats.approved} />
                    <StatCard label="Ausstehend" value={stats.pending} />
                </div>
            )}

            <div className="mt-8">
                <button
                    onClick={generateAiEvents}
                    className="btn-primary"
                    disabled={aiStatus === 'running'}
                >
                    {aiStatus === 'running' ? 'KI läuft…' : 'KI‑Vorschläge erzeugen'}
                </button>
                {aiStatus && aiStatus !== 'running' && (
                    <p className="mt-2 text-sm">{aiStatus}</p>
                )}
            </div>
        </section>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="border rounded p-4 text-center dark:border-gray-700">
            <p className="text-lg font-medium">{value}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
        </div>
    );
}
