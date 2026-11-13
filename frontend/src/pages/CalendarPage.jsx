import React from 'react';
import { Download, Maximize2 } from 'lucide-react';
import Calendar from '../components/Calendar';
import calendarImage from '../assets/college_calendar_2026_2027.webp';

const CalendarPage = () => (
  <div className="max-w-5xl mx-auto px-4 py-16">
    <div className="eyebrow mb-3">Academic Calendar</div>
    <h1 className="text-3xl font-bold mb-2">Academic Calendar</h1>
    <p className="text-gray-600 mb-10 max-w-2xl">
      Session schedules, academic dates, and upcoming events for the EMA EMITS Model Government.
    </p>

    <section className="mb-14">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold text-primary-900">2026&ndash;2027 Collegiate Calendar</h2>
        <div className="flex gap-2">
          <a
            href={calendarImage}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:text-primary-800 transition-colors"
          >
            <Maximize2 className="h-4 w-4" />
            View full size
          </a>
          <a
            href={calendarImage}
            download="EMA_EMITS_College_Calendar_2026_2027.webp"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:text-primary-800 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download
          </a>
        </div>
      </div>
      <a href={calendarImage} target="_blank" rel="noopener noreferrer" className="block">
        <img
          src={calendarImage}
          alt="EMA EMITS College Philippines 2026-2027 Collegiate Calendar (Bi-Semester)"
          className="w-full h-auto rounded-lg shadow-md border border-gray-200"
          loading="lazy"
        />
      </a>
      <p className="text-xs text-gray-500 mt-2">
        This calendar is tentative and may be subject to change or reschedule. Please stay updated for official
        announcements.
      </p>
    </section>

    <h2 className="text-xl font-bold text-primary-900 mb-6">Key Dates</h2>
    <Calendar />
  </div>
);

export default CalendarPage;
