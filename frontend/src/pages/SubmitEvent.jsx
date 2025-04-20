// frontend/src/pages/SubmitEvent.jsx
import React, { useState } from 'react';
import FileUpload from '../components/Upload/FileUpload';
import UploadForm from '../components/Upload/UploadForm';

export default function SubmitEvent() {
    const [mode, setMode] = useState('form'); // 'form' | 'file'
    const [feedback, setFeedback] = useState(null);

    // 1) onSubmit-Handler für das Formular
    const handleFormSubmit = async (formData) => {
        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error(`Serverfehler ${res.status}`);
            setFeedback('Dein Event wurde eingereicht!');
        } catch (err) {
            setFeedback(`Fehler: ${err.message}`);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Event einreichen</h1>

            {/* Tabs */}
            <div className="flex border-b mb-6">
                <button
                    className={`px-4 py-2 -mb-px focus:outline-none ${mode === 'form'
                        ? 'border-b-2 border-blue-500 font-medium'
                        : 'text-gray-600'
                        }`}
                    onClick={() => setMode('form')}
                >
                    Einzelnes Event
                </button>
                <button
                    className={`ml-2 px-4 py-2 -mb-px focus:outline-none ${mode === 'file'
                        ? 'border-b-2 border-blue-500 font-medium'
                        : 'text-gray-600'
                        }`}
                    onClick={() => setMode('file')}
                >
                    JSON Datei hochladen
                </button>
            </div>

            {/* Content */}
            {mode === 'form' ? (
                <>
                    <UploadForm
                        categories={['History', 'Science', 'Art']}  // passe hier deine Kategorien rein
                        onSubmit={handleFormSubmit}
                    />
                    {feedback && <p className="mt-4 text-sm">{feedback}</p>}
                </>
            ) : (
                <FileUpload />
            )}
        </div>
    );
}
