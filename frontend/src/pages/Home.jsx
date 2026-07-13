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

const ProjectSection = () => (
  <div className="max-w-7xl mx-auto px-4 py-16">
    <div className="eyebrow mb-3">The Project</div>
    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
      About the EMA EMITS Model Government
    </h2>
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

      <ProjectSection />

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
