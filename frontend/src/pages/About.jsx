import React, { useState } from 'react';
import { COLLEGE_NAME } from '../utils/constants';

// Founded year, motto, and location are taken from the college seal itself.
// Mission, Vision, Core Values, and history copy are left as clearly-marked
// placeholders since those are official statements that should come from
// the school directly, not be invented here.
const HISTORY_TABS = [
  {
    key: 'college',
    label: 'EMA EMITS College Philippines',
    body: "Add the college's founding story and key milestones here — replace this placeholder with the official write-up."
  },
  {
    key: 'eemg',
    label: 'EMA EMITS Model Government',
    body: "Add the Model Government's founding story and key milestones here — replace this placeholder with the official write-up."
  }
];

const HistoryTabs = () => {
  const [active, setActive] = useState(HISTORY_TABS[0].key);
  const tab = HISTORY_TABS.find((t) => t.key === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {HISTORY_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              active === t.key
                ? 'bg-primary-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="card-accent p-6">
        {/* Image placeholder - photos to be added later */}
        <div className="w-full aspect-video rounded-lg bg-gray-100 flex items-center justify-center mb-4 border border-dashed border-gray-300">
          <span className="text-sm text-gray-400">Photo coming soon</span>
        </div>
        <p className="text-gray-500 text-sm italic">{tab.body}</p>
      </div>
    </div>
  );
};

const PlaceholderSection = ({ title, text }) => (
  <section className="mb-8">
    <h2 className="text-xl font-bold mb-2">{title}</h2>
    <div className="card-accent p-6">
      <p className="text-gray-500 text-sm italic">{text}</p>
    </div>
  </section>
);

const About = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <div className="eyebrow mb-3">About Us</div>
    <h1 className="text-3xl font-bold mb-2">About {COLLEGE_NAME}</h1>
    <p className="text-gray-600 mb-10 max-w-2xl">
      EMA EMITS Model Government is a student-body organization of {COLLEGE_NAME}, founded in 2012
      in Pinamalayan, Oriental Mindoro, Philippines, under the motto "Love, Faith, Justice."
    </p>

    <section className="mb-8">
      <h2 className="text-xl font-bold mb-2">Our History</h2>
      <HistoryTabs />
    </section>

    <PlaceholderSection title="Mission" text="Add the official mission statement here." />
    <PlaceholderSection title="Vision" text="Add the official vision statement here." />
    <PlaceholderSection title="Core Values" text="Add the official core values here." />
    <PlaceholderSection title="EECP Hymn" text="Add the EECP Hymn lyrics here." />
  </div>
);

export default About;