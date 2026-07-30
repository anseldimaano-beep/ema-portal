import React, { useState } from 'react';
import { ImageOff, ExternalLink } from 'lucide-react';
import { getVideoEmbedUrl, isVideoFile } from '../utils/helpers';

// Renders a video (YouTube/Facebook/uploaded file) with a fallback to the
// featured image if nothing playable is available. Facebook's embed player
// often shows its own internal "Unavailable" error (e.g. blocked Reels)
// without ever firing a real onError event, so we can't reliably
// auto-detect that case in JS. To cover it, we always show a small
// "Watch on Facebook/YouTube" link under the embed so visitors have a
// working way to view the video even when the embed itself is silently
// broken on Facebook's end.
const VideoEmbed = ({ videoUrl, featuredImage, attachment, title, className = '' }) => {
  const [failed, setFailed] = useState(false);
  const embedUrl = getVideoEmbedUrl(videoUrl);
  const isFacebook = !!videoUrl && /facebook\.com|fb\.watch/.test(videoUrl);
  const hasUploadedVideo = !embedUrl && isVideoFile(attachment);

  if (embedUrl && !failed) {
    return (
      <div className={`relative w-full h-full flex flex-col ${className}`}>
        <div className="flex-1 min-h-0">
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onError={() => setFailed(true)}
          />
        </div>
        {isFacebook && (
          
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-semibold text-primary-700 bg-primary-50 px-2 py-1 hover:underline shrink-0"
          >
            <ExternalLink className="h-3 w-3" />
            Trouble viewing? Watch on Facebook
          </a>
        )}
      </div>
    );
  }

  if (hasUploadedVideo) {
    return (
      <video
        src={attachment}
        controls
        preload="metadata"
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  return featuredImage ? (
    <img src={featuredImage} alt={title} className={`w-full h-full object-cover ${className}`} />
  ) : (
    <ImageOff className="h-8 w-8 text-primary-200" />
  );
};

export default VideoEmbed;
