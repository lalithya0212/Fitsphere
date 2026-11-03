import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus } from 'lucide-react';

interface AuthModeTabsProps {
  mode: 'login' | 'register';
  onChange: (mode: 'login' | 'register') => void;
}

export const AuthModeTabs: React.FC<AuthModeTabsProps> = ({ mode, onChange }) => {
  return (
    <div
      role="tablist"
      aria-label="Authentication Mode"
      className="relative grid grid-cols-2 p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 select-none"
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'login'}
        onClick={() => onChange('login')}
        className={`relative z-10 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
          mode === 'login' ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        {mode === 'login' && (
          <motion.div
            layoutId="authModePill"
            className="absolute inset-0 bg-white rounded-xl shadow-xs border border-slate-200/60"
            transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
          />
        )}
        <LogIn className="w-3.5 h-3.5 relative z-10 text-emerald-600" />
        <span className="relative z-10">Sign In</span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={mode === 'register'}
        onClick={() => onChange('register')}
        className={`relative z-10 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
          mode === 'register' ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        {mode === 'register' && (
          <motion.div
            layoutId="authModePill"
            className="absolute inset-0 bg-white rounded-xl shadow-xs border border-slate-200/60"
            transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
          />
        )}
        <UserPlus className="w-3.5 h-3.5 relative z-10 text-emerald-600" />
        <span className="relative z-10">Register</span>
      </button>
    </div>
  );
};
