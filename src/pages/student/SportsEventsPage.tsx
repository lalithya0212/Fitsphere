import React, { useState } from 'react';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { SportsEvent } from '../../types';
import { triggerCelebration } from '../../utils/confetti';
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Coins,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Shield,
  FileText,
  X
} from 'lucide-react';
import { SportMediaBanner } from '../../components/common/SportMediaBanner';

export const SportsEventsPage: React.FC = () => {
  const { events, currentUser, registerForEvent } = useFitSphereStore();

  const [selectedEvent, setSelectedEvent] = useState<SportsEvent | null>(null);
  const [activeModalEvent, setActiveModalEvent] = useState<SportsEvent | null>(null);
  const [regResult, setRegResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleRegister = (event: SportsEvent) => {
    const res = registerForEvent(event.id);
    setRegResult(res);
    if (res.success) {
      triggerCelebration();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
            Campus Sports Events & Tournaments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Represent your department or dorm house. Use your earned FitCredits to enter varsity championships.
          </p>
        </div>

        {/* Balance callout */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl shrink-0">
          <span className="text-xs font-bold text-amber-800">Your FitCredits:</span>
          <span className="text-base font-black text-amber-900">⭐ {currentUser.fitCredits || 0}</span>
        </div>
      </div>

      {regResult && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold animate-in fade-in ${
            regResult.success
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-center gap-2">
            {regResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{regResult.message}</span>
          </div>
          <button onClick={() => setRegResult(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Events Grid or Empty State */}
      {events.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 mx-auto flex items-center justify-center text-amber-600 shadow-sm">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-display">No Campus Tournaments Scheduled</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            The Athletic Administration has not posted any tournaments yet. As soon as varsity championships and athletic meets are scheduled, you will be able to register and view tournament brackets here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => {
          const isRegistered = event.registeredStudentIds.includes(currentUser.id);
          const hasEnoughCredits = (currentUser.fitCredits || 0) >= event.requiredCredits;

          return (
            <div
              key={event.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between transition-all hover:shadow-md"
            >
              {/* Event Image Banner with Custom Upload or Sport Emoji Fallback */}
              <SportMediaBanner
                bannerUrl={event.bannerUrl}
                sport={event.sport}
                category={event.category}
                title={event.title}
                className="h-48"
              >
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
                    {event.sport}
                  </span>
                  <span className="badge-gold text-[10px] font-bold">
                    {event.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <div className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md">
                    {event.requiredCredits > 0 ? `${event.requiredCredits} Credits` : 'Free Entry'}
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-lg font-extrabold tracking-tight leading-snug">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {event.venue}
                    </span>
                  </div>
                </div>
              </SportMediaBanner>

              {/* Event Body */}
              <div className="p-5">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {event.description}
                </p>

                {/* Progress bar of slots */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-500" /> Registered Athletes
                    </span>
                    <span>
                      {event.currentParticipants} / {event.maxParticipants} slots
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all"
                      style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Rules preview */}
                <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <span className="font-bold text-slate-800 block text-[10px] uppercase tracking-wider">
                    Eligibility & Rules
                  </span>
                  <p>{event.eligibility}</p>
                </div>

                {/* Registration Action */}
                <div className="mt-5 flex gap-2 pt-2">
                  <button
                    onClick={() => setActiveModalEvent(event)}
                    className="btn-secondary text-xs py-2.5 px-3 font-semibold"
                  >
                    View Brackets
                  </button>

                  {isRegistered ? (
                    <div className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Registered & Cleared</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRegister(event)}
                      className={`flex-1 btn-gold text-xs py-2.5 font-black flex items-center justify-center gap-1.5 ${
                        !hasEnoughCredits ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Coins className="w-4 h-4 text-slate-900" />
                      <span>Register ({event.requiredCredits} Credits)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Fixtures & Brackets Modal */}
      {activeModalEvent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  Tournament Operations
                </span>
                <h3 className="text-lg font-bold text-slate-900 font-display">{activeModalEvent.title}</h3>
              </div>
              <button
                onClick={() => setActiveModalEvent(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tournament Fixtures</h4>
              {activeModalEvent.fixtures && activeModalEvent.fixtures.length > 0 ? (
                activeModalEvent.fixtures.map((fixture) => (
                  <div key={fixture.matchId} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                      <span>{fixture.round}</span>
                      <span>{fixture.scheduledTime} • {fixture.venue}</span>
                    </div>
                    <div className="flex items-center justify-between font-black text-slate-900 text-sm">
                      <span>{fixture.teamA}</span>
                      <span className="text-slate-400 font-normal">vs</span>
                      <span>{fixture.teamB}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-4 text-center">
                  Fixtures are seeded 48 hours prior to match day based on current team FitCredits ranking.
                </p>
              )}
            </div>

            <button
              onClick={() => setActiveModalEvent(null)}
              className="w-full btn-secondary text-xs py-2.5 font-bold"
            >
              Close Tournament Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
