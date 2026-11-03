import React, { useState, useEffect } from 'react';
import { User, Mail, ArrowRight, AlertCircle, CheckCircle2, Loader2, Trophy, Building, Briefcase } from 'lucide-react';
import { PasswordInput } from './PasswordInput';
import { CoachQuizModal } from './CoachQuizModal';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { UserRole } from '../../types';

interface SignupFormProps {
  selectedRole: UserRole;
  onSwitchToLogin: () => void;
  onRegistrationSuccess: (registeredData: {
    email: string;
    password: string;
    role: UserRole;
    name: string;
  }) => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  selectedRole,
  onSwitchToLogin,
  onRegistrationSuccess,
}) => {
  const { registerUser } = useFitSphereStore();

  // Common fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Role-specific fields
  const [sport, setSport] = useState('Football & Sprint');
  const [department, setDepartment] = useState('Computer Science & Athletics');
  const [sportSpecialization, setSportSpecialization] = useState('Strength & Conditioning');
  const [adminRole, setAdminRole] = useState('Associate Athletic Director');

  // Error & Status states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quiz modal state for coach
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  useEffect(() => {
    setErrors({});
    setAuthError('');
  }, [selectedRole]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full legal name is required.';
    }

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      newErrors.email = 'University email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      newErrors.email = 'Please enter a valid university email address.';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (password.trim().length < 6) {
      newErrors.password = 'Must be at least 6 characters.';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (selectedRole === 'student') {
      if (!sport.trim()) newErrors.sport = 'Primary sport is required.';
      if (!department.trim()) newErrors.department = 'Department is required.';
    } else if (selectedRole === 'trainer') {
      if (!sportSpecialization.trim()) newErrors.sportSpecialization = 'Specialization is required.';
    } else if (selectedRole === 'admin') {
      if (!adminRole.trim()) newErrors.adminRole = 'Administrative role is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuizComplete = async (scorePct: number) => {
    setIsQuizModalOpen(false);
    setIsSubmitting(true);
    setAuthError('');

    const { submitTrainerVerification } = useFitSphereStore.getState();

    // 1. Submit accreditation verification application to Admin
    submitTrainerVerification({
      trainerName: fullName.trim(),
      trainerEmail: email.trim(),
      avatar: '',
      sportSpecialization: sportSpecialization.trim(),
      experienceYears: 5,
      bio: `Collegiate coach candidate specializing in ${sportSpecialization.trim()}`,
      certifications: ['Collegiate Coach Accreditation Candidate', `${scorePct}% Exam Score`],
      assessmentScore: scorePct
    });

    try {
      // 2. Register Coach user in backend / store with pending verification
      const result = await registerUser({
        role: 'trainer',
        name: fullName.trim(),
        email: email.trim(),
        password: password.trim(),
        department: 'Varsity Athletics & Performance',
        sportSpecialization: sportSpecialization.trim(),
        verificationScore: scorePct,
        credentials: ['Collegiate Coach Candidate', `${scorePct}% Exam Score`]
      });

      setIsSubmitting(false);

      if (result.success && result.user) {
        setAuthSuccess(`Accreditation exam completed (${scorePct}%)! Application submitted for Administrator verification.`);
        setTimeout(() => {
          onRegistrationSuccess({
            email: email.trim(),
            password: password.trim(),
            role: 'trainer',
            name: result.user.name,
          });
        }, 500);
      } else {
        setAuthError(result.message || 'Registration could not be completed.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setAuthError(err.message || 'Registration error occurred.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // If Coach role, require completion of Fitness & Sports Quiz first
    if (selectedRole === 'trainer') {
      setIsQuizModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    setAuthError('');

    try {
      let result;

      if (selectedRole === 'student') {
        result = await registerUser({
          role: 'student',
          name: fullName.trim(),
          email: email.trim(),
          password: password.trim(),
          department: department.trim(),
          sportSpecialization: sport.trim(),
          dormHouse: 'Campus Athletics Quad'
        });
      } else {
        result = await registerUser({
          role: 'admin',
          name: fullName.trim(),
          email: email.trim(),
          password: password.trim(),
          department: adminRole.trim(),
          credentials: ['Athletic Administration & Sports Management']
        });
      }

      setIsSubmitting(false);

      if (result.success && result.user) {
        setAuthSuccess(`Account created for ${result.user.name}! Redirecting to Sign In...`);
        setTimeout(() => {
          onRegistrationSuccess({
            email: email.trim(),
            password: password.trim(),
            role: selectedRole,
            name: result.user.name,
          });
        }, 500);
      } else {
        setAuthError(result.message || 'Registration could not be completed.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setAuthError(err.message || 'Registration error occurred.');
    }
  };

  const getButtonLabel = () => {
    if (selectedRole === 'student') return 'Create Student Account';
    if (selectedRole === 'trainer') return 'Proceed to Fitness & Sports Quiz';
    return 'Create Admin Account';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
      {/* Feedback alerts */}
      {authError && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{authError}</div>
        </div>
      )}

      {authSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{authSuccess}</div>
        </div>
      )}

      {/* Row 1: Full Name & University Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="reg-name" className="block text-xs font-semibold text-slate-700 tracking-wide">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="reg-name"
              name="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Maya Lin"
              required
              className={`w-full pl-10 pr-3 py-2 bg-white text-slate-900 placeholder-slate-400 text-sm rounded-xl border transition-all duration-150 outline-none ${
                errors.fullName
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
              }`}
            />
          </div>
          {errors.fullName && <p className="text-[11px] font-medium text-rose-600">{errors.fullName}</p>}
        </div>

        {/* University Email */}
        <div className="space-y-1.5">
          <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-700 tracking-wide">
            University Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="reg-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="athlete@university.edu"
              required
              className={`w-full pl-10 pr-3 py-2 bg-white text-slate-900 placeholder-slate-400 text-sm rounded-xl border transition-all duration-150 outline-none ${
                errors.email
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
              }`}
            />
          </div>
          {errors.email && <p className="text-[11px] font-medium text-rose-600">{errors.email}</p>}
        </div>
      </div>

      {/* Row 2: Passwords (side-by-side for compact height) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <PasswordInput
          id="reg-password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min 6 characters"
          label="Password"
          error={errors.password}
          autoComplete="new-password"
          required
        />
        <PasswordInput
          id="reg-confirm-password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter password"
          label="Confirm Password"
          error={errors.confirmPassword}
          autoComplete="new-password"
          required
        />
      </div>

      {/* Role-Aware Dynamic Fields */}
      {selectedRole === 'student' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
          {/* Primary Sport / Track */}
          <div className="space-y-1.5">
            <label htmlFor="reg-sport" className="block text-xs font-semibold text-slate-700 tracking-wide">
              Primary Sport / Track
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Trophy className="w-4 h-4" />
              </div>
              <input
                id="reg-sport"
                name="sport"
                type="text"
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                placeholder="e.g. Football & Track"
                required
                className={`w-full pl-10 pr-3 py-2 bg-white text-slate-900 placeholder-slate-400 text-sm rounded-xl border transition-all duration-150 outline-none ${
                  errors.sport
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                    : 'border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                }`}
              />
            </div>
            {errors.sport && <p className="text-[11px] font-medium text-rose-600">{errors.sport}</p>}
          </div>

          {/* Academic Department */}
          <div className="space-y-1.5">
            <label htmlFor="reg-dept" className="block text-xs font-semibold text-slate-700 tracking-wide">
              Academic Department
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Building className="w-4 h-4" />
              </div>
              <input
                id="reg-dept"
                name="department"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science"
                required
                className={`w-full pl-10 pr-3 py-2 bg-white text-slate-900 placeholder-slate-400 text-sm rounded-xl border transition-all duration-150 outline-none ${
                  errors.department
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                    : 'border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                }`}
              />
            </div>
            {errors.department && <p className="text-[11px] font-medium text-rose-600">{errors.department}</p>}
          </div>
        </div>
      )}

      {selectedRole === 'trainer' && (
        <div className="space-y-1.5 pt-0.5">
          <label htmlFor="reg-specialization" className="block text-xs font-semibold text-slate-700 tracking-wide">
            Sport Specialization
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Trophy className="w-4 h-4" />
            </div>
            <input
              id="reg-specialization"
              name="specialization"
              type="text"
              value={sportSpecialization}
              onChange={(e) => setSportSpecialization(e.target.value)}
              placeholder="e.g. Strength & Conditioning, Track & Field"
              required
              className={`w-full pl-10 pr-3 py-2 bg-white text-slate-900 placeholder-slate-400 text-sm rounded-xl border transition-all duration-150 outline-none ${
                errors.sportSpecialization
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
              }`}
            />
          </div>
          {errors.sportSpecialization && (
            <p className="text-[11px] font-medium text-rose-600">{errors.sportSpecialization}</p>
          )}
        </div>
      )}

      {selectedRole === 'admin' && (
        <div className="space-y-1.5 pt-0.5">
          <label htmlFor="reg-admin-role" className="block text-xs font-semibold text-slate-700 tracking-wide">
            Administrative Role
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <input
              id="reg-admin-role"
              name="adminRole"
              type="text"
              value={adminRole}
              onChange={(e) => setAdminRole(e.target.value)}
              placeholder="e.g. Associate Athletic Director, Sports Management"
              required
              className={`w-full pl-10 pr-3 py-2 bg-white text-slate-900 placeholder-slate-400 text-sm rounded-xl border transition-all duration-150 outline-none ${
                errors.adminRole
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
              }`}
            />
          </div>
          {errors.adminRole && <p className="text-[11px] font-medium text-rose-600">{errors.adminRole}</p>}
        </div>
      )}

      {/* Primary Submit CTA */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] shadow-md shadow-emerald-600/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Creating account...</span>
          </>
        ) : (
          <>
            <span>{getButtonLabel()}</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Footer Switch Prompt */}
      <div className="pt-1.5 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline focus:outline-none"
        >
          Sign In
        </button>
      </div>

      {/* Fitness & Sports Accreditation Examination Modal for Coach Role */}
      <CoachQuizModal
        isOpen={isQuizModalOpen}
        coachName={fullName}
        coachEmail={email}
        sportSpecialization={sportSpecialization}
        onComplete={handleQuizComplete}
        onClose={() => setIsQuizModalOpen(false)}
      />
    </form>
  );
};
