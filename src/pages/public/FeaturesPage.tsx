import React, { useState } from 'react';
import {
  Activity,
  Coins,
  CheckSquare,
  ShieldCheck,
  Trophy,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FeaturesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      id: 'pulse',
      title: 'Fitness Pulse Engine',
      icon: Activity,
      color: 'emerald',
      tagline: 'Multi-dimensional live athletic score',
      description:
        'FitSphere aggregates daily workouts, cardiac recovery rate, sprint metrics, and attendance consistency into an animated circular score (e.g. 82%, ↑12% improvement). Sub-scores for Cardio, Strength, Agility, and Routine provide clear feedback on progress.',
      points: [
        'Dynamic SVG circular gauge with gradient visualization',
        'Automatic calculation based on completed drills and coach assessments',
        'Monthly delta tracking with positive reinforcement',
        'Athlete Journey progression (Beginner ➔ Intermediate ➔ Advanced ➔ Athlete)'
      ]
    },
    {
      id: 'credits',
      title: 'FitCredits Campus Economy',
      icon: Coins,
      color: 'amber',
      tagline: 'Discipline-backed campus tokenomics',
      description:
        'Athletes earn FitCredits directly through proven physical exertion (+20 per workout, +10 for field attendance, +50 for streaks). Credits serve as currency for campus championship entries, varsity gear, and recovery clinic bookings.',
      points: [
        'Transparent double-entry ledger with timestamped transactions',
        'Direct credit deduction upon tournament registration',
        'Administrative Dean grants for sports honors',
        'Tier benefits for Gold and Varsity athletes'
      ]
    },
    {
      id: 'proof',
      title: 'Workout Proof Review Deck',
      icon: CheckSquare,
      color: 'blue',
      tagline: 'Coaching verification workflow',
      description:
        'Students submit photo/video completion proof with recorded telemetry (duration, heart rate, GPS distance, reps). Coaches review submissions inside a specialized coaching workspace, with one-click approval (+FitCredits awarded) or targeted revision feedback.',
      points: [
        'Interactive media preview with athlete session telemetry',
        'Instant credit awards upon coach confirmation',
        'Constructive feedback loops for biomechanical correction',
        'Push notifications alert student immediately upon review'
      ]
    },
    {
      id: 'verification',
      title: '10-Question Trainer Verification',
      icon: ShieldCheck,
      color: 'purple',
      tagline: 'Scientific coaching accreditation',
      description:
        'To prevent generic or unsafe advice, every collegiate trainer must complete a rigorous 10-Question Sports Science & Injury Prevention Examination (covering PAP, periodization, ACL risk, concussion protocols) before administrative activation.',
      points: [
        'Automated scoring algorithm with 70% passing threshold',
        'Direct integration into Sports Administrator verification queue',
        'Sport specialization tagging (Football, Cricket, Track, S&C)',
        'Public verification badge displayed on coach profiles'
      ]
    },
    {
      id: 'events',
      title: 'Sports Events & Championship Brackets',
      icon: Trophy,
      color: 'rose',
      tagline: 'Inter-college tournament operations',
      description:
        'Administrators create and manage campus football championships, cricket trophies, sprint invitationals, and fun runs with customized credit requirements and single-elimination tournament brackets.',
      points: [
        'Credit requirement validation before slot reservation',
        'Single-elimination match fixtures and schedule generation',
        'Live participant rosters and attendance check-ins',
        'Celebratory confetti upon successful registration'
      ]
    },
    {
      id: 'chat',
      title: 'Real-Time Coach-Athlete Chat',
      icon: MessageSquare,
      color: 'teal',
      tagline: 'Frictionless athletic communication',
      description:
        'Direct messaging inspired by WhatsApp and Slack connects students with assigned varsity coaches. Athletes receive quick form feedback, training advice, and recovery guidance directly on their mobile device.',
      points: [
        'Instant message exchange with timestamps',
        'Simulated coach responses for realistic demo testing',
        'Direct links between chat cues and training plan assignments',
        'Seamless push notifications for unread coach messages'
      ]
    }
  ];

  const current = features[activeTab];
  const CurrentIcon = current.icon;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center max-w-3xl mx-auto">
          <span className="badge-emerald font-bold mb-3">Engine Architecture</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 font-display">
            The 6 Core FitSphere Engines
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Explore the specialized subsystems powering modern university sports departments.
          </p>
        </div>

        {/* Feature Tab Selector */}
        <div className="flex flex-wrap gap-2 justify-center">
          {features.map((f, idx) => {
            const Icon = f.icon;
            const isSelected = activeTab === idx;
            return (
              <button
                key={f.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{f.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Feature Detail Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
              <CurrentIcon className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
                Engine {activeTab + 1} of 6
              </span>
              <h2 className="text-2xl font-black text-slate-950 font-display">{current.title}</h2>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">{current.tagline}</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium mb-6">
            {current.description}
          </p>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Technical Capabilities & Architecture
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {current.points.map((pt, i) => (
                <div key={i} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium">
              Ready to test this engine live in the interactive application?
            </span>
            <Link to="/student/dashboard" className="btn-primary text-xs px-5 py-2.5 font-bold">
              <span>Try Live in Student Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
