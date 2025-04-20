import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../../../firebase';

export default function RequireAdmin({ children }) {
    const [checking, setChecking] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unregister = auth.onAuthStateChanged(async user => {
            if (!user) {
                setChecking(false);
                return;
            }
            const tokenResult = await user.getIdTokenResult();
            setIsAdmin(tokenResult.claims.role === 'admin');
            setChecking(false);
        });
        return unregister;
    }, []);

    if (checking) return null; // oder Lade-Indikator
    if (!auth.currentUser) return <Navigate to="/login" replace />;
    if (!isAdmin) return <Navigate to="/" replace />;
    return children;
}