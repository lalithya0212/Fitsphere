import React, { useState } from 'react';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { UserAvatar } from '../../components/common/UserAvatar';
import {
  Trophy,
  Flame,
  Medal,
  Award,
  Crown,
  Sparkles,
  TrendingUp,
  Shield,
  CheckCircle2
} from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const { getLeaderboard, currentUser } = useFitSphereStore();
  const [filterSport, setFilterSport] = useState<string>('All');
  const [filterDorm, setFilterDorm] = useState<string>('All');

  const fullLeaderboard = getLeaderboard();

  const filteredEntries = fullLeaderboard.filter(entry => {
    if (filterSport !== 'All' && !entry.sport.toLowerCase().includes(filterSport.toLowerCase())) {
      return false;
    }
    if (filterDorm !== 'All' && entry.dormHouse !== filterDorm) {
      return false;
    }
    return true;
  });

  const topThree = filteredEntries.slice(0, 3);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-2">
          <Crown className="w-4 h-4 text-amber-600" />
          <span>Campus Athletics Honor Roll</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
          Campus Champions Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Rankings updated dynamically based on verified workout proofs, attendance streaks, and tournament wins.
        </p>
      </div>

      {/* Top 3 Podium Showcase */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          {/* 2nd Place (Silver) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col items-center text-center order-2 md:order-1 relative">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-black text-sm mb-3 shadow-xs">
              2
            </div>
            <UserAvatar name={topThree[1].name} role="student" size="lg" className="mb-2" />
            <h3 className="text-sm font-bold text-slate-900">{topThree[1].name}</h3>
            <p className="text-[11px] text-slate-500">{topThree[1].sport} • {topThree[1].dormHouse}</p>
            <div className="mt-3 text-lg font-black text-slate-800 font-display">
              ⭐ {topThree[1].fitCredits} Credits
            </div>
            <span className="text-[10px] text-emerald-600 font-bold mt-0.5">
              Score: {topThree[1].fitnessScore}% • {topThree[1].streakDays}d Streak
            </span>
          </div>

          {/* 1st Place (Gold Champion) */}
          <div className="bg-gradient-to-b from-amber-500/10 via-amber-100/30 to-white rounded-3xl p-7 border-2 border-amber-400 shadow-lg flex flex-col items-center text-center order-1 md:order-2 relative -translate-y-2">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-base mb-3 shadow-md">
              👑 1
            </div>
            <UserAvatar name={topThree[0].name} role="student" size="xl" className="mb-2" />
            <h3 className="text-base font-extrabold text-slate-950">{topThree[0].name}</h3>
            <p className="text-xs text-slate-600 font-medium">{topThree[0].sport} • {topThree[0].dormHouse}</p>
            <div className="mt-3 text-2xl font-black text-amber-700 font-display">
              ⭐ {topThree[0].fitCredits} Credits
            </div>
            <span className="text-xs text-emerald-700 font-extrabold mt-0.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Campus Top Scorer ({topThree[0].fitnessScore}%)
            </span>
          </div>

          {/* 3rd Place (Bronze) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col items-center text-center order-3 relative">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm mb-3 shadow-xs">
              3
            </div>
            <UserAvatar name={topThree[2].name} role="student" size="lg" className="mb-2" />
            <h3 className="text-sm font-bold text-slate-900">{topThree[2].name}</h3>
            <p className="text-[11px] text-slate-500">{topThree[2].sport} • {topThree[2].dormHouse}</p>
            <div className="mt-3 text-lg font-black text-slate-800 font-display">
              ⭐ {topThree[2].fitCredits} Credits
            </div>
            <span className="text-[10px] text-emerald-600 font-bold mt-0.5">
              Score: {topThree[2].fitnessScore}% • {topThree[2].streakDays}d Streak
            </span>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Filter by Sport:</span>
          <select
            value={filterSport}
            onChange={e => setFilterSport(e.target.value)}
            className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
          >
            <option value="All">All Campus Sports</option>
            <option value="Football">Football</option>
            <option value="Basketball">Basketball</option>
            <option value="Track">Track & Field</option>
            <option value="Rowing">Rowing</option>
            <option value="Badminton">Badminton</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Dorm / House:</span>
          <select
            value={filterDorm}
            onChange={e => setFilterDorm(e.target.value)}
            className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
          >
            <option value="All">All Dorms</option>
            <option value="Phoenix House">Phoenix House</option>
            <option value="Olympus Hall">Olympus Hall</option>
            <option value="Titan Dormitory">Titan Dormitory</option>
            <option value="Athena Court">Athena Court</option>
          </select>
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Current Standings ({filteredEntries.length} Athletes)
          </h3>
          <span className="text-xs text-slate-500 font-medium">Updated 5 mins ago</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Rank</th>
                <th className="py-3.5 px-4">Student Athlete</th>
                <th className="py-3.5 px-4">Department & Dorm</th>
                <th className="py-3.5 px-4">Sport</th>
                <th className="py-3.5 px-4">Active Streak</th>
                <th className="py-3.5 px-4">Fitness Score</th>
                <th className="py-3.5 px-6 text-right">FitCredits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredEntries.map((entry) => {
                const isYou = entry.studentId === currentUser.id;

                return (
                  <tr
                    key={entry.studentId}
                    className={`transition-colors ${
                      isYou ? 'bg-emerald-50/80 font-bold text-emerald-950' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-4 px-6 font-extrabold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                        {isYou && (
                          <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                            YOU
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={entry.name} role="student" size="sm" />
                        <div>
                          <div className="font-bold text-slate-900">{entry.name}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div>{entry.department}</div>
                      <div className="text-[11px] text-slate-400">{entry.dormHouse}</div>
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-900">{entry.sport}</td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                        <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" /> {entry.streakDays} days
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500"
                            style={{ width: `${entry.fitnessScore}%` }}
                          />
                        </div>
                        <span className="font-bold">{entry.fitnessScore}%</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right font-black text-amber-700 text-sm">
                      ⭐ {entry.fitCredits}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
