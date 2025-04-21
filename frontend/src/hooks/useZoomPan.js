import { useState, useCallback, useEffect } from 'react';

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
const START_YEAR = -13_800_000_000;
const END_YEAR = 3_000;
const FULL_MS = (END_YEAR - START_YEAR) * MS_PER_YEAR;

// Dynamische minimale Sichtbarkeit (in Jahren) via logarithmische Interpolation
function minVisibleYears(centerYear) {
    const minResult = 0.02;
    const minY = 1 / 12;   // maximaler Zoom auf Monatsebene
    const maxY = 3e9;      // minimaler Zoom auf Milliardenjahre
    const t = (centerYear - START_YEAR) / (END_YEAR - START_YEAR);
    const u = Math.min(Math.max(t, 0), 1);
    //const result = Math.exp(u * Math.log(minY) + (1 - u) * Math.log(maxY)) + 0.01;
    const result = (maxY / (200000 * (maxY * u - maxY))) + 22.8;
    console.log("test", result);
    if (result >= minResult && u < 1) {
        return result;
    } else {
        return minResult;
    } // Nur so weit zoomen, dass minVisibleYears(centerYear) größer als 0.1 ist. Sonst kleinster Zoom:
}
/**
 * Hook für Zoom und Pan auf der Timeline
 * @param {React.RefObject<HTMLElement>} ref      Container-Element
 * @param {number}                         width   Aktuelle Breite des Containers
 * @param {number} [initialStartYear]              Linke Jahr-Marke bei Initialisierung
 * @param {number} [initialEndYear]                Rechte Jahr-Marke bei Initialisierung
 */
export default function useZoomPan(
    ref,
    width,
    initialStartYear = START_YEAR,
    initialEndYear = END_YEAR
) {
    const BASE_MIN_SCALE = width > 0 ? width / FULL_MS : 1e-12;
    const [scale, setScale] = useState(BASE_MIN_SCALE);
    const [offsetX, setOffsetX] = useState(0);

    // Initial: sichtbaren Bereich auf [initialStartYear, initialEndYear] setzen
    useEffect(() => {
        if (!ref.current || width <= 0) return;
        const spanMs = (initialEndYear - initialStartYear) * MS_PER_YEAR;
        let initScale = width / spanMs;
        initScale = Math.max(initScale, BASE_MIN_SCALE);
        // Ermittle dynamische Zoom-Grenze am Zentrum dieses Bereichs
        const centerYear = initialStartYear + (initialEndYear - initialStartYear) / 2;
        const maxScale = width / (minVisibleYears(centerYear) * MS_PER_YEAR);
        initScale = Math.min(initScale, maxScale);
        const initOffset = -(initialStartYear - START_YEAR) * MS_PER_YEAR * initScale;
        setScale(initScale);
        setOffsetX(initOffset);
    }, [ref, width, initialStartYear, initialEndYear]);

    const onWheel = useCallback(
        (e) => {
            e.preventDefault();
            if (!ref.current) return;
            const { deltaY, shiftKey, clientX } = e;
            const rect = ref.current.getBoundingClientRect();
            const cursorX = clientX - rect.left;

            // Aktueller Zoommittelpunkt
            const centerYear = START_YEAR + ((-offsetX + width / 2) / (scale * MS_PER_YEAR));
            const visYears = minVisibleYears(centerYear);
            const maxScale = width / (visYears * MS_PER_YEAR);

            let newScale = scale;
            let newOffset = offsetX;

            if (shiftKey) {
                // horizontales Panning
                newOffset = offsetX - deltaY;
            } else {
                // Zoom um den Maus-Pivot
                const factor = deltaY < 0 ? 1.1 : 0.9;
                let s = scale * factor;
                s = Math.max(s, BASE_MIN_SCALE);
                s = Math.min(s, maxScale);
                newScale = s;
                // Offset so anpassen, dass Pivot-Punkt an gleicher Stelle bleibt
                const timeAtCursor = (cursorX - offsetX) / scale;
                newOffset = cursorX - timeAtCursor * s;
            }

            // Clamp Offset
            const maxOffset = 0;
            const minOffset = width - FULL_MS * newScale;
            newOffset = Math.max(Math.min(newOffset, maxOffset), minOffset);

            setScale(newScale);
            setOffsetX(newOffset);
        },
        [ref, scale, offsetX, width]
    );

    return { scale, offsetX, onWheel, START_YEAR, END_YEAR, MS_PER_YEAR };
}
