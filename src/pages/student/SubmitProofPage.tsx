import React, { useState } from 'react';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { useLocation, Link } from 'react-router-dom';
import { triggerCelebration } from '../../utils/confetti';
import {
  UploadCloud,
  CheckCircle2,
  Clock,
  Flame,
  Heart,
  Activity,
  Image as ImageIcon,
  Video as VideoIcon,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  MessageSquare,
  AlertCircle,
  Trash2,
  Dumbbell
} from 'lucide-react';

export const SubmitProofPage: React.FC = () => {
  const { currentUser, workouts, proofSubmissions, submitWorkoutProof } = useFitSphereStore();
  const location = useLocation();

  const prefill = location.state as {
    workoutId?: string;
    workoutTitle?: string;
    durationMinutes?: number;
    caloriesBurned?: number;
  } | null;

  // Check if student has an assigned coach
  const hasAssignedCoach = !!(currentUser.assignedTrainerId || currentUser.assignedTrainerName);

  const coachWorkouts = hasAssignedCoach
    ? workouts.filter(
        w => (currentUser.assignedTrainerId && (w as any).trainerId === currentUser.assignedTrainerId) ||
             (currentUser.assignedTrainerName && w.assignedByTrainerName && w.assignedByTrainerName.toLowerCase() === currentUser.assignedTrainerName.toLowerCase())
      )
    : [];

  // STRICT REQUIREMENT: Only the assigned coach workout plan is accepted, no dropdown of other plans
  const givenWorkout = (prefill?.workoutId ? coachWorkouts.find(w => w.id === prefill.workoutId) : null) || coachWorkouts[0] || null;

  const [durationMinutes, setDurationMinutes] = useState(prefill?.durationMinutes || givenWorkout?.durationMinutes || 45);
  const [caloriesBurned, setCaloriesBurned] = useState(prefill?.caloriesBurned || Math.round((givenWorkout?.durationMinutes || 45) * 8.5));
  const [heartRateAvg, setHeartRateAvg] = useState(158);
  const [distanceKm, setDistanceKm] = useState(3.5);
  const [repsCompleted, setRepsCompleted] = useState(24);
  const [athleteNotes, setAthleteNotes] = useState('');

  // Real user upload state (no mock photos)
  const [proofMediaUrl, setProofMediaUrl] = useState<string>('');
  const [proofMediaType, setProofMediaType] = useState<'image' | 'video'>('image');
  const [fileName, setFileName] = useState<string>('');
  const [mediaError, setMediaError] = useState<string | null>(null);

  const [isSuccess, setIsSuccess] = useState(false);

  const myProofs = proofSubmissions.filter(p => p.studentId === currentUser.id);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Detect media type
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      setMediaError('Please upload a valid image (PNG, JPG, WEBP) or video (MP4, WEBM, MOV) file.');
      return;
    }

    setMediaError(null);
    setFileName(file.name);
    setProofMediaType(isVideo ? 'video' : 'image');

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setProofMediaUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearMedia = () => {
    setProofMediaUrl('');
    setFileName('');
    setProofMediaType('image');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!givenWorkout) {
      setMediaError('No active workout plan is available to submit proof for.');
      return;
    }

    if (!proofMediaUrl) {
      setMediaError('Please upload your photo or video proof from your device gallery before submitting.');
      return;
    }

    submitWorkoutProof({
      workoutId: givenWorkout.id,
      workoutTitle: givenWorkout.title,
      proofMediaUrl,
      proofMediaType,
      telemetry: {
        durationMinutes,
        caloriesBurned,
        heartRateAvg,
        distanceKm,
        repsCompleted
      },
      athleteNotes: athleteNotes.trim() || 'Session completed as scheduled on varsity training grounds.'
    });

    triggerCelebration();
    setIsSuccess(true);
    handleClearMedia();
    setAthleteNotes('');
    setTimeout(() => setIsSuccess(false), 7000);
  };

  const coachName = currentUser.assignedTrainerName || 'Your Assigned Coach';

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
          Workout Proof Submission Desk
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Upload your personal workout photo or video proof for {coachName} to review and award FitCredits.
        </p>
      </div>

      {/* Success Alert */}
      {isSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center gap-3 animate-in fade-in zoom-in-95">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <div className="text-xs font-bold">Workout Proof Submitted to Coach Review Queue!</div>
            <div className="text-[11px] text-emerald-800">
              A notification has been sent to {coachName}. Once approved, FitCredits will be credited directly to your wallet.
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Submit Form + Submission History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Submission Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-emerald-600" />
            Log Completed Session Proof
          </h2>

          {!givenWorkout ? (
            /* No workout plan assigned state */
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {!hasAssignedCoach ? 'No Coach Assigned Yet' : 'No Assigned Workout Plan'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                {!hasAssignedCoach
                  ? 'You do not have an assigned faculty coach yet. Workout proofs can only be submitted once a coach is assigned to you by admin and assigns you a training plan.'
                  : 'Proof can only be submitted for a workout plan assigned by your coach. You currently do not have an active workout plan.'}
              </p>
              <div className="mt-4">
                <Link
                  to={!hasAssignedCoach ? '/student/coach' : '/student/chat'}
                  className="btn-primary text-xs py-2 px-4 font-bold inline-flex items-center gap-1.5"
                >
                  <span>{!hasAssignedCoach ? 'Check Coach Status' : 'Message Coach'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* FIXED GIVEN WORKOUT CARD - NO DROPDOWN OF OTHER PLANS */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Target Workout Plan (Assigned)
                </label>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {givenWorkout.sport}
                      </span>
                      <span className="text-xs font-extrabold text-slate-900">
                        {givenWorkout.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Assigned by: Coach {givenWorkout.assignedByTrainerName || coachName} • {givenWorkout.durationMinutes} mins • {givenWorkout.difficulty}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>+{givenWorkout.rewardCredits} Credits</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 italic">
                  Note: Proof submission is locked to this designated workout plan.
                </p>
              </div>

              {/* MEDIA FILE PICKER (GALLERY / CAMERA PHOTO OR VIDEO) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Workout Proof (Photo or Video from Device)
                  </label>
                  {proofMediaUrl && (
                    <button
                      type="button"
                      onClick={handleClearMedia}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                {proofMediaUrl ? (
                  /* Media Preview (Video or Image) */
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950">
                    {proofMediaType === 'video' ? (
                      <video
                        src={proofMediaUrl}
                        controls
                        className="w-full max-h-64 object-contain bg-black"
                      />
                    ) : (
                      <img
                        src={proofMediaUrl}
                        alt="Workout proof"
                        className="w-full max-h-64 object-contain bg-slate-900"
                      />
                    )}
                    <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-white">
                      <span className="flex items-center gap-1.5 truncate max-w-[200px] text-[11px] text-slate-300">
                        {proofMediaType === 'video' ? <VideoIcon className="w-3.5 h-3.5 text-blue-400" /> : <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />}
                        {fileName || 'Selected Media'}
                      </span>
                      <label
                        htmlFor="proof-file-input"
                        className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                      >
                        Change Media
                      </label>
                    </div>
                  </div>
                ) : (
                  /* Empty Upload Box */
                  <label
                    htmlFor="proof-file-input"
                    className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/20 transition-all rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform text-slate-600 group-hover:text-emerald-600">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                      Select Photo or Video Proof from Gallery
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1 max-w-xs">
                      Tap to browse files or camera roll (MP4, MOV, JPG, PNG, WEBP)
                    </span>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                        <ImageIcon className="w-3 h-3 text-emerald-600" /> Photo Proof
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                        <VideoIcon className="w-3 h-3 text-blue-600" /> Video Drill
                      </span>
                    </div>
                  </label>
                )}

                {/* Hidden Native File Input */}
                <input
                  id="proof-file-input"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {mediaError && (
                  <p className="text-[11px] font-bold text-rose-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{mediaError}</span>
                  </p>
                )}
              </div>

              {/* Telemetry Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3 text-slate-400" /> Duration
                  </label>
                  <div className="flex items-baseline gap-1">
                    <input
                      type="number"
                      min={1}
                      value={durationMinutes}
                      onChange={e => setDurationMinutes(Number(e.target.value))}
                      className="w-14 bg-white px-2 py-1 rounded-lg border border-slate-200 text-xs font-black"
                    />
                    <span className="text-[11px] text-slate-500 font-semibold">min</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
                    <Flame className="w-3 h-3 text-amber-500" /> Burn
                  </label>
                  <div className="flex items-baseline gap-1">
                    <input
                      type="number"
                      min={0}
                      value={caloriesBurned}
                      onChange={e => setCaloriesBurned(Number(e.target.value))}
                      className="w-16 bg-white px-2 py-1 rounded-lg border border-slate-200 text-xs font-black"
                    />
                    <span className="text-[11px] text-slate-500 font-semibold">kcal</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
                    <Heart className="w-3 h-3 text-rose-500" /> Avg HR
                  </label>
                  <div className="flex items-baseline gap-1">
                    <input
                      type="number"
                      min={50}
                      max={220}
                      value={heartRateAvg}
                      onChange={e => setHeartRateAvg(Number(e.target.value))}
                      className="w-14 bg-white px-2 py-1 rounded-lg border border-slate-200 text-xs font-black"
                    />
                    <span className="text-[11px] text-slate-500 font-semibold">bpm</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
                    <Activity className="w-3 h-3 text-blue-500" /> Distance
                  </label>
                  <div className="flex items-baseline gap-1">
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      value={distanceKm}
                      onChange={e => setDistanceKm(Number(e.target.value))}
                      className="w-14 bg-white px-2 py-1 rounded-lg border border-slate-200 text-xs font-black"
                    />
                    <span className="text-[11px] text-slate-500 font-semibold">km</span>
                  </div>
                </div>
              </div>

              {/* Athlete Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Athlete Session Reflection / Notes for Coach
                </label>
                <textarea
                  rows={3}
                  value={athleteNotes}
                  onChange={e => setAthleteNotes(e.target.value)}
                  placeholder="How did your form feel? Mention any sprint fatigue, tempo notes, or cues practiced..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={!proofMediaUrl}
                className={`w-full text-xs py-3 font-bold flex items-center justify-center gap-2 mt-2 rounded-xl transition-all ${
                  proofMediaUrl
                    ? 'btn-primary'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Submit Proof for +{givenWorkout.rewardCredits} FitCredits</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </button>
            </form>
          )}
        </div>

        {/* Proof History & Coach Feedback Deck (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Verification History</span>
              <span className="text-xs font-bold text-slate-500">{myProofs.length} Submissions</span>
            </h2>

            {myProofs.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-700">No Submissions Yet</h4>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                  When you submit photos or videos of your completed workouts, they will be logged here for review.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {myProofs.map((proof) => (
                  <div
                    key={proof.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      proof.status === 'approved'
                        ? 'bg-emerald-50/40 border-emerald-200/80'
                        : proof.status === 'pending'
                        ? 'bg-amber-50/40 border-amber-200/80'
                        : 'bg-rose-50/40 border-rose-200/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                            {proof.proofMediaType}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900">{proof.workoutTitle}</h4>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Submitted: {new Date(proof.submittedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        {proof.status === 'approved' && (
                          <span className="badge-emerald font-bold">Approved +{proof.creditsAwarded} pts</span>
                        )}
                        {proof.status === 'pending' && (
                          <span className="badge-gold font-bold animate-pulse">Awaiting Coach</span>
                        )}
                        {proof.status === 'rejected' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Revision Requested
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Telemetry pill */}
                    <div className="mt-2.5 flex items-center gap-3 text-[11px] font-semibold text-slate-600 bg-white/70 p-2 rounded-xl border border-slate-200/50">
                      <span>⏱️ {proof.telemetry.durationMinutes}m</span>
                      <span>🔥 {proof.telemetry.caloriesBurned} kcal</span>
                      <span>❤️ {proof.telemetry.heartRateAvg} bpm</span>
                      {proof.telemetry.distanceKm && <span>📍 {proof.telemetry.distanceKm} km</span>}
                    </div>

                    {/* Coach Feedback Note */}
                    {proof.trainerFeedback && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-white border border-emerald-200 text-xs text-slate-700">
                        <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 mb-0.5">
                          <MessageSquare className="w-3 h-3" /> Coach Feedback ({proof.reviewedByTrainerName || 'Coach'}):
                        </div>
                        <p className="italic text-[11px] leading-relaxed">"{proof.trainerFeedback}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Collegiate Verification Standards */}
          <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-lg text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <ShieldAlert className="w-4 h-4" />
              <span>Collegiate Verification Standards</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              All proof submissions require verifiable telemetry (heart rate, duration, GPS) or photo/video proof uploaded directly from your workout session.
              Coaches review submissions daily to verify compliance and award FitCredits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
