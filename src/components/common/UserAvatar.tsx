import React, { useState } from 'react';

interface UserAvatarProps {
  name: string;
  role?: 'student' | 'trainer' | 'admin' | string;
  avatar?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  shape?: 'rounded' | 'circle';
}

export const getInitials = (name: string): string => {
  if (!name) return 'U';
  // Strip prefixes like Dr., Coach, etc.
  const cleaned = name.replace(/^(dr\.|coach|prof\.|mr\.|mrs\.|ms\.)\s+/i, '').trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  role = 'student',
  avatar,
  size = 'md',
  className = '',
  shape = 'rounded'
}) => {
  const [imageError, setImageError] = useState(false);

  // If avatar is mock unsplash URL, consider it invalid so we show collegiate initials
  const isMockAvatar = !avatar || avatar.includes('images.unsplash.com') || avatar.trim() === '';
  const shouldShowImage = !isMockAvatar && !imageError;

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-24 h-24 text-2xl'
  }[size];

  const shapeClass = shape === 'circle' ? 'rounded-full' : {
    xs: 'rounded-lg',
    sm: 'rounded-xl',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-2xl',
    '2xl': 'rounded-3xl'
  }[size];

  const roleGradients: Record<string, string> = {
    student: 'bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-xs',
    trainer: 'bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xs',
    admin: 'bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-900 text-white shadow-xs'
  };

  const gradientClass = roleGradients[role] || 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white';

  if (shouldShowImage) {
    return (
      <img
        src={avatar}
        alt={name}
        onError={() => setImageError(true)}
        className={`${sizeClasses} ${shapeClass} object-cover ${className}`}
      />
    );
  }

  const initials = getInitials(name);

  return (
    <div
      className={`${sizeClasses} ${shapeClass} ${gradientClass} flex items-center justify-center font-black font-display tracking-tight select-none ring-1 ring-white/20 shrink-0 ${className}`}
      title={name}
      aria-label={name}
    >
      <span>{initials}</span>
    </div>
  );
};
