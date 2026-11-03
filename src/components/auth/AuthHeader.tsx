import React from 'react';
import { Link } from 'react-router-dom';

interface AuthHeaderProps {
  mode: 'login' | 'register';
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ mode }) => {
  return (
    <div className="text-left space-y-2">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="group inline-flex focus:outline-none focus:ring-2 focus:ring-emerald-500/30 rounded-2xl"
          title="Back to FitSphere Home"
        >
          <div className="w-10 h-10 rounded-2xl bg-slate-950 flex items-center justify-center shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-200">
            <img src="/logo.svg" alt="FitSphere Logo" className="w-6 h-6" />
          </div>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-950 font-display tracking-tight leading-none">
            Fit<span className="text-emerald-500">Sphere</span>
          </h1>
          <p className="text-[11px] font-medium text-slate-500 tracking-wide mt-0.5">
            Unified Campus Athletic & Fitness Management Portal
          </p>
        </div>
      </div>

      <div className="pt-2">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          {mode === 'login' ? 'Welcome back' : 'Create your FitSphere account'}
        </h2>
        <p className="text-xs text-slate-500">
          {mode === 'login'
            ? 'Sign in to access your athletics, workouts, and performance data.'
            : 'Join your campus sports and fitness ecosystem today.'}
        </p>
      </div>
    </div>
  );
};
