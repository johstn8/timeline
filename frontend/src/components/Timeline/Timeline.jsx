import React, { useEffect, useRef, useState } from 'react';

export default function Timeline() {
    const wrapperRef = useRef(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    // Breite und Höhe messen
    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => {
            setWidth(entry.contentRect.width);
            setHeight(entry.contentRect.height);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    return (
        <div
            ref={wrapperRef}
            className="absolute inset-0 overflow-hidden"
        >
            <svg width="100%" height="100%">
                {/* Timeline-Strich horizontal in der Mitte */}
                <line
                    x1="0"
                    y1={height / 2}
                    x2={width}
                    y2={height / 2}
                    stroke="black"
                    strokeWidth="3"
                />
            </svg>
        </div>
    );
}
