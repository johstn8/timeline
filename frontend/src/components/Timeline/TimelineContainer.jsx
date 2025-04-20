import React, { useState, useEffect } from 'react';
import useResizeObserver from '../../hooks/useResizeObserver';
import useZoomPan from '../../hooks/useZoomPan';
import Axis from './Axis';
import EventLayer from './EventLayer';
import Tooltip from './Tooltip';

export default function TimelineContainer({ events }) {
    const { ref, width, height } = useResizeObserver();
    const {
        scale,
        offsetX,
        onWheel,
        START_YEAR,
        MS_PER_YEAR,
    } = useZoomPan(ref, width, 1900, 2050);
    const [hovered, setHovered] = useState(null);

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
                    MS_PER_YEAR={MS_PER_YEAR}
                />
                <EventLayer
                    events={events}
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