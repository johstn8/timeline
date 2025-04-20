// src/components/Timeline/Axis.jsx
import React, { useMemo } from 'react';

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
const IDEAL_PX = 80; // angestrebter Pixel‑Abstand zwischen zwei Labels

/** Bestimme einen „schönen“ Jahres‑Schritt (…,10,20,50,100,200,500,1000, …) */
function pickStep(yearSpan) {
    const pow = Math.pow(10, Math.floor(Math.log10(yearSpan)));
    for (const m of [1, 2, 5, 10]) {
        const step = m * pow;
        if (step >= yearSpan) return step;
    }
    return 10 * pow;
}

export default function Axis({ width, height, scale, offsetX, timelineStart }) {
    const midY = height / 2;

    const ticks = useMemo(() => {
        const msPerPx = 1 / scale;
        const yearsPerPx = msPerPx / MS_PER_YEAR;
        const desiredYears = yearsPerPx * IDEAL_PX;
        const stepYears = pickStep(desiredYears);

        // Sichtbaren Bereich in Jahren ermitteln
        const visStartYear = new Date(timelineStart + (-offsetX) / scale).getUTCFullYear();
        const visEndYear = new Date(timelineStart + (width - offsetX) / scale).getUTCFullYear();

        const firstTickYear = Math.floor(visStartYear / stepYears) * stepYears;
        const tickArr = [];

        for (let y = firstTickYear; y <= visEndYear; y += stepYears) {
            const x = (new Date(`${y}-01-01T00:00:00Z`).getTime() - timelineStart) * scale + offsetX;
            tickArr.push({ x, label: y });
        }
        return tickArr;
    }, [width, scale, offsetX, timelineStart]);

    return (
        <g>
            <line x1="0" y1={midY} x2={width} y2={midY} stroke="currentColor" strokeWidth="2" />
            {ticks.map((t) => (
                <g key={t.label} transform={`translate(${t.x}, ${midY})`}>
                    <line y2="-6" stroke="currentColor" />
                    <text y="-10" textAnchor="middle" className="text-xs select-none">
                        {t.label}
                    </text>
                </g>
            ))}
        </g>
    );
}