import React, { useEffect, useState } from 'react';

// Photo grid with a full-size viewer. photos = [{ src, caption }].
// Used on the About page and on announcements.
const PhotoGallery = ({ photos, heading = 'Photos', compact = false }) => {
  const [open, setOpen] = useState(null); // index of the enlarged photo, or null
  const count = photos.length;

  useEffect(() => {
    if (open === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((i) => (i + 1) % count);
      if (e.key === 'ArrowLeft') setOpen((i) => (i - 1 + count) % count);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, count]);

  // Close the viewer if the tab changes to one with fewer photos.
  useEffect(() => {
    setOpen(null);
  }, [photos]);

  if (count === 0) return null;
  const current = open !== null ? photos[open] : null;

  return (
    <section className={compact ? 'mt-4' : 'mb-8'}>
      {heading && <h2 className="text-xl font-bold mb-2">{heading}</h2>}
      <div className={`grid gap-3 ${compact ? 'grid-cols-3 sm:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'}`}>
        {photos.map((ph, i) => (
          <button
            key={ph.src}
            type="button"
            onClick={() => setOpen(i)}
            className="group relative aspect-video overflow-hidden rounded-lg bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label={ph.caption ? `Enlarge photo: ${ph.caption}` : `Enlarge photo ${i + 1}`}
          >
            <img
              src={ph.src}
              alt={ph.caption || `Photo ${i + 1}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {current && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={() => setOpen(null)}
        >
          <button
            type="button"
            onClick={() => setOpen(null)}
            className="absolute top-4 right-4 text-white text-3xl leading-none px-3 py-1"
            aria-label="Close photo viewer"
          >
            &times;
          </button>
          {count > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((i) => (i - 1 + count) % count);
              }}
              className="absolute left-2 md:left-6 text-white text-4xl px-3 py-2"
              aria-label="Previous photo"
            >
              &#8249;
            </button>
          )}
          <figure className="max-w-5xl max-h-full text-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={current.src}
              alt={current.caption || `Photo ${open + 1}`}
              className="max-h-[80vh] max-w-full mx-auto rounded"
            />
            {current.caption && (
              <figcaption className="text-white/90 text-sm mt-3">{current.caption}</figcaption>
            )}
            <div className="text-white/60 text-xs mt-1">
              {open + 1} / {count}
            </div>
          </figure>
          {count > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((i) => (i + 1) % count);
              }}
              className="absolute right-2 md:right-6 text-white text-4xl px-3 py-2"
              aria-label="Next photo"
            >
              &#8250;
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default PhotoGallery;
