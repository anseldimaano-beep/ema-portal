import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { COLLEGE_NAME } from '../utils/constants';

// Founded year, motto, and location are taken from the college seal itself.
// Mission/Vision/Core Values/Hymn belong to the college (EECP) specifically,
// not the student government body, so they only render under that tab.
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

const PlaceholderSection = ({ title, text }) => (
  <section className="mb-8">
    <h2 className="text-xl font-bold mb-2">{title}</h2>
    <div className="card-accent p-6">
      <p className="text-gray-500 text-sm italic">{text}</p>
    </div>
  </section>
);

const HistoryTabs = () => {
  const [active, setActive] = useState(HISTORY_TABS[0].key);
  const { hash } = useLocation();
  const tab = HISTORY_TABS.find((t) => t.key === active);

  // The About dropdown links to /about#college and /about#eemg. React
  // Router doesn't reload the page for a hash change on the same route, so
  // pick up the hash here and switch the tab to match.
  useEffect(() => {
    const key = hash.replace('#', '');
    if (HISTORY_TABS.some((t) => t.key === key)) {
      setActive(key);
    }
  }, [hash]);

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

      <div className="card-accent p-6 mb-8">
        {/* Image placeholder - photos to be added later */}
        <div className="w-full aspect-video rounded-lg bg-gray-100 flex items-center justify-center mb-4 border border-dashed border-gray-300">
          <span className="text-sm text-gray-400">Photo coming soon</span>
        </div>
        <p className="text-gray-500 text-sm italic">{tab.body}</p>
      </div>

      {/* Mission/Vision/Core Values/Hymn are EECP (college) specific */}
      {active === 'college' && (
        <>
          <PlaceholderSection title="Mission" text="Add the official mission statement here." />
          <PlaceholderSection title="Vision" text="Add the official vision statement here." />
          <PlaceholderSection title="Core Values" text="Add the official core values here." />
          <PlaceholderSection title="EECP Hymn" text="Add the EECP Hymn lyrics here." />
        </>
      )}
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

    <section>
      <h2 className="text-xl font-bold mb-2">Our History</h2>
      <HistoryTabs />
    </section>
  </div>
);

export default About;