//---------------------------------------------------------------------
// ---------- components/Timeline/Tooltip.jsx ----------
import React from 'react';
import { format } from 'date-fns';

export default function Tooltip({ event, position, onClose }) {
    const { title, startDate, endDate, description } = event;
    const fmt = d => format(new Date(d), 'PPP');
    return (
        <div className="absolute z-50 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow max-w-xs"
            style={{ left: position.x, top: position.y }}>
            <button onClick={onClose} className="absolute top-1 right-1">×</button>
            <h3 className="font-semibold mb-1 text-sm">{title}</h3>
            <p className="text-xs mb-1">{fmt(startDate)}{endDate ? ` – ${fmt(endDate)}` : ''}</p>
            {description && <p className="text-xs">{description}</p>}
        </div>
    );
}
