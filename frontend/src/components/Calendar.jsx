import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, Clock } from 'lucide-react';
import api from '../services/api';
import { formatDate, formatTime } from '../utils/helpers';

// Visual treatment per event type - a left accent bar + small badge color,
// so exams, holidays, deadlines etc. are distinguishable at a glance.
const EVENT_STYLES = {
  semester_start: { bar: 'bg-green-500', badge: 'bg-green-50 text-green-700' },
  semester_end: { bar: 'bg-green-500', badge: 'bg-green-50 text-green-700' },
  enrollment: { bar: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700' },
  examination: { bar: 'bg-red-500', badge: 'bg-red-50 text-red-700' },
  holiday: { bar: 'bg-accent-500', badge: 'bg-accent-50 text-accent-700' },
  event: { bar: 'bg-primary-700', badge: 'bg-primary-50 text-primary-700' },
  deadline: { bar: 'bg-orange-500', badge: 'bg-orange-50 text-orange-700' },
  suspension: { bar: 'bg-gray-500', badge: 'bg-gray-100 text-gray-700' },
  other: { bar: 'bg-gray-400', badge: 'bg-gray-100 text-gray-600' }
};

const monthKey = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long' });
};

const EventRow = ({ event }) => {
  const style = EVENT_STYLES[event.event_type] || EVENT_STYLES.other;
  const d = new Date(event.start_date);

  return (
    <div className={`flex gap-4 border-l-4 ${style.bar} bg-white rounded-r-lg shadow-sm border border-gray-100 border-l-4 p-4`}>
      <div className="shrink-0 w-14 text-center">
        <div className="text-xs font-bold uppercase text-gray-400">
          {d.toLocaleDateString('en-PH', { month: 'short' })}
        </div>
        <div className="text-2xl font-bold text-gray-900 leading-tight">{d.getDate()}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className={`text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${style.badge}`}>
            {event.event_type_display}
          </span>
          {event.end_date && event.end_date !== event.start_date && (
            <span className="text-xs text-gray-400">through {formatDate(event.end_date)}</span>
          )}
        </div>
        <h3 className="font-bold text-gray-900">{event.title}</h3>
        {event.description && <p className="text-gray-600 text-sm mt-1">{event.description}</p>}
        <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
          {!event.is_all_day && event.start_time && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatTime(event.start_time)}
              {event.end_time && ` – ${formatTime(event.end_time)}`}
            </span>
          )}
          {event.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {event.location}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    api
      .get('/portal/calendar/')
      .then((res) => {
        setEvents(res.data.results || res.data || []);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  const grouped = useMemo(() => {
    const sorted = [...events].sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    const groups = {};
    sorted.forEach((e) => {
      const key = monthKey(e.start_date);
      groups[key] = groups[key] || [];
      groups[key].push(e);
    });
    return groups;
  }, [events]);

  if (status === 'loading') {
    return <p className="text-gray-500">Loading calendar…</p>;
  }

  if (status === 'error' || events.length === 0) {
    return (
      <div className="card p-8 text-center text-gray-500">
        No calendar events have been posted yet. Check back soon.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {Object.entries(grouped).map(([month, monthEvents]) => (
        <div key={month}>
          <h2 className="text-lg font-bold text-primary-900 mb-4">{month}</h2>
          <div className="space-y-3">
            {monthEvents.map((e) => (
              <EventRow key={e.id} event={e} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Calendar;
