import React, { useState } from 'react';

const PROJECT_PILLARS = [
  {
    title: 'What It Is',
    body:
      'A hands-on civic education program where EMA EMITS College students take on the roles of senators and committee officers, running real legislative sessions on issues affecting campus life.'
  },
  {
    title: 'How It Works',
    body:
      'Students file resolutions, debate them in committee, and bring approved measures to the floor for a full session vote, following the same process used by the actual Philippine Senate.'
  },
  {
    title: 'Why It Matters',
    body:
      'The program builds public speaking, policy research, and parliamentary skills, giving students first-hand practice in how laws are written, debated, and passed.'
  }
];

const YEARS = [
  { key: 'ay2025', label: '2025-2026' },
  { key: 'ay2026', label: '2026-2027' }
];

// Shared tabbed-by-term layout for the Project and Programs sections below.
const YearTabSection = ({ title, placeholder }) => {
  const [active, setActive] = useState(YEARS[0].key);

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {YEARS.map((y) => (
          <button
            key={y.key}
            onClick={() => setActive(y.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              active === y.key
                ? 'bg-primary-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {y.label}
          </button>
        ))}
      </div>
      <div className="card-accent p-6">
        <p className="text-gray-500 text-sm italic">
          {placeholder} for A.Y. {YEARS.find((y) => y.key === active).label}.
        </p>
      </div>
    </section>
  );
};

// Standalone page describing the EEMG Model Government program itself -
// separate from the homepage, which just summarizes the site's sections.
const Project = () => (
  <div className="max-w-5xl mx-auto px-4 py-16">
    <div className="eyebrow mb-3">The Project &amp; Programs</div>
    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
      About the EMA EMITS Model Government
    </h1>
    <p className="text-gray-600 max-w-3xl mb-10">
      EEMG is EMA EMITS College's student-run simulation of the Philippine Senate, giving students
      a direct, practical understanding of how legislation is made from the ground up. To know more,
      click here.
    </p>

    <div className="grid md:grid-cols-3 gap-6 mb-12">
      {PROJECT_PILLARS.map((p) => (
        <div key={p.title} className="card-accent p-6">
          <h3 className="font-bold text-primary-900 mb-2">{p.title}</h3>
          <p className="text-gray-600 text-sm">{p.body}</p>
        </div>
      ))}
    </div>

    <YearTabSection title="Project" placeholder="Add the project details" />
    <YearTabSection title="Programs" placeholder="Add the program details" />
  </div>
);

export default Project;