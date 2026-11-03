import React from 'react';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Flame,
  Users,
  Building,
  Coins,
  ShieldCheck
} from 'lucide-react';

export const CampusAnalyticsPage: React.FC = () => {
  const { users, transactions, events } = useFitSphereStore();

  const studentUsers = users.filter(u => u.role === 'student');
  const certifiedCoaches = users.filter(u => u.role === 'trainer' && u.verificationStatus === 'verified').length;
  const activeAthletes = studentUsers.filter(
    u => u.assignedTrainerId || (u.streakDays && u.streakDays > 0) || (u.fitCredits && u.fitCredits > 0)
  ).length;

  const totalFitCredits = studentUsers.reduce((sum, u) => sum + (u.fitCredits || 0), 0);
  const avgHealthIndex = studentUsers.length > 0
    ? (studentUsers.reduce((sum, u) => sum + (u.fitnessScore || 75), 0) / studentUsers.length).toFixed(1)
    : '82.0';

  const creditEconomyData = [
    { month: 'May', earned: 18000, redeemed: 12000 },
    { month: 'Jun', earned: 22000, redeemed: 15000 },
    { month: 'Jul', earned: 19000, redeemed: 13500 },
    { month: 'Aug', earned: 28000, redeemed: 19000 },
    { month: 'Sep', earned: totalFitCredits > 0 ? totalFitCredits : 34000, redeemed: 24000 },
  ];

  const dormCupData = [
    { dorm: 'Phoenix House', score: 940, color: '#10B981' },
    { dorm: 'Olympus Hall', score: 880, color: '#2563EB' },
    { dorm: 'Titan Dormitory', score: 810, color: '#F59E0B' },
    { dorm: 'Athena Court', score: 760, color: '#8B5CF6' },
  ];

  const facilityUtilizationData = [
    { facility: 'Main Stadium Turf', utilization: 92 },
    { facility: 'Olympic Synthetic Track', utilization: 86 },
    { facility: 'Aquatics Olympic Pool', utilization: 78 },
    { facility: 'Varsity Weight Room', utilization: 95 },
    { facility: 'Indoor Badminton Arena', utilization: 84 },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
          Campus Sports Intelligence & Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          University-wide athletic metrics, FitCredits economy circulation, and facility utilization rates.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Campus Health Index</span>
          <div className="text-3xl font-black text-emerald-600 font-display mt-1">{avgHealthIndex}%</div>
          <span className="text-xs text-slate-500 mt-1 block">Real-time student diagnostic</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Credits in Circulation</span>
          <div className="text-3xl font-black text-amber-600 font-display mt-1">{totalFitCredits.toLocaleString()}</div>
          <span className="text-xs text-amber-700 font-semibold mt-1 block">Active campus liquidity</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Active Varsity Athletes</span>
          <div className="text-3xl font-black text-blue-600 font-display mt-1">{activeAthletes}</div>
          <span className="text-xs text-slate-500 mt-1 block">Assigned to faculty coaches</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Accredited Coaches</span>
          <div className="text-3xl font-black text-purple-600 font-display mt-1">{certifiedCoaches}</div>
          <span className="text-xs text-purple-700 font-semibold mt-1 block">100% Exam Verified</span>
        </div>
      </div>

      {/* Chart 1: FitCredits Economy Earned vs Redeemed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">FitCredits Economy: Earned vs Redeemed</h2>
              <p className="text-xs text-slate-500">Monthly credit distribution and tournament consumption</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={creditEconomyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="earned" name="Credits Earned" stroke="#10B981" fill="#10B981" fillOpacity={0.2} strokeWidth={2} />
                <Area type="monotone" dataKey="redeemed" name="Credits Redeemed" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} strokeWidth={2} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dorm Cup Standings */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Inter-Dorm Athletics Cup</h2>
              <p className="text-xs text-slate-500">Aggregated fitness points per collegiate hall</p>
            </div>
          </div>

          <div className="space-y-3">
            {dormCupData.map((d, i) => (
              <div key={d.dorm} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[10px]">
                      {i + 1}
                    </span>
                    {d.dorm}
                  </span>
                  <span className="text-slate-900 font-extrabold">{d.score} pts</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(d.score / 1000) * 100}%`, backgroundColor: d.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Facility Utilization */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-1">Campus Sports Facility Utilization</h2>
        <p className="text-xs text-slate-500 mb-4">Field, court, and stadium booking density</p>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {facilityUtilizationData.map((f) => (
            <div key={f.facility} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{f.facility}</span>
              <div className="text-2xl font-black text-slate-900 font-display mt-1">
                {f.utilization}%
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${f.utilization}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
