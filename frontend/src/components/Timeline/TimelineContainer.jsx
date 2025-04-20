import React, { useState, useEffect, useMemo } from 'react';
import useResizeObserver from '@/hooks/useResizeObserver';
import useZoomPan from '@/hooks/useZoomPan';
import useTimelineData from '@/hooks/useTimelineData';
import Axis from './Axis';
import EventLayer from './EventLayer';
import Tooltip from './Tooltip';

export default function TimelineContainer() {
    const { ref, width, height } = useResizeObserver();
    const { events, categories } = useTimelineData();

    const INITIAL_START = 1900;
    const INITIAL_END = 2050;
    const {
        scale,
        offsetX,
        onWheel,
        START_YEAR,
        END_YEAR,
        MS_PER_YEAR,
    } = useZoomPan(ref, width, INITIAL_START, INITIAL_END);

    const [hovered, setHovered] = useState(null);
    const [excludedCats, setExcludedCats] = useState([]);

    const filteredEvents = useMemo(
        () =>
            events.filter((event) => {
                const cats = Array.isArray(event.categories)
                    ? event.categories
                    : [event.category];
                return !cats.some((c) => excludedCats.includes(c));
            }),
        [events, excludedCats]
    );

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, [ref, onWheel]);

    return (
        <div ref={ref} className="relative w-full h-full overflow-hidden">
            <svg width={width} height={height} className="absolute top-0 left-0">
                <Axis
                    width={width}
                    height={height}
                    scale={scale}
                    offsetX={offsetX}
                    START_YEAR={START_YEAR}
                    END_YEAR={END_YEAR}
                    MS_PER_YEAR={MS_PER_YEAR}
                />
                <EventLayer
                    events={filteredEvents}
                    scale={scale}
                    offsetX={offsetX}
                    width={width}
                    height={height}
                    onHover={setHovered}
                    START_YEAR={START_YEAR}
                    MS_PER_YEAR={MS_PER_YEAR}
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
