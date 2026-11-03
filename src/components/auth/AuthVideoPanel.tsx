import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export const AuthVideoPanel: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
      videoRef.current.play().catch(() => {
        // Autoplay may be deferred until user interaction by some browsers if unmuted, but it's muted
      });
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative w-full h-[220px] sm:h-[260px] lg:h-full min-h-[220px] lg:min-h-full p-3 sm:p-4 lg:p-5 flex flex-col justify-center"
    >
      {/* Video Container Frame */}
      <div className="relative w-full h-full min-h-[200px] lg:min-h-[560px] rounded-2xl sm:rounded-[24px] overflow-hidden bg-slate-950 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.08)]">
        {/* Logo Reveal Video */}
        <video
          ref={videoRef}
          src="/videos/fitsphere-logo-reveal.mp4"
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          className="w-full h-full object-cover object-center pointer-events-none select-none transition-opacity duration-700"
        />

        {/* Ultra-subtle ambient glass highlight over border to blend with bright UI */}
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl sm:rounded-[24px] pointer-events-none" />
        
        {/* Very soft ambient mint tint in corners */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/20 via-transparent to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
};
