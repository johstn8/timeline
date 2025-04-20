import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function RegisterPage() {
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
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            // Firestore: Rolle 'user' speichern
            await setDoc(doc(db, 'users', user.uid), {
                email,
                role: 'user',
                createdAt: serverTimestamp(),
            });
            // Token in localStorage
            const token = await user.getIdToken();
            localStorage.setItem('token', token);
            // Weiterleitung zur Home-Seite
            navigate('/', { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex flex-col items-center justify-center py-12">
            <h1 className="text-2xl font-semibold mb-6">Registrieren</h1>
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
                    {loading ? 'Registrieren …' : 'Account erstellen'}
                </button>
            </form>
            <p className="text-sm mt-2">
                Bereits einen Account?{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                    Einloggen
                </Link>
            </p>
        </section>
    );
}