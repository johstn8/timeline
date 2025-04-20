import React from 'react';

export default function CategoryFilter({ categories, selected, onChange }) {
    const toggle = cat => {
        if (selected.includes(cat)) onChange(selected.filter(c => c !== cat));
        else onChange([...selected, cat]);
    };

    return (
        <div className="absolute top-4 right-4 bg-white p-2 shadow rounded">
            {categories.map(cat => (
                <label key={cat} className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={selected.includes(cat)}
                        onChange={() => toggle(cat)}
                    />
                    <span>{cat}</span>
                </label>
            ))}
        </div>
    );
}