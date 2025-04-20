//---------------------------------------------------------------------
// ---------- components/Timeline/Axis.jsx ----------
import React from 'react';
import { format } from 'date-fns';

export default function Axis({ width, scale, timelineStart, timelineEnd, height = 60, maxTicks = 10 }) {
    const domainStart = timelineStart;
    const domainEnd = timelineEnd;
    const pxPerTime = t => (t - timelineStart) * scale;

    const rawInterval = (domainEnd - domainStart) / maxTicks;
    const power = Math.pow(10, Math.floor(Math.log10(rawInterval)));
    const interval = Math.ceil(rawInterval / power) * power;
    const firstTick = Math.ceil(domainStart / interval) * interval;

    const ticks = [];
    for (let t = firstTick; t <= domainEnd; t += interval) {
        ticks.push({ t, x: pxPerTime(t) });
    }

    return (
        <g>
            {/* Haupt‑Achse */}
            <line x1={0} y1={height / 2} x2={width / scale} y2={height / 2} stroke="currentColor" strokeWidth={2} />
            {/* Zukunft gestrichelt */}
            {domainEnd > Date.now() && (
                <line x1={pxPerTime(Date.now())} y1={height / 2} x2={pxPerTime(domainEnd)} y2={height / 2}
                    stroke="currentColor" strokeWidth={2} strokeDasharray="4 4" />
            )}
            {/* Ticks */}
            {ticks.map((tk, i) => (
                <g key={i} transform={`translate(${tk.x},${height / 2})`}>
                    <line y2={-10} stroke="currentColor" />
                    <text y={20} textAnchor="middle" fontSize={12}>{format(new Date(tk.t), 'yyyy')}</text>
                </g>
            ))}
        </g>
    );
}