import React, { useState, useEffect } from 'react';
import useTimelineData from '../hooks/useTimelineData';
import FilterMenu from '../components/Filters/FilterMenu';
import TimelineContainer from '../components/Timeline/TimelineContainer';

export default function Home() {
    // Lade Events und Kategorien aus Firebase
    const { events, categories } = useTimelineData();

    // State für ausgewählte Kategorien (initial später gesetzt auf alle)
    const [selectedCategories, setSelectedCategories] = useState([]);

    // Sobald Kategorien geladen sind und noch nichts ausgewählt, alle auswählen
    useEffect(() => {
        if (categories.length > 0 && selectedCategories.length === 0) {
            setSelectedCategories(categories);
        }
    }, [categories]);

    // Gefilterte Events: zeige nur Events, deren Kategorien ausgewählt sind
    const filteredEvents = events.filter((e) => {
        const cats = Array.isArray(e.categories) ? e.categories : [e.category];
        return cats.some((c) => selectedCategories.includes(c));
    });

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 flex justify-end">
                <FilterMenu
                    categories={categories}
                    selected={selectedCategories}
                    onChange={setSelectedCategories}
                />
            </div>
            <div className="flex-1">
                <TimelineContainer events={filteredEvents} />
            </div>
        </div>
    );
}