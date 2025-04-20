import { useState, useCallback, useEffect } from 'react';

/**
 * Zoom‑ und Pan‑Hook für den Timeline‑Container.
 *
 * @param {React.RefObject<HTMLElement>} ref    DOM‑Element, das das Mausrad empfängt
 * @param {number} [initialScale=1e-5]          Start‑Zoomfaktor (px pro ms)
 */
export default function useZoomPan(ref, initialScale = 1e-5) {
    // px pro Millisekunde — definiert das gesamte Zoom‑Level
    const [scale, setScale] = useState(initialScale);
    // Horizontaler Pan‑Offset in Pixeln
    const [offsetX, setOffsetX] = useState(0);

    /**
     * Nach dem ersten Rendern: „Heute“ in die Mitte des Elements setzen.
     */
    useEffect(() => {
        if (!ref.current) return;
        const mid = ref.current.clientWidth / 2;
        setOffsetX(-Date.now() * initialScale + mid);
        // initialScale darf hier NICHT mit in den dep‑array, sonst springen wir bei jedem Zoom.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref]);

    /**
     * Handler für das native `wheel`‑Event.
     *  * Shift + Wheel  → horizontales Panning
     *  * nur Wheel      → Zoom um den Maus‑Pivot
     */
    const onWheel = useCallback(
        (e) => {
            e.preventDefault();
            const { deltaY, shiftKey, clientX } = e;

            if (shiftKey) {
                // Horizontal scrollen (Pan)
                setOffsetX((o) => o - deltaY);
                return;
            }

            // Zoomen
            const factor = deltaY > 0 ? 1.1 : 0.9; // runter = rauszoomen, hoch = reinzoomen
            const rect = ref.current.getBoundingClientRect();
            const pivot = clientX - rect.left; // Maus‑X relativ zum Element

            // Erst den Offset so anpassen, dass der Pivot‑Punkt beim Zoomen erhalten bleibt
            setOffsetX((o) => (o - pivot) * factor + pivot);
            // Dann die eigentliche Skalierung ändern
            setScale((s) => s * factor);
        },
        [ref]
    );

    return { scale, offsetX, onWheel };
}