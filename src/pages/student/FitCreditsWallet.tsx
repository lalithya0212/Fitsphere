import React, { useState } from 'react';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { triggerCelebration } from '../../utils/confetti';
import {
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  Trophy,
  Sparkles,
  ShoppingBag,
  Flame,
  CheckCircle2,
  Calendar,
  Filter,
  Shirt,
  Zap,
  Activity
} from 'lucide-react';

export const FitCreditsWallet: React.FC = () => {
  const { currentUser, transactions } = useFitSphereStore();
  const [filterType, setFilterType] = useState<'All' | 'Earned' | 'Spent'>('All');
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  const myTransactions = transactions.filter(t => t.userId === currentUser.id);

  const totalEarned = myTransactions
    .filter(t => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const totalSpent = Math.abs(
    myTransactions
      .filter(t => t.amount < 0)
      .reduce((acc, t) => acc + t.amount, 0)
  );

  const filteredTx = myTransactions.filter(t => {
    if (filterType === 'Earned') return t.amount > 0;
    if (filterType === 'Spent') return t.amount < 0;
    return true;
  });

  const rewards = [
    {
      id: 'rew-1',
      title: 'University Varsity Performance Hoodie',
      cost: 300,
      icon: Shirt,
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      category: 'Official Apparel'
    },
    {
      id: 'rew-2',
      title: 'College Dri-FIT Training Singlet',
      cost: 200,
      icon: Shirt,
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      category: 'Athletic Kit'
    },
    {
      id: 'rew-3',
      title: 'High-Performance Whey & Electrolyte Bundle',
      cost: 80,
      icon: Zap,
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      category: 'Nutrition'
    },
    {
      id: 'rew-4',
      title: 'Varsity Cryotherapy Recovery Session',
      cost: 150,
      icon: Activity,
      bg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      category: 'Physio & Recovery'
    },
  ];

  const handleRedeem = (reward: typeof rewards[0]) => {
    const balance = currentUser.fitCredits || 0;
    if (balance < reward.cost) {
      alert(`Insufficient FitCredits. You need ${reward.cost} credits, but have ${balance}. Complete more workouts to earn credits!`);
      return;
    }

    useFitSphereStore.setState(state => ({
      currentUser: { ...state.currentUser, fitCredits: (state.currentUser.fitCredits || 0) - reward.cost },
      users: state.users.map(u => u.id === state.currentUser.id ? { ...u, fitCredits: (u.fitCredits || 0) - reward.cost } : u),
      transactions: [
        {
          id: `tx-${Date.now()}`,
          userId: state.currentUser.id,
          type: 'merch_redemption',
          title: `Redeemed: ${reward.title}`,
          amount: -reward.cost,
          date: new Date().toISOString().split('T')[0],
          category: 'Reward'
        },
        ...state.transactions
      ]
    }));

    triggerCelebration();
    setRedeemSuccess(`Successfully redeemed ${reward.title}! Pick up at Varsity Equipment Desk.`);
    setTimeout(() => setRedeemSuccess(null), 5000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
          FitCredits Digital Wallet & Ledger
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Your discipline-backed campus currency earned through workouts, attendance, and competitive tournaments.
        </p>
      </div>

      {redeemSuccess && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="text-xs font-bold">{redeemSuccess}</div>
        </div>
      )}

      {/* Big Balance & Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Balance Card */}
        <div className="rounded-3xl bg-gradient-to-br from-amber-500 via-amber-400 to-yellow-500 p-6 text-slate-950 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/20 rounded-full blur-xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-950/70">
                Available Balance
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-white text-[10px] font-bold">
                Gold Tier
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-4xl sm:text-5xl font-black font-display tracking-tight">
                ⭐ {currentUser.fitCredits || 0}
              </span>
              <span className="text-xs font-bold uppercase tracking-tight text-amber-950">
                Credits
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-900/10 flex items-center justify-between text-xs font-bold text-amber-950">
            <span>Next Privilege: Varsity Kit</span>
            <span>At 300 pts</span>
          </div>
        </div>

        {/* Lifetime Earned Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Lifetime Earned</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-3xl font-black text-emerald-600 font-display">
              +{totalEarned} pts
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              From verified workouts, team attendance & streak milestones.
            </p>
          </div>

          <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200/60">
            {myTransactions.filter(t => t.amount > 0).length} Verified Earned Entries
          </div>
        </div>

        {/* Lifetime Spent Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Credits Invested</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-3xl font-black text-slate-800 font-display">
              -{totalSpent} pts
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Redeemed for campus rewards and athletic gear.
            </p>
          </div>

          <div className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200/60">
            {myTransactions.filter(t => t.amount < 0).length} Perks & Items Redeemed
          </div>
        </div>
      </div>

      {/* Grid: Transaction Ledger + Rewards Store */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ledger (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500" />
                FitCredits Transaction Ledger
              </h2>
              <p className="text-xs text-slate-500">Live verified ledger records</p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 text-xs font-bold">
              {(['All', 'Earned', 'Spent'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterType(tab)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    filterType === tab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {filteredTx.map(tx => (
              <div
                key={tx.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                      tx.amount > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {tx.amount > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{tx.title}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{tx.date}</span>
                      <span>• Category: {tx.category}</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`text-sm font-extrabold ${
                    tx.amount > 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Credits
                </div>
              </div>
            ))}

            {filteredTx.length === 0 && (
              <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Coins className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-700">No Transactions Found</h4>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                  Workout proofs approved by your coach and campus redemptions will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Varsity Rewards Store (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              Campus Rewards Store
            </h2>
            <span className="badge-gold font-bold text-[10px]">Instant Redeem</span>
          </div>

          <div className="space-y-3">
            {rewards.map(reward => {
              const canAfford = (currentUser.fitCredits || 0) >= reward.cost;
              const Icon = reward.icon;

              return (
                <div
                  key={reward.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${reward.bg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{reward.category}</span>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{reward.title}</h4>
                      <div className="text-xs font-extrabold text-amber-700 mt-0.5">
                        ⭐ {reward.cost} FitCredits
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford}
                    className={`text-xs px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all ${
                      canAfford
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xs'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Redeem' : 'Need More'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
