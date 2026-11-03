import React, { useState, useEffect } from 'react';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { UserAvatar } from '../../components/common/UserAvatar';
import { api, AdminProfileResponse, AdminProfileUpdateRequest } from '../../services/api';
import {
  ShieldAlert,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  Edit3,
  X,
  Save,
  Loader2,
  AlertCircle,
  Phone,
  Mail,
  Briefcase,
  IdCard,
  Sliders
} from 'lucide-react';

export const AdminProfilePage: React.FC = () => {
  const { currentUser } = useFitSphereStore();

  const [profile, setProfile] = useState<AdminProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form edit state
  const [formData, setFormData] = useState<AdminProfileUpdateRequest>({
    name: '',
    phone: '',
    department: '',
    designation: '',
    bio: '',
    profileImageUrl: ''
  });

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminProfile();
      setProfile(data);
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        department: data.department || '',
        designation: data.designation || '',
        bio: data.bio || '',
        profileImageUrl: data.profileImageUrl || ''
      });
    } catch (err: any) {
      console.warn('Could not fetch admin profile from backend:', err);
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
      const updated = await api.updateAdminProfile({
        name: formData.name?.trim(),
        phone: formData.phone?.trim(),
        department: formData.department?.trim(),
        designation: formData.designation?.trim(),
        bio: formData.bio?.trim(),
        profileImageUrl: formData.profileImageUrl?.trim()
      });

      setProfile(updated);
      setIsEditing(false);
      setSuccessMsg('Director credentials and profile saved to MySQL database successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err?.message || 'Failed to update admin profile.');
    } finally {
      setSaving(false);
    }
  };

  const displayName = profile?.name || currentUser.name;
  const displayEmail = profile?.email || currentUser.email;
  const displayPhone = profile?.phone || currentUser.phone || 'Not specified';
  const displayEmployeeId = profile?.employeeId || 'ADM-0001';
  const displayDepartment = profile?.department || currentUser.department || 'Intercollegiate Athletics & Sports Administration';
  const displayDesignation = profile?.designation || 'Director of Athletics';
  const displayBio = profile?.bio || 'Campus Athletics Director overseeing intercollegiate varsity programs.';

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
            Athletics Director Profile & Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Department governance credentials, administrative oversight, and campus accreditation.
          </p>
        </div>

        <button
          onClick={() => {
            if (profile) {
              setFormData({
                name: profile.name || '',
                phone: profile.phone || '',
                department: profile.department || '',
                designation: profile.designation || '',
                bio: profile.bio || '',
                profileImageUrl: profile.profileImageUrl || ''
              });
            }
            setIsEditing(true);
          }}
          className="btn-primary text-xs py-2 px-4 flex items-center gap-2 self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Director Profile</span>
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
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <p className="text-xs font-bold text-slate-500">Loading administrator profile from MySQL...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <UserAvatar name={displayName} role="admin" size="xl" />

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-950 font-display">{displayName}</h2>
                <span className="badge-purple font-bold text-xs flex items-center gap-1">
                  Executive Dean
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {displayEmployeeId}
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
                Title: <span className="font-bold text-purple-700">{displayDesignation}</span>
                <span className="text-slate-400 mx-2">•</span>
                Department: <span className="font-bold text-slate-800">{displayDepartment}</span>
              </p>
            </div>
          </div>

          {/* Bio block */}
          {displayBio && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs">
              <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block mb-1">
                Executive Biography & Mandate
              </span>
              <p className="text-slate-600 leading-relaxed">{displayBio}</p>
            </div>
          )}

          {/* Details Grids */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-600" />
                Department Credentials
              </h4>
              <div className="flex justify-between">
                <span className="text-slate-500">Employee / Officer ID:</span>
                <span className="font-bold text-slate-900">{displayEmployeeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Official Designation:</span>
                <span className="font-bold text-purple-700">{displayDesignation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Department:</span>
                <span className="font-bold text-slate-900">{displayDepartment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Authorization Level:</span>
                <span className="font-bold text-emerald-700">Root / Full Administrative Authority</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Database Timestamp Audit
              </h4>
              <div className="flex justify-between">
                <span className="text-slate-500">Account Created:</span>
                <span className="font-semibold text-slate-700">
                  {profile?.userCreatedAt ? new Date(profile.userCreatedAt).toLocaleDateString() : 'Active'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Profile Initialized:</span>
                <span className="font-semibold text-slate-700">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Active'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Profile Update:</span>
                <span className="font-semibold text-slate-700">
                  {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleTimeString() : 'Live'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">System Role:</span>
                <span className="font-bold text-purple-700">ADMIN</span>
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
                <h3 className="text-lg font-bold text-slate-950 font-display">Edit Director Profile</h3>
                <p className="text-xs text-slate-500">Update athletics director records in MySQL database.</p>
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
                  <label className="block font-bold text-slate-700 mb-1">Director Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Title / Designation</label>
                  <input
                    type="text"
                    value={formData.designation || ''}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Director of Athletics"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Intercollegiate Athletics"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Executive Bio</label>
                <textarea
                  rows={3}
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Summary of responsibilities and campus mandate..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
