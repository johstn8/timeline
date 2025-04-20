// src/components/Timeline/EventLayer.jsx

import React from 'react';
import EventDot from './EventDot';

/**
 * Rendert alle EventDots auf der Achse.
 * Erwartete Props:
 *  - events: Array der Event-Objekte
 *  - scale: Zoom-Faktor (px per ms)
 *  - timelineStart: Startzeit in ms
 *  - offsetX: horizontaler Pan-Offset in px
 *  - height: Höhe des SVG-Containers in px
 *  - onHover: Callback(event|null) für Tooltip-Handling
 */
export default function EventLayer({
    events,
    scale,
    timelineStart,
    offsetX,
    height,
    onHover,
}) {
    const midY = height / 2;

    return (
        <g>
            {events.map((event) => {
                // absoluter Zeit-Offset seit timelineStart
                const t = new Date(event.startDate).getTime() - timelineStart;
                // finale x-Position inkl. Zoom & Pan
                const x = t * scale + offsetX;
                return (
                    <EventDot
                        key={event.id}
                        x={x}
                        y={midY}
                        importance={event.importance}
                        onMouseEnter={() => onHover(event)}
                        onMouseLeave={() => onHover(null)}
                    />
                );
            })}
        </g>
    );
}
