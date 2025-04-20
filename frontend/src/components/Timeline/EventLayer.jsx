import React from 'react';
import EventDot from './EventDot';

/**
 * Rendert alle EventDots auf der Achse.
 *
 * Props
 *  • events          – Array der Event‑Objekte
 *  • scale           – px per ms
 *  • timelineStart   – Startzeit (ms seit 1970‑01‑01 UTC)
 *  • offsetX         – horizontaler Pan‑Offset (px)
 *  • height          – Höhe des SVG‑Bereichs (px)
 *  • onHover(obj)    – Callback für Tooltip { event, position } | null
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
                // Zeit‑Delta seit timelineStart in ms → px
                const t = new Date(event.startDate).getTime() - timelineStart;
                const x = t * scale + offsetX;
                const y = midY;

                return (
                    <EventDot
                        key={event.id}
                        x={x}
                        y={y}
                        importance={event.importance ?? 1}
                        onMouseEnter={() =>
                            onHover({ event, position: { x: x + 8, y: y - 24 } })
                        }
                        onMouseLeave={() => onHover(null)}
                    />
                );
            })}
        </g>
    );
}