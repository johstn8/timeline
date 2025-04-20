import React, { useState, useEffect } from 'react';
import useResizeObserver from '@/hooks/useResizeObserver';
import useZoomPan from '@/hooks/useZoomPan';
import useTimelineData from '@/hooks/useTimelineData';
import Axis from './Axis';
import EventLayer from './EventLayer';
import Tooltip from './Tooltip';
import CategoryFilter from '@/components/Filters/CategoryFilter';

export default function TimelineContainer() {
    // Größe des Containers
    const { ref, width, height } = useResizeObserver();

    // Zoom & Pan – Hook bekommt die Ref des Containers
    const { scale, offsetX, onWheel } = useZoomPan(ref);

    // Timeline‑Daten aus dem Service‑Hook
    const { events, categories, timelineStart } = useTimelineData();

    // Tooltip‑ & Filter‑State
    const [hoveredEvent, setHoveredEvent] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState(categories);

    // Gefilterte Events nach Kategorien
    const filteredEvents = events.filter((e) =>
        selectedCategories.includes(e.category)
    );

    /**
     * Native (nicht‑passive) wheel‑Listener anbinden.
     * React‑synthetic events sind immer passiv und erlauben kein preventDefault.
     */
    useEffect(() => {
        if (!ref.current) return;
        const el = ref.current;
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, [ref, onWheel]);

    return (
        <div ref={ref} className="relative w-full h-full overflow-hidden">
            {/* Kategorie‑Filter */}
            <CategoryFilter
                categories={categories}
                selected={selectedCategories}
                onChange={setSelectedCategories}
            />

            {/* SVG‑Canvas */}
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

            {/* Tooltip */}
            {hoveredEvent && <Tooltip event={hoveredEvent} />}
        </div>
    );
}