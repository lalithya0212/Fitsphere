import React, { useState, useEffect } from 'react';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { UserAvatar } from '../../components/common/UserAvatar';
import { api, TrainerProfileResponse, TrainerProfileUpdateRequest } from '../../services/api';
import {
  ShieldCheck,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Dumbbell,
  Users,
  Edit3,
  X,
  Save,
  Loader2,
  AlertCircle,
  Phone,
  Mail,
  Briefcase
} from 'lucide-react';

export const TrainerProfilePage: React.FC = () => {
  const { currentUser, users } = useFitSphereStore();

  const [profile, setProfile] = useState<TrainerProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form edit state
  const [formData, setFormData] = useState<TrainerProfileUpdateRequest>({
    name: '',
    phone: '',
    qualification: '',
    experienceYears: 1,
    specialization: '',
    bio: '',
    profileImageUrl: ''
  });

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getTrainerProfile();
      setProfile(data);
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        qualification: data.qualification || '',
        experienceYears: data.experienceYears || 1,
        specialization: data.specialization || '',
        bio: data.bio || '',
        profileImageUrl: data.profileImageUrl || ''
      });
    } catch (err: any) {
      console.warn('Could not fetch trainer profile from backend:', err);
      setError(err?.message || 'Failed to connect to backend profile service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const updated = await api.updateTrainerProfile({
        name: formData.name?.trim(),
        phone: formData.phone?.trim(),
        qualification: formData.qualification?.trim(),
        experienceYears: formData.experienceYears !== undefined ? Number(formData.experienceYears) : undefined,
        specialization: formData.specialization?.trim(),
        bio: formData.bio?.trim(),
        profileImageUrl: formData.profileImageUrl?.trim()
      });

      setProfile(updated);
      setIsEditing(false);
      setSuccessMsg('Coach credentials and profile saved to MySQL database successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err?.message || 'Failed to update coach profile.');
    } finally {
      setSaving(false);
    }
  };

  const displayName = profile?.name || currentUser.name;
  const displayEmail = profile?.email || currentUser.email;
  const displayPhone = profile?.phone || currentUser.phone || 'Not specified';
  const displayTrainerId = profile?.trainerId || 'TRN-PENDING';
  const displayQualification = profile?.qualification || 'Certified Collegiate Athletic Coach';
  const displayExp = profile?.experienceYears !== undefined ? `${profile.experienceYears} Years` : '3 Years';
  const displaySpecialization = profile?.specialization || currentUser.sportSpecialization || 'Strength & Conditioning';
  const displayBio = profile?.bio || 'Varsity performance coach dedicated to collegiate athletic excellence.';

  const isVerified = currentUser.verificationStatus === 'verified';
  const assignedCount = isVerified
    ? users.filter(u => u.role === 'student' && (u.assignedTrainerId === currentUser.id || u.assignedTrainerName === currentUser.name)).length
    : 0;

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
            Coach Credentials & Accreditation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Collegiate sports verification records, licensing badges, and coaching authorizations.
          </p>
        </div>

        <button
          onClick={() => {
            if (profile) {
              setFormData({
                name: profile.name || '',
                phone: profile.phone || '',
                qualification: profile.qualification || '',
                experienceYears: profile.experienceYears || 1,
                specialization: profile.specialization || '',
                bio: profile.bio || '',
                profileImageUrl: profile.profileImageUrl || ''
              });
            }
            setIsEditing(true);
          }}
          className="btn-primary text-xs py-2 px-4 flex items-center gap-2 self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Credentials</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs font-bold">{successMsg}</div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="text-xs font-semibold">{error}</div>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs font-bold text-slate-500">Loading coach profile from MySQL...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <UserAvatar name={displayName} role="trainer" size="xl" />

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-950 font-display">{displayName}</h2>
                {isVerified ? (
                  <span className="badge-emerald font-bold text-xs flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Athletic Coach ({currentUser.verificationScore || 85}%)
                  </span>
                ) : currentUser.verificationStatus === 'rejected' ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    Verification Rejected
                  </span>
                ) : (
                  <span className="badge-gold font-bold text-xs flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    Pending Administrator Verification
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {displayTrainerId}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{displayEmail}</span>
                <span>•</span>
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{displayPhone}</span>
              </p>
              <p className="text-xs text-slate-700 font-medium">
                Specialization: <span className="font-bold text-blue-700">{displaySpecialization}</span>
                <span className="text-slate-400 mx-2">•</span>
                Experience: <span className="font-bold text-slate-800">{displayExp}</span>
              </p>
            </div>
          </div>

          {/* Bio block */}
          {displayBio && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs">
              <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block mb-1">
                Coaching Philosophy & Background
              </span>
              <p className="text-slate-600 leading-relaxed">{displayBio}</p>
            </div>
          )}

          {/* Qualifications & metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Certifications & Degrees</span>
              <div className="text-sm font-bold text-slate-900 mt-1 line-clamp-2">
                {displayQualification}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Collegiate Coaching Credential</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Athletes</span>
              <div className="text-2xl font-black text-blue-600 font-display mt-1">
                {assignedCount}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Active Varsity Roster</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Clearance Status</span>
              <div className="text-2xl font-black text-slate-900 font-display mt-1">
                {isVerified ? 'Authorized' : currentUser.verificationStatus === 'rejected' ? 'Declined' : 'Pending'}
              </div>
              <div className="text-[11px] text-emerald-700 font-bold mt-0.5">
                {isVerified ? 'Can award FitCredits' : 'Awaiting Administrator Review'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-950 font-display">Edit Coach Credentials</h3>
                <p className="text-xs text-slate-500">Update coaching records and background in MySQL database.</p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Specialization</label>
                  <input
                    type="text"
                    value={formData.specialization || ''}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="e.g. Strength & Speed Conditioning"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={formData.experienceYears || 0}
                    onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Qualifications & Certifications</label>
                <input
                  type="text"
                  value={formData.qualification || ''}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  placeholder="e.g. M.S. Exercise Physiology, CSCS, USAW Level 2"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Coach Biography</label>
                <textarea
                  rows={3}
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Summary of coaching philosophy, records, or achievements..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary text-xs py-2 px-6 flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{saving ? 'Saving...' : 'Save Credentials'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
