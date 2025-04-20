import React, { useMemo } from 'react';
import EventDot from './EventDot';

export default function EventLayer({
    events,
    scale,
    offsetX,
    width,       // neu
    height,
    onHover,
    START_YEAR,
    MS_PER_YEAR
}) {
    const midY = height / 2;
    const pxPerYear = scale * MS_PER_YEAR;

    // nur Events rendern, die im Viewport (±100 px) liegen
    const visibleEvents = useMemo(
        () =>
            events.filter((e) => {
                const year = new Date(e.startDate).getUTCFullYear();
                const x = (year - START_YEAR) * pxPerYear + offsetX;
                return x > -100 && x < width + 100;
            }),
        [events, pxPerYear, offsetX, width, START_YEAR]
    );

    return (
        <g>
            {visibleEvents.map((ev) => {
                const year = new Date(ev.startDate).getUTCFullYear();
                const x = (year - START_YEAR) * pxPerYear + offsetX;
                return (
                    <EventDot
                        key={ev.id}
                        x={x}
                        y={midY}
                        importance={ev.importance || 1}
                        onMouseEnter={() =>
                            onHover({ event: ev, position: { x: x + 8, y: midY - 24 } })
                        }
                        onMouseLeave={() => onHover(null)}
                    />
                );
            })}
        </g>
    );
}
