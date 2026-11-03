import React, { useState } from 'react';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { triggerCelebration } from '../../utils/confetti';
import { useNavigate } from 'react-router-dom';
import { UserAvatar } from '../../components/common/UserAvatar';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Flame,
  Heart,
  Activity,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye
} from 'lucide-react';

export const ProofReviewDeck: React.FC = () => {
  const { proofSubmissions, reviewWorkoutProof, switchRole, currentUser, users } = useFitSphereStore();
  const navigate = useNavigate();

  const isVerified = currentUser.verificationStatus === 'verified';

  // STRICT REQUIREMENT: Only review proofs from athletes assigned to this coach
  const assignedStudentIds = new Set(
    users
      .filter(u => u.role === 'student' && (u.assignedTrainerId === currentUser.id || u.assignedTrainerName === currentUser.name))
      .map(s => s.id)
  );

  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [activeFeedback, setActiveFeedback] = useState<{ [proofId: string]: string }>({});
  const [customCredits, setCustomCredits] = useState<{ [proofId: string]: number }>({});
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredProofs = isVerified
    ? proofSubmissions.filter(p => p.status === filter && assignedStudentIds.has(p.studentId))
    : [];

  const quickFeedbackOptions = [
    "Flawless sprint cadence and deceleration control! Awarded full credits.",
    "Great work staying low through the first 10m. Shin angles were clean.",
    "Form broke down slightly on set 3. Please re-submit with a side camera angle.",
    "Exceptional aerobic recovery between intervals. Paced to perfection!"
  ];

  const handleApprove = (proofId: string, defaultCredits: number, studentName: string) => {
    const feedback = activeFeedback[proofId] || "Excellent session execution and telemetry compliance. Verified by Coach.";
    const credits = customCredits[proofId] !== undefined ? customCredits[proofId] : defaultCredits;

    reviewWorkoutProof(proofId, 'approve', feedback, credits);
    triggerCelebration();

    setActionSuccess(`Approved workout proof for ${studentName}! Awarded +${credits} FitCredits.`);
    setTimeout(() => setActionSuccess(null), 6000);
  };

  const handleReject = (proofId: string, studentName: string) => {
    const feedback = activeFeedback[proofId] || "Please re-submit with telemetry heart rate chart clearly visible.";
    reviewWorkoutProof(proofId, 'reject', feedback);

    setActionSuccess(`Revision requested for ${studentName}. Feedback sent to student portal.`);
    setTimeout(() => setActionSuccess(null), 6000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
            Student Workout Proof Review Deck
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review submitted telemetry and photos. Approved sessions automatically add FitCredits to student wallets.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold shrink-0">
          {(['pending', 'approved', 'rejected'] as const).map(tab => {
            const count = proofSubmissions.filter(p => p.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl capitalize transition-all flex items-center gap-1.5 ${
                  filter === tab
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{tab}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  tab === 'pending' && count > 0 ? 'bg-amber-400 text-slate-950 animate-pulse' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Success Notice */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold">{actionSuccess}</span>
        </div>
      )}

      {/* Proof Review Cards Stream */}
      <div className="space-y-6">
        {filteredProofs.map((proof) => {
          const currentCreditAward = customCredits[proof.id] !== undefined ? customCredits[proof.id] : proof.creditsAwarded;

          return (
            <div
              key={proof.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-7"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Media Proof Preview (Left) */}
                <div className="lg:w-72 shrink-0">
                  <div className="relative h-52 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group">
                    {proof.proofMediaType === 'video' ? (
                      <video
                        src={proof.proofMediaUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={proof.proofMediaUrl}
                        alt={proof.workoutTitle}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-2 left-2 pointer-events-none">
                      <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                        {proof.proofMediaType} proof
                      </span>
                    </div>
                  </div>

                  {/* Telemetry Summary Pill */}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Duration</div>
                      <div className="font-black text-slate-800">{proof.telemetry.durationMinutes} mins</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Burn</div>
                      <div className="font-black text-amber-700">{proof.telemetry.caloriesBurned} kcal</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Avg Heart Rate</div>
                      <div className="font-black text-rose-600">{proof.telemetry.heartRateAvg} bpm</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Distance / Reps</div>
                      <div className="font-black text-blue-600">
                        {proof.telemetry.distanceKm ? `${proof.telemetry.distanceKm} km` : `${proof.telemetry.repsCompleted} reps`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Proof Evaluation Details (Right) */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* Student Info Bar */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={proof.studentName} role="student" size="md" />
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{proof.studentName}</h3>
                          <p className="text-[11px] text-slate-500">
                            Submitted: {new Date(proof.submittedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div>
                        {proof.status === 'approved' && (
                          <span className="badge-emerald font-bold text-xs">Approved (+{proof.creditsAwarded} pts)</span>
                        )}
                        {proof.status === 'pending' && (
                          <span className="badge-gold font-bold text-xs animate-pulse">Awaiting Review</span>
                        )}
                        {proof.status === 'rejected' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Revision Required
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3">
                      <h4 className="text-base font-extrabold text-slate-950 font-display">
                        {proof.workoutTitle}
                      </h4>
                      <div className="mt-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
                        <span className="font-bold text-slate-900 text-[10px] uppercase tracking-wider block mb-0.5">
                          Athlete Reflection:
                        </span>
                        <p className="italic leading-relaxed">"{proof.athleteNotes}"</p>
                      </div>
                    </div>

                    {/* Review Feedback & Credit Input (Only when Pending) */}
                    {proof.status === 'pending' && (
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700">
                            Coaching Feedback & Form Evaluation
                          </label>
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="text-slate-500 font-semibold">Credits to award:</span>
                            <input
                              type="number"
                              value={currentCreditAward}
                              onChange={e =>
                                setCustomCredits(prev => ({
                                  ...prev,
                                  [proof.id]: Number(e.target.value)
                                }))
                              }
                              className="w-16 px-2 py-1 bg-amber-50 border border-amber-300 rounded-lg text-xs font-black text-amber-900"
                            />
                          </div>
                        </div>

                        {/* Quick feedback chips */}
                        <div className="flex flex-wrap gap-1.5">
                          {quickFeedbackOptions.map((opt, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() =>
                                setActiveFeedback(prev => ({ ...prev, [proof.id]: opt }))
                              }
                              className="text-[10px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 transition-colors"
                            >
                              "{opt.slice(0, 35)}..."
                            </button>
                          ))}
                        </div>

                        <textarea
                          rows={2}
                          value={activeFeedback[proof.id] || ''}
                          onChange={e =>
                            setActiveFeedback(prev => ({ ...prev, [proof.id]: e.target.value }))
                          }
                          placeholder="Write feedback for athlete (e.g., 'Great hip drive, keep shoulders packed')..."
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {/* Display existing feedback if already approved or rejected */}
                    {proof.trainerFeedback && proof.status !== 'pending' && (
                      <div className="mt-4 p-3 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs text-slate-800">
                        <span className="font-bold text-blue-900 block text-[10px] uppercase mb-0.5">
                          Evaluated by {proof.reviewedByTrainerName || 'Coach'}:
                        </span>
                        <p className="italic">"{proof.trainerFeedback}"</p>
                      </div>
                    )}
                  </div>

                  {/* Actions for Pending */}
                  {proof.status === 'pending' && (
                    <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
                      <button
                        onClick={() => handleReject(proof.id, proof.studentName)}
                        className="btn-secondary text-xs py-2.5 px-4 font-bold text-rose-700 hover:bg-rose-50 border-rose-200"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Request Revision</span>
                      </button>

                      <button
                        onClick={() => handleApprove(proof.id, proof.creditsAwarded, proof.studentName)}
                        className="btn-primary text-xs py-2.5 px-6 font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve & Award +{currentCreditAward} FitCredits</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredProofs.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <CheckCircle2 className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold text-slate-800">
              {!isVerified
                ? 'Coach Verification Required'
                : assignedStudentIds.size === 0
                ? 'No Athletes Assigned Yet'
                : `No ${filter} workout proofs`}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {!isVerified
                ? 'Your coaching account is awaiting verification by the administrator before you can review student workout proofs.'
                : assignedStudentIds.size === 0
                ? 'No student-athletes have been assigned to your coaching roster yet by the campus administration.'
                : 'When your assigned student athletes submit photos or telemetry from workouts, they will appear in this review deck.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
