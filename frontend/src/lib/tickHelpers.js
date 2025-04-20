// Ermittelt geeignete Tick‑Schritte (in Jahren) je nach Zoomstufe
export function chooseYearStep(pxPerYear) {
    const IDEAL_PX = 80;
    const targetYears = IDEAL_PX / pxPerYear;
    const steps = [
        1 / 365,      // Tage
        1 / 12,       // Monate
        1,          // Jahre
        10,         // Dekaden
        100,        // Jahrhunderte
        1_000,      // Jahrtausende
        1e4, 1e5,   // Myriaden / Zehntausende
        1e6, 1e7,   // Millionen / Zehnermillionen
        1e8, 1e9    // Hunderte Millionen / Milliarden
    ];
    return steps.find(s => s >= targetYears) || steps[steps.length - 1];
}

export function formatYearLabel(year) {
    if (year === -13_800_000_000) return 'Urknall';
    const abs = Math.abs(year);
    if (abs >= 1e9) return `${(year / 1e9).toFixed(1)} Mrd`;
    if (abs >= 1e6) return `${(year / 1e6).toFixed(1)} Mio`;
    if (abs >= 1e3) return `${(year / 1e3).toFixed(1)} Tsd`;
    return `${year}`;
}
