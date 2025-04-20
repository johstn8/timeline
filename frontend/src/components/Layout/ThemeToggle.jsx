import React from 'react';
import useDarkMode from '../../hooks/useDarkMode';

export default function ThemeToggle() {
    const [isDark, toggleDarkMode] = useDarkMode();

    return (
        <button
            onClick={toggleDarkMode}
            aria-label="Toggle light/dark mode"
            className="p-2 rounded focus:outline-none focus:ring-0 cursor-pointer"
        >
            {isDark ? (
                // Sonnensymbol im Dark Mode (wechselt zu Light)
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07 5.07l-.7-.7M6.34 6.34l-.7-.7m12.02 12.02l-.7-.7M6.34 17.66l-.7-.7M12 5a7 7 0 110 14 7 7 0 010-14z" />
                </svg>
            ) : (
                // Mondsymbol im Light Mode (wechselt zu Dark)
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
                </svg>
            )}
        </button>
    );
}
