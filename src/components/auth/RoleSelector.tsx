import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Dumbbell, Shield } from 'lucide-react';
import { UserRole } from '../../types';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onChange: (role: UserRole) => void;
}

interface RoleOption {
  id: UserRole;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ROLES: RoleOption[] = [
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'trainer', label: 'Coach', icon: Dumbbell },
  { id: 'admin', label: 'Admin', icon: Shield },
];

export const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onChange }) => {
  return (
    <div className="space-y-1.5 text-left">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Select Role
        </label>
      </div>

      <div
        role="radiogroup"
        aria-label="User role selection"
        className="relative grid grid-cols-3 p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 gap-1 select-none"
      >
        {ROLES.map(({ id, label, icon: Icon }) => {
          const isSelected = selectedRole === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(id)}
              className={`relative z-10 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                isSelected
                  ? 'text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeRoleIndicator"
                  className="absolute inset-0 bg-emerald-600 rounded-xl shadow-sm shadow-emerald-600/30"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.3 }}
                />
              )}
              <Icon className="w-3.5 h-3.5 relative z-10 shrink-0" />
              <span className="relative z-10 truncate">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
