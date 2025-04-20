// src/pages/Home.jsx
import React, { useState } from 'react';
import useFetchEvents from '../hooks/useFetchEvents';
import TimelineContainer from '../components/Timeline/TimelineContainer';
import FilterMenu from '../components/Filters/FilterMenu';

export default function Home() {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [minImportance, setMinImportance] = useState(1);
    const { events, loading, error } = useFetchEvents({
        categories: selectedCategories,
        minImportance,
    });

    return (
        <div className="flex flex-col h-full">
            {/* Header: Filter & ThemeToggle rechtsbündig */}
            <div className="p-4 flex justify-end items-center space-x-4">
                <FilterMenu
                    selected={selectedCategories}
                    onChange={setSelectedCategories}
                />
            </div>

            {/* Timeline-Fenster füllt Rest aus */}
            <div className="relative w-full h-full flex-1 overflow-hidden">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span>Lädt Events…</span>
                    </div>
                )}
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center text-red-600">
                        <span>Fehler: {error.message || error}</span>
                    </div>
                )}
                {!loading && !error && (
                    <TimelineContainer />
                )}
            </div>
        </div>
    );
}