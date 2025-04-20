import { useState, useCallback, useEffect } from 'react';

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

/**
 * Hook für Zoom & Pan eines horizontalen Zeitstrahls.
 *
 * @param {React.RefObject<HTMLElement>} ref          – DOM‑Element, das die Wheel‑Events bekommt
 * @param {number}                       width        – aktuelle Breite des Containers in px
 * @param {number}                       timelineStart– Epoche‑Start (ms since 1970‑01‑01 UTC)
 */
export default function useZoomPan(ref, width, timelineStart) {
    // px pro ms; wird nach erster Messung des Containers gesetzt
    const [scale, setScale] = useState(1e-8);
    // horizontaler Offset in px (Pan)
    const [offsetX, setOffsetX] = useState(0);

    /**
     * Initiale Skalierung & Zentrierung → "Heute" soll mittig sein.
     */
    useEffect(() => {
        if (!ref.current || width === 0) return;

        const spanMs = Date.now() - timelineStart;      // Zeitspanne Jahr 0 → Heute
        const newScale = width / spanMs;                // alles sichtbar machen

        const centre = width / 2;
        const todayOffset = -spanMs * newScale + centre; // Heute mittig

        setScale(newScale);
        setOffsetX(todayOffset);
    }, [ref, width, timelineStart]);

    /**
     * Wheel‑Handler:
     *   • Shift+Wheel  → horizontal Pan
     *   • Wheel        → Zoom um Pivot der Maus
     */
    const onWheel = useCallback(
        (e) => {
            e.preventDefault();
            const { deltaY, shiftKey, clientX } = e;
            const factor = deltaY > 0 ? 1.1 : 0.9; // raus / rein

            if (shiftKey) {
                setOffsetX((o) => o - deltaY);
                return;
            }

            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const pivot = clientX - rect.left;            // Maus‑X relativ zum Element

            setOffsetX((o) => (o - pivot) * factor + pivot);
            setScale((s) => s * factor);
        },
        [ref]
    );

    return { scale, offsetX, onWheel };
}