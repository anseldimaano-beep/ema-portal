export const formatDate=(d)=>new Date(d).toLocaleDateString('en-PH',{year:'numeric',month:'long',day:'numeric'});export const formatTime=(t)=>new Date('2000-01-01T'+t).toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'});

// Turns a YouTube or Facebook video link (the kind you'd paste from the
// share button) into the iframe "embed" URL each platform expects. Returns
// null if the link doesn't match either pattern, so callers can fall back
// to a plain link instead of a broken embed.
export const getVideoEmbedUrl = (url) => {
  if (!url) return null;
  const ytMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  if (/facebook\.com|fb\.watch/.test(url)) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0`;
  }
  return null;
};

// Checks whether a file URL (e.g. an uploaded "attachment") points to a
// playable video file based on its extension, so callers can render it in
// a native <video> tag instead of treating it as an image or document link.
export const isVideoFile = (url) => {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov|m4v)$/i.test(url.split('?')[0]);
};
