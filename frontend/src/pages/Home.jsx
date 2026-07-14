import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import api from '../services/api';
import { formatDate } from '../utils/helpers';
import eemgSeal from '../assets/eemg_seal.png';

// Hero image + pagination, styled after the Senate site's
// "Latest Photo Releases" module: an eyebrow label, headline, excerpt and
// date on the left, a large photo with prev/next controls on the right.
const HeroCarousel = ({ slides }) => {
  const [index, setIndex] = useState(0);
  const total = slides.length;
  const slide = slides[index];

  const goPrev = () => setIndex((i) => (i - 1 + total) % total);
  const goNext = () => setIndex((i) => (i + 1) % total);

  if (!slide) return null;

  return (
    <div className="bg-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-16 grid md:grid-cols-2 gap-10 items-center">
        {/* Left: copy */}
        <div>
          <div className="eyebrow mb-4">Latest Announcements</div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
            {slide.title}
          </h1>
          <p className="text-gray-600 text-base md:text-lg mb-6 max-w-xl">
            {slide.excerpt || slide.content}
          </p>
          {slide.published_at && (
            <p className="text-sm text-gray-400 mb-8">{formatDate(slide.published_at)}</p>
          )}
          <div className="flex flex-wrap gap-4">
            <Link to={`/government`} className="btn-primary">
              Learn More
            </Link>
            <Link to="/faq" className="btn-outline">
              View All Announcements
            </Link>
          </div>
        </div>

        {/* Right: photo + pagination, mirroring the reference layout */}
        <div className="relative rounded-xl overflow-hidden shadow-xl bg-primary-900 aspect-[4/3]">
          {slide.featured_image ? (
            <img
              src={slide.featured_image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-8">
              <img src={eemgSeal} alt="" className="w-full h-full object-contain" />
            </div>
          )}

          {total > 1 && (
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-6 bg-gradient-to-t from-black/60 to-transparent py-4">
              <button
                onClick={goPrev}
                aria-label="Previous"
                className="h-9 w-9 flex items-center justify-center rounded-full bg-white/90 text-primary-900 hover:bg-white transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-white text-sm font-semibold tabular-nums">
                {index + 1} / {total}
              </span>
              <button
                onClick={goNext}
                aria-label="Next"
                className="h-9 w-9 flex items-center justify-center rounded-full bg-white/90 text-primary-900 hover:bg-white transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const STATS = [
  { label: 'Senators', value: '12' },
  { label: 'Committees', value: '6' },
  { label: 'Representative Groups', value: '5' },
  { label: 'Founded', value: '2012' }
];

const StatsStrip = () => (
  <div className="bg-primary-900 border-b-4 border-accent-400">
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      {STATS.map((s) => (
        <div key={s.label}>
          <div className="text-3xl md:text-4xl font-extrabold text-white">{s.value}</div>
          <div className="text-xs md:text-sm font-semibold text-primary-200 uppercase tracking-wide mt-1.5">{s.label}</div>
        </div>
      ))}
    </div>
  </div>
);

const CATEGORY_LABELS = {
  general: 'General',
  academic: 'Academic',
  administrative: 'Administrative',
  event: 'Event',
  emergency: 'Emergency',
  enrollment: 'Enrollment',
  scholarship: 'Scholarship'
};

const AnnouncementCard = ({ a }) => (
  <div className="card-accent flex flex-col">
    <div className="h-40 bg-primary-50 flex items-center justify-center overflow-hidden">
      {a.featured_image ? (
        <img src={a.featured_image} alt={a.title} className="w-full h-full object-cover" />
      ) : (
        <ImageOff className="h-8 w-8 text-primary-200" />
      )}
    </div>
    <div className="p-5 flex flex-col flex-1">
      <div className="flex items-center gap-2 text-xs mb-2">
        <span className="uppercase tracking-wide font-bold text-primary-700">
          {CATEGORY_LABELS[a.category] || 'General'}
        </span>
        {a.published_at && <span className="text-gray-400">· {formatDate(a.published_at)}</span>}
      </div>
      <h3 className="font-bold text-gray-900 mb-2">{a.title}</h3>
      <p className="text-gray-600 text-sm flex-1">{a.excerpt || a.content}</p>
    </div>
  </div>
);

const SITE_SECTIONS = [
  {
    title: 'About',
    body: 'The college background, mission, vision, and accreditation details.',
    to: '/about'
  },
  {
    title: 'Project',
    body: 'What the Model Government program is and how it works.',
    to: '/project'
  },
  {
    title: 'Government',
    body: 'Meet the senators and see how committees are organized.',
    to: '/government'
  },
  {
    title: 'Calendar',
    body: 'Academic dates, session schedules, and upcoming events.',
    to: '/calendar'
  },
  {
    title: 'FAQ',
    body: 'Answers to common questions about admissions and campus life.',
    to: '/faq'
  },
  {
    title: 'Contact',
    body: 'Reach the office directly or send a message through the form.',
    to: '/contact'
  }
];

const SiteOverviewSection = () => (
  <div className="max-w-7xl mx-auto px-4 py-16">
    <div className="eyebrow mb-3">On This Site</div>
    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">What you'll find here</h2>
    <p className="text-gray-600 max-w-3xl mb-10">
      A quick summary of every section of the EMA EMITS Model Government portal.
    </p>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {SITE_SECTIONS.map((s) => (
        <Link key={s.title} to={s.to} className="card-accent p-6 hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-primary-900 mb-2">{s.title}</h3>
          <p className="text-gray-600 text-sm">{s.body}</p>
        </Link>
      ))}
    </div>
  </div>
);

const Home = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    api
      .get('/portal/announcements/')
      .then((res) => setAnnouncements(res.data.results || res.data || []))
      .catch(() => setAnnouncements([]));
  }, []);

  // Feature the newest/pinned items in the hero carousel; the rest fill the grid below.
  const heroSlides = useMemo(() => announcements.slice(0, 5), [announcements]);
  const restSlides = useMemo(() => announcements.slice(5), [announcements]);

  const fallbackSlide = {
    title: 'EMA EMITS Model Government',
    excerpt:
      'Follow session updates, senator profiles, and committee work from the EMA EMITS Model Government right here.',
    featured_image: null
  };

  return (
    <div>
      <HeroCarousel slides={heroSlides.length > 0 ? heroSlides : [fallbackSlide]} />

      <StatsStrip />

      <SiteOverviewSection />

      {/* Announcements grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="eyebrow mb-3">News &amp; Announcements</div>
            <h2 className="text-2xl font-bold text-gray-900">More from the Model Government</h2>
          </div>
        </div>

        {announcements.length === 0 && (
          <p className="text-gray-500">No announcements right now. Check back soon.</p>
        )}

        {restSlides.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restSlides.map((a) => (
              <AnnouncementCard key={a.id} a={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
