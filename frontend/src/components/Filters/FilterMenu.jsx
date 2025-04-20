import React, { useState, useRef, useEffect } from 'react';

export default function FilterMenu({ categories, selected, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Klick außerhalb schließt Menü
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }; document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Kategorie umschalten
    const toggle = (cat) => {
        const next = selected.includes(cat)
            ? selected.filter((c) => c !== cat)
            : [...selected, cat];
        onChange(next);
    };

    return (
        <div ref={ref} className="relative inline-block">
            <button
                type="button"
                className="px-3 py-2 border rounded bg-white dark:bg-brand-900 shadow cursor-pointer hover:bg-gray-100 dark:hover:bg-brand-800"
                onClick={() => setOpen((o) => !o)}
            >
                Filter ({selected.length}/{categories.length})
            </button>

            {open && (
                <ul className="absolute right-0 mt-2 w-48 border rounded bg-white dark:bg-brand-900 shadow max-h-60 overflow-auto z-50">
                    {categories.map((cat) => (
                        <li
                            key={cat}
                            className="flex items-center px-3 py-1 hover:bg-gray-100 dark:hover:bg-brand-800 cursor-pointer"
                            onClick={() => toggle(cat)}
                        >
                            <input
                                type="checkbox"
                                checked={selected.includes(cat)}
                                readOnly
                                className="mr-2 form-checkbox text-blue-600 focus:ring-0"
                            />
                            <span>{cat}</span>
                        </li>
                    ))}
                    {categories.length === 0 && (
                        <li className="px-3 py-1 text-gray-500">Keine Kategorien verfügbar</li>
                    )}
                </ul>
            )}
        </div>
    );
}