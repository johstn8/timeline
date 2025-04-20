// ---------- src/hooks/usePan.js ----------
import { useState, useRef } from 'react';

export default function usePan(initialOffset = 0) {
    const [offset, setOffset] = useState(initialOffset);
    const startX = useRef(null);

    const wheelShift = (dy) => {
        setOffset(o => o - dy);
    };

    const onMouseDown = (e) => { startX.current = e.clientX; };
    const onMouseMove = (e) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        startX.current = e.clientX;
        setOffset(o => o + dx);
    };
    const onMouseUp = () => { startX.current = null; };

    return { offset, setOffset, wheelShift, onMouseDown, onMouseMove, onMouseUp };
}