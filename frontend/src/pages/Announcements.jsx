import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { formatDate } from '../utils/helpers';
import VideoEmbed from '../components/VideoEmbed';
import PostPhotoGrid from '../components/PostPhotoGrid';
import { Globe } from 'lucide-react';
import logo from '../assets/logo.png';

const CATEGORY_LABELS = {
  general: 'General',
  academic: 'Academic',
  administrative: 'Administrative',
  event: 'Event',
  emergency: 'Emergency',
  enrollment: 'Enrollment'
};

const CATEGORY_FILTERS = [{ value: 'all', label: 'All' }, ...Object.entries(CATEGORY_LABELS).map(
  ([value, label]) => ({ value, label })
)];

// Facebook-style post: page header, text with "See more", video, then a photo collage.
const AnnouncementRow = ({ a }) => {
  const [expanded, setExpanded] = useState(false);
  const text = a.content || a.excerpt || '';
  const isLong = text.length > 220 || text.split('\n').length > 4;
  const hasVideo = !!(a.video_file || a.video_url);

  // With a video, the featured image is just its poster/fallback; otherwise it leads the collage.
  const photos = [
    ...(!hasVideo && a.featured_image ? [{ src: a.featured_image, caption: a.title }] : []),
    ...(a.photos || []).map((p) => ({ src: p.image, caption: p.caption }))
  ];

  return (
    <article className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <header className="flex items-center gap-3 px-4 pt-4">
        <img src={logo} alt="" className="h-10 w-10 rounded-full border border-gray-200 object-contain bg-white p-0.5" />
        <div className="min-w-0">
          <div className="font-bold text-gray-900 leading-tight">EMA EMITS Model Government</div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            {a.published_at && <span>{formatDate(a.published_at)}</span>}
            <span>&middot;</span>
            <Globe className="h-3 w-3" aria-label="Public" />
            <span className="ml-1 uppercase tracking-wide font-bold text-primary-700">
              {CATEGORY_LABELS[a.category] || 'General'}
            </span>
          </div>
        </div>
      </header>

      <div className="px-4 pt-3 pb-3">
        <h3 className="font-bold text-gray-900 text-base mb-1">{a.title}</h3>
        <p className={`text-gray-800 text-[15px] leading-relaxed whitespace-pre-line ${expanded ? '' : 'line-clamp-4'}`}>
          {text}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-gray-500 text-sm font-semibold mt-1 hover:underline"
          >
            {expanded ? 'See less' : 'See more'}
          </button>
        )}
      </div>

      {hasVideo && (
        <div className="bg-black aspect-video">
          <VideoEmbed videoFile={a.video_file} videoUrl={a.video_url} featuredImage={a.featured_image} title={a.title} />
        </div>
      )}
      <PostPhotoGrid photos={photos} />
    </article>
  );
};

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    api
      .get('/portal/announcements/')
      .then((res) => setAnnouncements(res.data.results || res.data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => (category === 'all' ? announcements : announcements.filter((a) => a.category === category)),
    [announcements, category]
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="eyebrow mb-3">Stay Informed</div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Announcements &amp; News</h1>
      <p className="text-gray-600 max-w-2xl mb-8">
        Official updates, session recaps, and important notices from the EMA EMITS Model Government.
      </p>

      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORY_FILTERS.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
              category === c.value
                ? 'bg-primary-800 text-white border-primary-800'
                : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-500">Loading announcements...</p>}

      {!loading && error && (
        <p className="text-gray-500">Announcements couldn&apos;t be loaded right now. Please check back later.</p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-gray-500">No announcements in this category yet. Check back soon.</p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid gap-6">
          {filtered.map((a) => (
            <AnnouncementRow key={a.id} a={a} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;
