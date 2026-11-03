import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { PasswordInput } from './PasswordInput';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { UserRole } from '../../types';

interface LoginFormProps {
  selectedRole: UserRole;
  onSwitchToRegister: () => void;
  onRoleChange: (role: UserRole) => void;
  prefilledCredentials?: {
    email: string;
    password: string;
    role: UserRole;
    name: string;
  } | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  selectedRole,
  onSwitchToRegister,
  onRoleChange,
  prefilledCredentials,
}) => {
  const { login } = useFitSphereStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If redirected from registration with prefilled credentials
  useEffect(() => {
    if (prefilledCredentials) {
      setEmail(prefilledCredentials.email);
      setPassword(prefilledCredentials.password);
      if (prefilledCredentials.role !== selectedRole) {
        onRoleChange(prefilledCredentials.role);
      }
      setAuthSuccess(`Account created for ${prefilledCredentials.name}! Click "Sign In" to access your portal.`);
      setAuthError('');
      setEmailError('');
      setPasswordError('');
    }
  }, [prefilledCredentials]);

  // Reset errors when role changes manually
  useEffect(() => {
    setAuthError('');
    setEmailError('');
    setPasswordError('');
  }, [selectedRole]);

  const validate = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setAuthError('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setEmailError('University email address is required.');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setEmailError('Please enter a valid university email format.');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('Password is required.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setAuthError('');

    try {
      const result = await login(email, password);
      setIsSubmitting(false);

      if (result.success && result.user) {
        setAuthSuccess(`Welcome back, ${result.user.name}! Opening your dashboard...`);
        const targetRole = result.user.role;
        setTimeout(() => {
          if (targetRole === 'student') {
            navigate('/student/dashboard');
          } else if (targetRole === 'trainer') {
            navigate('/trainer/dashboard');
          } else {
            navigate('/admin/dashboard');
          }
        }, 350);
      } else {
        setAuthError(result.message || 'Authentication failed. Please check your email and password.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setAuthError(err.message || 'Unable to connect to authentication server.');
    }
  };

  const getRoleLabel = () => {
    if (selectedRole === 'student') return 'Student';
    if (selectedRole === 'trainer') return 'Coach';
    return 'Admin';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
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

      {/* University Email Input */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-xs font-semibold text-slate-700 tracking-wide"
        >
          University Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError('');
            }}
            placeholder={
              selectedRole === 'student'
                ? 'athlete@university.edu'
                : selectedRole === 'trainer'
                ? 'coach@athletics.university.edu'
                : 'director@athletics.university.edu'
            }
            autoComplete="email"
            required
            className={`w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 placeholder-slate-400 text-sm rounded-xl border transition-all duration-150 outline-none ${
              emailError
                ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
            }`}
          />
        </div>
        {emailError && (
          <p className="text-[11px] font-medium text-rose-600">{emailError}</p>
        )}
      </div>

      {/* Password Input */}
      <PasswordInput
        id="login-password"
        name="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (passwordError) setPasswordError('');
        }}
        placeholder="Enter your account password"
        label="Password"
        error={passwordError}
        autoComplete="current-password"
        required
      />

      {/* Primary Submit CTA */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] shadow-md shadow-emerald-600/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <span>Sign In as {getRoleLabel()}</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Footer Switch Prompt */}
      <div className="pt-2 text-center text-xs text-slate-500">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline focus:outline-none"
        >
          Register Account
        </button>
      </div>
    </form>
  );
};
