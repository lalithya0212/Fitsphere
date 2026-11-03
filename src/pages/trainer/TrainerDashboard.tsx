import React from 'react';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { Link, useNavigate } from 'react-router-dom';
import { UserAvatar } from '../../components/common/UserAvatar';
import {
  Users,
  Dumbbell,
  CheckSquare,
  Activity,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  ShieldCheck,
  Flame,
  MessageSquare
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const TrainerDashboard: React.FC = () => {
  const { currentUser, proofSubmissions, users, workouts, switchRole } = useFitSphereStore();
  const navigate = useNavigate();

  // Verification status check
  const isVerified = currentUser.verificationStatus === 'verified';

  // STRICT REQUIREMENT: Only show students assigned to this coach by admin, and only if coach is verified
  const assignedStudents = isVerified
    ? users.filter(u => u.role === 'student' && (u.assignedTrainerId === currentUser.id || u.assignedTrainerName === currentUser.name))
    : [];

  const assignedStudentIds = new Set(assignedStudents.map(s => s.id));

  // Only proofs submitted by athletes assigned to this coach
  const pendingProofs = isVerified
    ? proofSubmissions.filter(p => p.status === 'pending' && assignedStudentIds.has(p.studentId))
    : [];

  // Workouts created by this coach
  const myWorkouts = workouts.filter(w => (w as any).trainerId === currentUser.id || w.assignedByTrainerName === currentUser.name);

  const teamWeeklyVolumeData = [
    { day: 'Mon', completed: assignedStudents.length > 0 ? 32 : 0, scheduled: assignedStudents.length > 0 ? 38 : 0 },
    { day: 'Tue', completed: assignedStudents.length > 0 ? 28 : 0, scheduled: assignedStudents.length > 0 ? 30 : 0 },
    { day: 'Wed', completed: assignedStudents.length > 0 ? 36 : 0, scheduled: assignedStudents.length > 0 ? 40 : 0 },
    { day: 'Thu', completed: assignedStudents.length > 0 ? 25 : 0, scheduled: assignedStudents.length > 0 ? 28 : 0 },
    { day: 'Fri', completed: assignedStudents.length > 0 ? 38 : 0, scheduled: assignedStudents.length > 0 ? 42 : 0 },
    { day: 'Sat', completed: assignedStudents.length > 0 ? 18 : 0, scheduled: assignedStudents.length > 0 ? 22 : 0 },
    { day: 'Sun', completed: assignedStudents.length > 0 ? 12 : 0, scheduled: assignedStudents.length > 0 ? 15 : 0 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Verification Notice Banner if not verified */}
      {!isVerified && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 animate-pulse" />
            <div>
              <div className="text-xs font-bold">Coach Account Pending Administrator Verification</div>
              <div className="text-[11px] text-amber-800">
                Your coaching account is awaiting administrator review. Once verified by an administrator, student-athletes can be allocated to your coaching roster.
              </div>
            </div>
          </div>
          <span className="badge-gold text-[10px] font-bold shrink-0 self-start sm:self-auto">
            Status: {currentUser.verificationStatus === 'rejected' ? 'Accreditation Rejected' : 'Awaiting Clearance'}
          </span>
        </div>
      )}

      {/* Workspace Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Professional Coaching Workspace</span>
              <span className="w-1 h-1 rounded-full bg-blue-400" />
              <span>
                {isVerified
                  ? (currentUser.verificationScore ? `Exam Verified ${currentUser.verificationScore}%` : 'Verified Faculty Coach')
                  : 'Pending Verification'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">
              {currentUser.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Supervising {currentUser.sportSpecialization || 'Varsity Conditioning'}. You have{' '}
              <strong className="text-amber-400 font-bold">{pendingProofs.length} student workout proofs</strong> awaiting review.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2.5 text-xs font-semibold text-slate-300">
              <span className="bg-slate-800/90 px-3 py-1 rounded-lg border border-slate-700">
                👥 {assignedStudents.length} Assigned Athletes
              </span>
              <span className="bg-slate-800/90 px-3 py-1 rounded-lg border border-slate-700">
                🏅 {currentUser.credentials?.[0] || 'UEFA B License'}
              </span>
              <span className="bg-slate-800/90 px-3 py-1 rounded-lg border border-slate-700">
                🏋️ {currentUser.credentials?.[1] || 'NSCA - CSCS'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <Link
              to="/trainer/proof-review"
              className="btn-gold text-xs py-3 px-5 font-black flex items-center justify-center gap-2 shadow-lg"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Review Proofs ({pendingProofs.length})</span>
            </Link>

            <Link
              to="/trainer/plans"
              className="btn-secondary text-xs py-3 px-4 font-bold flex items-center justify-center gap-1.5"
            >
              <span>+ New Workout Plan</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Athletes</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-display mt-2">
            {assignedStudents.length}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {assignedStudents.length > 0 ? 'Full squad active' : (isVerified ? 'Awaiting athlete allocation' : 'Pending verification')}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Pending Proofs</span>
            <CheckSquare className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600 font-display mt-2">
            {pendingProofs.length}
          </div>
          <Link to="/trainer/proof-review" className="text-xs text-amber-700 font-bold hover:underline mt-1 block">
            Review submissions →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Squad Attendance</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600 font-display mt-2">
            {assignedStudents.length > 0 ? '91.4%' : '0%'}
          </div>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">
            {assignedStudents.length > 0 ? '↑ 3.2% vs last week' : 'No active squad data'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Training Plans</span>
            <Dumbbell className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-purple-600 font-display mt-2">
            {myWorkouts.length}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {myWorkouts.length > 0 ? 'Active varsity curriculums' : 'No plans published yet'}
          </span>
        </div>
      </div>

      {/* Grid: Pending Proofs Action Deck + Team Volume Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pending Proofs Deck (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-amber-500" />
                <h2 className="text-base font-bold text-slate-900">Pending Proof Review Queue</h2>
              </div>
              <Link to="/trainer/proof-review" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                Open Review Deck ({pendingProofs.length}) →
              </Link>
            </div>

            <div className="space-y-3">
              {pendingProofs.slice(0, 3).map((proof) => (
                <div
                  key={proof.id}
                  className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <UserAvatar name={proof.studentName} role="student" size="sm" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{proof.studentName}</div>
                      <div className="text-[11px] text-slate-500">{proof.workoutTitle}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {proof.telemetry.durationMinutes}m • {proof.telemetry.caloriesBurned} kcal • {proof.telemetry.heartRateAvg} bpm
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/trainer/proof-review"
                    className="btn-navy text-[11px] py-1.5 px-3 font-bold shrink-0"
                  >
                    Evaluate
                  </Link>
                </div>
              ))}

              {pendingProofs.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">
                  All athlete workout proofs have been reviewed!
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Approved proofs automatically credit student wallets.</span>
            <Link to="/trainer/proof-review" className="font-bold text-emerald-600">
              Go to Deck
            </Link>
          </div>
        </div>

        {/* Team Volume Chart (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Squad Workout Completion Volume</h2>
              <p className="text-xs text-slate-500">Scheduled vs Completed sessions</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamWeeklyVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', fontSize: '11px' }}
                />
                <Bar dataKey="scheduled" name="Scheduled" fill="#E2E8F0" radius={[6, 6, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#10B981" radius={[6, 6, 0, 0]} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Assigned Student Roster Quick View */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Active Athlete Roster</h2>
            <p className="text-xs text-slate-500">Assigned collegiate athletes under your supervision</p>
          </div>
          <Link to="/trainer/students" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
            View All Athletes →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {!isVerified ? (
            <div className="col-span-full py-10 px-4 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <ShieldCheck className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-slate-800">Administrator Verification Required</h4>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                Your coaching account is awaiting verification by the campus administrator. Athletes can only be assigned to you after verification is approved.
              </p>
            </div>
          ) : assignedStudents.length === 0 ? (
            <div className="col-span-full py-10 px-4 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-slate-800">No Athletes Assigned Yet</h4>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                The campus administration has not assigned any student-athletes to your coaching roster yet. Once athletes are allocated to you by admin, they will appear here.
              </p>
            </div>
          ) : (
            assignedStudents.slice(0, 4).map((student) => (
              <div
                key={student.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <UserAvatar name={student.name} role="student" size="sm" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{student.name}</h4>
                      <p className="text-[11px] text-slate-500">{student.sportSpecialization}</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 mt-2">
                    <div className="flex justify-between">
                      <span>Fitness Score:</span>
                      <span className="font-bold text-slate-900">{student.fitnessScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>FitCredits:</span>
                      <span className="font-bold text-amber-700">⭐ {student.fitCredits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Streak:</span>
                      <span className="font-bold text-emerald-600">{student.streakDays} days</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex gap-2">
                  <Link
                    to="/trainer/assessments"
                    className="flex-1 btn-secondary text-[11px] py-1.5 text-center font-semibold"
                  >
                    5D Eval
                  </Link>
                  <Link
                    to="/trainer/chat"
                    className="btn-navy text-[11px] py-1.5 px-2.5 font-bold"
                  >
                    Chat
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
