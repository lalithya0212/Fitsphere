import React from 'react';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { FitnessPulse } from '../../components/common/FitnessPulse';
import { AthleteJourney } from '../../components/common/AthleteJourney';
import { Link, useNavigate } from 'react-router-dom';
import {
  Coins,
  Dumbbell,
  Trophy,
  Flame,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Clock,
  Zap,
  CheckCircle2,
  Calendar,
  ChevronRight,
  TrendingUp,
  Award,
  Video
} from 'lucide-react';
import { UserAvatar } from '../../components/common/UserAvatar';

export const StudentDashboard: React.FC = () => {
  const { currentUser, users, workouts, events, proofSubmissions, transactions } = useFitSphereStore();
  const navigate = useNavigate();

  // Check if student has an assigned coach
  const hasAssignedCoach = !!(currentUser.assignedTrainerId || currentUser.assignedTrainerName);

  // Pick today's workout from assigned coach only
  const coachWorkouts = hasAssignedCoach
    ? workouts.filter(
        w => (currentUser.assignedTrainerId && (w as any).trainerId === currentUser.assignedTrainerId) ||
             (currentUser.assignedTrainerName && w.assignedByTrainerName && w.assignedByTrainerName.toLowerCase() === currentUser.assignedTrainerName.toLowerCase())
      )
    : [];

  const todaysWorkout = coachWorkouts[0] || null;

  // Upcoming featured event
  const nextEvent = events.find(e => e.status === 'Open') || events[0] || null;

  // Recent proofs
  const myProofs = proofSubmissions.filter(p => p.studentId === currentUser.id);
  const pendingCount = myProofs.filter(p => p.status === 'pending').length;

  const assignedCoach = users.find(
    u => (currentUser.assignedTrainerId && u.id === currentUser.assignedTrainerId) ||
         (currentUser.assignedTrainerName && u.name === currentUser.assignedTrainerName)
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-radial from-emerald-500/10 to-transparent blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Varsity Athletic Portfolio</span>
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              <span>{currentUser.academicYear || 'Sophomore'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">
              Good Morning, {currentUser.name.split(' ')[0]} 👋
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Your Fitness Journey is performing at a high collegiate standard. You have{' '}
              <strong className="text-emerald-400">{currentUser.streakDays} days</strong> active streak. Keep up the intensity today!
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300">
              <span className="bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700/60">
                🏛️ {currentUser.dormHouse || 'Phoenix House'}
              </span>
              <span className="bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700/60">
                ⚽ {currentUser.sportSpecialization || 'Football Team'}
              </span>
              <span className="bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700/60">
                🎓 {currentUser.department || 'Mechanical Eng.'}
              </span>
            </div>
          </div>

          {/* Quick FitCredits Balance Pill */}
          <div className="flex flex-col items-start sm:items-end bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">FitCredits Balance</span>
            <div className="text-3xl sm:text-4xl font-black text-amber-400 font-display flex items-center gap-1.5 my-1">
              <span>⭐</span>
              <span>{currentUser.fitCredits || 0}</span>
            </div>
            <span className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +35 earned this week
            </span>
            <Link
              to="/student/fitcredits"
              className="mt-3 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-xl transition-colors"
            >
              Open Wallet & Rewards
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: Fitness Pulse + Today's Workout + Coach Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Fitness Pulse (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              Fitness Pulse
            </h2>
            <Link to="/student/progress" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
              View Analytics
            </Link>
          </div>

          <div className="py-2">
            <FitnessPulse score={currentUser.fitnessScore || 82} delta={currentUser.fitnessScoreDelta || 12} size="md" />
          </div>

          <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 flex items-center justify-between">
            <span className="font-medium">Cardiovascular & Sprint Load</span>
            <span className="font-bold text-emerald-600">Optimal Zone</span>
          </div>
        </div>

        {/* Today's Workout (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          {todaysWorkout ? (
            <>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="badge-emerald font-bold">Assigned for Today</span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    +{todaysWorkout.rewardCredits} FitCredits
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-950 font-display">
                  {todaysWorkout.title}
                </h2>
                <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                  {todaysWorkout.description}
                </p>

                {/* Workout Meta Chips */}
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> {todaysWorkout.durationMinutes} Mins
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                    {todaysWorkout.difficulty}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200/60">
                    Intensity: {todaysWorkout.intensity}
                  </span>
                </div>

                {/* Drill Highlights */}
                {todaysWorkout.drills && todaysWorkout.drills.length > 0 && (
                  <div className="mt-4 space-y-1.5 text-xs text-slate-700">
                    {todaysWorkout.drills.slice(0, 3).map((drill, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="font-semibold">{drill.name}</span>
                        </div>
                        <span className="text-slate-500 text-[11px]">{drill.sets} sets × {drill.reps}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5 flex gap-2">
                <Link
                  to="/student/workouts"
                  className="flex-1 btn-primary text-xs py-2.5 text-center font-bold"
                >
                  Start & View Drills
                </Link>
                <Link
                  to="/student/submit-proof"
                  state={{ workoutId: todaysWorkout.id, workoutTitle: todaysWorkout.title }}
                  className="btn-secondary text-xs py-2.5 font-bold"
                >
                  Submit Proof
                </Link>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-10 space-y-3 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shadow-xs">
                <Dumbbell className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  {!hasAssignedCoach ? 'No Coach Assigned Yet' : 'No Assigned Workouts Yet'}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
                  {!hasAssignedCoach
                    ? 'You have not been assigned a coach yet. Once the administration allocates your faculty coach, your workout plans will be scheduled here.'
                    : `When ${currentUser.assignedTrainerName || 'your assigned coach'} creates training plans, they will be scheduled here for your daily drills.`}
                </p>
              </div>
              <Link
                to={!hasAssignedCoach ? "/student/coach" : "/student/workouts"}
                className="btn-secondary text-xs py-2 px-4 font-bold mt-2"
              >
                {!hasAssignedCoach ? "Check Coach Status" : "View Training Module"}
              </Link>
            </div>
          )}
        </div>

        {/* Assigned Trainer & Status (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Coach</span>
              {currentUser.assignedTrainerName ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  Waiting
                </span>
              )}
            </div>

            <div className="text-center py-2">
            {currentUser.assignedTrainerName ? (
              <>
                <div className="text-center">
                  <UserAvatar
                    name={currentUser.assignedTrainerName}
                    role="trainer"
                    avatar={assignedCoach?.avatar}
                    size="xl"
                    className="mx-auto mb-2"
                  />
                  <h3 className="text-sm font-bold text-slate-900">{currentUser.assignedTrainerName}</h3>
                  <p className="text-[11px] text-slate-500">{assignedCoach?.sportSpecialization || currentUser.sportSpecialization || 'Varsity Athletics'}</p>
                  <div className="mt-1.5 inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Verified Collegiate Coach
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mt-2">
                  <p className="italic text-[11px]">
                    &quot;Stay disciplined with training and log all session telemetry.&quot;
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-4 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 mx-auto flex items-center justify-center text-amber-600">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-xs font-bold text-slate-900">Coach Assignment Pending</h3>
                <p className="text-[11px] text-slate-500 leading-snug">
                  The Athletic Administration will designate an accredited faculty coach to your profile.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-2">
            {currentUser.assignedTrainerName ? (
              <>
                <Link
                  to="/student/chat"
                  className="w-full btn-navy text-xs py-2 font-bold flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message Coach</span>
                </Link>
                <Link
                  to="/student/trainer"
                  className="w-full btn-secondary text-xs py-2 text-center"
                >
                  View Coach Profile
                </Link>
              </>
            ) : (
              <Link
                to="/student/trainer"
                className="w-full btn-secondary text-xs py-2 text-center block font-semibold text-slate-600"
              >
                View Assignment Status
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Signature Feature: Athlete Journey Timeline */}
      <AthleteJourney currentStage={currentUser.fitnessLevel || 'advanced'} />

      {/* Upcoming Events & Proof Submissions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Championship Tournament */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-950 font-display">Upcoming Championship</h3>
            </div>
            <Link to="/student/events" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
              All Tournaments →
            </Link>
          </div>

          {nextEvent ? (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-amber-50/40 border border-amber-200/60">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="badge-gold font-bold text-[10px] mb-1">{nextEvent.category}</span>
                  <h4 className="text-base font-bold text-slate-900">{nextEvent.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {nextEvent.date}
                    </span>
                    <span>• {nextEvent.venue}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-500 font-medium">Required</div>
                  <div className="text-base font-black text-amber-700">{nextEvent.requiredCredits} Credits</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/40 flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium">
                  {nextEvent.currentParticipants} / {nextEvent.maxParticipants} slots filled
                </span>
                <Link
                  to="/student/events"
                  className="btn-gold text-xs py-1.5 px-4 font-bold"
                >
                  Register with Credits
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-400">
              No campus tournaments currently scheduled. Check back soon for upcoming championships!
            </div>
          )}
        </div>

        {/* Proof Submissions Quick Status */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-950 font-display">Recent Proof Submissions</h3>
            </div>
            <Link to="/student/submit-proof" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
              Submit New Proof +
            </Link>
          </div>

          <div className="space-y-3">
            {myProofs.slice(0, 2).map((proof) => (
              <div key={proof.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden shrink-0">
                    <img src={proof.proofMediaUrl} alt="proof" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{proof.workoutTitle}</h5>
                    <p className="text-[11px] text-slate-500">
                      {proof.telemetry.durationMinutes} mins • {proof.telemetry.caloriesBurned} kcal • {proof.telemetry.heartRateAvg} bpm
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  {proof.status === 'approved' ? (
                    <span className="badge-emerald font-bold">Approved +{proof.creditsAwarded} pts</span>
                  ) : proof.status === 'pending' ? (
                    <span className="badge-gold font-bold">Awaiting Review</span>
                  ) : (
                    <span className="badge-blue font-bold">Needs Revision</span>
                  )}
                </div>
              </div>
            ))}

            {myProofs.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-400">
                No proofs submitted yet. Complete today's workout and upload proof to earn FitCredits!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
