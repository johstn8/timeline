// src/components/Filters/FilterMenu.jsx
import React, { useState, useEffect, useRef } from 'react';

const DEFAULT_CATEGORIES = [
    'Wirtschaft',
    'Religion',
    'Krieg',
    'Erdgeschichte',
    'Politik',
    'Kultur',
];

export default function FilterMenu({
    selected = [],
    onChange,
    categories = DEFAULT_CATEGORIES,
    className = '',
}) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    // Dropdown schließen, wenn außerhalb geklickt wird
    useEffect(() => {
        const close = (e) => {
            if (!wrapperRef.current || wrapperRef.current.contains(e.target)) return;
            setOpen(false);
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);

    const toggleCategory = (cat) => {
        const next = selected.includes(cat)
            ? selected.filter((c) => c !== cat)
            : [...selected, cat];
        onChange(next);
    };

    return (
        <div ref={wrapperRef} className={`relative inline-block ${className}`}>
            <button
                type="button"
                className="px-3 py-2 border rounded dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                onClick={() => setOpen((o) => !o)}
            >
                Filter <span className="ml-1 text-xs">({selected.length || '0'})</span>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50">
                    <ul className="max-h-60 overflow-y-auto">
                        {categories.map((cat) => {
                            const id = `cat-${cat}`;
                            return (
                                <li
                                    key={cat}
                                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center cursor-pointer select-none"
                                    onClick={() => toggleCategory(cat)}
                                >
                                    <input
                                        id={id}
                                        type="checkbox"
                                        checked={selected.includes(cat)}
                                        onChange={() => toggleCategory(cat)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="mr-2 accent-blue-900 dark:accent-blue-600 focus:outline-none focus:ring-0 focus:border-transparent"
                                    />
                                    <label
                                        htmlFor={id}
                                        className="cursor-pointer flex-1"
                                        onClick={(e) => e.stopPropagation()} // verhindert doppeltes Toggle
                                    >
                                        {cat}
                                    </label>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="border-t border-gray-200 dark:border-gray-700 flex justify-between p-2 text-sm">
                        <button type="button" onClick={() => onChange([])} className="text-blue-600 hover:underline focus:outline-none">
                            Keine
                        </button>
                        <button type="button" onClick={() => onChange(categories)} className="text-blue-600 hover:underline focus:outline-none">
                            Alle
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
