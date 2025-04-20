import React, { useState, useEffect, useMemo } from 'react';
import useResizeObserver from '@/hooks/useResizeObserver';
import useZoomPan from '@/hooks/useZoomPan';
import useTimelineData from '@/hooks/useTimelineData';
import Axis from './Axis';
import EventLayer from './EventLayer';
import Tooltip from './Tooltip';
import CategoryFilter from '@/components/Filters/CategoryFilter';

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
        MS_PER_YEAR
    } = useZoomPan(ref, width, INITIAL_START, INITIAL_END);

    const [hovered, setHovered] = useState(null);
    const [selected, setSelected] = useState(categories);
    const filteredEvents = useMemo(
        () =>
            events.filter(
                (e) =>
                    selected.length === 0 ||
                    e.categories?.some((c) => selected.includes(c))
            ),
        [events, selected]
    );

    useEffect(() => {
        const el = ref.current;
        if (el) {
            el.addEventListener('wheel', onWheel, { passive: false });
            return () => el.removeEventListener('wheel', onWheel);
        }
    }, [ref, onWheel]);

    return (
        <div ref={ref} className="relative w-full h-full overflow-hidden">
            <CategoryFilter
                categories={categories}
                selected={selected}
                onChange={setSelected}
            />

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
                    width={width}
                    events={filteredEvents}
                    scale={scale}
                    offsetX={offsetX}
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
