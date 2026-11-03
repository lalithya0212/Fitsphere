import React, { useState } from 'react';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { WorkoutPlan, DrillItem } from '../../types';
import { triggerCelebration } from '../../utils/confetti';
import {
  ClipboardList,
  Plus,
  Dumbbell,
  Clock,
  Flame,
  CheckCircle2,
  Trash2,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SportMediaBanner } from '../../components/common/SportMediaBanner';
import { ImageUploadField } from '../../components/common/ImageUploadField';

export const TrainingPlansPage: React.FC = () => {
  const { workouts, createWorkoutPlan, currentUser } = useFitSphereStore();

  const isVerified = currentUser.verificationStatus === 'verified';

  // Only show workouts published by this coach
  const myWorkouts = workouts.filter(
    w => (w as any).trainerId === currentUser.id || w.assignedByTrainerName === currentUser.name
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [sport, setSport] = useState('Football');
  const [targetAudience, setTargetAudience] = useState<WorkoutPlan['targetAudience']>('Football Squad');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Advanced');
  const [intensity, setIntensity] = useState<'Low' | 'Moderate' | 'High' | 'Extreme'>('High');
  const [rewardCredits, setRewardCredits] = useState(20);
  const [description, setDescription] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');

  // Drills builder state
  const [drills, setDrills] = useState<DrillItem[]>([
    { id: 'd-1', name: 'Sprint Ladder Shuffle', targetMuscle: 'Calves & Adductors', sets: 4, reps: '30 sec', restSeconds: 45, coachingCue: 'Quick light ground contacts' },
    { id: 'd-2', name: 'Nordic Hamstring Lowers', targetMuscle: 'Biceps Femoris', sets: 4, reps: '6 reps', restSeconds: 60, coachingCue: 'Fight the eccentric descent' }
  ]);

  const [newDrillName, setNewDrillName] = useState('');
  const [newDrillMuscle, setNewDrillMuscle] = useState('');
  const [newDrillSets, setNewDrillSets] = useState(3);
  const [newDrillReps, setNewDrillReps] = useState('10 reps');
  const [newDrillRest, setNewDrillRest] = useState(60);
  const [newDrillCue, setNewDrillCue] = useState('');

  const handleAddDrill = () => {
    if (!newDrillName.trim()) return;
    const newDrill: DrillItem = {
      id: `d-${Date.now()}`,
      name: newDrillName,
      targetMuscle: newDrillMuscle || 'Full Body',
      sets: newDrillSets,
      reps: newDrillReps,
      restSeconds: newDrillRest,
      coachingCue: newDrillCue || 'Maintain upright athletic posture'
    };
    setDrills([...drills, newDrill]);
    setNewDrillName('');
    setNewDrillMuscle('');
    setNewDrillCue('');
  };

  const handleRemoveDrill = (id: string) => {
    setDrills(drills.filter(d => d.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createWorkoutPlan({
      title,
      sport,
      targetAudience,
      durationMinutes,
      difficulty,
      rewardCredits,
      intensity,
      description: description || 'High-performance collegiate drill sequence targeting speed and durability.',
      bannerUrl: bannerUrl.trim(),
      drills
    });

    triggerCelebration();
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setBannerUrl('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
            Varsity Training Plans & Drills
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Build and publish periodized workout plans and drill sequences for your student athlete squads.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary text-xs py-2.5 px-4 font-bold flex items-center gap-2 shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Workout Plan</span>
        </button>
      </div>

      {!isVerified && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-center gap-3 animate-in fade-in">
          <Clock className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="text-xs font-bold">
            Coach Verification Pending: Your account is awaiting administrator clearance. Once verified and athletes are assigned by admin, your plans will be directly available to your squads.
          </div>
        </div>
      )}

      {/* Plans List */}
      {myWorkouts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4 border border-purple-100">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-display">No Workout Plans Created Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            Click &quot;+ Create New Workout Plan&quot; above to create and publish your first training plan and drill sequences for your athletes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myWorkouts.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between"
          >
            {/* Workout Banner with Gallery Upload or Sport Emoji Fallback */}
            <SportMediaBanner
              bannerUrl={plan.bannerUrl}
              sport={plan.sport}
              category={plan.difficulty}
              title={plan.title}
              className="h-40"
            >
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                  {plan.sport}
                </span>
                <span className="badge-gold text-[10px] font-bold">
                  +{plan.rewardCredits} Credits
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="text-base font-extrabold">{plan.title}</h3>
                <div className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                  <span>⏱️ {plan.durationMinutes} Mins</span>
                  <span>• {plan.difficulty}</span>
                  <span>• {plan.targetAudience}</span>
                </div>
              </div>
            </SportMediaBanner>

            <div className="p-5">
              <p className="text-xs text-slate-600 mb-4">{plan.description}</p>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Included Drills ({plan.drills.length})
                </span>
                {plan.drills.slice(0, 3).map((d, i) => (
                  <div key={d.id} className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{d.name}</span>
                    <span className="text-slate-500">{d.sets} × {d.reps}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Create Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-slate-200 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 font-display">Create Collegiate Workout Plan</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Plan Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Football Speed & Acceleration Matrix"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sport</label>
                  <select
                    value={sport}
                    onChange={e => setSport(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  >
                    <option value="Football">Football</option>
                    <option value="Track & Field">Track & Field</option>
                    <option value="Strength & Conditioning">Strength & Conditioning</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Swimming">Swimming</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Squad</label>
                  <select
                    value={targetAudience}
                    onChange={e => setTargetAudience(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  >
                    <option value="Football Squad">Football Squad</option>
                    <option value="Track & Field">Track & Field</option>
                    <option value="All Athletes">All Athletes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={e => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Reward Credits</label>
                  <input
                    type="number"
                    value={rewardCredits}
                    onChange={e => setRewardCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-amber-50 text-amber-900"
                  />
                </div>
              </div>

              {/* Gallery Image Upload Field */}
              <ImageUploadField
                label="Workout Reference Image"
                value={bannerUrl}
                onChange={setBannerUrl}
                sport={sport}
                category={difficulty}
                helperText="Upload reference exercise photo from gallery (optional). If left empty, an official sport icon & emoji will be displayed."
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Focus areas, biomechanical goals, and intensity requirements..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              {/* Drills Builder */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs font-bold text-slate-800 mb-2">Build Drills ({drills.length})</div>
                <div className="space-y-2 mb-3">
                  {drills.map((d) => (
                    <div key={d.id} className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{d.name}</span>
                        <span className="text-slate-400 text-[11px] ml-2">({d.sets} sets × {d.reps})</span>
                      </div>
                      <button type="button" onClick={() => handleRemoveDrill(d.id)} className="text-rose-500 hover:text-rose-700">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add drill form */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Drill name (e.g. Box Jumps)"
                    value={newDrillName}
                    onChange={e => setNewDrillName(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Target muscle / area"
                    value={newDrillMuscle}
                    onChange={e => setNewDrillMuscle(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs mt-2">
                  <input
                    type="number"
                    placeholder="Sets"
                    value={newDrillSets}
                    onChange={e => setNewDrillSets(Number(e.target.value))}
                    className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Reps (e.g. 8 reps)"
                    value={newDrillReps}
                    onChange={e => setNewDrillReps(e.target.value)}
                    className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddDrill}
                    className="btn-navy text-xs py-1 px-3 font-bold"
                  >
                    + Add Drill
                  </button>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-xs py-2.5 px-4 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary text-xs py-2.5 font-bold"
                >
                  Publish Workout Plan (+{rewardCredits} Credits)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
