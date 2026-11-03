import React from 'react';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Zap,
  Activity,
  Award,
  Flame,
  Clock,
  Dumbbell,
  ShieldCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProgressAnalytics: React.FC = () => {
  const { studentAssessment, currentUser, proofSubmissions, users } = useFitSphereStore();

  const myApprovedProofs = proofSubmissions.filter(
    p => p.studentId === currentUser.id && p.status === 'approved'
  );

  // Calculate actual weekly volume & calories
  const totalVolumeMinutes = myApprovedProofs.reduce(
    (acc, p) => acc + (p.telemetry.durationMinutes || 0),
    0
  );
  const totalCaloriesBurned = myApprovedProofs.reduce(
    (acc, p) => acc + (p.telemetry.caloriesBurned || 0),
    0
  );

  // Compute Campus Standing dynamically
  const studentsRanked = users
    .filter(u => u.role === 'student')
    .sort((a, b) => (b.fitCredits || 0) - (a.fitCredits || 0));
  const myRankIndex = studentsRanked.findIndex(u => u.id === currentUser.id);
  const campusRank = myRankIndex !== -1 ? `#${myRankIndex + 1}` : 'Unranked';

  // Compute Daily Consistency from real proofs (past 7 days Mon-Sun)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const consistencyMap: { [day: string]: { minutes: number; calories: number } } = {
    Mon: { minutes: 0, calories: 0 },
    Tue: { minutes: 0, calories: 0 },
    Wed: { minutes: 0, calories: 0 },
    Thu: { minutes: 0, calories: 0 },
    Fri: { minutes: 0, calories: 0 },
    Sat: { minutes: 0, calories: 0 },
    Sun: { minutes: 0, calories: 0 }
  };

  myApprovedProofs.forEach(p => {
    const d = new Date(p.submittedAt);
    const dayIndex = d.getDay(); // 0 is Sun, 1 is Mon...
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex];
    if (consistencyMap[dayName]) {
      consistencyMap[dayName].minutes += p.telemetry.durationMinutes || 0;
      consistencyMap[dayName].calories += p.telemetry.caloriesBurned || 0;
    }
  });

  const consistencyData = days.map(day => ({
    day,
    minutes: consistencyMap[day].minutes,
    calories: consistencyMap[day].calories
  }));

  // Fitness Trajectory from real approved sessions
  const fitnessTrendData = myApprovedProofs.length > 0
    ? myApprovedProofs.slice(-8).map((p, idx) => ({
        session: `Sess ${idx + 1}`,
        score: Math.min(100, Math.round(50 + (p.telemetry.durationMinutes * 0.4) + (p.creditsAwarded * 0.5))),
        credits: p.creditsAwarded
      }))
    : [];

  // 5D Radar Data from store assessment
  const hasAssessment = studentAssessment && studentAssessment.current;
  const radarData = [
    {
      dimension: 'Strength',
      Baseline: studentAssessment?.baseline?.strength || 0,
      Current: studentAssessment?.current?.strength || 0,
      fullMark: 100
    },
    {
      dimension: 'Speed',
      Baseline: studentAssessment?.baseline?.speed || 0,
      Current: studentAssessment?.current?.speed || 0,
      fullMark: 100
    },
    {
      dimension: 'Endurance',
      Baseline: studentAssessment?.baseline?.endurance || 0,
      Current: studentAssessment?.current?.endurance || 0,
      fullMark: 100
    },
    {
      dimension: 'Flexibility',
      Baseline: studentAssessment?.baseline?.flexibility || 0,
      Current: studentAssessment?.current?.flexibility || 0,
      fullMark: 100
    },
    {
      dimension: 'Skill Dev',
      Baseline: studentAssessment?.baseline?.skill || 0,
      Current: studentAssessment?.current?.skill || 0,
      fullMark: 100
    }
  ];

  // Derive PRs from real submissions
  const maxDuration = myApprovedProofs.reduce((max, p) => Math.max(max, p.telemetry.durationMinutes || 0), 0);
  const maxCalories = myApprovedProofs.reduce((max, p) => Math.max(max, p.telemetry.caloriesBurned || 0), 0);
  const maxReps = myApprovedProofs.reduce((max, p) => Math.max(max, p.telemetry.repsCompleted || 0), 0);
  const maxDistance = myApprovedProofs.reduce((max, p) => Math.max(max, p.telemetry.distanceKm || 0), 0);

  const personalRecords = [
    {
      metric: 'Longest Session',
      value: maxDuration > 0 ? `${maxDuration} mins` : '--',
      icon: Clock,
      note: maxDuration > 0 ? 'Verified Endurance Cap' : 'No verified sessions'
    },
    {
      metric: 'Peak Caloric Burn',
      value: maxCalories > 0 ? `${maxCalories} kcal` : '--',
      icon: Flame,
      note: maxCalories > 0 ? 'Single Workout Peak' : 'No verified sessions'
    },
    {
      metric: 'Max Drill Reps',
      value: maxReps > 0 ? `${maxReps} reps` : '--',
      icon: Dumbbell,
      note: maxReps > 0 ? 'Continuous Volume' : 'No verified sessions'
    },
    {
      metric: 'Max GPS Distance',
      value: maxDistance > 0 ? `${maxDistance} km` : '--',
      icon: Activity,
      note: maxDistance > 0 ? 'Recorded Route Track' : 'No verified sessions'
    },
    {
      metric: 'Active Streak',
      value: `${currentUser.streakDays || 0} Days`,
      icon: Award,
      note: currentUser.streakDays ? 'Consecutive Training Days' : 'Start your streak today'
    },
    {
      metric: 'FitCredits Accrued',
      value: `${currentUser.fitCredits || 0} pts`,
      icon: Zap,
      note: 'Wallet Balance'
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
          Athletic Performance Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Objective telemetry tracking physical development, consistency, and radar dimensions from verified workouts.
        </p>
      </div>

      {/* KPI Highlight Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall Fitness Score</span>
          <div className="text-3xl font-black text-slate-900 font-display mt-1">
            {currentUser.fitnessScore || 0}%
          </div>
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> Based on coach evaluations
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified Volume</span>
          <div className="text-3xl font-black text-slate-900 font-display mt-1">
            {totalVolumeMinutes} mins
          </div>
          <span className="text-xs text-blue-600 font-semibold mt-1 block">
            {myApprovedProofs.length} approved {myApprovedProofs.length === 1 ? 'session' : 'sessions'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Energy Expended</span>
          <div className="text-3xl font-black text-amber-600 font-display mt-1">
            {totalCaloriesBurned} kcal
          </div>
          <span className="text-xs text-amber-700 font-semibold mt-1 block">
            From verified telemetry
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Campus Standing</span>
          <div className="text-3xl font-black text-emerald-600 font-display mt-1">
            {campusRank}
          </div>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">
            ⭐ {currentUser.fitCredits || 0} FitCredits
          </span>
        </div>
      </div>

      {/* Grid: Trajectory Line Chart + 5D Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trajectory Area Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Fitness Improvement Trajectory</h2>
              <p className="text-xs text-slate-500">Progression across verified workout sessions</p>
            </div>
            {fitnessTrendData.length > 0 && (
              <span className="badge-emerald font-bold text-[10px]">Verified Sessions</span>
            )}
          </div>

          <div className="h-64 w-full">
            {fitnessTrendData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <TrendingUp className="w-10 h-10 text-slate-300 mb-2" />
                <h4 className="text-xs font-bold text-slate-700">No Verified Sessions Logged Yet</h4>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                  Submit workout proof for your coach to review. Once approved, your progress trajectory will chart here.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fitnessTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="session" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', fontSize: '11px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    name="Performance Metric"
                    stroke="#10B981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#scoreGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 5D Athletic Radar Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">5D Athletic Radar Profile</h2>
              <p className="text-xs text-slate-500">Baseline vs Active Coach Assessment</p>
            </div>
            <span className="badge-blue font-bold text-[10px]">Varsity Metrics</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="Baseline (Initial)" dataKey="Baseline" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.2} />
                <Radar name="Current (Active)" dataKey="Current" stroke="#2563EB" fill="#2563EB" fillOpacity={0.4} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Consistency Bar Chart + Personal Records Shelf */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Consistency Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Weekly Consistency & Caloric Burn</h2>
              <p className="text-xs text-slate-500">Active minutes and calories from verified sessions</p>
            </div>
          </div>

          <div className="h-60 w-full">
            {myApprovedProofs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Calendar className="w-10 h-10 text-slate-300 mb-2" />
                <h4 className="text-xs font-bold text-slate-700">No Weekly Activity Recorded</h4>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                  Your daily training minutes and calories will populate as workouts are completed and verified.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={consistencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', fontSize: '11px' }}
                  />
                  <Bar dataKey="minutes" name="Training Minutes" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="calories" name="Calories Burned" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Personal Records Shelf (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Verified Performance Records (PRs)
            </h2>
            <p className="text-xs text-slate-500 mb-4">Official telemetry records logged from approved sessions</p>

            <div className="grid grid-cols-2 gap-2.5">
              {personalRecords.map((pr, idx) => {
                const Icon = pr.icon;
                return (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold">
                      <Icon className="w-3 h-3 text-emerald-600" />
                      <span>{pr.metric}</span>
                    </div>
                    <div className="text-base font-black text-slate-950 font-display mt-0.5">
                      {pr.value}
                    </div>
                    <div className="text-[9px] text-slate-400 mt-0.5 truncate">{pr.note}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
            <span className="font-bold">Total Approved Sessions:</span>
            <span className="font-bold text-emerald-700 text-xs">{myApprovedProofs.length} Sessions</span>
          </div>
        </div>
      </div>
    </div>
  );
};
