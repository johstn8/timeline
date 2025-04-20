//---------------------------------------------------------------------
// ---------- components/Timeline/EventDot.jsx ----------
import React from 'react';

export default function EventDot({ event, scale, timelineStart, zoom, onMouseEnter, onMouseLeave }) {
    const { startDate, importance } = event;
    const visible = importance >= 1 + Math.log10(zoom);
    if (!visible) return null;
    const x = (new Date(startDate).getTime() - timelineStart) * scale;
    const r = Math.max(3, importance * 2);
    return (
        <circle cx={x} cy={30} r={r} fill="currentColor" opacity={0.8}
            onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />
    );
}