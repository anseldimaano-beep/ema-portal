import React, { useEffect, useState } from 'react';

// Facebook-style photo collage with a full-size viewer.
// photos = [{ src, caption }]. Shows up to 4 tiles; extra photos become a "+N" overlay.
const MAX_TILES = 4;

const PostPhotoGrid = ({ photos }) => {
  const [open, setOpen] = useState(null);
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

  if (count === 0) return null;

  const shown = photos.slice(0, MAX_TILES);
  const extra = count - MAX_TILES;
  const current = open !== null ? photos[open] : null;

  // Grid layout per photo count (like Facebook).
  let gridClass = 'grid-cols-1';
  if (shown.length === 2) gridClass = 'grid-cols-2 aspect-[2/1]';
  if (shown.length === 3) gridClass = 'grid-cols-2 grid-rows-2 aspect-[4/3]';
  if (shown.length >= 4) gridClass = 'grid-cols-2 grid-rows-2 aspect-square sm:aspect-[4/3]';

  const tile = (ph, i) => (
    <button
      key={ph.src}
      type="button"
      onClick={() => setOpen(i)}
      aria-label={`Open photo ${i + 1} of ${count}`}
      className={`relative overflow-hidden bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
        shown.length === 3 && i === 0 ? 'row-span-2' : ''
      }`}
    >
      <img
        src={ph.src}
        alt={ph.caption || `Photo ${i + 1}`}
        loading="lazy"
        className={`w-full h-full object-cover hover:brightness-95 transition ${
          shown.length === 1 ? 'max-h-[34rem]' : ''
        }`}
      />
      {extra > 0 && i === MAX_TILES - 1 && (
        <span className="absolute inset-0 bg-black/55 text-white text-3xl font-semibold flex items-center justify-center">
          +{extra}
        </span>
      )}
    </button>
  );

  return (
    <>
      <div className={`grid gap-0.5 bg-white ${gridClass}`}>{shown.map(tile)}</div>

      {current && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
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
            {current.caption && <figcaption className="text-white/90 text-sm mt-3">{current.caption}</figcaption>}
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
    </>
  );
};

export default PostPhotoGrid;
