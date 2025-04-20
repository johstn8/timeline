import { useState, useCallback } from 'react';

export default function useZoomPan() {
    const [scale, setScale] = useState(0.0000001);
    const [offsetX, setOffsetX] = useState(0);

    const onWheel = useCallback(e => {
        e.preventDefault();
        const delta = e.deltaY;
        if (e.shiftKey) {
            setOffsetX(o => o - delta);
        } else {
            const factor = delta > 0 ? 1.1 : 0.9;
            setScale(s => s * factor);
        }
    }, []);

    return { scale, offsetX, onWheel };
}