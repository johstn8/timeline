import React, { useMemo } from 'react';

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

export default function Axis({ width, height, scale, offsetX, timelineStart }) {
    const midY = height / 2;

    // aktuell sichtbarer Zeitbereich (ms seit timelineStart)
    const visibleStartMs = (-offsetX) / scale;
    const visibleEndMs = (width - offsetX) / scale;

    const visibleStartYear = new Date(timelineStart + visibleStartMs).getUTCFullYear();
    const visibleEndYear = new Date(timelineStart + visibleEndMs).getUTCFullYear();

    const firstTickYear = Math.floor(visibleStartYear / 10) * 10;

    const ticks = useMemo(() => {
        const arr = [];
        for (let y = firstTickYear; y <= visibleEndYear; y += 10) {
            const x = (new Date(`${y}-01-01T00:00:00Z`).getTime() - timelineStart) * scale + offsetX;
            // nur rendern, wenn einigermaßen im Viewport (Performance)
            if (x < -50 || x > width + 50) continue;
            arr.push({ x, label: y });
        }
        return arr;
    }, [firstTickYear, visibleEndYear, scale, offsetX, width, timelineStart]);

    return (
        <g>
            {/* Grundlinie */}
            <line x1="0" y1={midY} x2={width} y2={midY} stroke="currentColor" strokeWidth="2" />

            {/* Jahres‑Ticks */}
            {ticks.map((t, i) => (
                <g key={i} transform={`translate(${t.x}, ${midY})`}>
                    <line y2="-8" stroke="currentColor" />
                    <text y="-12" textAnchor="middle" className="text-xs">
                        {t.label}
                    </text>
                </g>
            ))}
        </g>
    );
}