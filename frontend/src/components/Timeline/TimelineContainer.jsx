import React, { useState, useMemo } from 'react';
import useResizeObserver from '@/hooks/useResizeObserver';
import useZoomPan from '@/hooks/useZoomPan';
import useTimelineData from '@/hooks/useTimelineData';

import Axis from './Axis';
import EventLayer from './EventLayer';
import Tooltip from './Tooltip';
import CategoryFilter from '@/components/Filters/CategoryFilter';

export default function TimelineContainer() {
    const { ref, width, height } = useResizeObserver();
    const { events, categories, timelineStart } = useTimelineData();

    const { scale, offsetX, onWheel } = useZoomPan(ref, width, timelineStart);

    const [hovered, setHovered] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState(categories);

    const filteredEvents = useMemo(
        () =>
            events.filter((e) =>
                selectedCategories.length === 0
                    ? true
                    : (Array.isArray(e.categories)
                        ? e.categories
                        : [e.category])
                        .some((c) => selectedCategories.includes(c))
            ),
        [events, selectedCategories]
    );

    return (
        <div
            ref={ref}
            className="relative w-full h-full overflow-hidden"
            onWheelCapture={onWheel}
        >
            <CategoryFilter
                categories={categories}
                selected={selectedCategories}
                onChange={setSelectedCategories}
            />

            <svg width={width} height={height} className="absolute top-0 left-0">
                <Axis
                    width={width}
                    height={height}
                    scale={scale}
                    offsetX={offsetX}
                    timelineStart={timelineStart}
                />

                <EventLayer
                    events={filteredEvents}
                    scale={scale}
                    timelineStart={timelineStart}
                    offsetX={offsetX}
                    height={height}
                    onHover={setHovered}
                />
            </svg>

            {hovered && (
                <Tooltip
                    event={hovered.event}
                    position={hovered.position}
                    onClose={() => setHovered(null)}
                />
            )}
        </div>
    );
}