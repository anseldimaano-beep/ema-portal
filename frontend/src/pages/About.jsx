import React from 'react';
import { COLLEGE_NAME } from '../utils/constants';

// Placeholder copy - replace with the school's real history, mission, and
// vision statements before this goes live.
const About = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <h1 className="text-3xl font-bold mb-8">About {COLLEGE_NAME}</h1>

    <section className="mb-10">
      <h2 className="text-xl font-bold mb-2">Our History</h2>
      <p className="text-gray-600">
        Replace with the college's founding story, year established, and key milestones.
      </p>
    </section>

    <section className="mb-10">
      <h2 className="text-xl font-bold mb-2">Mission</h2>
      <p className="text-gray-600">Replace with the official mission statement.</p>
    </section>

    <section className="mb-10">
      <h2 className="text-xl font-bold mb-2">Vision</h2>
      <p className="text-gray-600">Replace with the official vision statement.</p>
    </section>

    <section>
      <h2 className="text-xl font-bold mb-2">Accreditation</h2>
      <p className="text-gray-600">
        Replace with CHED recognition details, accrediting bodies, and program permits/COPCs.
      </p>
    </section>
  </div>
);

export default About;
