import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase';
import { signOut } from 'firebase/auth';
import ThemeToggle from './ThemeToggle';

export default function Header() {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        return auth.onAuthStateChanged(async u => {
            setUser(u);
            if (u) {
                const tokenResult = await u.getIdTokenResult();
                setIsAdmin(tokenResult.claims.role === 'admin');
            } else {
                setIsAdmin(false);
            }
        });
    }, []);

    const logout = async () => {
        await signOut(auth);
        localStorage.removeItem('token');
        navigate('/');
    };

    // Gemeinsame Klassen für Links/Buttons
    const linkClass =
        'text-gray-900 dark:text-gray-200 ' +
        'hover:text-gray-700 dark:hover:text-gray-300 ' +
        'hover:underline decoration-1 decoration-current ' +
        'focus:outline-none cursor-pointer';

    return (
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-lightmode_header_footer dark:bg-darkmode_header_footer">            <h1 className="text-xl font-semibold">
            <Link to="/" className="hover:pointer">
                Historischer Zeitstrahl
            </Link>
        </h1>
            <nav className="flex items-center space-x-4">

                {isAdmin && (
                    <Link to="/admin" className={linkClass}>
                        Admin
                    </Link>
                )}
                {user && (
                    <Link to="/submit" className={linkClass}>
                        Event einreichen
                    </Link>
                )}

                {user ? (
                    <button onClick={logout} className={linkClass}>
                        Abmelden
                    </button>
                ) : (
                    <Link to="/login" className={linkClass}>
                        Anmelden
                    </Link>
                )}

                <ThemeToggle />
            </nav>
        </header>
    );
}
