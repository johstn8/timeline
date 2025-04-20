import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            const token = await user.getIdToken();
            localStorage.setItem('token', token);
            navigate('/admin', { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex flex-col items-center justify-center py-12">
            <h1 className="text-2xl font-semibold mb-6">Anmelden</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                <input
                    type="email"
                    placeholder="E‑Mail"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input w-full"
                    required
                />
                <input
                    type="password"
                    placeholder="Passwort"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input w-full"
                    required
                />
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button
                    type="submit"
                    className="btn-primary w-full"
                    disabled={loading}
                >
                    {loading ? 'Lädt …' : 'Einloggen'}
                </button>
            </form>
            {/* Registrieren-Link */}
            <p className="text-sm mt-2">
                Noch keinen Account?{' '}
                <Link to="/register" className="text-blue-600 hover:underline">
                    Registrieren
                </Link>
            </p>
        </section >
    );
}