import React, { useState } from 'react';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { UserProfile } from '../../types';
import { Link } from 'react-router-dom';
import { UserAvatar } from '../../components/common/UserAvatar';
import {
  Users,
  Search,
  Flame,
  Award,
  Activity,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';

export const StudentRosterPage: React.FC = () => {
  const { users, currentUser } = useFitSphereStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [inspectStudent, setInspectStudent] = useState<UserProfile | null>(null);

  const isVerified = currentUser.verificationStatus === 'verified';

  // STRICT REQUIREMENT: Only athletes assigned to this coach by admin are in their roster
  const studentList = isVerified
    ? users.filter(u => u.role === 'student' && (u.assignedTrainerId === currentUser.id || u.assignedTrainerName === currentUser.name))
    : [];

  const filteredStudents = studentList.filter(s => {
    const matchesName = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.sportSpecialization && s.sportSpecialization.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.department && s.department.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLevel = selectedLevel === 'All' || s.fitnessLevel === selectedLevel;

    return matchesName && matchesLevel;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
          Collegiate Athlete Roster
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Supervise assigned student athletes, monitor attendance consistency, and review diagnostic levels.
        </p>
      </div>

      {!isVerified ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-display">Coach Verification Required</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            Your coaching profile is currently awaiting verification from the athletics administrator. You cannot view or manage student athletes until your account is verified and athletes are allocated to you.
          </p>
        </div>
      ) : studentList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-display">No Athletes Assigned Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            The campus athletics administration has not assigned any varsity student-athletes to your coaching roster yet. Once athletes are allocated to you by admin, they will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/80">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by athlete name, sport, or major..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500">Tier:</span>
              <select
                value={selectedLevel}
                onChange={e => setSelectedLevel(e.target.value)}
                className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none"
              >
                <option value="All">All Athletic Tiers</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="athlete">Varsity Athlete</option>
              </select>
            </div>
          </div>

          {/* Athletes Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Athlete</th>
                <th className="py-3.5 px-4">Sport & Major</th>
                <th className="py-3.5 px-4">Tier Status</th>
                <th className="py-3.5 px-4">Fitness Score</th>
                <th className="py-3.5 px-4">FitCredits</th>
                <th className="py-3.5 px-4">Attendance Streak</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={student.name} role="student" size="md" />
                      <div>
                        <div className="font-bold text-slate-900">{student.name}</div>
                        <div className="text-[10px] text-slate-400">{student.studentId} • {student.dormHouse}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900">{student.sportSpecialization}</div>
                    <div className="text-[11px] text-slate-500">{student.department}</div>
                  </td>

                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold capitalize ${
                      student.fitnessLevel === 'athlete'
                        ? 'bg-amber-100 text-amber-800'
                        : student.fitnessLevel === 'advanced'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {student.fitnessLevel || 'Advanced'}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${student.fitnessScore}%` }}
                        />
                      </div>
                      <span className="font-bold">{student.fitnessScore}%</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-black text-amber-700">
                    ⭐ {student.fitCredits}
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                      <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" />
                      {student.streakDays} days
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setInspectStudent(student)}
                        className="btn-secondary text-[11px] py-1.5 px-3 font-semibold"
                      >
                        Inspect
                      </button>
                      <Link
                        to="/trainer/assessments"
                        className="btn-navy text-[11px] py-1.5 px-3 font-bold"
                      >
                        Evaluate
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
    )}

      {/* Inspect Athlete Modal */}
      {inspectStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Collegiate Athlete Profile
              </span>
              <button onClick={() => setInspectStudent(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 flex items-center gap-4">
              <UserAvatar name={inspectStudent.name} role="student" size="lg" />
              <div>
                <h3 className="text-base font-bold text-slate-900">{inspectStudent.name}</h3>
                <p className="text-xs text-slate-500">{inspectStudent.studentId} • {inspectStudent.academicYear}</p>
                <p className="text-xs text-slate-700 font-semibold mt-0.5">{inspectStudent.sportSpecialization} ({inspectStudent.dormHouse})</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Fitness Score</div>
                <div className="text-lg font-black text-slate-900">{inspectStudent.fitnessScore}%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-slate-400 font-bold uppercase text-[10px]">FitCredits</div>
                <div className="text-lg font-black text-amber-700">⭐ {inspectStudent.fitCredits}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                to="/trainer/assessments"
                className="flex-1 btn-primary text-xs py-2.5 font-bold text-center"
              >
                Perform 5D Assessment
              </Link>
              <Link
                to="/trainer/chat"
                className="btn-secondary text-xs py-2.5 font-bold"
              >
                Chat
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
