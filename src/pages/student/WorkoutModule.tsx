import React, { useState } from 'react';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { WorkoutPlan } from '../../types';
import { Link, useNavigate } from 'react-router-dom';
import {
  Dumbbell,
  Clock,
  Zap,
  Coins,
  Play,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Flame,
  ArrowRight,
  Shield,
  X
} from 'lucide-react';
import { SportMediaBanner } from '../../components/common/SportMediaBanner';

export const WorkoutModule: React.FC = () => {
  const { workouts, currentUser } = useFitSphereStore();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // STRICT REQUIREMENT: Only show workout plans if a coach is assigned to this student
  const hasAssignedCoach = !!(currentUser.assignedTrainerId || currentUser.assignedTrainerName);

  const coachWorkouts = hasAssignedCoach
    ? workouts.filter(
        w => (currentUser.assignedTrainerId && (w as any).trainerId === currentUser.assignedTrainerId) ||
             (currentUser.assignedTrainerName && w.assignedByTrainerName && w.assignedByTrainerName.toLowerCase() === currentUser.assignedTrainerName.toLowerCase())
      )
    : [];

  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(coachWorkouts[0]?.id || null);

  // Active workout session modal state
  const [activeSession, setActiveSession] = useState<WorkoutPlan | null>(null);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [completedDrills, setCompletedDrills] = useState<{ [key: string]: boolean }>({});

  const categories = ['All', 'Football Squad', 'Track & Field', 'All Athletes'];

  const filteredWorkouts = coachWorkouts.filter(w => {
    if (selectedCategory === 'All') return true;
    return w.targetAudience === selectedCategory;
  });

  const toggleDrill = (id: string) => {
    setCompletedDrills(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFinishWorkout = () => {
    if (!activeSession) return;
    const minutes = Math.max(1, Math.round(sessionSeconds / 60));
    navigate('/student/submit-proof', {
      state: {
        workoutId: activeSession.id,
        workoutTitle: activeSession.title,
        durationMinutes: minutes > 0 ? minutes : activeSession.durationMinutes,
        caloriesBurned: Math.round(minutes * 8.5)
      }
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
            Assigned Workouts & Varsity Drills
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {hasAssignedCoach
              ? `Supervised training plans published by ${currentUser.assignedTrainerName || 'your coach'}.`
              : 'Complete assigned training plans once allocated a collegiate coach by administration.'}
          </p>
        </div>

        {hasAssignedCoach && coachWorkouts.length > 0 && (
          <Link
            to="/student/submit-proof"
            className="btn-primary text-xs py-2.5 px-4 font-bold shadow-md shadow-emerald-500/20"
          >
            <span>Submit Completed Proof</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Category Pills - only shown if workouts exist */}
      {hasAssignedCoach && coachWorkouts.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Workouts Grid or Empty State */}
      {!hasAssignedCoach ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-sm">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-display">No Coach Assigned Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            You do not have an assigned faculty coach yet. Training plans and varsity drills will appear here once the campus athletic administration allocates a coach to your athlete profile.
          </p>
          <div className="mt-4">
            <Link
              to="/student/coach"
              className="btn-secondary text-xs py-2 px-4 font-bold inline-flex items-center gap-1.5"
            >
              <span>View Coach Allocation Status</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : filteredWorkouts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-display">No Assigned Workouts</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            Your assigned coach ({currentUser.assignedTrainerName}) has not published any training plans or drills for your squad yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredWorkouts.map((workout) => {
            const isExpanded = expandedPlanId === workout.id;

            return (
              <div
                key={workout.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between transition-all hover:shadow-md"
              >
                {/* Card Banner with Custom Upload or Sport Emoji Fallback */}
                <SportMediaBanner
                  bannerUrl={workout.bannerUrl}
                  sport={workout.sport}
                  category={workout.difficulty}
                  title={workout.title}
                  className="h-44"
                >
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
                      {workout.sport}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/90 backdrop-blur-md text-slate-950 text-[10px] font-black shadow-xs">
                      +{workout.rewardCredits} Credits
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-lg font-extrabold tracking-tight leading-snug">
                      {workout.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {workout.durationMinutes} Mins
                      </span>
                      <span>• {workout.difficulty}</span>
                      <span>• Coach {workout.assignedByTrainerName || 'Faculty Coach'}</span>
                    </div>
                  </div>
                </SportMediaBanner>

              {/* Body */}
              <div className="p-5">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {workout.description}
                </p>

                {/* Drills Preview / Accordion */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setExpandedPlanId(isExpanded ? null : workout.id)}
                    className="w-full flex items-center justify-between text-xs font-bold text-slate-800 hover:text-emerald-700 py-1"
                  >
                    <span>View {workout.drills.length} Specific Drills & Cues</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 space-y-2 text-xs">
                      {workout.drills.map((drill, idx) => (
                        <div
                          key={drill.id}
                          className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70"
                        >
                          <div className="flex items-center justify-between font-bold text-slate-900">
                            <span className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center font-bold">
                                {idx + 1}
                              </span>
                              {drill.name}
                            </span>
                            <span className="text-emerald-700 text-[11px]">
                              {drill.sets} sets × {drill.reps}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1 italic pl-7">
                            Cue: "{drill.coachingCue}" (Rest: {drill.restSeconds}s)
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-5 flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setActiveSession(workout);
                      setSessionSeconds(0);
                      setCompletedDrills({});
                    }}
                    className="flex-1 btn-primary text-xs py-2.5 font-bold flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Active Session</span>
                  </button>

                  <Link
                    to="/student/submit-proof"
                    state={{ workoutId: workout.id, workoutTitle: workout.title }}
                    className="btn-secondary text-xs py-2.5 font-bold"
                  >
                    Log Proof
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Active Workout Session Modal */}
      {activeSession && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Active Workout Session</span>
              </div>
              <button
                onClick={() => setActiveSession(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 text-center">
              <h3 className="text-xl font-black text-slate-900 font-display">{activeSession.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Target: {activeSession.durationMinutes} Minutes • +{activeSession.rewardCredits} Credits</p>

              {/* Animated Timer Pill */}
              <div className="my-6 inline-flex flex-col items-center p-4 rounded-2xl bg-slate-900 text-white shadow-lg">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Session Clock</span>
                <span className="text-4xl font-extrabold font-display tracking-widest text-emerald-400 mt-1">
                  {Math.floor(sessionSeconds / 60).toString().padStart(2, '0')}:
                  {(sessionSeconds % 60).toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">Est. burn: {Math.round((sessionSeconds / 60) * 8.5)} kcal</span>
              </div>
            </div>

            {/* Drill Checklist */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              <div className="text-xs font-bold text-slate-700 mb-1">Check Off Completed Drills:</div>
              {activeSession.drills.map((drill) => {
                const isDone = !!completedDrills[drill.id];
                return (
                  <div
                    key={drill.id}
                    onClick={() => toggleDrill(drill.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                      isDone
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                        isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span>{drill.name}</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">{drill.sets} × {drill.reps}</span>
                  </div>
                );
              })}
            </div>

            {/* Modal Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setSessionSeconds(prev => prev + 300)}
                className="btn-secondary text-xs py-2.5 px-3 font-semibold"
              >
                +5 Mins
              </button>
              <button
                onClick={handleFinishWorkout}
                className="flex-1 btn-primary text-xs py-2.5 font-bold"
              >
                <span>Finish & Submit Proof</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
