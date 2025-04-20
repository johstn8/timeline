// frontend/src/components/Upload/FileUpload.jsx
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Drag-and-drop JSON file uploader for timeline events.
 * Calls onUpload(arrayOfEvents) when a valid JSON file is loaded.
 */
export default function FileUpload({ onUpload }) {
    const [error, setError] = useState(null);
    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            setError(null);
            const file = e.dataTransfer.files[0];
            if (!file) return;
            if (file.type !== 'application/json') {
                setError('Nur JSON-Dateien erlaubt');
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const data = JSON.parse(reader.result);
                    if (!Array.isArray(data)) {
                        setError('Erwartet ein JSON-Array von Events');
                        return;
                    }
                    onUpload(data);
                } catch (err) {
                    setError('Ungültiges JSON: ' + err.message);
                }
            };
            reader.readAsText(file);
        },
        [onUpload]
    );
    return (
        <div
            className="p-6 border-2 border-dashed rounded hover:border-gray-400 dark:hover:border-gray-600 text-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <p>Ziehen Sie eine JSON-Datei hierher, um Events hochzuladen</p>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}

FileUpload.propTypes = {
    onUpload: PropTypes.func.isRequired,
};