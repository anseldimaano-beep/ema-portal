import React, { useEffect, useMemo, useState } from 'react';
import { ImageOff } from 'lucide-react';
import api from '../services/api';
import { formatDate } from '../utils/helpers';

const CATEGORY_LABELS = {
  general: 'General',
  academic: 'Academic',
  administrative: 'Administrative',
  event: 'Event',
  emergency: 'Emergency',
  enrollment: 'Enrollment',
  scholarship: 'Scholarship'
};

const CATEGORY_FILTERS = [{ value: 'all', label: 'All' }, ...Object.entries(CATEGORY_LABELS).map(
  ([value, label]) => ({ value, label })
)];

const AnnouncementRow = ({ a }) => (
  <div className="card-accent flex flex-col sm:flex-row overflow-hidden">
    <div className="sm:w-56 h-40 sm:h-auto bg-primary-50 flex items-center justify-center shrink-0 overflow-hidden">
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
        {a.published_at && <span className="text-gray-400">&middot; {formatDate(a.published_at)}</span>}
      </div>
      <h3 className="font-bold text-gray-900 text-lg mb-2">{a.title}</h3>
      <p className="text-gray-600 text-sm flex-1">{a.excerpt || a.content}</p>
    </div>
  </div>
);

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
    <div className="max-w-7xl mx-auto px-4 py-16">
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
