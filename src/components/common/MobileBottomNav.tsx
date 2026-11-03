import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import {
  LayoutDashboard,
  Dumbbell,
  UploadCloud,
  Trophy,
  MessageSquare,
  Users,
  CheckSquare,
  ClipboardList,
  ShieldCheck,
  BarChart3
} from 'lucide-react';

interface MobileNavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  badge?: string | number;
}

export const MobileBottomNav: React.FC = () => {
  const { activeRole, proofSubmissions, trainerApplications } = useFitSphereStore();
  const location = useLocation();

  const isPublicPage = ['/', '/about', '/features', '/login', '/register', '/trainer-assessment'].includes(location.pathname);
  if (isPublicPage) return null;

  const pendingProofs = proofSubmissions.filter(p => p.status === 'pending').length;
  const pendingTrainers = trainerApplications.filter(t => t.status === 'pending').length;

  const studentItems: MobileNavItem[] = [
    { to: '/student/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/student/workouts', label: 'Drills', icon: Dumbbell },
    { to: '/student/submit-proof', label: 'Proof', icon: UploadCloud, highlight: true },
    { to: '/student/events', label: 'Events', icon: Trophy },
    { to: '/student/chat', label: 'Coach', icon: MessageSquare },
  ];

  const trainerItems: MobileNavItem[] = [
    { to: '/trainer/dashboard', label: 'Workspace', icon: LayoutDashboard },
    { to: '/trainer/students', label: 'Athletes', icon: Users },
    {
      to: '/trainer/proof-review',
      label: 'Review',
      icon: CheckSquare,
      badge: pendingProofs > 0 ? pendingProofs : undefined
    },
    { to: '/trainer/plans', label: 'Plans', icon: ClipboardList },
    { to: '/trainer/chat', label: 'Chat', icon: MessageSquare },
  ];

  const adminItems: MobileNavItem[] = [
    { to: '/admin/dashboard', label: 'HQ', icon: LayoutDashboard },
    {
      to: '/admin/trainers',
      label: 'Trainers',
      icon: ShieldCheck,
      badge: pendingTrainers > 0 ? pendingTrainers : undefined
    },
    { to: '/admin/students', label: 'Students', icon: Users },
    { to: '/admin/events', label: 'Events', icon: Trophy },
    { to: '/admin/analytics', label: 'Stats', icon: BarChart3 },
  ];

  let items = studentItems;
  if (activeRole === 'trainer') items = trainerItems;
  if (activeRole === 'admin') items = adminItems;

  return (
    <nav aria-label="Mobile navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-lg px-2 py-1">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all relative ${
                isActive
                  ? 'text-emerald-600 font-extrabold'
                  : 'text-slate-400 hover:text-slate-600'
              } ${item.highlight ? 'relative -top-2 bg-emerald-500 text-slate-950 p-2.5 rounded-full shadow-lg shadow-emerald-500/30' : ''}`}
            >
              <div className="relative">
                <Icon className={item.highlight ? 'w-5 h-5 text-slate-950' : 'w-5 h-5'} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-400 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              {!item.highlight && (
                <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                  {item.label}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
