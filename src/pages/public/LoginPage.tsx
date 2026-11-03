import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { AuthVideoPanel } from '../../components/auth/AuthVideoPanel';
import { AuthHeader } from '../../components/auth/AuthHeader';
import { AuthModeTabs } from '../../components/auth/AuthModeTabs';
import { RoleSelector } from '../../components/auth/RoleSelector';
import { LoginForm } from '../../components/auth/LoginForm';
import { SignupForm } from '../../components/auth/SignupForm';
import { UserRole } from '../../types';

interface LoginPageProps {
  defaultMode?: 'login' | 'register';
}

export const LoginPage: React.FC<LoginPageProps> = ({ defaultMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Mode: login or register
  const initialMode = defaultMode || (location.pathname === '/register' ? 'register' : 'login');
  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);

  // Sync mode if user navigates via browser forward/back or URL
  useEffect(() => {
    if (location.pathname === '/register' && authMode !== 'register') {
      setAuthMode('register');
    } else if (location.pathname === '/login' && authMode !== 'login') {
      setAuthMode('login');
    }
  }, [location.pathname, authMode]);

  // Role: student, trainer (coach), admin
  const roleParam = searchParams.get('role')?.toLowerCase();
  const initialRole: UserRole =
    roleParam === 'coach' || roleParam === 'trainer'
      ? 'trainer'
      : roleParam === 'admin'
      ? 'admin'
      : 'student';

  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);

  // Prefilled credentials passed when redirected from Signup
  const [prefilledCredentials, setPrefilledCredentials] = useState<{
    email: string;
    password: string;
    role: UserRole;
    name: string;
  } | null>(null);

  const handleModeSwitch = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    navigate(mode === 'register' ? '/register' : '/login', { replace: true });
  };

  const handleRegistrationSuccess = (data: {
    email: string;
    password: string;
    role: UserRole;
    name: string;
  }) => {
    setPrefilledCredentials(data);
    setSelectedRole(data.role);
    setAuthMode('login');
    navigate('/login', { replace: true });
  };

  return (
    <AuthLayout
      videoPanel={<AuthVideoPanel />}
      authPanel={
        <div className="space-y-4">
          {/* Brand Header */}
          <AuthHeader mode={authMode} />

          {/* Segmented Auth Mode Switch */}
          <AuthModeTabs mode={authMode} onChange={handleModeSwitch} />

          {/* Segmented Role Selector */}
          <RoleSelector selectedRole={selectedRole} onChange={setSelectedRole} />

          {/* Smooth Form Transition without Page Reload */}
          <div className="pt-1">
            <AnimatePresence mode="wait" initial={false}>
              {authMode === 'login' ? (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  <LoginForm
                    selectedRole={selectedRole}
                    onRoleChange={setSelectedRole}
                    onSwitchToRegister={() => handleModeSwitch('register')}
                    prefilledCredentials={prefilledCredentials}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="register-form"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  <SignupForm
                    selectedRole={selectedRole}
                    onSwitchToLogin={() => handleModeSwitch('login')}
                    onRegistrationSuccess={handleRegistrationSuccess}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      }
    />
  );
};
