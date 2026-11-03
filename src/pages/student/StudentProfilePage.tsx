import React, { useState, useEffect } from 'react';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { UserAvatar } from '../../components/common/UserAvatar';
import { api, StudentProfileResponse, StudentProfileUpdateRequest } from '../../services/api';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Calendar,
  BookOpen,
  Target,
  FileText,
  Phone,
  Mail,
  Edit3,
  X,
  Save,
  Loader2,
  AlertCircle,
  Clock,
  IdCard
} from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { currentUser } = useFitSphereStore();

  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form edit state
  const [formData, setFormData] = useState<StudentProfileUpdateRequest>({
    name: '',
    phone: '',
    department: '',
    course: '',
    yearOfStudy: 1,
    dateOfBirth: '',
    gender: 'Other',
    fitnessGoal: '',
    bio: '',
    profileImageUrl: ''
  });

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getStudentProfile();
      setProfile(data);
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        department: data.department || '',
        course: data.course || '',
        yearOfStudy: data.yearOfStudy || 1,
        dateOfBirth: data.dateOfBirth || '',
        gender: data.gender || 'Other',
        fitnessGoal: data.fitnessGoal || '',
        bio: data.bio || '',
        profileImageUrl: data.profileImageUrl || ''
      });
    } catch (err: any) {
      console.warn('Could not fetch student profile from backend:', err);
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
      const updated = await api.updateStudentProfile({
        name: formData.name?.trim(),
        phone: formData.phone?.trim(),
        department: formData.department?.trim(),
        course: formData.course?.trim(),
        yearOfStudy: formData.yearOfStudy ? Number(formData.yearOfStudy) : undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender?.trim(),
        fitnessGoal: formData.fitnessGoal?.trim(),
        bio: formData.bio?.trim(),
        profileImageUrl: formData.profileImageUrl?.trim()
      });

      setProfile(updated);
      setIsEditing(false);
      setSuccessMsg('Athletic profile saved and synced to database successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err?.message || 'Failed to update student profile.');
    } finally {
      setSaving(false);
    }
  };

  // Fallback values if backend response is loading or error
  const displayName = profile?.name || currentUser.name;
  const displayEmail = profile?.email || currentUser.email;
  const displayPhone = profile?.phone || currentUser.phone || 'Not specified';
  const displayStudentId = profile?.studentId || currentUser.studentId || 'ATH-PENDING';
  const displayDepartment = profile?.department || currentUser.department || 'Athletics & Physical Education';
  const displayCourse = profile?.course || 'Collegiate Athletic Program';
  const displayYear = profile?.yearOfStudy ? `Year ${profile.yearOfStudy}` : 'Year 1';
  const displayGoal = profile?.fitnessGoal || 'General Fitness & Conditioning';
  const displayBio = profile?.bio || 'FitSphere collegiate student-athlete.';

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
            Student-Athlete Profile & Clearances
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time MySQL records, collegiate athletic clearances, and academic standing.
          </p>
        </div>

        <button
          onClick={() => {
            if (profile) {
              setFormData({
                name: profile.name || '',
                phone: profile.phone || '',
                department: profile.department || '',
                course: profile.course || '',
                yearOfStudy: profile.yearOfStudy || 1,
                dateOfBirth: profile.dateOfBirth || '',
                gender: profile.gender || 'Other',
                fitnessGoal: profile.fitnessGoal || '',
                bio: profile.bio || '',
                profileImageUrl: profile.profileImageUrl || ''
              });
            }
            setIsEditing(true);
          }}
          className="btn-primary text-xs py-2 px-4 flex items-center gap-2 self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
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
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-xs font-bold text-slate-500">Loading student profile from MySQL...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <UserAvatar name={displayName} role="student" size="xl" />

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-950 font-display">{displayName}</h2>
                <span className="badge-emerald font-bold text-xs">Varsity Cleared</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {displayStudentId}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{displayEmail}</span>
                <span>•</span>
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{displayPhone}</span>
              </p>
              <p className="text-xs text-slate-600 flex items-center gap-2">
                <span className="font-semibold text-slate-800">{displayDepartment}</span>
                <span>•</span>
                <span className="text-emerald-700 font-bold">{displayCourse}</span>
                <span>•</span>
                <span className="text-slate-500">{displayYear}</span>
              </p>
            </div>
          </div>

          {/* Bio block */}
          {displayBio && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs">
              <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block mb-1">
                Athlete Biography
              </span>
              <p className="text-slate-600 leading-relaxed">{displayBio}</p>
            </div>
          )}

          {/* Details Grids */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-600" />
                Athletic Records & Goals
              </h4>
              <div className="flex justify-between">
                <span className="text-slate-500">Student Roll ID:</span>
                <span className="font-bold text-slate-900">{displayStudentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fitness Goal:</span>
                <span className="font-bold text-emerald-700">{displayGoal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date of Birth:</span>
                <span className="font-bold text-slate-900">{profile?.dateOfBirth || 'Not recorded'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gender:</span>
                <span className="font-bold text-slate-900">{profile?.gender || 'Not recorded'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">FitCredits Balance:</span>
                <span className="font-bold text-amber-700">⭐ {currentUser.fitCredits || 250}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                Academic & Campus Standing
              </h4>
              <div className="flex justify-between">
                <span className="text-slate-500">Department:</span>
                <span className="font-bold text-slate-900">{displayDepartment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Degree / Program:</span>
                <span className="font-bold text-slate-900">{displayCourse}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Academic Standing:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Eligible (Varsity Tier)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Profile Created:</span>
                <span className="font-semibold text-slate-700">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Active'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Synced:</span>
                <span className="font-semibold text-slate-700">
                  {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleTimeString() : 'Live'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-950 font-display">Edit Athletic Profile</h3>
                <p className="text-xs text-slate-500">Update collegiate athlete details in MySQL database.</p>
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
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Sports Science & Kinesiology"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Degree / Course</label>
                  <input
                    type="text"
                    value={formData.course || ''}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    placeholder="e.g. B.S. Sports Analytics"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Year of Study</label>
                  <select
                    value={formData.yearOfStudy || 1}
                    onChange={(e) => setFormData({ ...formData, yearOfStudy: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value={1}>Year 1 (Freshman)</option>
                    <option value={2}>Year 2 (Sophomore)</option>
                    <option value={3}>Year 3 (Junior)</option>
                    <option value={4}>Year 4 (Senior)</option>
                    <option value={5}>Year 5 (Graduate)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth || ''}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender || 'Other'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Fitness & Athletic Goal</label>
                <input
                  type="text"
                  value={formData.fitnessGoal || ''}
                  onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
                  placeholder="e.g. Varsity Sprinting & Speed Endurance"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Athlete Biography</label>
                <textarea
                  rows={3}
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Brief summary of your athletic background and goals..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  <span>{saving ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
