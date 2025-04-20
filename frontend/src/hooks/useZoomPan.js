import { useState, useCallback, useEffect } from 'react';

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

/**
 * Hook für Zoom & Pan eines horizontalen Zeitstrahls.
 *
 * @param {React.RefObject<HTMLElement>} ref          – DOM‑Element für Wheel‑Events
 * @param {number}                       width        – Breite des Containers in px
 * @param {number}                       timelineStart– Startzeit (ms seit 1970)
 */
export default function useZoomPan(ref, width, timelineStart) {
    const [scale, setScale] = useState(1e-8);
    const [offsetX, setOffX] = useState(0);

    // Initialer Zoom: Heute mittig
    useEffect(() => {
        if (!ref.current || width === 0) return;
        const spanMs = Date.now() - timelineStart;
        const newScale = width / spanMs;
        const center = width / 2;
        const todayOff = -spanMs * newScale + center;
        setScale(newScale);
        setOffX(todayOff);
    }, [ref, width, timelineStart]);

    /**
     * Wheel‑Event: Shift+Wheel → Pan; sonst → Zoom
     * Vertikales Scrollen umgekehrt: Scroll ↑ zoomt rein, Scroll ↓ zoomt raus.
     */
    const onWheel = useCallback(
        (e) => {
            e.preventDefault();
            const { deltaY, shiftKey, clientX } = e;

            if (shiftKey) {
                // horizontales Pan
                setOffX((o) => o - deltaY);
                return;
            }

            // Scroll up (deltaY < 0) → reinzoomen (factor > 1)
            // Scroll down (deltaY > 0) → rauszoomen (factor < 1)
            const factor = deltaY < 0 ? 1.1 : 0.9;

            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const pivot = clientX - rect.left;

            setOffX((o) => (o - pivot) * factor + pivot);
            setScale((s) => s * factor);
        },
        [ref]
    );

    return { scale, offsetX, onWheel };
}