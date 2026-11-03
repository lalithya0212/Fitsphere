import React, { useState } from 'react';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { triggerCelebration } from '../../utils/confetti';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import {
  Activity,
  Award,
  CheckCircle2,
  Save,
  Zap,
  Dumbbell,
  Flame,
  Heart,
  Shield,
  Sparkles
} from 'lucide-react';

export const AssessmentsPage: React.FC = () => {
  const { studentAssessment, updateStudentAssessment, users, currentUser } = useFitSphereStore();

  const isVerified = currentUser.verificationStatus === 'verified';

  // STRICT REQUIREMENT: Only athletes assigned to this coach by admin can be assessed
  const studentUsers = isVerified
    ? users.filter(u => u.role === 'student' && (u.assignedTrainerId === currentUser.id || u.assignedTrainerName === currentUser.name))
    : [];

  const [selectedStudentId, setSelectedStudentId] = useState(studentUsers[0]?.id || studentAssessment.studentId);

  // Editable dimensions state
  const [strength, setStrength] = useState(studentAssessment.current.strength);
  const [speed, setSpeed] = useState(studentAssessment.current.speed);
  const [endurance, setEndurance] = useState(studentAssessment.current.endurance);
  const [flexibility, setFlexibility] = useState(studentAssessment.current.flexibility);
  const [skill, setSkill] = useState(studentAssessment.current.skill);

  const [notes, setNotes] = useState(studentAssessment.trainerNotes);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentStudent = studentUsers.find(s => s.id === selectedStudentId) || studentUsers[0] || null;

  // Radar Data
  const radarData = [
    { dimension: 'Strength', Baseline: studentAssessment.baseline.strength, Current: strength, fullMark: 100 },
    { dimension: 'Speed', Baseline: studentAssessment.baseline.speed, Current: speed, fullMark: 100 },
    { dimension: 'Endurance', Baseline: studentAssessment.baseline.endurance, Current: endurance, fullMark: 100 },
    { dimension: 'Flexibility', Baseline: studentAssessment.baseline.flexibility, Current: flexibility, fullMark: 100 },
    { dimension: 'Skill Dev', Baseline: studentAssessment.baseline.skill, Current: skill, fullMark: 100 },
  ];

  const calculatedFitnessScore = Math.round((strength + speed + endurance + flexibility + skill) / 5);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;
    updateStudentAssessment(
      selectedStudentId,
      { strength, speed, endurance, flexibility, skill },
      notes,
      ['Top-End Sprint Velocity (11.8s)', 'Reactive Jump Agility', 'Aerobic Lactate Recovery'],
      ['Hip Flexor Mobility under Fatigue', 'Deceleration Mechanics']
    );

    triggerCelebration();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 5000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
          Athletic 5D Performance Assessment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Evaluate Strength, Speed, Endurance, Flexibility, and Skill Development. Visualized in a before vs after radar comparison.
        </p>
      </div>

      {!isVerified ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-sm">
            <Shield className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-display">Coach Verification Required</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            Your coaching profile must be verified by the campus administrator before you can evaluate athletes and perform 5D physical diagnostics.
          </p>
        </div>
      ) : studentUsers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
            <Activity className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-display">No Athletes Assigned for Assessment</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            The campus athletics administration has not assigned any student-athletes to your coaching roster yet. Once athletes are assigned by admin, you will be able to perform 5D diagnostic assessments here.
          </p>
        </div>
      ) : (
        <>
          {savedSuccess && currentStudent && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs font-bold">
                Assessment successfully recorded! {currentStudent.name}'s Fitness Score updated to{' '}
                <span className="text-emerald-700 font-black">{calculatedFitnessScore}%</span>.
              </div>
            </div>
          )}

          {/* Main Grid: Evaluation Sliders + Live Radar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sliders Form (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Select Collegiate Athlete
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={e => setSelectedStudentId(e.target.value)}
                    className="mt-1 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none"
                  >
                    {studentUsers.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.sportSpecialization} • {s.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Calculated Score</span>
                  <div className="text-2xl font-black text-emerald-600 font-display">
                    {calculatedFitnessScore}%
                  </div>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                {/* 1. Strength */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Dumbbell className="w-3.5 h-3.5 text-blue-600" /> Strength & Force Production
                    </span>
                    <span className="text-blue-600 font-black">{strength}/100</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    value={strength}
                    onChange={e => setStrength(Number(e.target.value))}
                    className="w-full accent-blue-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400">Baseline: 65 • Compound barbell and collision resistance</span>
                </div>

                {/* 2. Speed */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-emerald-600" /> Speed & Acceleration Biomechanics
                    </span>
                    <span className="text-emerald-600 font-black">{speed}/100</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    value={speed}
                    onChange={e => setSpeed(Number(e.target.value))}
                    className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400">Baseline: 70 • Initial drive phase and top-end velocity</span>
                </div>

                {/* 3. Endurance */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-500" /> Cardiovascular & Lactate Clearance
                    </span>
                    <span className="text-rose-600 font-black">{endurance}/100</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    value={endurance}
                    onChange={e => setEndurance(Number(e.target.value))}
                    className="w-full accent-rose-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400">Baseline: 62 • VO2 Max capacity and repeated sprint ability</span>
                </div>

                {/* 4. Flexibility */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-purple-600" /> Flexibility & Joint Mobility
                    </span>
                    <span className="text-purple-600 font-black">{flexibility}/100</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    value={flexibility}
                    onChange={e => setFlexibility(Number(e.target.value))}
                    className="w-full accent-purple-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400">Baseline: 58 • Hip capsule, ankle dorsiflexion, and thoracic extension</span>
                </div>

                {/* 5. Skill */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-amber-500" /> Sport-Specific Skill & Decision Making
                    </span>
                    <span className="text-amber-600 font-black">{skill}/100</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    value={skill}
                    onChange={e => setSkill(Number(e.target.value))}
                    className="w-full accent-amber-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400">Baseline: 68 • Tactical agility and match execution</span>
                </div>

                {/* Notes */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Coach Diagnostic Notes</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-navy text-xs py-3 font-bold flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Official 5D Evaluation</span>
                </button>
              </form>
            </div>

            {/* Live Radar Chart (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-slate-900">Before vs After Comparison</h3>
                  <span className="badge-emerald font-bold text-[10px]">Live Dynamic Sync</span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Radar displays gray baseline vs blue active scores in real-time as sliders move.
                </p>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#E2E8F0" />
                      <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: '#334155', fontWeight: 700 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                      <Radar name="Baseline (Initial)" dataKey="Baseline" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.25} />
                      <Radar name="Current (Active)" dataKey="Current" stroke="#10B981" fill="#10B981" fillOpacity={0.4} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <h4 className="font-bold text-slate-800 text-[10px] uppercase">Evaluation Protocol</h4>
                <div className="text-slate-600 leading-relaxed text-[11px]">
                  Athletes evaluated quarterly in accordance with NCAA Division athletic training principles.
                  Scores automatically update the student's personal <strong>Fitness Pulse (82%)</strong>.
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

