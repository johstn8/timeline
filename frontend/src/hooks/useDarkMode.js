import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'timeline-dark-mode';

export default function useDarkMode() {
    // Initialzustand: aus localStorage oder System-Preference
    const [isDark, setIsDark] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored !== null) return stored === 'true';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Klasse auf <html> setzen
    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem(STORAGE_KEY, isDark);
    }, [isDark]);

    // Toggle‑Funktion
    const toggleDarkMode = useCallback(() => {
        setIsDark(prev => !prev);
    }, []);

    return [isDark, toggleDarkMode];
}
