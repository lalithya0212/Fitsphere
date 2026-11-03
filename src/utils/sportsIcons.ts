export interface SportVisualMeta {
  emoji: string;
  gradient: string;
  accentColor: string;
  category: string;
}

export const getSportVisual = (sportName: string = '', categoryName: string = ''): SportVisualMeta => {
  const s = (sportName + ' ' + categoryName).toLowerCase();

  if (s.includes('foot') || s.includes('soccer')) {
    return {
      emoji: '⚽',
      gradient: 'from-emerald-950 via-slate-950 to-emerald-900',
      accentColor: '#10B981',
      category: 'Football & Field'
    };
  }

  if (s.includes('basket')) {
    return {
      emoji: '🏀',
      gradient: 'from-amber-950 via-slate-950 to-amber-900',
      accentColor: '#F59E0B',
      category: 'Varsity Basketball'
    };
  }

  if (s.includes('cricket')) {
    return {
      emoji: '🏏',
      gradient: 'from-rose-950 via-slate-950 to-red-900',
      accentColor: '#EF4444',
      category: 'Cricket Championship'
    };
  }

  if (s.includes('swim') || s.includes('aqua')) {
    return {
      emoji: '🏊',
      gradient: 'from-cyan-950 via-slate-950 to-blue-900',
      accentColor: '#06B6D4',
      category: 'Aquatic Sports'
    };
  }

  if (s.includes('track') || s.includes('sprint') || s.includes('run') || s.includes('marathon')) {
    return {
      emoji: '🏃',
      gradient: 'from-blue-950 via-slate-950 to-indigo-900',
      accentColor: '#3B82F6',
      category: 'Track & Sprint'
    };
  }

  if (s.includes('badminton')) {
    return {
      emoji: '🏸',
      gradient: 'from-teal-950 via-slate-950 to-emerald-900',
      accentColor: '#14B8A6',
      category: 'Badminton League'
    };
  }

  if (s.includes('tennis')) {
    return {
      emoji: '🎾',
      gradient: 'from-lime-950 via-slate-950 to-emerald-900',
      accentColor: '#84CC16',
      category: 'Tennis Court'
    };
  }

  if (s.includes('volley')) {
    return {
      emoji: '🏐',
      gradient: 'from-orange-950 via-slate-950 to-amber-900',
      accentColor: '#F97316',
      category: 'Volleyball'
    };
  }

  if (s.includes('strength') || s.includes('weight') || s.includes('lift') || s.includes('hypertrophy') || s.includes('gym')) {
    return {
      emoji: '🏋️',
      gradient: 'from-purple-950 via-slate-950 to-violet-900',
      accentColor: '#8B5CF6',
      category: 'Strength & Conditioning'
    };
  }

  if (s.includes('yoga') || s.includes('stretch') || s.includes('mobility') || s.includes('recovery')) {
    return {
      emoji: '🧘',
      gradient: 'from-pink-950 via-slate-950 to-rose-900',
      accentColor: '#EC4899',
      category: 'Flexibility & Recovery'
    };
  }

  if (s.includes('plyo') || s.includes('agility') || s.includes('speed') || s.includes('conditioning')) {
    return {
      emoji: '⚡',
      gradient: 'from-yellow-950 via-slate-950 to-amber-900',
      accentColor: '#EAB308',
      category: 'Speed & Agility'
    };
  }

  return {
    emoji: '🏆',
    gradient: 'from-slate-950 via-purple-950 to-slate-900',
    accentColor: '#A855F7',
    category: 'Collegiate Athletics'
  };
};
