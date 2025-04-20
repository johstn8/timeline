// src/components/Timeline/EventDot.jsx

import React from 'react';

/**
 * Zeichnet einen einzelnen Punkt.
 * Props:
 *  - x, y: Position
 *  - importance: Zahl zur Bestimmung des Radius
 */
export default function EventDot({
    x,
    y,
    importance,
    onMouseEnter,
    onMouseLeave,
}) {
    const r = Math.max(3, importance * 2);
    return (
        <circle
            cx={x}
            cy={y}
            r={r}
            fill="currentColor"
            opacity={0.8}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{ pointerEvents: 'visible' }}
        />
    );
}
