import { useState, useCallback, useEffect } from 'react';

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
const START_YEAR = -13_800_000_000;  // Urknall relativ (Jahre)
const END_YEAR = 3_000;          // bis 3000 n. Chr.
const FULL_MS = (END_YEAR - START_YEAR) * MS_PER_YEAR;

export default function useZoomPan(
    ref,
    width,
    initialStartYear = START_YEAR,
    initialEndYear = END_YEAR
) {
    // Minimaler Zoom, um ganzes Fenster zu zeigen
    const MIN_SCALE = width > 0 ? width / FULL_MS : 1e-12;

    const [scale, setScale] = useState(MIN_SCALE);
    const [offsetX, setOffsetX] = useState(0);

    // Initial: Startbereich (z.B. 1900–2050)
    useEffect(() => {
        if (!ref.current || width <= 0) return;
        const spanMs = (initialEndYear - initialStartYear) * MS_PER_YEAR;
        let initScale = width / spanMs;
        if (initScale < MIN_SCALE) initScale = MIN_SCALE;
        const initOffset = -(initialStartYear - START_YEAR) * MS_PER_YEAR * initScale;
        setScale(initScale);
        setOffsetX(initOffset);
    }, [ref, width, initialStartYear, initialEndYear, MIN_SCALE]);

    const onWheel = useCallback((e) => {
        e.preventDefault();
        if (!ref.current) return;
        const { deltaY, shiftKey, clientX } = e;
        const rect = ref.current.getBoundingClientRect();
        const cursorX = clientX - rect.left;

        let newScale = scale;
        let newOffset = offsetX;

        if (shiftKey) {
            // horizontales Pan
            newOffset = offsetX - deltaY;
        } else {
            // Zoom-Faktor invertiert: Scroll↑ rein, ↓ raus
            const factor = deltaY < 0 ? 1.1 : 0.9;
            let s = scale * factor;
            if (s < MIN_SCALE) s = MIN_SCALE;
            // Weltkoordinate (ms seit Urknall) unter dem Cursor
            const timeAtCursor = (cursorX - offsetX) / scale;
            // Neuer Offset, damit diese Weltkoordinate unter Cursor bleibt
            const o = cursorX - timeAtCursor * s;
            newScale = s;
            newOffset = o;
        }

        // Clamp auf [links … rechts]
        const maxOffset = 0;
        const minOffset = width - FULL_MS * newScale;
        if (newOffset > maxOffset) newOffset = maxOffset;
        if (newOffset < minOffset) newOffset = minOffset;

        setScale(newScale);
        setOffsetX(newOffset);
    }, [ref, scale, offsetX, width]);

    return {
        scale,
        offsetX,
        onWheel,
        START_YEAR,
        END_YEAR,
        MS_PER_YEAR,
    };
}