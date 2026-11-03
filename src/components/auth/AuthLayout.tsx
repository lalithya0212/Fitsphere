import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  videoPanel: React.ReactNode;
  authPanel: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ videoPanel, authPanel }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-[#f7fbfa] to-[#f0fdf9] flex items-center justify-center p-3 sm:p-6 lg:p-8 relative overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      {/* Very subtle ambient light glows in the background (non-intrusive, bright) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100/25 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      {/* Main Centered Auth Container */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[1180px] lg:w-[85%] xl:w-[82%] min-h-[580px] lg:min-h-[620px] bg-white rounded-3xl sm:rounded-[32px] border border-slate-200/80 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.06),0_0_1px_1px_rgba(15,23,42,0.02)] overflow-hidden flex flex-col lg:flex-row relative z-10 my-4"
      >
        {/* Left Side: Video Showcase (52% on desktop, compact top on mobile) */}
        <div className="w-full lg:w-[52%] bg-slate-50/60 lg:border-r border-slate-100 flex items-center justify-center relative">
          {videoPanel}
        </div>

        {/* Right Side: Functional Auth Interface (48% on desktop) */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className="w-full lg:w-[48%] flex flex-col justify-center px-5 sm:px-9 lg:px-10 py-6 sm:py-8 lg:py-10 bg-white"
        >
          <div className="w-full max-w-[420px] mx-auto">
            {authPanel}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
