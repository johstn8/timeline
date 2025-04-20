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
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {/* Sonnenkern */}
                    <circle cx="12" cy="12" r="5" />

                    {/* Einzel-Strahl definieren */}
                    <defs>
                        <line id="ray" x1="12" y1="3.7" x2="12" y2="2.5" />
                    </defs>

                    {/* Strahl 8‑fach rotiert */}
                    <use xlinkHref="#ray" />
                    <use xlinkHref="#ray" transform="rotate(45 12 12)" />
                    <use xlinkHref="#ray" transform="rotate(90 12 12)" />
                    <use xlinkHref="#ray" transform="rotate(135 12 12)" />
                    <use xlinkHref="#ray" transform="rotate(180 12 12)" />
                    <use xlinkHref="#ray" transform="rotate(225 12 12)" />
                    <use xlinkHref="#ray" transform="rotate(270 12 12)" />
                    <use xlinkHref="#ray" transform="rotate(315 12 12)" />
                </svg>
            ) : (
                // Mondsymbol im Light Mode (wechselt zu Dark)
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path
                        d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
                    />
                </svg>
            )}
        </button>
    );
}
