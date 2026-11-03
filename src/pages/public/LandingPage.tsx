import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  Dumbbell,
  ShieldCheck,
  TrendingUp,
  Coins,
  ArrowRight,
  CheckCircle2,
  Users,
  Flame,
  Zap,
  Activity,
  Award,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { FitnessPulse } from '../../components/common/FitnessPulse';
import { useFitSphereStore } from '../../store/useFitSphereStore';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, activeRole } = useFitSphereStore();
  const navigate = useNavigate();

  // Calculator State
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState(4);
  const [attendancesPerWeek, setAttendancesPerWeek] = useState(3);
  const estimatedWeeklyCredits = workoutsPerWeek * 20 + attendancesPerWeek * 10;
  const estimatedSemesterCredits = estimatedWeeklyCredits * 14;

  const handleQuickStart = (role: 'student' | 'trainer' | 'admin') => {
    if (isAuthenticated && activeRole === role) {
      navigate(`/${role}/dashboard`);
    } else {
      navigate(`/login?role=${role}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-100/60 via-slate-50 to-transparent blur-3xl -z-10" />

        <div className="text-center max-w-3xl mx-auto">

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-[1.08] font-display"
          >
            Empowering Campus Fitness.{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sports-blue bg-clip-text text-transparent">
              Building Future Athletes.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto"
          >
            FitSphere connects sports directors, varsity coaches, and collegiate athletes into one high-performance digital ecosystem.
            Track workouts, verify telemetry proofs, earn FitCredits, and compete in inter-college championships.
          </motion.p>

          {/* Explore FitSphere CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex items-center justify-center"
          >
            <button
              onClick={() => navigate('/login')}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sports-blue text-white font-display font-extrabold text-base sm:text-lg tracking-normal shadow-xl shadow-emerald-600/30 hover:shadow-2xl hover:shadow-emerald-600/45 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 ring-4 ring-emerald-500/10 hover:ring-emerald-500/20"
            >
              <Sparkles className="w-5 h-5 text-emerald-200 group-hover:rotate-12 transition-transform duration-300" />
              <span>Explore FitSphere</span>
              <ArrowRight className="w-5 h-5 text-emerald-100 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </motion.div>

        </div>

        {/* Live Interactive Dashboard Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-14 max-w-5xl mx-auto rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-2xl p-6 sm:p-8"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left: Fitness Pulse Dial Showcase */}
            <div className="w-full lg:w-1/2 flex flex-col items-center p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-emerald-50/30 border border-slate-200/60">
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Telemetry</span>
                <span className="badge-emerald font-bold">Real-time Score</span>
              </div>
              <FitnessPulse score={82} delta={12} size="md" />
              <p className="text-xs text-slate-500 text-center mt-3">
                Calculated across Strength, Speed, Endurance, Mobility & Attendance.
              </p>
            </div>

            {/* Right: Real-time Feature highlights */}
            <div className="w-full lg:w-1/2 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-colors">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 font-bold shrink-0">
                    <Coins className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">FitCredits Digital Campus Economy</h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Earn +20 credits per workout, +10 for field attendance. Redeem credits for tournament entries and varsity kit perks.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-colors">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800 font-bold shrink-0">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">10-Question Trainer Verification</h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Every university coach completes an exercise science examination (e.g. 88%) before receiving campus athletic clearance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-colors">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold shrink-0">
                    <Trophy className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Annual Tournaments & Brackets</h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Inter-college football cups, T20 cricket championships, and Olympic track meets managed through live brackets.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* University Athletic Stats */}
      <section className="bg-slate-900 text-white py-14 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold font-display text-emerald-400">1,420+</div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Collegiate Athletes</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold font-display text-blue-400">28</div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Verified Varsity Coaches</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold font-display text-amber-400">148,500</div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">FitCredits Distributed</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold font-display text-purple-400">14</div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Championship Meets</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FitCredits Calculator */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
          <div className="text-center mb-8">
            <span className="badge-gold font-bold mb-2">Interactive Simulator</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
              Calculate Your FitCredits Potential
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              See how regular workouts and training sessions add up to unlock varsity championship slots.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-800 mb-2">
                <span>Workouts Completed Per Week (+20 credits each):</span>
                <span className="text-emerald-600 font-extrabold">{workoutsPerWeek} days</span>
              </div>
              <input
                type="range"
                min={1}
                max={7}
                value={workoutsPerWeek}
                onChange={(e) => setWorkoutsPerWeek(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold text-slate-800 mb-2">
                <span>Field/Practice Attendance Per Week (+10 credits each):</span>
                <span className="text-blue-600 font-extrabold">{attendancesPerWeek} sessions</span>
              </div>
              <input
                type="range"
                min={0}
                max={6}
                value={attendancesPerWeek}
                onChange={(e) => setAttendancesPerWeek(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>

            {/* Results Callout */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-blue-500/10 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Semester Earnings</div>
                <div className="text-3xl font-black text-amber-700 font-display">
                  ⭐ {estimatedSemesterCredits} FitCredits
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  ({estimatedWeeklyCredits} credits/week across a 14-week semester)
                </div>
              </div>

              <button
                onClick={() => handleQuickStart('student')}
                className="btn-gold text-xs px-5 py-3 w-full sm:w-auto shrink-0 font-bold"
              >
                Start Earning Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Portal Ecosystem Grid */}
      <section className="py-16 bg-slate-100/70 border-t border-slate-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="badge-emerald font-bold mb-2">Unified Operating System</span>
            <h2 className="text-3xl font-black text-slate-950 font-display">
              Designed for the Whole Athletic Department
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Three synchronized workspaces built for students, coaches, and sports administrators.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Student Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-4">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">For Student-Athletes</span>
                <h3 className="text-xl font-bold text-slate-950 mt-1">Personal Athletic Journey</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  "An app that motivates me to become healthier, train harder, and represent my college."
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Interactive 82% Fitness Pulse
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> FitCredits wallet & leaderboards
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Photo/video proof uploads
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleQuickStart('student')}
                className="mt-6 w-full btn-primary text-xs py-2.5"
              >
                Launch Student Portal
              </button>
            </div>

            {/* Trainer Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-4">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">For Coaches & Trainers</span>
                <h3 className="text-xl font-bold text-slate-950 mt-1">Professional Coaching Workspace</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  "A professional coaching command deck to develop athletes and manage varsity squads."
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Workout proof approval desk
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> 5D athletic radar assessments
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Real-time athlete chat system
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleQuickStart('trainer')}
                className="mt-6 w-full btn-navy text-xs py-2.5"
              >
                Launch Coach Workspace
              </button>
            </div>

            {/* Admin Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">For Sports Administrators</span>
                <h3 className="text-xl font-bold text-slate-950 mt-1">Sports Command Center</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  "A complete command center to oversee university sports, trainers, and facilities."
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Coach skill verification queues
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Tournament bracket generators
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Department-wide health analytics
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleQuickStart('admin')}
                className="mt-6 w-full btn-secondary text-xs py-2.5"
              >
                Launch Command Center
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="FitSphere" className="w-7 h-7" />
            <span className="font-display font-extrabold text-white text-base">FitSphere</span>
            <span className="text-slate-500">| Empowering Campus Fitness. Building Future Athletes.</span>
          </div>
          <div>
            © 2026 FitSphere Collegiate Athletics Systems. Built for modern university athletic departments.
          </div>
        </div>
      </footer>
    </div>
  );
};
