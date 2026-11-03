import { PushNotification, UserRole } from '../types';

/**
 * Dynamically formats an ISO timestamp or date string into real-time relative time
 * (e.g. "Just now", "2m ago", "Today at 3:45 PM", "Yesterday at 11:20 AM").
 */
export function formatRealtimeNotificationTime(timestamp: string | number | undefined): string {
  if (!timestamp) return 'Just now';

  let date: Date;
  if (typeof timestamp === 'number') {
    date = new Date(timestamp);
  } else if (!isNaN(Number(timestamp))) {
    date = new Date(Number(timestamp));
  } else {
    const parsed = new Date(timestamp);
    if (isNaN(parsed.getTime())) {
      // Fallback if legacy text like "Just now" was saved
      return timestamp;
    }
    date = parsed;
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // If timestamp is slightly in future due to clock sync
  if (diffMs < 0) {
    return 'Just now';
  }

  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (diffSecs < 45) {
    return 'Just now';
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24 && date.toDateString() === now.toDateString()) {
    return `Today at ${timeStr} (${diffHours}h ago)`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${timeStr}`;
  }

  if (diffDays < 7) {
    return `${diffDays}d ago (${timeStr})`;
  }

  const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  return `${dateStr} at ${timeStr}`;
}

export interface NotificationRoleContext {
  roleLabel: string;
  pageLabel: string;
  badgeColor: string;
  icon: string;
}

/**
 * Returns role-based target page context and badges for any notification
 */
export function getNotificationRoleContext(notif: PushNotification): NotificationRoleContext {
  const link = notif.link || '';

  if (link.includes('/student/workouts')) {
    return {
      roleLabel: 'Student Portal',
      pageLabel: 'Assigned Workouts',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: '🏋️'
    };
  }
  if (link.includes('/student/fitcredits')) {
    return {
      roleLabel: 'Student Portal',
      pageLabel: 'FitCredits Wallet',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: '⭐'
    };
  }
  if (link.includes('/student/events')) {
    return {
      roleLabel: 'Student Portal',
      pageLabel: 'Campus Tournaments',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      icon: '🏆'
    };
  }
  if (link.includes('/student/coach')) {
    return {
      roleLabel: 'Student Portal',
      pageLabel: 'Assigned Coach',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: '🏃'
    };
  }
  if (link.includes('/student/submit-proof')) {
    return {
      roleLabel: 'Student Portal',
      pageLabel: 'Proof Submission',
      badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      icon: '📋'
    };
  }
  if (link.includes('/trainer/proof-review')) {
    return {
      roleLabel: 'Coach Desk',
      pageLabel: 'Athlete Proof Review',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: '📥'
    };
  }
  if (link.includes('/trainer/students')) {
    return {
      roleLabel: 'Coach Desk',
      pageLabel: 'My Athletes Roster',
      badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
      icon: '👥'
    };
  }
  if (link.includes('/trainer/plans')) {
    return {
      roleLabel: 'Coach Desk',
      pageLabel: 'Training Plans',
      badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      icon: '📝'
    };
  }
  if (link.includes('/trainer/assessments')) {
    return {
      roleLabel: 'Coach Desk',
      pageLabel: 'Athlete Assessments',
      badgeColor: 'bg-violet-50 text-violet-800 border-violet-200',
      icon: '📊'
    };
  }
  if (link.includes('/admin/trainers')) {
    return {
      roleLabel: 'Admin Desk',
      pageLabel: 'Coach Verification',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      icon: '🛡️'
    };
  }
  if (link.includes('/admin/events')) {
    return {
      roleLabel: 'Admin Desk',
      pageLabel: 'Tournament Rosters',
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: '🏅'
    };
  }

  // Fallbacks by role
  if (notif.recipientRole === 'student') {
    return {
      roleLabel: 'Student Portal',
      pageLabel: 'Student Workspace',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: '🎓'
    };
  }
  if (notif.recipientRole === 'trainer') {
    return {
      roleLabel: 'Coach Desk',
      pageLabel: 'Coach Workspace',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: '🏋️'
    };
  }
  if (notif.recipientRole === 'admin') {
    return {
      roleLabel: 'Admin Desk',
      pageLabel: 'Admin Workspace',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      icon: '🛡️'
    };
  }

  return {
    roleLabel: 'Campus Alert',
    pageLabel: 'General Update',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
    icon: '🔔'
  };
}

/**
 * Filter notifications strictly for the active user and their assigned role
 */
export function filterNotificationsByRole(
  notifications: PushNotification[],
  activeRole: UserRole,
  userId: string
): PushNotification[] {
  return notifications.filter(notif => {
    // If targeted to specific user
    if (notif.recipientUserId) {
      return notif.recipientUserId === userId;
    }

    // Role broadcast
    if (notif.recipientRole === 'all') {
      return true;
    }

    return notif.recipientRole === activeRole;
  });
}
