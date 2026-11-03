import React, { useState } from 'react';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import {
  Settings,
  Shield,
  Coins,
  CheckCircle2,
  Save,
  Bell,
  Sliders
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { resetToDefaults, users, deleteDemoAccounts, restoreDemoAccounts } = useFitSphereStore();

  const [workoutCreditMultiplier, setWorkoutCreditMultiplier] = useState(1.0);
  const [passingExamThreshold, setPassingExamThreshold] = useState(70);
  const [enablePWAOffline, setEnablePWAOffline] = useState(true);
  const [requireConcussionClearance, setRequireConcussionClearance] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
          Athletic Department System Policies
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure FitCredits economy rules, trainer exam thresholds, and collegiate compliance standards.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs font-bold">Department settings saved and active across all student & coach portals.</div>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        {/* Section 1: FitCredits Rules */}
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
            <Coins className="w-5 h-5 text-amber-500" />
            FitCredits Tokenomics & Reward Rules
          </h2>
          <p className="text-xs text-slate-500 mb-4">Set default credit distribution for student workout proofs.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Workout Reward Multiplier (Current: {workoutCreditMultiplier}x)
              </label>
              <select
                value={workoutCreditMultiplier}
                onChange={e => setWorkoutCreditMultiplier(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
              >
                <option value={1.0}>Standard 1.0x (20 Credits/Workout)</option>
                <option value={1.25}>Midterm Surge 1.25x (25 Credits/Workout)</option>
                <option value={1.5}>Championship Finals 1.5x (30 Credits/Workout)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Trainer Exam Passing Threshold (Current: {passingExamThreshold}%)
              </label>
              <input
                type="number"
                min={50}
                max={90}
                value={passingExamThreshold}
                onChange={e => setPassingExamThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Health & Safety Controls */}
        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-purple-600" />
            Medical & Compliance Gatekeeping
          </h2>
          <p className="text-xs text-slate-500 mb-4">Mandatory health screening requirements for varsity tournament entry.</p>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={requireConcussionClearance}
                onChange={e => setRequireConcussionClearance(e.target.checked)}
                className="w-4 h-4 accent-purple-600 rounded"
              />
              <div>
                <span className="font-bold text-slate-900 block">Enforce SCAT-5 Baseline Concussion Screening</span>
                <span className="text-slate-500 text-[11px]">Students without recorded annual baseline cannot register for contact sports tournaments.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={enablePWAOffline}
                onChange={e => setEnablePWAOffline(e.target.checked)}
                className="w-4 h-4 accent-purple-600 rounded"
              />
              <div>
                <span className="font-bold text-slate-900 block">Enable Mobile PWA Offline Proof Logging</span>
                <span className="text-slate-500 text-[11px]">Allows athletes to record GPS runs and reps even when stadium Wi-Fi is unavailable.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Section 3: Collegiate Account & Persona Management */}
        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
            <Sliders className="w-5 h-5 text-indigo-600" />
            Collegiate Account & Persona Management
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Manage user directories, purge demo personas for testing, and restore baseline accounts.
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <div className="text-lg font-black text-slate-900">{users.length}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">Total Accounts</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <div className="text-lg font-black text-amber-600">
                  {users.filter(u => u.isDemo || ['student-1', 'student-2', 'student-3', 'student-4', 'student-5', 'trainer-1', 'trainer-2', 'admin-1'].includes(u.id)).length}
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">Demo Personas</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <div className="text-lg font-black text-emerald-600">
                  {users.filter(u => !u.isDemo && !['student-1', 'student-2', 'student-3', 'student-4', 'student-5', 'trainer-1', 'trainer-2', 'admin-1'].includes(u.id)).length}
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">Custom Registered</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Delete all default demo accounts? Only custom-registered accounts will remain.')) {
                    const res = deleteDemoAccounts();
                    alert(`Removed ${res.count} demo accounts.`);
                  }
                }}
                className="btn-secondary text-xs py-2 px-3 font-bold text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                Delete All Demo Accounts
              </button>

              <button
                type="button"
                onClick={() => {
                  restoreDemoAccounts();
                  alert('Default demo accounts restored.');
                }}
                className="btn-secondary text-xs py-2 px-3 font-bold text-emerald-700 border-emerald-200 hover:bg-emerald-50"
              >
                Restore Default Demo Accounts
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset all demo data and store to initial collegiate state?')) {
                resetToDefaults();
              }
            }}
            className="btn-secondary text-xs py-2.5 px-4 font-bold text-slate-600 border-slate-300 hover:bg-slate-100"
          >
            Reset Entire System to Default Demo State
          </button>

          <button
            type="submit"
            className="btn-primary text-xs py-2.5 px-6 font-bold flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Policies</span>
          </button>
        </div>
      </form>
    </div>
  );
};
