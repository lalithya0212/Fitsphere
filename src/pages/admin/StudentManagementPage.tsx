import React, { useState } from 'react';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { UserProfile } from '../../types';
import { triggerCelebration } from '../../utils/confetti';
import { UserAvatar } from '../../components/common/UserAvatar';
import {
  GraduationCap,
  Search,
  Filter,
  Dumbbell,
  Coins,
  Shield,
  CheckCircle2,
  Sparkles,
  X,
  Award,
  Trash2,
  UserX
} from 'lucide-react';

export const StudentManagementPage: React.FC = () => {
  const { users, assignTrainerToStudent, unassignTrainerFromStudent, grantAdminBonusCredits, deleteUser } = useFitSphereStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('All');

  // Assign trainer modal state
  const [assigningStudent, setAssigningStudent] = useState<UserProfile | null>(null);
  const [selectedTrainerId, setSelectedTrainerId] = useState('');

  // Bonus credits modal state
  const [bonusStudent, setBonusStudent] = useState<UserProfile | null>(null);
  const [bonusAmount, setBonusAmount] = useState(100);
  const [bonusReason, setBonusReason] = useState('Inter-University Tournament Representation');

  const [notice, setNotice] = useState<string | null>(null);

  const students = users.filter(u => u.role === 'student');
  const trainers = users.filter(u => u.role === 'trainer' && u.verificationStatus === 'verified');

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.studentId && s.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.sportSpecialization && s.sportSpecialization.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMajor = selectedMajor === 'All' || s.department === selectedMajor;

    return matchesSearch && matchesMajor;
  });

  const handleAssignTrainer = () => {
    if (!assigningStudent) return;
    if (!selectedTrainerId) {
      unassignTrainerFromStudent(assigningStudent.id);
      setNotice(`Coach assignment removed for ${assigningStudent.name}. Student is now waiting for coach assignment.`);
    } else {
      assignTrainerToStudent(assigningStudent.id, selectedTrainerId);
      const coach = trainers.find(t => t.id === selectedTrainerId);
      setNotice(`Assigned ${coach?.name || 'Coach'} to ${assigningStudent.name}!`);
    }
    setTimeout(() => setNotice(null), 4000);
    setAssigningStudent(null);
  };

  const handleRemoveCoach = (student: UserProfile) => {
    unassignTrainerFromStudent(student.id);
    setNotice(`Removed assigned coach from ${student.name}. Student page is now waiting for coach allocation.`);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleGrantBonus = () => {
    if (!bonusStudent) return;
    grantAdminBonusCredits(bonusStudent.id, bonusAmount, bonusReason);
    triggerCelebration();
    setNotice(`Granted +${bonusAmount} FitCredits to ${bonusStudent.name} (${bonusReason})!`);
    setTimeout(() => setNotice(null), 4000);
    setBonusStudent(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
            Student-Athlete Campus Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage athletic eligibility, assign faculty coaches, and award administrative honor roll FitCredits.
          </p>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs font-bold">{notice}</div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/80">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search student athlete name, roll #, sport..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500">Major:</span>
          <select
            value={selectedMajor}
            onChange={e => setSelectedMajor(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none"
          >
            <option value="All">All Academic Departments</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Biomedical Engineering">Biomedical Engineering</option>
            <option value="Business & Finance">Business & Finance</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Student Athlete</th>
                <th className="py-3.5 px-4">Major & Dorm</th>
                <th className="py-3.5 px-4">Sport</th>
                <th className="py-3.5 px-4">Assigned Coach</th>
                <th className="py-3.5 px-4">Fitness Score</th>
                <th className="py-3.5 px-4">FitCredits</th>
                <th className="py-3.5 px-6 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 px-6 text-center text-slate-400">
                    <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <div className="text-sm font-bold text-slate-700">No Student-Athletes Registered</div>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                      Real-time student registrations will appear here. Newly registered students remain unassigned until you designate an accredited coach.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={student.name}
                          role="student"
                          avatar={student.avatar}
                          size="md"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{student.name}</div>
                          <div className="text-[10px] text-slate-400">{student.studentId || 'New Athlete'} • {student.academicYear || 'Year 1'}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{student.department}</div>
                      <div className="text-[11px] text-slate-500">{student.dormHouse || 'Campus Quad'}</div>
                    </td>

                    <td className="py-4 px-4 font-bold text-slate-900">
                      {student.sportSpecialization}
                    </td>

                    <td className="py-4 px-4">
                      {student.assignedTrainerName ? (
                        <div className="inline-flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg text-[11px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {student.assignedTrainerName}
                          </span>
                          <button
                            onClick={() => handleRemoveCoach(student)}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Remove assigned coach from student"
                          >
                            <UserX className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-lg text-[11px]">
                          ⚠️ Waiting for Coach
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 font-bold text-slate-900">
                      {student.fitnessScore || 75}%
                    </td>

                    <td className="py-4 px-4 font-black text-amber-700">
                      ⭐ {student.fitCredits || 0}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setAssigningStudent(student);
                            setSelectedTrainerId(student.assignedTrainerId || (trainers[0]?.id || ''));
                          }}
                          className={`text-[11px] py-1.5 px-3 font-bold rounded-xl transition-all ${
                            student.assignedTrainerName
                              ? 'btn-secondary text-slate-700'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                          }`}
                        >
                          {student.assignedTrainerName ? 'Reassign / Remove Coach' : 'Assign Coach'}
                        </button>

                        <button
                          onClick={() => setBonusStudent(student)}
                          className="btn-gold text-[11px] py-1.5 px-2.5 font-bold"
                        >
                          + Grant Credits
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Remove student athlete "${student.name}" from university records?`)) {
                              deleteUser(student.id);
                              setNotice(`Student "${student.name}" removed.`);
                              setTimeout(() => setNotice(null), 3000);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title={`Delete student account ${student.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Coach Modal */}
      {assigningStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {assigningStudent.assignedTrainerName ? 'Reassign Faculty Coach' : 'Assign Faculty Coach'}
              </h3>
              <button onClick={() => setAssigningStudent(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 space-y-3">
              <p className="text-xs text-slate-600">
                Assign a certified university coach to oversee <strong>{assigningStudent.name}</strong> ({assigningStudent.sportSpecialization})'s training and workout proof evaluations.
              </p>

              {trainers.length === 0 ? (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                  No verified faculty coaches are currently registered. Approve pending coach applications in the Trainer Accreditation page first.
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Coach</label>
                  <select
                    value={selectedTrainerId}
                    onChange={e => setSelectedTrainerId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-900"
                  >
                    <option value="">-- No Coach (Unassign / Waiting Status) --</option>
                    {trainers.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.sportSpecialization || 'Varsity Athletics'})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              {assigningStudent.assignedTrainerId ? (
                <button
                  type="button"
                  onClick={() => {
                    handleRemoveCoach(assigningStudent);
                    setAssigningStudent(null);
                  }}
                  className="px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>Remove Coach</span>
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAssigningStudent(null)}
                  className="btn-secondary text-xs py-2 px-3"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={trainers.length === 0}
                  onClick={handleAssignTrainer}
                  className="btn-primary text-xs py-2 px-4 font-bold disabled:opacity-40"
                >
                  Save Allocation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grant Bonus Credits Modal */}
      {bonusStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-500" />
                Dean Athletic Grant
              </h3>
              <button onClick={() => setBonusStudent(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <p className="text-slate-600">
                Grant administrative bonus FitCredits to <strong>{bonusStudent.name}</strong> for university representation or athletic excellence.
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bonus Credits Amount</label>
                <input
                  type="number"
                  value={bonusAmount}
                  onChange={e => setBonusAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-black text-amber-800 bg-amber-50 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Citation / Reason</label>
                <input
                  type="text"
                  value={bonusReason}
                  onChange={e => setBonusReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setBonusStudent(null)}
                className="btn-secondary text-xs py-2.5 px-4 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleGrantBonus}
                className="flex-1 btn-gold text-xs py-2.5 font-bold"
              >
                Award +{bonusAmount} FitCredits
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
