import { useState, useEffect } from 'react';
import timelineService from '@/services/timelineService';

export default function useTimelineData() {
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const timelineStart = new Date('0000-01-01').getTime();

    useEffect(() => {
        timelineService.getEvents().then(data => {
            setEvents(data);
            const cats = Array.from(new Set(data.map(e => e.category)));
            setCategories(cats);
        });
    }, []);

    return { events, categories, timelineStart };
}