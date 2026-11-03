import React from 'react';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { Link, useNavigate } from 'react-router-dom';
import { UserAvatar } from '../../components/common/UserAvatar';
import { TrainerVerificationApplication } from '../../types';
import {
  Shield,
  Users,
  GraduationCap,
  Dumbbell,
  Trophy,
  Coins,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Activity,
  Sparkles,
  Calendar
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { currentUser, users, events, trainerApplications, verifyTrainer } = useFitSphereStore();
  const navigate = useNavigate();

  // REAL-TIME SYNCHRONIZED METRICS DIRECTLY FROM ACTIVE USERS:
  const studentUsers = users.filter(u => u.role === 'student');
  const trainerUsers = users.filter(u => u.role === 'trainer');

  const studentsCount = studentUsers.length;
  const certifiedTrainersCount = trainerUsers.filter(u => u.verificationStatus === 'verified').length;

  // Active athletes: students with assigned coaches, active streaks, or recorded fitness activity
  const activeAthletesCount = studentUsers.filter(
    u => u.assignedTrainerId || (u.streakDays && u.streakDays > 0) || (u.fitCredits && u.fitCredits > 0)
  ).length;

  // Real-time total FitCredits in circulation across all students
  const totalFitCredits = studentUsers.reduce((sum, u) => sum + (u.fitCredits || 0), 0);

  // Active tournaments from real events store
  const activeTournamentsCount = events.length;

  // Real-time student registrations across all tournaments (which student registered for which tournament)
  const studentTournamentRegistrations = React.useMemo(() => {
    const list: {
      registrationId: string;
      studentId: string;
      studentName: string;
      studentEmail: string;
      studentAvatar: string;
      studentDepartment: string;
      studentDorm: string;
      eventTitle: string;
      eventSport: string;
      eventCategory: string;
      eventDate: string;
      eventVenue: string;
      requiredCredits: number;
    }[] = [];

    events.forEach(event => {
      (event.registeredStudentIds || []).forEach(studentId => {
        const student = users.find(u => u.id === studentId);
        list.push({
          registrationId: `${event.id}-${studentId}`,
          studentId,
          studentName: student?.name || 'Registered Student',
          studentEmail: student?.email || 'student@university.edu',
          studentAvatar: student?.avatar || '',
          studentDepartment: student?.department || 'General Athletics',
          studentDorm: student?.dormHouse || 'Campus Dorm',
          eventTitle: event.title,
          eventSport: event.sport,
          eventCategory: event.category,
          eventDate: event.date,
          eventVenue: event.venue,
          requiredCredits: event.requiredCredits
        });
      });
    });

    return list;
  }, [events, users]);

  // Real pending coaches list combining trainerApplications & unverified coaches in users
  const pendingApplicationsMap = new Map<string, TrainerVerificationApplication>();
  trainerApplications.forEach(app => {
    if (app.status === 'pending') {
      pendingApplicationsMap.set(app.trainerEmail.toLowerCase(), app);
    }
  });

  trainerUsers.forEach(trainer => {
    if (trainer.verificationStatus === 'pending' && !pendingApplicationsMap.has(trainer.email.toLowerCase())) {
      pendingApplicationsMap.set(trainer.email.toLowerCase(), {
        id: `app-${trainer.id}`,
        trainerName: trainer.name,
        trainerEmail: trainer.email,
        avatar: trainer.avatar || '',
        sportSpecialization: trainer.sportSpecialization || 'Varsity Conditioning',
        experienceYears: 4,
        bio: `Collegiate coach candidate specializing in ${trainer.sportSpecialization || 'Varsity Conditioning'}`,
        certifications: trainer.credentials || ['Collegiate Coach Candidate'],
        assessmentScore: trainer.verificationScore || 85,
        passed: (trainer.verificationScore || 85) >= 70,
        status: 'pending',
        submittedAt: new Date().toISOString().split('T')[0]
      });
    }
  });

  const pendingTrainersList = Array.from(pendingApplicationsMap.values());
  const pendingTrainersCount = pendingTrainersList.length;

  // Dynamic department participation aggregated from real student users
  const departmentMap: Record<string, { students: number; athletes: number }> = {};
  studentUsers.forEach(u => {
    const dept = u.department || 'General Athletics';
    if (!departmentMap[dept]) {
      departmentMap[dept] = { students: 0, athletes: 0 };
    }
    departmentMap[dept].students += 1;
    if (u.assignedTrainerId || (u.streakDays && u.streakDays > 0) || (u.fitnessScore && u.fitnessScore >= 80)) {
      departmentMap[dept].athletes += 1;
    }
  });

  const departmentParticipationData = Object.entries(departmentMap).map(([department, data]) => ({
    department: department.length > 14 ? department.substring(0, 12) + '..' : department,
    students: data.students,
    athletes: data.athletes
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Command Center Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold mb-3">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Intercollegiate Sports Operations</span>
              <span className="w-1 h-1 rounded-full bg-purple-400" />
              <span>{currentUser.department || 'Campus Athletics Administration'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">
              Sports Command Center
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              <span className="text-white font-bold">{currentUser.name || 'Campus Administrator'}</span> presiding. Overseeing university athletic programs, coach verification exams, and campus tournaments.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2.5 text-xs font-semibold text-slate-300">
              <span className="bg-slate-900/90 px-3 py-1 rounded-lg border border-slate-800">
                🏛️ {studentsCount.toLocaleString()} Enrolled Athletes
              </span>
              <span className="bg-slate-900/90 px-3 py-1 rounded-lg border border-slate-800">
                ⭐ {totalFitCredits.toLocaleString()} FitCredits In Circulation
              </span>
              <span className="bg-slate-900/90 px-3 py-1 rounded-lg border border-slate-800">
                🏆 {activeTournamentsCount} Active Tournaments
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <Link
              to="/admin/trainers"
              className="btn-gold text-xs py-3 px-5 font-black flex items-center justify-center gap-2 shadow-lg"
            >
              <Shield className="w-4 h-4" />
              <span>Verify Trainers ({pendingTrainersCount})</span>
            </Link>

            <Link
              to="/admin/events"
              className="btn-secondary text-xs py-3 px-4 font-bold flex items-center justify-center gap-1.5"
            >
              <span>+ Create Tournament</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Highlight Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Students</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-display mt-1">
            {studentsCount.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">Active on campus</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Active Athletes</span>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 font-display mt-1">
            {activeAthletesCount.toLocaleString()}
          </div>
          <span className="text-[11px] text-blue-700 font-semibold mt-1 block">
            {activeAthletesCount === 1 ? '1 Active Squad Member' : `${activeAthletesCount} Varsity Squads`}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Certified Coaches</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-display mt-1">
            {certifiedTrainersCount.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">100% Exam Verified</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Pending Trainers</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 font-display mt-1">
            {pendingTrainersCount.toLocaleString()}
          </div>
          <Link to="/admin/trainers" className="text-[11px] text-amber-700 font-bold hover:underline mt-1 block">
            Awaiting clearance &rarr;
          </Link>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs col-span-2 md:col-span-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">FitCredits Distributed</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 font-display mt-1">
            {totalFitCredits.toLocaleString()}
          </div>
          <span className="text-[11px] text-amber-800 font-semibold mt-1 block">Campus Economy</span>
        </div>
      </div>

      {/* Grid: Pending Trainer Verification Queue + Multi-Sport Participation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pending Verification Queue (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <h2 className="text-base font-bold text-slate-900">Trainer Verification Queue</h2>
              </div>
              <Link to="/admin/trainers" className="text-xs font-bold text-purple-600 hover:text-purple-700">
                View All ({pendingTrainersCount}) &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {pendingTrainersList.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <UserAvatar name={app.trainerName} role="trainer" avatar={app.avatar} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{app.trainerName}</span>
                        <span className="badge-emerald text-[10px] font-bold">
                          {app.assessmentScore}% Score
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">{app.sportSpecialization}</div>
                      <div className="text-[10px] text-slate-400">{app.certifications?.join(', ') || 'Collegiate Coach Candidate'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => verifyTrainer(app.id, 'approve')}
                      className="btn-primary text-xs py-1.5 px-3 font-bold"
                    >
                      Verify Coach
                    </button>
                    <button
                      onClick={() => verifyTrainer(app.id, 'reject')}
                      className="btn-secondary text-xs py-1.5 px-2.5 text-rose-600"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}

              {pendingTrainersList.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400">
                  No trainer applications pending review. All faculty coaches are verified.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            Coaches must score &ge; 70% on the 10-Question Sports Science Exam before administrative clearance.
          </div>
        </div>

        {/* Multi-Department Athletic Engagement (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Department Athletic Participation</h2>
              <p className="text-xs text-slate-500">Enrolled Students vs Active Athletes</p>
            </div>
          </div>

          <div className="h-64 w-full">
            {departmentParticipationData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentParticipationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="department" tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', fontSize: '11px' }}
                  />
                  <Bar dataKey="students" name="Total Enrolled" fill="#CBD5E1" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="athletes" name="Varsity Athletes" fill="#2563EB" radius={[6, 6, 0, 0]} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-xs text-slate-400">
                <Users className="w-8 h-8 text-slate-300 mb-2" />
                <span>No departmental student records enrolled yet.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Campus Tournaments */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Intercollegiate Tournaments {'&'} Leagues</h2>
            <p className="text-xs text-slate-500">Scheduled campus sports events and participant registration counts</p>
          </div>
          <Link to="/admin/events" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
            Manage All Events &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {events.map((evt) => (
            <div key={evt.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="badge-gold text-[10px] font-bold">{evt.sport}</span>
                  <span className="text-[10px] font-black text-amber-700">
                    {evt.requiredCredits > 0 ? `${evt.requiredCredits} Credits` : 'Free'}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">{evt.title}</h4>
                <div className="text-[11px] text-slate-500 mt-1">
                  📅 {evt.date} • {evt.venue}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-200/60">
                <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                  <span>Enrolled:</span>
                  <span>{evt.currentParticipants}/{evt.maxParticipants}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${(evt.currentParticipants / evt.maxParticipants) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Student Tournament Registrations */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-base font-bold text-slate-900">Live Student Tournament Registrations</h2>
            </div>
            <p className="text-xs text-slate-500">Real-time ledger of which student has registered for which campus tournament</p>
          </div>
          <Link to="/admin/events" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            <span>View Full Rosters {'&'} Manage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {studentTournamentRegistrations.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/60">
            No students have registered for any tournament yet. As soon as a student registers, their live enrollment details will appear here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {studentTournamentRegistrations.map((reg) => (
              <div key={reg.registrationId} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <UserAvatar name={reg.studentName} role="student" size="sm" />
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">{reg.studentName}</div>
                    <div className="text-[11px] text-emerald-700 font-semibold truncate">
                      🏆 {reg.eventTitle}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {reg.studentDepartment} • {reg.eventSport}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="badge-gold text-[10px] font-bold">
                    {reg.requiredCredits > 0 ? `${reg.requiredCredits} ⭐` : 'Free'}
                  </span>
                  <div className="text-[9px] text-slate-400 mt-1">{reg.eventDate}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
