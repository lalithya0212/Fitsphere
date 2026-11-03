import React, { useState } from 'react';
import { getSportVisual } from '../../utils/sportsIcons';

interface SportMediaBannerProps {
  bannerUrl?: string;
  sport: string;
  category?: string;
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

export const SportMediaBanner: React.FC<SportMediaBannerProps> = ({
  bannerUrl,
  sport,
  category,
  title,
  className = 'h-44',
  children
}) => {
  const [imageError, setImageError] = useState(false);
  const visual = getSportVisual(sport, category);

  const hasValidImage = !!bannerUrl && bannerUrl.trim().length > 0 && !imageError;

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {hasValidImage ? (
        <>
          <img
            src={bannerUrl}
            alt={title || sport}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
        </>
      ) : (
        /* Fallback when no image is provided or fails to load: Sleek Icon / Emoji Banner */
        <div className={`w-full h-full bg-gradient-to-br ${visual.gradient} relative flex items-center justify-between px-6 overflow-hidden`}>
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 w-36 h-36 rounded-full bg-white/5 blur-xl pointer-events-none" />

          {/* Centered / Background Large Sport Emoji Watermark */}
          <div className="absolute right-4 bottom-2 text-7xl sm:text-8xl select-none opacity-25 filter drop-shadow-lg transform rotate-6 pointer-events-none">
            {visual.emoji}
          </div>

          {/* Subtle Glow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      {/* Overlay content (Badges, dates, credits, headers) */}
      {children}
    </div>
  );
};
