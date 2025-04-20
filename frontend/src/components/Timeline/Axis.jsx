import React from 'react';

export default function Axis({ width, height, scale, offsetX }) {
    const midY = height / 2;
    // Beispiel Domain: [start, end] in ms seit Epoche
    const domainStart = 0;
    const domainEnd = new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 50; // 50 Jahre Zukunft
    const pxPerMs = scale;

    const tickInterval = (domainEnd - domainStart) / 10;
    const ticks = [];
    for (let t = domainStart; t <= domainEnd; t += tickInterval) {
        const x = (t - domainStart) * pxPerMs + offsetX;
        ticks.push({ x, label: new Date(t).getFullYear() });
    }

    return (
        <g>
            <line x1={0} y1={midY} x2={width} y2={midY} stroke="currentColor" strokeWidth={2} />
            {ticks.map((tick, i) => (
                <g key={i} transform={`translate(${tick.x}, ${midY})`}>
                    <line y2={-8} stroke="currentColor" />
                    <text y={-12} textAnchor="middle" className="text-sm">
                        {tick.label}
                    </text>
                </g>
            ))}
        </g>
    );
}