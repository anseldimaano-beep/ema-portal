import React from 'react';
import { COLLEGE_NAME } from '../utils/constants';

// Founded year and motto are taken from the college seal itself. Mission,
// vision, and accreditation are left as clearly-marked placeholders since
// those are official statements that should come from the school directly,
// not be invented here.
const About = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <div className="eyebrow mb-3">About Us</div>
    <h1 className="text-3xl font-bold mb-2">About {COLLEGE_NAME}</h1>
    <p className="text-gray-600 mb-10 max-w-2xl">
      Founded in 2012 in Pinamalayan, Oriental Mindoro, Philippines, under the motto
      "Love, Faith, Justice."
    </p>

    <section className="mb-8">
      <h2 className="text-xl font-bold mb-2">Our History</h2>
      <div className="card-accent p-6">
        <p className="text-gray-500 text-sm italic">
          Add the college's founding story and key milestones here — replace this placeholder with
          the official write-up.
        </p>
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-xl font-bold mb-2">Mission</h2>
      <div className="card-accent p-6">
        <p className="text-gray-500 text-sm italic">
          Add the official mission statement here.
        </p>
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-xl font-bold mb-2">Vision</h2>
      <div className="card-accent p-6">
        <p className="text-gray-500 text-sm italic">
          Add the official vision statement here.
        </p>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold mb-2">Accreditation</h2>
      <div className="card-accent p-6">
        <p className="text-gray-500 text-sm italic">
          Add CHED recognition details, accrediting bodies, and program permits/COPCs here.
        </p>
      </div>
    </section>
  </div>
);

export default About;
