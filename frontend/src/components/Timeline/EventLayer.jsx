import React from 'react';
import EventDot from './EventDot';

export default function EventLayer({ events, scale, timelineStart, offsetX, onHover }) {
    return (
        <g>
            {events.map(event => {
                const t = new Date(event.startDate).getTime() - timelineStart;
                const x = t * scale + offsetX;
                return (
                    <EventDot
                        key={event.id}
                        x={x}
                        y={0}
                        event={event}
                        onMouseEnter={() => onHover(event)}
                        onMouseLeave={() => onHover(null)}
                    />
                );
            })}
        </g>
    );
}