import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { UserAvatar } from './UserAvatar';
import {
  formatRealtimeNotificationTime,
  getNotificationRoleContext,
  filterNotificationsByRole
} from '../../utils/timeAgo';
import {
  Bell,
  Sparkles,
  Trophy,
  ChevronDown,
  LogOut,
  User,
  Check,
  ExternalLink,
  Menu,
  X,
  Clock,
  ArrowRight
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const {
    currentUser,
    activeRole,
    switchRole,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    isAuthenticated,
    logout
  } = useFitSphereStore();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifTab, setNotifTab] = useState<'all' | 'unread'>('all');
  const navigate = useNavigate();
  const location = useLocation();

  // Live ticker to update relative times every 15 seconds in real-time
  const [, setTicker] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTicker(t => t + 1), 15000);
    return () => clearInterval(timer);
  }, []);

  const isPublicPage = ['/', '/about', '/features', '/login', '/register', '/trainer-assessment'].includes(location.pathname);

  // Role-based notification filtering: strictly show notifications for the active user's assigned role & pages
  const roleNotifications = useMemo(() => {
    return filterNotificationsByRole(notifications, activeRole, currentUser.id);
  }, [notifications, activeRole, currentUser.id]);

  const unreadRoleNotifs = useMemo(() => {
    return roleNotifications.filter(n => !n.read);
  }, [roleNotifications]);

  const displayedNotifs = useMemo(() => {
    if (notifTab === 'unread') {
      return unreadRoleNotifs;
    }
    return roleNotifications;
  }, [roleNotifications, unreadRoleNotifs, notifTab]);

  // Keep landing, login, and signup pages clean by removing the navbar
  if (['/', '/login', '/register'].includes(location.pathname)) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {!isPublicPage && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform">
              <img src="/logo.svg" alt="FitSphere Logo" className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-xl font-black tracking-tight text-slate-900">
                  Fit<span className="text-emerald-500">Sphere</span>
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 hidden sm:block -mt-0.5">
                Empowering Campus Fitness • Building Future Athletes
              </p>
            </div>
          </Link>
        </div>


        {/* Right: Portal Actions */}
        <div className="flex items-center gap-3">
          {/* FitCredits Badge (Visible in Student & General Portal) */}
          {activeRole === 'student' && !isPublicPage && (
            <Link
              to="/student/fitcredits"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 hover:border-amber-300 hover:bg-amber-100/60 transition-all shadow-xs group"
            >
              <span className="flex h-5 w-5 rounded-full bg-amber-400 items-center justify-center text-slate-950 text-xs font-black shadow-xs">
                ⭐
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-black text-amber-900 group-hover:scale-105 transition-transform">
                  {currentUser.fitCredits || 0}
                </span>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-tight">
                  Credits
                </span>
              </div>
            </Link>
          )}

          {/* Current Portal Badge */}
          {!isPublicPage && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              <span className={`w-2 h-2 rounded-full ${
                activeRole === 'student' ? 'bg-emerald-500' : activeRole === 'trainer' ? 'bg-blue-500' : 'bg-purple-500'
              }`} />
              <span className="capitalize">{activeRole} Workspace</span>
            </div>
          )}

          {/* Notifications Dropdown */}
          {!isPublicPage && (
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadRoleNotifs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-bounce shadow-xs">
                    {unreadRoleNotifs.length}
                  </span>
                )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 mt-2 w-84 sm:w-[420px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 py-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* Dropdown Header */}
                  <div className="px-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 text-sm font-display">Notifications</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 capitalize border border-slate-200">
                          {activeRole} Workspace
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Real-time updates for your assigned role pages
                      </p>
                    </div>

                    {unreadRoleNotifs.length > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline"
                      >
                        <Check className="w-3.5 h-3.5" /> Mark all read
                      </button>
                    )}
                  </div>

                  {/* Filter Tabs */}
                  <div className="px-4 pt-2.5 pb-1 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setNotifTab('all')}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        notifTab === 'all'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      All ({roleNotifications.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotifTab('unread')}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        notifTab === 'unread'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Unread ({unreadRoleNotifs.length})
                    </button>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 px-2 mt-2">
                    {displayedNotifs.length === 0 ? (
                      <div className="py-10 px-4 text-center space-y-2">
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-lg">
                          🔔
                        </div>
                        <div className="text-xs font-bold text-slate-700">
                          {notifTab === 'unread' ? 'No unread notifications' : 'No notifications for your role'}
                        </div>
                        <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                          {activeRole === 'student'
                            ? 'As your coach assigns workouts, awards FitCredits, or tournaments update, real-time alerts will appear here.'
                            : activeRole === 'trainer'
                            ? 'When student athletes submit workout proof or administrative rosters change, real-time alerts will appear here.'
                            : 'When coaches apply or students register for tournaments, real-time administrative alerts will appear here.'}
                        </p>
                      </div>
                    ) : (
                      displayedNotifs.map((notif) => {
                        const context = getNotificationRoleContext(notif);
                        const realtimeTime = formatRealtimeNotificationTime(notif.timestamp);

                        return (
                          <div
                            key={notif.id}
                            onClick={() => {
                              markNotificationAsRead(notif.id);
                              if (notif.link) {
                                navigate(notif.link);
                                setShowNotifs(false);
                              }
                            }}
                            className={`p-3 rounded-2xl cursor-pointer transition-all my-1 border ${
                              !notif.read
                                ? 'bg-emerald-50/60 border-emerald-200/70 hover:bg-emerald-50'
                                : 'bg-white border-transparent hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${context.badgeColor}`}>
                                <span>{context.icon}</span>
                                <span>{context.pageLabel}</span>
                              </span>

                              <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 whitespace-nowrap">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{realtimeTime}</span>
                              </div>
                            </div>

                            <h5 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                              {!notif.read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                              )}
                              <span>{notif.title}</span>
                            </h5>

                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                              {notif.message}
                            </p>

                            {notif.link && (
                              <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800">
                                <span>Open in {context.pageLabel}</span>
                                <ArrowRight className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile Avatar / Public Login CTA */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-secondary text-xs py-2 px-3 sm:px-4">
                Sign In
              </Link>
              <Link to="/login" className="btn-primary text-xs py-2 px-3 sm:px-4">
                Launch Portal
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              {isPublicPage && (
                <Link
                  to={`/${activeRole}/dashboard`}
                  className="btn-primary text-xs py-2 px-3 sm:px-4 flex items-center gap-1.5"
                >
                  <span>Open Workspace</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}

              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                >
                  <UserAvatar name={currentUser.name} role={currentUser.role} size="sm" />
                  <div className="text-left hidden md:block">
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-500 capitalize">
                      {currentUser.sportSpecialization || currentUser.department || currentUser.role}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <div className="mt-1 inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold uppercase">
                        {currentUser.role}
                      </div>
                    </div>

                    <Link
                      to={`/${activeRole}/profile`}
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50"
                    >
                      <User className="w-4 h-4 text-slate-400" /> Profile & Athletics Info
                    </Link>

                    <Link
                      to="/"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-400" /> Public Landing Page
                    </Link>

                    <div className="border-t border-slate-100 my-1 pt-1">
                      <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Switch Role Workspace
                      </div>
                      <button
                        onClick={() => {
                          switchRole('student');
                          setShowProfileMenu(false);
                          navigate('/student/dashboard');
                        }}
                        className={`w-full text-left flex items-center justify-between px-4 py-1.5 text-xs ${
                          activeRole === 'student' ? 'font-bold text-emerald-600 bg-emerald-50' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>Student Athlete</span>
                        {activeRole === 'student' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                      </button>
                      <button
                        onClick={() => {
                          switchRole('trainer');
                          setShowProfileMenu(false);
                          navigate('/trainer/dashboard');
                        }}
                        className={`w-full text-left flex items-center justify-between px-4 py-1.5 text-xs ${
                          activeRole === 'trainer' ? 'font-bold text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>Varsity Coach</span>
                        {activeRole === 'trainer' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                      </button>
                      <button
                        onClick={() => {
                          switchRole('admin');
                          setShowProfileMenu(false);
                          navigate('/admin/dashboard');
                        }}
                        className={`w-full text-left flex items-center justify-between px-4 py-1.5 text-xs ${
                          activeRole === 'admin' ? 'font-bold text-purple-600 bg-purple-50' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>Sports Director (Admin)</span>
                        {activeRole === 'admin' && <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
                      </button>
                    </div>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setShowProfileMenu(false);
                          navigate('/login');
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 font-semibold"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
