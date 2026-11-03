import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Zap, Heart, ShieldAlert } from 'lucide-react';

interface FitnessPulseProps {
  score?: number;
  delta?: number;
  size?: 'sm' | 'md' | 'lg';
  showBreakdown?: boolean;
}

export const FitnessPulse: React.FC<FitnessPulseProps> = ({
  score = 82,
  delta = 12,
  size = 'md',
  showBreakdown = true
}) => {
  // SVG circle calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const sizeClasses = {
    sm: 'w-36 h-36',
    md: 'w-52 h-52',
    lg: 'w-64 h-64',
  };

  return (
    <div className="flex flex-col items-center">
      {/* Animated Circular Gauge */}
      <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
        {/* Ambient Pulse Glow */}
        <div className="absolute inset-2 rounded-full bg-emerald-500/10 blur-xl animate-pulse-slow pointer-events-none" />

        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
          <defs>
            <linearGradient id="fitnessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="60%" stopColor="#059669" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#10B981" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Background track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Tick marks for athletic gauge feel */}
          <circle
            cx="80"
            cy="80"
            r={radius - 12}
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="1.5"
            strokeDasharray="2 6"
            opacity="0.6"
          />

          {/* Animated progress arc */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="url(#fitnessGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            filter="url(#glow)"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Fitness Pulse
          </span>
          <div className="flex items-baseline">
            <motion.span
              className="text-4xl font-extrabold text-slate-900 tracking-tight font-display"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {score}
            </motion.span>
            <span className="text-xl font-bold text-emerald-600">%</span>
          </div>

          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-200/60">
            <TrendingUp className="w-3 h-3" />
            <span>↑ {delta}% improved</span>
          </div>
        </div>
      </div>

      {/* Sub-Metrics Breakdown */}
      {showBreakdown && (
        <div className="grid grid-cols-4 gap-2 w-full mt-4 pt-3 border-t border-slate-100">
          <div className="text-center p-1.5 rounded-xl bg-slate-50/80">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-medium mb-0.5">
              <Heart className="w-2.5 h-2.5 text-rose-500" />
              <span>Cardio</span>
            </div>
            <div className="text-xs font-bold text-slate-800">88%</div>
          </div>

          <div className="text-center p-1.5 rounded-xl bg-slate-50/80">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-medium mb-0.5">
              <Zap className="w-2.5 h-2.5 text-amber-500" />
              <span>Strength</span>
            </div>
            <div className="text-xs font-bold text-slate-800">82%</div>
          </div>

          <div className="text-center p-1.5 rounded-xl bg-slate-50/80">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-medium mb-0.5">
              <Activity className="w-2.5 h-2.5 text-blue-500" />
              <span>Agility</span>
            </div>
            <div className="text-xs font-bold text-slate-800">86%</div>
          </div>

          <div className="text-center p-1.5 rounded-xl bg-slate-50/80">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-medium mb-0.5">
              <ShieldAlert className="w-2.5 h-2.5 text-emerald-500" />
              <span>Routine</span>
            </div>
            <div className="text-xs font-bold text-slate-800">92%</div>
          </div>
        </div>
      )}
    </div>
  );
};
