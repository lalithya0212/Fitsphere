import React from 'react';
import { AthleteJourneyStage } from '../../types';
import { CheckCircle2, Shield, Trophy, Medal, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface AthleteJourneyProps {
  currentStage?: AthleteJourneyStage;
}

interface StageInfo {
  id: AthleteJourneyStage;
  label: string;
  minCredits: number;
  perks: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STAGES: StageInfo[] = [
  {
    id: 'beginner',
    label: 'Beginner',
    minCredits: 0,
    perks: 'Access to campus recreation gym & foundational fitness assessments',
    icon: Shield
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    minCredits: 100,
    perks: 'Inter-dorm sport eligibility, personalized coach chat & basic drill libraries',
    icon: Medal
  },
  {
    id: 'advanced',
    label: 'Advanced',
    minCredits: 250,
    perks: 'Varsity squad tryouts, priority stadium booking & nutrition consults',
    icon: Flame
  },
  {
    id: 'athlete',
    label: 'Varsity Athlete',
    minCredits: 500,
    perks: 'Full collegiate athlete scholarship consideration, elite physio & Nike varsity apparel',
    icon: Trophy
  }
];

export const AthleteJourney: React.FC<AthleteJourneyProps> = ({ currentStage = 'advanced' }) => {
  const stageOrder: AthleteJourneyStage[] = ['beginner', 'intermediate', 'advanced', 'athlete'];
  const currentIndex = stageOrder.indexOf(currentStage);

  return (
    <div className="w-full bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            Athlete Journey Timeline
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Progress from campus beginner to collegiate varsity athlete via training consistency.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Current Tier: {STAGES[currentIndex]?.label}
        </span>
      </div>

      {/* Progress Bar & Milestones */}
      <div className="relative mt-6 mb-8 px-4">
        {/* Background track */}
        <div className="absolute top-1/2 left-8 right-8 h-1.5 -translate-y-1/2 bg-slate-100 rounded-full z-0" />

        {/* Completed active track */}
        <motion.div
          className="absolute top-1/2 left-8 h-1.5 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-sports-blue rounded-full z-0"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentIndex / (STAGES.length - 1)) * 85}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />

        {/* Nodes */}
        <div className="relative z-10 flex justify-between items-center">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const Icon = stage.icon;

            return (
              <div key={stage.id} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCurrent
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md shadow-emerald-600/30 scale-110'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                <div className="text-center mt-2">
                  <div
                    className={`text-xs font-bold ${
                      isCurrent ? 'text-emerald-700' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {stage.label}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {stage.minCredits}+ credits
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Perks Highlight Card */}
      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/60 flex items-start gap-3 text-xs">
        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 font-bold shrink-0">
          PERK
        </div>
        <div>
          <span className="font-semibold text-slate-800">
            {STAGES[currentIndex]?.label} Tier Unlocked:
          </span>{' '}
          <span className="text-slate-600">{STAGES[currentIndex]?.perks}</span>
          {currentIndex < STAGES.length - 1 && (
            <div className="mt-1.5 text-[11px] font-medium text-sports-blue flex items-center gap-1">
              <span>Next Goal:</span>
              <span className="font-bold">
                {STAGES[currentIndex + 1].minCredits - 250} more FitCredits to reach {STAGES[currentIndex + 1].label}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
