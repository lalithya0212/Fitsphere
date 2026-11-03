import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { UserAvatar } from './UserAvatar';
import {
  LayoutDashboard,
  Dumbbell,
  UploadCloud,
  Coins,
  Trophy,
  Flame,
  LineChart,
  MessageSquare,
  UserCheck,
  User,
  Users,
  ClipboardList,
  CheckSquare,
  Activity,
  ShieldCheck,
  GraduationCap,
  BarChart3,
  Settings,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface SidebarLinkItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeRole, currentUser, proofSubmissions, trainerApplications } = useFitSphereStore();
  const location = useLocation();

  const pendingProofs = proofSubmissions.filter(p => p.status === 'pending').length;
  const pendingTrainers = trainerApplications.filter(t => t.status === 'pending').length;

  const studentLinks: SidebarLinkItem[] = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/workouts', label: 'Workouts & Drills', icon: Dumbbell },
    { to: '/student/submit-proof', label: 'Submit Proof', icon: UploadCloud, highlight: true },
    { to: '/student/fitcredits', label: 'FitCredits Wallet', icon: Coins },
    { to: '/student/events', label: 'Sports Events', icon: Trophy },
    { to: '/student/leaderboard', label: 'Campus Champions', icon: Flame },
    { to: '/student/progress', label: 'Performance Analytics', icon: LineChart },
    { to: '/student/chat', label: 'Coach Chat', icon: MessageSquare },
    { to: '/student/trainer', label: 'My Coach', icon: UserCheck },
    { to: '/student/profile', label: 'Athletic Profile', icon: User },
  ];

  const trainerLinks: SidebarLinkItem[] = [
    { to: '/trainer/dashboard', label: 'Coaching Workspace', icon: LayoutDashboard },
    { to: '/trainer/students', label: 'Assigned Athletes', icon: Users },
    { to: '/trainer/plans', label: 'Training Plans', icon: ClipboardList },
    {
      to: '/trainer/proof-review',
      label: 'Proof Review Deck',
      icon: CheckSquare,
      badge: pendingProofs > 0 ? `${pendingProofs} pending` : undefined,
      highlight: pendingProofs > 0
    },
    { to: '/trainer/assessments', label: '5D Assessments', icon: Activity },
    { to: '/trainer/chat', label: 'Athlete Messages', icon: MessageSquare },
    { to: '/trainer/profile', label: 'Coach Credentials', icon: User },
  ];

  const adminLinks: SidebarLinkItem[] = [
    { to: '/admin/dashboard', label: 'Sports Command Center', icon: LayoutDashboard },
    {
      to: '/admin/trainers',
      label: 'Trainer Verification',
      icon: ShieldCheck,
      badge: pendingTrainers > 0 ? `${pendingTrainers} pending` : undefined,
      highlight: pendingTrainers > 0
    },
    { to: '/admin/students', label: 'Student Directory', icon: GraduationCap },
    { to: '/admin/events', label: 'Tournaments & Brackets', icon: Trophy },
    { to: '/admin/analytics', label: 'Campus Sports Intelligence', icon: BarChart3 },
    { to: '/admin/profile', label: 'Director Profile', icon: User },
    { to: '/admin/settings', label: 'Department Policies', icon: Settings },
  ];

  let links = studentLinks;
  if (activeRole === 'trainer') links = trainerLinks;
  if (activeRole === 'admin') links = adminLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Container - Fixed and stationary, never shifts up/down during page scrolling */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:h-full md:w-64 md:shrink-0 md:rounded-3xl md:border md:border-slate-200/80 md:shadow-xs md:overflow-hidden md:z-auto ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="p-4 overflow-y-auto flex-1 flex flex-col">
          {/* Active Role Indicator Card */}
          <div className="mb-4 p-3 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/70 border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <UserAvatar name={currentUser.name} role={currentUser.role} size="md" />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-black text-slate-900 truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] font-bold text-slate-500 truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  {activeRole === 'student' ? 'Varsity Athlete' : activeRole === 'trainer' ? 'Verified Coach' : 'Athletic Dean'}
                </div>
              </div>
            </div>

            {activeRole === 'student' && (
              <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">FitCredits</span>
                <span className="font-black text-amber-600 flex items-center gap-1">
                  ⭐ {currentUser.fitCredits || 0} pts
                </span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {activeRole} Navigation
            </div>
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-slate-700'
                      }`}
                    />
                    <span>{link.label}</span>
                  </div>

                  {link.badge && (
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse shadow-xs">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
};
