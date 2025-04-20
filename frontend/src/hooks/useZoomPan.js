import { useState, useCallback, useEffect } from 'react';

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

export default function useZoomPan(ref, width, timelineStart) {
    const [scale, setScale] = useState(1e-8); // px per ms
    const [offsetX, setOffX] = useState(0);    // pan‑Offset in px

    // Initialer Zoom: Heute mittig
    useEffect(() => {
        if (!ref.current || width === 0) return;
        const spanMs = Date.now() - timelineStart;
        const newScale = width / spanMs;
        const center = width / 2;
        const todayOffset = -spanMs * newScale + center;
        setScale(newScale);
        setOffX(todayOffset);
    }, [ref, width, timelineStart]);

    const onWheel = useCallback(
        (e) => {
            e.preventDefault();
            const { deltaY, shiftKey, clientX } = e;
            const factor = deltaY > 0 ? 1.1 : 0.9;

            if (shiftKey) {
                setOffX((o) => o - deltaY);
                return;
            }

            const rect = ref.current.getBoundingClientRect();
            const pivot = clientX - rect.left;
            setOffX((o) => (o - pivot) * factor + pivot);
            setScale((s) => s * factor);
        },
        [ref]
    );

    return { scale, offsetX: offsetX, onWheel };
}