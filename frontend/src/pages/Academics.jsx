import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import programs from '../data/programs';

const Academics = () => (
  <div className="max-w-6xl mx-auto px-4 py-16">
    <h1 className="text-3xl font-bold mb-2">Academics</h1>
    <p className="text-gray-600 mb-10 max-w-2xl">
      Degree programs offered at EMA EMITS College. Select a program to see its curriculum
      focus and career paths.
    </p>

    <div className="grid md:grid-cols-2 gap-6">
      {programs.map((program) => (
        <Link
          key={program.slug}
          to={`/academics/${program.slug}`}
          className="card hover:shadow-lg transition-shadow flex flex-col"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-primary-700 mb-2">
            {program.department}
          </span>
          <h2 className="text-xl font-bold mb-1">{program.abbr}</h2>
          <p className="text-gray-500 mb-4">{program.name}</p>
          <p className="text-gray-600 mb-4">{program.summary}</p>
          <span className="mt-auto inline-flex items-center gap-1 text-primary-800 font-medium text-sm">
            View program <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      ))}
    </div>
  </div>
);

export default Academics;
