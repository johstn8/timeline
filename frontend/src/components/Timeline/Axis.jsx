import React, { useMemo } from 'react';
import { chooseYearStep, formatYearLabel } from '@/lib/tickHelpers';

export default function Axis({
    width,
    height,
    scale,
    offsetX,
    START_YEAR,
    END_YEAR,
    MS_PER_YEAR
}) {
    const midY = height / 2;
    const pxPerYear = scale * MS_PER_YEAR;
    const stepYears = chooseYearStep(pxPerYear);

    // Sichtbarer Bereich in Jahren
    const visStartYear = START_YEAR + (-offsetX) / pxPerYear;
    const visEndYear = START_YEAR + (width - offsetX) / pxPerYear;
    const firstTick = Math.ceil(visStartYear / stepYears) * stepYears;

    const ticks = useMemo(() => {
        const arr = [];
        for (let y = firstTick; y <= visEndYear; y += stepYears) {
            const x = (y - START_YEAR) * pxPerYear + offsetX;
            arr.push({ x, label: formatYearLabel(y) });
        }
        return arr;
    }, [firstTick, visEndYear, pxPerYear, offsetX]);

    return (
        <g>
            <line
                x1={0}
                y1={midY}
                x2={width}
                y2={midY}
                stroke="currentColor"
                strokeWidth={2}
            />
            {ticks.map((t, i) => (
                <g key={i} transform={`translate(${t.x},${midY})`}>
                    <line y2={-6} stroke="currentColor" />
                    <text
                        y={-10}
                        textAnchor="middle"
                        className="text-xs select-none"
                        fill="currentColor"
                    >
                        {t.label}
                    </text>
                </g>
            ))}
        </g>
    );
}
