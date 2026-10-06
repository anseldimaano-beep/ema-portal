import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { COLLEGE_NAME } from '../utils/constants';

// Founded year, motto, and location are taken from the college seal itself.
// Mission/Vision/Core Values/Hymn belong to the college (EECP) specifically,
// not the student government body, so they only render under that tab.
const CollegeHistory = () => (
  <div className="space-y-8">
    <div className="space-y-4 text-gray-700 leading-relaxed">
      <p>
        EMA EMITS College Philippines began as Eastern Mindoro Academy (EMA), founded in 1945 in
        Pinamalayan, Oriental Mindoro by Attorney Federico Semilla. He was a native of Marinduque
        whose family had settled in Quinabigan, one of the town's barangays. In 1985 the school was
        incorporated as the Eastern Mindoro Institute of Technology and Sciences (EMITS).
      </p>
      <p>
        Many of today's students are the children and grandchildren of former students. For those
        families, EMITS has become a legacy. The Semilla family has kept upgrading the school, and
        its curriculum is revised regularly to meet DepEd requirements for private schools.
      </p>
    </div>

    <ol className="relative border-l-4 border-accent-500 ml-2 space-y-6">
      {COLLEGE_TIMELINE.map((m) => (
        <li key={m.year} className="pl-6 relative">
          <span className="absolute -left-[13px] top-1.5 w-5 h-5 rounded-full bg-primary-800 border-4 border-white ring-2 ring-accent-500" />
          <div className="font-display text-2xl font-bold text-primary-800 leading-none">{m.year}</div>
          <div className="font-semibold mt-1">{m.title}</div>
          <p className="text-gray-600 text-sm mt-1">{m.text}</p>
        </li>
      ))}
    </ol>

    <div>
      <h3 className="font-bold mb-2">One campus, kindergarten to college</h3>
      <p className="text-gray-700 mb-3">
        The school offers prep and kindergarten, elementary and secondary education, and college and
        technical courses recognized by CHED and TESDA.
      </p>
      <ul className="flex flex-wrap gap-2">
        {LEVELS.map((l) => (
          <li key={l} className="px-3 py-1 rounded-full text-sm bg-primary-50 text-primary-800 border border-primary-200">
            {l}
          </li>
        ))}
      </ul>
    </div>

    <div className="grid md:grid-cols-3 gap-4">
      {HIGHLIGHTS.map((h) => (
        <div key={h.title} className="border-t-4 border-primary-800 bg-gray-50 rounded-b-lg p-4">
          <h3 className="font-bold mb-1">{h.title}</h3>
          <p className="text-sm text-gray-600">{h.text}</p>
        </div>
      ))}
    </div>
  </div>
);

const COLLEGE_TIMELINE = [
  {
    year: '1945',
    title: 'Eastern Mindoro Academy opens',
    text: 'Attorney Federico Semilla founds the school in Pinamalayan, Oriental Mindoro.'
  },
  {
    year: '1985',
    title: 'Incorporated as EMITS',
    text: 'The Academy becomes the Eastern Mindoro Institute of Technology and Sciences.'
  },
  {
    year: '2012',
    title: 'EMA EMITS Model Government founded',
    text: 'Students gain a self-government body with senators, committees and representative groups.'
  }
];

const LEVELS = ['Prep & Kindergarten', 'Elementary', 'Secondary', 'College (CHED)', 'Technical (TESDA)'];

const HIGHLIGHTS = [
  {
    title: 'Campus press',
    text: 'The Rainbow Times (English) and Pulso ng EMITS (Filipino) have won over 200 press conference recognitions between them.'
  },
  {
    title: 'Theater',
    text: 'Tanghalan Ngani, the student theater group, stages full productions with costumes, props and lighting.'
  },
  {
    title: 'College of Education',
    text: 'Education students observe classes in the school\'s own high school department, and most graduates are hired soon after graduation.'
  }
];

const HISTORY_TABS = [
  {
    key: 'college',
    label: 'EMA EMITS College Philippines',
    body: <CollegeHistory />
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

// Paste the Alma Mater Song text between the backticks below.
// Leave a blank line between stanzas. Lines inside a stanza keep their line breaks.
const HYMN_LYRICS = ``;

const HymnSection = () => {
  const stanzas = HYMN_LYRICS.trim() ? HYMN_LYRICS.trim().split(/\n\s*\n/) : [];
  if (stanzas.length === 0) {
    return <PlaceholderSection title="EECP Hymn" text="Add the EECP Hymn lyrics here." />;
  }
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-2">EECP Hymn</h2>
      <div className="card-accent p-6 text-center">
        <p className="eyebrow justify-center mb-4">Alma Mater Song</p>
        <div className="space-y-5">
          {stanzas.map((st, i) => (
            <p key={i} className="whitespace-pre-line text-gray-700 leading-relaxed">
              {st}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

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
        {typeof tab.body === 'string' ? (
          <p className="text-gray-500 text-sm italic">{tab.body}</p>
        ) : (
          tab.body
        )}
      </div>

      {/* Mission/Vision/Core Values/Hymn are EECP (college) specific */}
      {active === 'college' && (
        <>
          <PlaceholderSection title="Mission" text="Add the official mission statement here." />
          <PlaceholderSection title="Vision" text="Add the official vision statement here." />
          <PlaceholderSection title="Core Values" text="Add the official core values here." />
          <HymnSection />
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
