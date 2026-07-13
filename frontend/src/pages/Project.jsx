import React from 'react';

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

// Standalone page describing the EEMG Model Government program itself -
// separate from the homepage, which just summarizes the site's sections.
const Project = () => (
  <div className="max-w-5xl mx-auto px-4 py-16">
    <div className="eyebrow mb-3">The Project</div>
    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
      About the EMA EMITS Model Government
    </h1>
    <p className="text-gray-600 max-w-3xl mb-10">
      EEMG is EMA EMITS College's student-run simulation of the Philippine Senate, giving students
      a direct, practical understanding of how legislation is made from the ground up.
    </p>

    <div className="grid md:grid-cols-3 gap-6">
      {PROJECT_PILLARS.map((p) => (
        <div key={p.title} className="card-accent p-6">
          <h3 className="font-bold text-primary-900 mb-2">{p.title}</h3>
          <p className="text-gray-600 text-sm">{p.body}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Project;
