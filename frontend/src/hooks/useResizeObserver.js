import { useState, useEffect, useRef } from 'react';

/**
 * useResizeObserver
 * Beobachtet die Größe eines Elements und liefert Breite & Höhe zurück.
 *
 * @returns {{
 *   ref: React.RefObject<HTMLElement>,
 *   width: number,
 *   height: number
 * }}
 */
export default function useResizeObserver() {
    // Referenz, die du im JSX an dein Element hängst
    const ref = useRef(null);
    // State für aktuelle Dimensionen
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        // Nur initialisieren, wenn ref gesetzt ist
        if (!ref.current) return;

        // Erstelle Observer
        const observer = new ResizeObserver(entries => {
            const entry = entries[0];
            // Aktualisiere State mit neuen Maßen
            setDimensions({
                width: entry.contentRect.width,
                height: entry.contentRect.height,
            });
        });

        observer.observe(ref.current);

        // Cleanup: Beobachtung beenden
        return () => {
            observer.disconnect();
        };
    }, [ref]);

    // Rückgabe: ref + aktuelle Breite/Höhe
    return { ref, ...dimensions };
}
