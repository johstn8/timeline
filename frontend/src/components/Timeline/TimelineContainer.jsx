import React, { useState } from 'react';
import useResizeObserver from '@/hooks/useResizeObserver';
import useZoomPan from '@/hooks/useZoomPan';
import useTimelineData from '@/hooks/useTimelineData';
import Axis from './Axis';
import EventLayer from './EventLayer';
import Tooltip from './Tooltip';
import CategoryFilter from '@/components/Filters/CategoryFilter';

export default function TimelineContainer() {
    // Hook für Breite/Höhe des Containers
    const { ref, width, height } = useResizeObserver();

    // Zoom- und Pan-Logik (Mausrad & Shift+Mausrad)
    const { scale, offsetX, onWheel } = useZoomPan();

    // Laden der Timeline-Daten und Kategorien
    const { events, categories, timelineStart } = useTimelineData();

    // State für Tooltip-Hover und ausgewählte Kategorien
    const [hoveredEvent, setHoveredEvent] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState(categories);

    // Gefilterte Events nach ausgewählten Kategorien
    const filteredEvents = events.filter(e =>
        selectedCategories.includes(e.category)
    );

    return (
        <div
            ref={ref}
            className="relative w-full h-full overflow-hidden"
            onWheelCapture={onWheel}
        >
            {/* Kategorie-Filter oben rechts */}
            <CategoryFilter
                categories={categories}
                selected={selectedCategories}
                onChange={setSelectedCategories}
            />

            {/* SVG-Canvas für Achse und Events */}
            <svg width={width} height={height} className="absolute top-0 left-0">
                <Axis
                    width={width}
                    height={height}
                    scale={scale}
                    offsetX={offsetX}
                />
                <EventLayer
                    events={filteredEvents}
                    scale={scale}
                    timelineStart={timelineStart}
                    offsetX={offsetX}
                    height={height}
                    onHover={setHoveredEvent}
                />
            </svg>

            {/* Tooltip für das aktuell gehighoverte Event */}
            {hoveredEvent && (
                <Tooltip
                    event={hoveredEvent}
                />
            )}
        </div>
    );
}
