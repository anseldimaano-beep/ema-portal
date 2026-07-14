import React, { useState } from 'react';
import { COLLEGE_NAME } from '../utils/constants';

// Founded year, motto, and location are taken from the college seal itself.
const HISTORY_TABS = [
  {
    key: 'college',
    label: 'EMA EMITS College Philippines',
    body: "Add the college's founding story and key milestones here — replace this placeholder with the official write-up.",
    hasImage: true
  },
  {
    key: 'eemg',
    label: 'EMA EMITS Model Government',
    body: "Add the Model Government's founding story and key milestones here — replace this placeholder with the official write-up.",
    hasImage: false
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
        {tab.hasImage && (
          <div className="w-full aspect-video rounded-lg bg-gray-100 flex items-center justify-center mb-4 border border-dashed border-gray-300">
            <span className="text-sm text-gray-400">Photo coming soon</span>
          </div>
        )}
        <p className="text-gray-500 text-sm italic">{tab.body}</p>
      </div>
    </div>
  );
};

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
  </div>
);

export default About;