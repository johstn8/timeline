import { useState, useCallback, useEffect } from 'react';

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
const START_YEAR = -13_800_000_000;  // Urknall
const END_YEAR = 3_000;          // maximales Jahr
const FULL_MS = (END_YEAR - START_YEAR) * MS_PER_YEAR;

export default function useZoomPan(
    ref,
    width,
    initialStartYear = START_YEAR,
    initialEndYear = END_YEAR
) {
    const MIN_SCALE = width > 0
        ? width / ((initialEndYear - initialStartYear) * MS_PER_YEAR)
        : 1e-12;

    const [scale, setScale] = useState(MIN_SCALE);
    const [offsetX, setOffsetX] = useState(0);

    // initialer Viewport 1900–2050
    useEffect(() => {
        if (!ref.current || width <= 0) return;
        const spanMs = (initialEndYear - initialStartYear) * MS_PER_YEAR;
        const initScale = width / spanMs;
        const initOff = -(initialStartYear - START_YEAR) * MS_PER_YEAR * initScale;
        setScale(initScale);
        setOffsetX(initOff);
    }, [ref, width, initialStartYear, initialEndYear]);

    const onWheel = useCallback((e) => {
        e.preventDefault();
        if (!ref.current) return;
        const { deltaY, shiftKey, clientX } = e;
        const rect = ref.current.getBoundingClientRect();
        const pivot = clientX - rect.left;

        let newScale = scale;
        let newOffset = offsetX;

        if (shiftKey) {
            // horizontales Panning
            newOffset = offsetX - deltaY;
        } else {
            // Zoom: ↑ rein (factor>1), ↓ raus (factor<1)
            const factor = deltaY < 0 ? 1.1 : 0.9;
            newScale = Math.max(scale * factor, MIN_SCALE);
            newOffset = (offsetX - pivot) * (newScale / scale) + pivot;
        }

        // clamp Offset innerhalb [maxO..minO]
        const maxOffset = 0;
        const minOffset = width - FULL_MS * newScale;
        newOffset = Math.min(Math.max(newOffset, minOffset), maxOffset);

        setScale(newScale);
        setOffsetX(newOffset);
    }, [ref, scale, offsetX, width]);

    return {
        scale,
        offsetX,
        onWheel,
        START_YEAR,
        END_YEAR,
        MS_PER_YEAR
    };
}
