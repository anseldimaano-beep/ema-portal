import React from 'react';
import Calendar from '../components/Calendar';

const CalendarPage = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <div className="eyebrow mb-3">Academic Calendar</div>
    <h1 className="text-3xl font-bold mb-2">Academic Calendar</h1>
    <p className="text-gray-600 mb-10 max-w-2xl">
      Session schedules, academic dates, and upcoming events for the EMA EMITS Model Government.
    </p>
    <Calendar />
  </div>
);

export default CalendarPage;
