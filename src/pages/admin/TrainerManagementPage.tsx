import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { TrainerVerificationApplication } from '../../types';
import { UserAvatar } from '../../components/common/UserAvatar';
import { triggerCelebration } from '../../utils/confetti';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Search,
  Plus,
  ArrowRight,
  Mail,
  UserCheck,
  X,
  Trash2
} from 'lucide-react';

export const TrainerManagementPage: React.FC = () => {
  const { trainerApplications, verifyTrainer, users, deleteUser } = useFitSphereStore();
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');
  const [inspectApp, setInspectApp] = useState<TrainerVerificationApplication | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredApps = trainerApplications.filter(a => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  const handleApprove = (app: TrainerVerificationApplication) => {
    verifyTrainer(app.id, 'approve');
    triggerCelebration();
    setActionSuccess(`Verified Coach ${app.trainerName}! Granted official collegiate coaching authorization.`);
    setTimeout(() => setActionSuccess(null), 5000);
    setInspectApp(null);
  };

  const handleReject = (app: TrainerVerificationApplication) => {
    verifyTrainer(app.id, 'reject');
    setActionSuccess(`Application rejected for ${app.trainerName}.`);
    setTimeout(() => setActionSuccess(null), 5000);
    setInspectApp(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
            Trainer Accreditation & Verification System
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Evaluate collegiate coach applications and verify their 10-Question Sports Science Skill Examination results.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold shrink-0">
          {(['all', 'pending', 'verified', 'rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl capitalize transition-all ${
                filter === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs font-bold">{actionSuccess}</div>
        </div>
      )}

      {/* Verification Workflow Steps Callout */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block mb-3">
          Standard Collegiate Accreditation Protocol
        </span>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold inline-flex items-center justify-center mb-1">
              1
            </span>
            <div className="font-bold text-slate-900">Trainer Registration</div>
            <div className="text-[10px] text-slate-400">Profile & credentials</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold inline-flex items-center justify-center mb-1">
              2
            </span>
            <div className="font-bold text-slate-900">Select Sport</div>
            <div className="text-[10px] text-slate-400">Specialization tagged</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold inline-flex items-center justify-center mb-1">
              3
            </span>
            <div className="font-bold text-slate-900">10-Q Skill Exam</div>
            <div className="text-[10px] text-slate-400">Sports science & injury</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold inline-flex items-center justify-center mb-1">
              4
            </span>
            <div className="font-bold text-slate-900">Score Evaluation</div>
            <div className="text-[10px] text-slate-400">Threshold: ≥ 70%</div>
          </div>

          <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 font-bold">
            <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold inline-flex items-center justify-center mb-1">
              5
            </span>
            <div className="font-bold">Admin Clearance</div>
            <div className="text-[10px] text-purple-700">Official verification</div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Trainer Candidate</th>
                <th className="py-3.5 px-4">Sport Specialization</th>
                <th className="py-3.5 px-4">Experience</th>
                <th className="py-3.5 px-4">Exam Score</th>
                <th className="py-3.5 px-4">Clearance Status</th>
                <th className="py-3.5 px-6 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 px-6 text-center text-slate-400">
                    <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <div className="text-sm font-bold text-slate-700">No Coach Applications Found</div>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                      When coaches register and complete their 10-Question Sports Science Examination, their verification requests will appear here in real-time.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={app.trainerName} role="trainer" size="md" />
                        <div>
                          <div className="font-bold text-slate-900">{app.trainerName}</div>
                          <div className="text-[10px] text-slate-400">{app.trainerEmail}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-bold text-slate-900">
                      {app.sportSpecialization}
                    </td>

                    <td className="py-4 px-4">
                      {app.experienceYears} Years
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm">{app.assessmentScore}%</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                          app.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {app.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {app.status === 'verified' ? (
                        <span className="badge-emerald font-bold flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : app.status === 'pending' ? (
                        <span className="badge-gold font-bold flex items-center gap-1 w-fit animate-pulse">
                          <Clock className="w-3.5 h-3.5" /> Pending Clearance
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Rejected
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setInspectApp(app)}
                          className="btn-secondary text-[11px] py-1.5 px-3 font-semibold"
                        >
                          Inspect Exam
                        </button>

                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(app)}
                              className="btn-primary text-[11px] py-1.5 px-3 font-bold"
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => handleReject(app)}
                              className="btn-secondary text-[11px] py-1.5 px-2 text-rose-600"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Faculty Coaches Roster */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Active Faculty Coaches & Trainers</h3>
            <p className="text-xs text-slate-500">Currently registered collegiate coaches with active workspace credentials.</p>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            {users.filter(u => u.role === 'trainer').length} Coaches
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {users.filter(u => u.role === 'trainer').length === 0 ? (
            <div className="py-8 px-6 text-center text-slate-400 text-xs">
              No faculty coaches registered yet.
            </div>
          ) : (
            users.filter(u => u.role === 'trainer').map(trainer => {
              const isCoachVerified = trainer.verificationStatus === 'verified';
              const assignedAthleteCount = users.filter(
                u => u.role === 'student' && (u.assignedTrainerId === trainer.id || u.assignedTrainerName === trainer.name)
              ).length;

              return (
                <div key={trainer.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <UserAvatar name={trainer.name} role="trainer" size="md" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{trainer.name}</h4>
                        {isCoachVerified ? (
                          <span className="badge-emerald text-[10px] font-bold">Verified Coach</span>
                        ) : trainer.verificationStatus === 'rejected' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Rejected
                          </span>
                        ) : (
                          <span className="badge-gold text-[10px] font-bold">Pending Clearance</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {trainer.email} • {trainer.sportSpecialization || trainer.department} • <strong className="text-slate-700">{assignedAthleteCount} Assigned Athletes</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isCoachVerified ? (
                      <Link
                        to="/admin/students"
                        className="btn-secondary text-[11px] py-1.5 px-3 font-semibold text-blue-700"
                      >
                        Assign Athletes ({assignedAthleteCount})
                      </Link>
                    ) : (
                      <span className="text-[11px] text-amber-700 font-semibold px-2">
                        Requires Admin Verification
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Remove coach "${trainer.name}" from university faculty?`)) {
                          deleteUser(trainer.id);
                          setActionSuccess(`Coach "${trainer.name}" removed.`);
                          setTimeout(() => setActionSuccess(null), 3000);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title={`Delete coach account ${trainer.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Inspect Application Modal */}
      {inspectApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                Trainer Credential Assessment Review
              </span>
              <button onClick={() => setInspectApp(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 flex items-center gap-4">
              <UserAvatar name={inspectApp.trainerName} role="trainer" size="lg" />
              <div>
                <h3 className="text-base font-bold text-slate-900">{inspectApp.trainerName}</h3>
                <p className="text-xs text-slate-500">{inspectApp.trainerEmail}</p>
                <p className="text-xs text-purple-700 font-bold mt-0.5">{inspectApp.sportSpecialization}</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">10-Question Exam Score:</span>
                <span className="font-black text-emerald-600 text-sm">{inspectApp.assessmentScore}% (Verified)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Certifications:</span>
                <span className="font-bold text-slate-900">{inspectApp.certifications.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Experience:</span>
                <span className="font-bold text-slate-900">{inspectApp.experienceYears} Years</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 block mb-1">Candidate Bio:</span>
                <p className="italic text-[11px] leading-relaxed">"{inspectApp.bio}"</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleReject(inspectApp)}
                className="btn-secondary text-xs py-2.5 px-4 text-rose-600 font-semibold"
              >
                Reject Application
              </button>
              <button
                onClick={() => handleApprove(inspectApp)}
                className="flex-1 btn-primary text-xs py-2.5 font-bold"
              >
                Verify & Authorize Faculty Clearance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
