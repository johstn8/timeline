// frontend/src/components/Upload/UploadForm.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Form to submit a single timeline event manually.
 * categories hat jetzt default [] und verhindert so TypeErrors.
 */
export default function UploadForm({
    categories = [],    // ← Default-Fallback
    onSubmit,
}) {
    const [form, setForm] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        categories: [],
        importance: 3,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'categories') {
            setForm((f) => ({
                ...f,
                categories: checked
                    ? [...f.categories, value]
                    : f.categories.filter((c) => c !== value),
            }));
        } else {
            setForm((f) => ({ ...f, [name]: type === 'number' ? Number(value) : value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded">
            <div>
                <label className="block">Titel</label>
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
            </div>
            <div>
                <label className="block">Beschreibung</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block">Startdatum</label>
                    <input
                        name="startDate"
                        type="date"
                        value={form.startDate}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block">Enddatum (optional)</label>
                    <input
                        name="endDate"
                        type="date"
                        value={form.endDate}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
            </div>
            <div>
                <label className="block mb-1">Kategorien</label>
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <label key={cat} className="flex items-center">
                            <input
                                type="checkbox"
                                name="categories"
                                value={cat}
                                checked={form.categories.includes(cat)}
                                onChange={handleChange}
                                className="mr-1"
                            />
                            {cat}
                        </label>
                    ))}
                </div>
            </div>
            <div>
                <label className="block">Wichtigkeit (1–5)</label>
                <input
                    name="importance"
                    type="number"
                    min="1"
                    max="5"
                    value={form.importance}
                    onChange={handleChange}
                    className="w-20 p-2 border rounded"
                />
            </div>
            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Event einreichen
            </button>
        </form>
    );
}

UploadForm.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.string),
    onSubmit: PropTypes.func.isRequired,
};

UploadForm.defaultProps = {
    categories: [],
};
