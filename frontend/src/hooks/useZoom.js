// ---------- src/hooks/useZoom.js ----------
import { useState } from 'react';

export default function useZoom(initialScale = 1, minScale = 0.05, maxScale = 50) {
    const [scale, setScale] = useState(initialScale);

    function wheel(e) {
        e.preventDefault();
        const factor = Math.exp(-e.deltaY * 0.002);
        const newScale = Math.min(maxScale, Math.max(minScale, scale * factor));
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        // Offset correction
        const delta = mouseX * (1 / scale - 1 / newScale);
        setScale(newScale);
        return { delta };
    }

    return { scale, wheel };
}