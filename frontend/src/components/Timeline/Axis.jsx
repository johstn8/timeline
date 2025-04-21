import React, { useMemo } from 'react';
import { chooseYearStep, formatYearLabel } from '@/lib/tickHelpers';

// Hilfen für Monats- und Tageslängen
const monthLengths = (year) => {
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    return [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
};
const daysInYear = (year) => monthLengths(year).reduce((sum, d) => sum + d, 0);
const monthNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

export default function Axis({ width, height, scale, offsetX, START_YEAR, MS_PER_YEAR }) {
    const midY = height / 2;
    const pxPerYear = scale * MS_PER_YEAR;
    const pxPerMonth = pxPerYear / 12;
    const pxPerDay = pxPerYear / 365;
    const MIN_LABEL_PX = 50; // Mindestpixelabstand für lesbare Labels

    const visStartFrac = START_YEAR + (-offsetX) / pxPerYear;
    const visEndFrac = START_YEAR + (width - offsetX) / pxPerYear;

    const ticks = useMemo(() => {
        const arr = [];

        // Tages-Ticks
        if (pxPerDay >= MIN_LABEL_PX) {
            let year = Math.floor(visStartFrac);
            let frac = visStartFrac - year;
            let totalDays = daysInYear(year);
            let dayIndex = Math.floor(frac * totalDays);

            while (true) {
                if (dayIndex >= totalDays) {
                    year += 1;
                    totalDays = daysInYear(year);
                    dayIndex = 0;
                }
                const fracYear = year + dayIndex / totalDays;
                if (fracYear > visEndFrac) break;

                // Monat und Tag ermitteln
                const mlens = monthLengths(year);
                const cumDays = mlens.reduce((acc, d, i) => {
                    acc[i] = (i > 0 ? acc[i - 1] : 0) + d;
                    return acc;
                }, []);
                const month = cumDays.findIndex(cd => cd > dayIndex);
                const prevCum = month > 0 ? cumDays[month - 1] : 0;
                const dayOfMonth = dayIndex - prevCum + 1;

                const x = (fracYear - START_YEAR) * pxPerYear + offsetX;
                if (dayOfMonth === 1) {
                    arr.push({ x, label: `${monthNames[month]} ${year}` });
                } else {
                    arr.push({ x, label: `${dayOfMonth} ${monthNames[month]}` });

                }
                dayIndex += 1;
            }
        }
        // Monats-Ticks
        else if (pxPerMonth >= MIN_LABEL_PX) {
            let year = Math.floor(visStartFrac);
            let frac = visStartFrac - year;
            let mlens = monthLengths(year);
            let total = daysInYear(year);
            let cum = 0;
            let month = mlens.findIndex(d => {
                const next = cum + d / total;
                if (next > frac) return true;
                cum = next;
                return false;
            });

            while (true) {
                const fracYear = year + cum;
                if (fracYear > visEndFrac) break;
                const x = (fracYear - START_YEAR) * pxPerYear + offsetX;
                // Januar als Jahreszahl, sonst Monatsname
                const label = month === 0 ? String(year) : monthNames[month];
                arr.push({ x, label });

                cum += mlens[month] / total;
                month += 1;
                if (month === 12) {
                    month = 0;
                    year += 1;
                    mlens = monthLengths(year);
                    total = daysInYear(year);
                    cum = 0;
                }
            }
        }
        // Jahres-Ticks
        else {
            const stepYears = chooseYearStep(pxPerYear);
            const firstTick = Math.ceil(visStartFrac / stepYears) * stepYears;
            for (let y = firstTick; y <= visEndFrac; y += stepYears) {
                const x = (y - START_YEAR) * pxPerYear + offsetX;
                const label = formatYearLabel(y);
                arr.push({ x, label });
            }
        }

        return arr;
    }, [visStartFrac, visEndFrac, pxPerDay, pxPerMonth, pxPerYear, offsetX, width]);

    return (
        <g>
            <line x1={0} y1={midY} x2={width} y2={midY} stroke="currentColor" strokeWidth={2} />
            {ticks.map((t, i) => (
                <g key={i} transform={`translate(${t.x},${midY})`}>
                    <line y2={-6} stroke="currentColor" />
                    <text y={-10} textAnchor="middle" className="text-xs select-none" fill="currentColor">
                        {t.label}
                    </text>
                </g>
            ))}
        </g>
    );
}
