import React, { useState } from 'react';
import useResizeObserver from '@/hooks/useResizeObserver';
import useZoomPan from '@/hooks/useZoomPan';
import useTimelineData from '@/hooks/useTimelineData';
import Axis from './Axis';
import EventLayer from './EventLayer';
import Tooltip from './Tooltip';
import CategoryFilter from '@/components/Filters/CategoryFilter';

export default function TimelineContainer() {
    const containerRef = React.useRef(null);
    const { width, height } = useResizeObserver(containerRef);
    const { scale, offsetX, onWheel } = useZoomPan();
    const { events, categories } = useTimelineData();
    const [hoveredEvent, setHoveredEvent] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState(categories);

    const filtered = events.filter(e => selectedCategories.includes(e.category));

    return (
        <div className="relative w-full h-full" ref={containerRef} onWheel={onWheel}>
            <CategoryFilter
                categories={categories}
                selected={selectedCategories}
                onChange={setSelectedCategories}
            />
            <svg width={width} height={height} className="absolute top-0 left-0">
                <Axis width={width} height={height} scale={scale} offsetX={offsetX} />
                <EventLayer
                    events={filtered}
                    scale={scale}
                    timelineStart={useTimelineData.timelineStart}
                    offsetX={offsetX}
                    onHover={setHoveredEvent}
                />
            </svg>
            {hoveredEvent && <Tooltip event={hoveredEvent} />}
        </div>
    );
}