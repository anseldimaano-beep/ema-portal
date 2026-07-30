import React, { useState } from 'react';
import { ImageOff, ExternalLink } from 'lucide-react';
import { getVideoEmbedUrl, isVideoFile } from '../utils/helpers';

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
          <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] font-semibold text-primary-700 bg-primary-50 px-2 py-1 hover:underline shrink-0">
            <ExternalLink className="h-3 w-3" />
            Trouble viewing? Watch on Facebook
          </a>
        )}
      </div>
    );
  }

  if (hasUploadedVideo) {
    return (
      <video src={attachment} controls preload="metadata" className={`w-full h-full object-cover ${className}`} />
    );
  }

  return featuredImage ? (
    <img src={featuredImage} alt={title} className={`w-full h-full object-cover ${className}`} />
  ) : (
    <ImageOff className="h-8 w-8 text-primary-200" />
  );
};

export default VideoEmbed;
