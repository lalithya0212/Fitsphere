import React from 'react';
import { Shield, Trophy, Heart, Target, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <span className="badge-emerald font-bold mb-3">Our Mission & Standards</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 font-display">
            The Campus Sports Operating System
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-2xl mx-auto leading-relaxed">
            FitSphere bridges the gap between university sports administration, varsity coaching, and student athletic lifestyle.
          </p>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">1. Student Health & Longevity</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Moving beyond traditional gym apps to cultivate lifelong health, cardiovascular durability, and injury prevention habits across student bodies.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-3">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">2. Varsity Excellence</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Empowering college teams with telemetry-driven training plans, periodization schedules, and competitive tournament structures.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">3. Reward-Based Motivation</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              FitCredits turns daily physical discipline into tangible campus rewards: championship entries, varsity apparel, and academic recognition.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">4. Certified Coaching Integrity</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Strict sports science examinations guarantee that every trainer advising students adheres to evidence-based strength, mobility, and concussion standards.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white text-center">
          <h2 className="text-2xl font-extrabold font-display">Experience FitSphere Live</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Switch between Student, Coach, and Admin personas to test the complete platform.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/student/dashboard" className="btn-primary text-xs px-6 py-3 font-bold">
              <span>Launch Live App</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
