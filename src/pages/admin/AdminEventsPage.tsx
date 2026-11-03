import React, { useState, useMemo } from 'react';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { SportsEvent } from '../../types';
import { UserAvatar } from '../../components/common/UserAvatar';
import { SportMediaBanner } from '../../components/common/SportMediaBanner';
import { ImageUploadField } from '../../components/common/ImageUploadField';
import { getSportVisual } from '../../utils/sportsIcons';
import { triggerCelebration } from '../../utils/confetti';
import {
  Trophy,
  Plus,
  Calendar,
  MapPin,
  Users,
  Coins,
  CheckCircle2,
  X,
  Sparkles,
  Trash2,
  Eye,
  GitBranch,
  Shield,
  Search,
  Filter,
  LayoutList,
  Layers,
  UserMinus,
  AlertCircle
} from 'lucide-react';

export const AdminEventsPage: React.FC = () => {
  const { events, createSportsEvent, deleteSportsEvent, adminRemoveEventRegistration, users, transactions } = useFitSphereStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [inspectEvent, setInspectEvent] = useState<SportsEvent | null>(null);

  // Tournament Form State
  const [title, setTitle] = useState('');
  const [sport, setSport] = useState('Football');
  const [category, setCategory] = useState<SportsEvent['category']>('Championship');
  const [format, setFormat] = useState('Single Elimination (Knockout)');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('16:00 - 19:30');
  const [venue, setVenue] = useState('Campus Main Sports Complex');
  const [requiredCredits, setRequiredCredits] = useState(50);
  const [maxParticipants, setMaxParticipants] = useState(32);
  const [prizePoolCredits, setPrizePoolCredits] = useState(1500);
  const [description, setDescription] = useState('');
  const [eligibility, setEligibility] = useState('Open to all registered collegiate students and inter-dorm athletic squads.');
  const [bannerUrl, setBannerUrl] = useState('');

  const [notice, setNotice] = useState<string | null>(null);

  // Registrations Section State (Filter & Search)
  const [selectedTournamentFilter, setSelectedTournamentFilter] = useState<string>('all');
  const [registrationSearchQuery, setRegistrationSearchQuery] = useState<string>('');
  const [registrationViewMode, setRegistrationViewMode] = useState<'table' | 'grouped'>('table');

  // Real-time calculation: Which student in which tournament has registered
  const allRegistrations = useMemo(() => {
    const list: {
      registrationId: string;
      studentId: string;
      studentName: string;
      studentEmail: string;
      studentAvatar: string;
      studentDepartment: string;
      studentDorm: string;
      studentCredits: number;
      studentFitnessScore: number;
      assignedTrainerName?: string;
      eventId: string;
      eventTitle: string;
      eventSport: string;
      eventCategory: string;
      eventDate: string;
      eventTime: string;
      eventVenue: string;
      requiredCredits: number;
      registeredDate: string;
    }[] = [];

    events.forEach(event => {
      (event.registeredStudentIds || []).forEach(studentId => {
        const student = users.find(u => u.id === studentId);
        const tx = transactions.find(
          t => t.userId === studentId && t.title?.includes(event.title) && t.type === 'event_registration'
        );

        list.push({
          registrationId: `${event.id}-${studentId}`,
          studentId,
          studentName: student?.name || 'Registered Athlete',
          studentEmail: student?.email || 'student@university.edu',
          studentAvatar: student?.avatar || '',
          studentDepartment: student?.department || 'Varsity Athletics',
          studentDorm: student?.dormHouse || 'Campus Residence',
          studentCredits: student?.fitCredits ?? 0,
          studentFitnessScore: student?.fitnessScore ?? 75,
          assignedTrainerName: student?.assignedTrainerName,
          eventId: event.id,
          eventTitle: event.title,
          eventSport: event.sport,
          eventCategory: event.category,
          eventDate: event.date,
          eventTime: event.time,
          eventVenue: event.venue,
          requiredCredits: event.requiredCredits,
          registeredDate: tx?.date || event.date
        });
      });
    });

    return list;
  }, [events, users, transactions]);

  const filteredRegistrations = useMemo(() => {
    return allRegistrations.filter(reg => {
      const matchesTournament =
        selectedTournamentFilter === 'all' || reg.eventId === selectedTournamentFilter;
      const q = registrationSearchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        reg.studentName.toLowerCase().includes(q) ||
        reg.studentEmail.toLowerCase().includes(q) ||
        reg.studentDepartment.toLowerCase().includes(q) ||
        reg.studentDorm.toLowerCase().includes(q) ||
        reg.eventTitle.toLowerCase().includes(q) ||
        reg.eventSport.toLowerCase().includes(q);

      return matchesTournament && matchesSearch;
    });
  }, [allRegistrations, selectedTournamentFilter, registrationSearchQuery]);

  const totalRegistrationsCount = allRegistrations.length;
  const uniqueAthletesCount = new Set(allRegistrations.map(r => r.studentId)).size;
  const totalCreditsCollected = allRegistrations.reduce((acc, r) => acc + r.requiredCredits, 0);
  const tournamentsWithEntriesCount = events.filter(e => (e.registeredStudentIds || []).length > 0).length;

  const handleRemoveRegistration = (eventId: string, studentId: string, studentName: string, eventTitle: string) => {
    if (
      confirm(
        `Are you sure you want to remove student "${studentName}" from tournament "${eventTitle}"?\nAny entry credits will be automatically refunded back to the student's wallet.`
      )
    ) {
      adminRemoveEventRegistration(eventId, studentId);
      setNotice(`Removed ${studentName} from "${eventTitle}". FitCredits refunded if applicable.`);
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const handleSportChange = (selectedSport: string) => {
    setSport(selectedSport);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createSportsEvent({
      title: title.trim(),
      sport,
      category,
      date,
      time,
      venue: venue.trim(),
      requiredCredits,
      maxParticipants,
      prizePoolCredits,
      status: 'Open',
      description: description.trim() || `Intercollegiate ${sport} tournament featuring bracket match fixtures and merit prizes.`,
      eligibility,
      rules: [
        `Tournament Format: ${format}.`,
        'All student participants must hold athletic clearance.',
        'Zero tolerance for ungentlemanly conduct; standard collegiate match rules apply.'
      ],
      bannerUrl: bannerUrl.trim()
    });

    setNotice(`Tournament "${title}" created and published to campus sports portal!`);
    triggerCelebration();
    setTimeout(() => setNotice(null), 4000);
    setIsCreateModalOpen(false);
    setTitle('');
    setDescription('');
    setBannerUrl('');
  };

  const handleDelete = (event: SportsEvent) => {
    if (confirm(`Are you sure you want to cancel and delete tournament "${event.title}"?`)) {
      deleteSportsEvent(event.id);
      setNotice(`Tournament "${event.title}" deleted.`);
      setTimeout(() => setNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
            Tournaments & Championship Brackets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure campus sports tournaments, define bracket parameters, and publish events to students in real-time.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary text-xs py-2.5 px-4 font-bold flex items-center gap-2 shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Tournament</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs font-bold">{notice}</div>
        </div>
      )}

      {/* Events Grid or Clean Empty State */}
      {events.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 mx-auto flex items-center justify-center text-amber-600 shadow-sm">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-display">No Campus Tournaments Scheduled</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            There are currently no mock tournaments. You can create real-time campus football tournaments, basketball cups, cricket leagues, or sprint meets according to your athletic calendar.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary text-xs py-2.5 px-5 font-bold inline-flex items-center gap-2 mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Tournament</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              {/* Event Banner with Uploaded Image or Sport Emoji Fallback */}
              <SportMediaBanner
                bannerUrl={event.bannerUrl}
                sport={event.sport}
                category={event.category}
                title={event.title}
                className="h-44"
              >
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
                    {event.sport}
                  </span>
                  <span className="badge-gold text-[10px] font-bold">
                    {event.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md">
                    {event.requiredCredits > 0 ? `${event.requiredCredits} Credits` : 'Free Entry'}
                  </span>
                  <button
                    onClick={() => handleDelete(event)}
                    className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-slate-300 hover:text-rose-400 transition-colors"
                    title="Delete tournament"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-base font-extrabold">{event.title}</h3>
                  <div className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-emerald-400" /> {event.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-400" /> {event.venue}</span>
                  </div>
                </div>
              </SportMediaBanner>

              {/* Event Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 mb-4 line-clamp-2">{event.description}</p>

                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs">
                    <div className="flex justify-between font-bold text-slate-800 mb-1">
                      <span>Participants Enrolled:</span>
                      <span className="text-emerald-700">{event.currentParticipants} / {event.maxParticipants} Athletes</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min(100, (event.currentParticipants / (event.maxParticipants || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>Prize Pool: <strong className="text-amber-700 font-black">⭐ {event.prizePoolCredits} Credits</strong></span>
                    <button
                      onClick={() => setInspectEvent(event)}
                      className="inline-flex items-center gap-1 font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>View Brackets & Roster</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          DEDICATED SEPARATE SECTION: LIVE STUDENT TOURNAMENT REGISTRATIONS & ROSTERS
         ───────────────────────────────────────────────────────────── */}
      <section className="mt-10 pt-8 border-t border-slate-200/80 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Student Roster Ledger
              </span>
              <span className="text-xs font-bold text-slate-500">
                • {totalRegistrationsCount} Total {totalRegistrationsCount === 1 ? 'Registration' : 'Registrations'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 font-display flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-600" />
              <span>Student Tournament Registrations</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Live synchronized ledger showing which student is registered in which tournament. View participant eligibility, department, entry credits paid, and manage rosters.
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setRegistrationViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                registrationViewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>All Registrations Table</span>
            </button>
            <button
              type="button"
              onClick={() => setRegistrationViewMode('grouped')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                registrationViewMode === 'grouped'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Grouped by Tournament</span>
            </button>
          </div>
        </div>

        {/* Real-Time Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Total Enrolled Entries
            </span>
            <div className="text-2xl font-black text-slate-900 font-display">
              {totalRegistrationsCount}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
              Across campus tournaments
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Unique Student Athletes
            </span>
            <div className="text-2xl font-black text-slate-900 font-display">
              {uniqueAthletesCount}
            </div>
            <span className="text-[11px] text-slate-500 font-semibold mt-0.5 block">
              Distinct registered students
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Entry Credits Collected
            </span>
            <div className="text-2xl font-black text-amber-600 font-display">
              ⭐ {totalCreditsCollected}
            </div>
            <span className="text-[11px] text-slate-500 font-semibold mt-0.5 block">
              FitCredits entry volume
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Active Competitions
            </span>
            <div className="text-2xl font-black text-blue-600 font-display">
              {tournamentsWithEntriesCount} / {events.length}
            </div>
            <span className="text-[11px] text-slate-500 font-semibold mt-0.5 block">
              Tournaments with athletes
            </span>
          </div>
        </div>

        {/* Filtering & Search Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, email, department, dorm, or tournament title..."
              value={registrationSearchQuery}
              onChange={e => setRegistrationSearchQuery(e.target.value)}
              className="w-full pl-10 pr-14 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {registrationSearchQuery && (
              <button
                type="button"
                onClick={() => setRegistrationSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedTournamentFilter}
              onChange={e => setSelectedTournamentFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Tournaments ({allRegistrations.length} registrations)</option>
              {events.map(e => (
                <option key={e.id} value={e.id}>
                  {e.title} ({(e.registeredStudentIds || []).length} registered)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content based on View Mode */}
        {allRegistrations.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200/80 text-center space-y-3 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">No Student Registrations Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              When students register for scheduled tournaments via their Campus Sports portal, their real-time registration entries, student profile, and tournament selections will automatically display in this dedicated ledger.
            </p>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-xs text-slate-500">
            No registrations match your search query &quot;{registrationSearchQuery}&quot;. Try adjusting your filter.
          </div>
        ) : registrationViewMode === 'table' ? (
          /* Table View: Full Breakdown of which student in which tournament */
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Student Athlete</th>
                    <th className="py-3 px-4">Tournament Registered</th>
                    <th className="py-3 px-4">Schedule & Venue</th>
                    <th className="py-3 px-4">Entry Credits</th>
                    <th className="py-3 px-4">Athletic Status</th>
                    <th className="py-3 px-4 text-right">Roster Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRegistrations.map((reg) => {
                    const visual = getSportVisual(reg.eventSport, reg.eventCategory);
                    return (
                      <tr key={reg.registrationId} className="hover:bg-slate-50/70 transition-colors">
                        {/* Student Athlete Column */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <UserAvatar name={reg.studentName} role="student" size="sm" />
                            <div>
                              <div className="font-extrabold text-slate-900">{reg.studentName}</div>
                              <div className="text-[11px] text-slate-400">{reg.studentEmail}</div>
                              <div className="text-[10px] text-slate-500 font-medium mt-0.5 flex items-center gap-1.5">
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">{reg.studentDepartment}</span>
                                <span>•</span>
                                <span>{reg.studentDorm}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Tournament Registered Column */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-start gap-2.5">
                            <div className="text-xl shrink-0 select-none">{visual.emoji}</div>
                            <div>
                              <div className="font-bold text-slate-900 leading-snug">{reg.eventTitle}</div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                                  {reg.eventSport}
                                </span>
                                <span className="badge-gold text-[10px] font-bold">
                                  {reg.eventCategory}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Schedule & Venue */}
                        <td className="py-3.5 px-4">
                          <div className="text-slate-800 font-semibold">{reg.eventDate}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <span>{reg.eventTime}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium truncate max-w-[160px]">
                            📍 {reg.eventVenue}
                          </div>
                        </td>

                        {/* Entry Credits */}
                        <td className="py-3.5 px-4">
                          {reg.requiredCredits > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-black text-[11px]">
                              ⭐ {reg.requiredCredits} Credits Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-[11px]">
                              Free Entry Pass
                            </span>
                          )}
                          <div className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Cleared & Enrolled
                          </div>
                        </td>

                        {/* Athletic Status */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <div className="text-[11px] text-slate-700 font-semibold">
                              FitScore: <strong className="text-emerald-600">{reg.studentFitnessScore}</strong>/100
                            </div>
                            <div className="text-[10px] text-slate-500">
                              Wallet: <strong>⭐ {reg.studentCredits}</strong>
                            </div>
                            {reg.assignedTrainerName && (
                              <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                                Coach: {reg.assignedTrainerName}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Action Column */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveRegistration(
                                reg.eventId,
                                reg.studentId,
                                reg.studentName,
                                reg.eventTitle
                              )
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-[11px] font-bold transition-colors"
                            title="Remove student and refund entry credits"
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grouped by Tournament View */
          <div className="space-y-4">
            {events.map((event) => {
              const registeredForThisEvent = allRegistrations.filter(r => r.eventId === event.id);
              const visual = getSportVisual(event.sport, event.category);

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl shadow-xs shrink-0 select-none">
                        {visual.emoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-slate-900">{event.title}</h3>
                          <span className="badge-gold text-[10px] font-bold">{event.category}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                          <span>📅 {event.date} • {event.time}</span>
                          <span>•</span>
                          <span>📍 {event.venue}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-900">
                          {registeredForThisEvent.length} / {event.maxParticipants} Athletes
                        </div>
                        <div className="text-[11px] text-amber-700 font-semibold">
                          {event.requiredCredits > 0 ? `${event.requiredCredits} Credits / athlete` : 'Free entry'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Athletes Roster for this tournament */}
                  {registeredForThisEvent.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-center text-xs text-slate-400">
                      No student athletes have enrolled in this tournament yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {registeredForThisEvent.map(reg => (
                        <div
                          key={reg.studentId}
                          className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <UserAvatar name={reg.studentName} role="student" size="sm" />
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 truncate">{reg.studentName}</div>
                              <div className="text-[10px] text-slate-400 truncate">{reg.studentDepartment}</div>
                              <div className="text-[9px] text-slate-500 font-medium">{reg.studentDorm}</div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveRegistration(
                                reg.eventId,
                                reg.studentId,
                                reg.studentName,
                                reg.eventTitle
                              )
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                            title="Remove student from roster"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Inspect Tournament Brackets & Registered Athletes Modal */}
      {inspectEvent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 border border-slate-200 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{inspectEvent.title}</h3>
                <p className="text-xs text-slate-500">{inspectEvent.sport} • {inspectEvent.category} • {inspectEvent.venue}</p>
              </div>
              <button onClick={() => setInspectEvent(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-5 space-y-4">
              {/* Registered Participants */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Enrolled Students ({inspectEvent.registeredStudentIds.length} / {inspectEvent.maxParticipants})
                </h4>
                {inspectEvent.registeredStudentIds.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-400">
                    No students have registered for this tournament yet. Registrations will appear in real-time.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {inspectEvent.registeredStudentIds.map(studentId => {
                      const studentObj = users.find(u => u.id === studentId);
                      return (
                        <div key={studentId} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-xs">
                          <UserAvatar name={studentObj?.name || 'Registered Athlete'} role="student" size="sm" />
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-900 truncate">{studentObj?.name || 'Registered Athlete'}</div>
                            <div className="text-[10px] text-slate-400 truncate">{studentObj?.department || 'Student Athlete'}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Tournament Knockout Bracket Visualization */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <GitBranch className="w-4 h-4 text-emerald-600" /> Tournament Bracket Structure
                </h4>
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                  <div className="text-xs text-slate-400">
                    Championship Bracket: <span className="text-emerald-400 font-bold">{inspectEvent.sport} Knockout</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Quarterfinals</div>
                      <div className="font-bold text-slate-200">Match 1 & 2</div>
                      <div className="text-[9px] text-slate-400 mt-1">Pending Seeding</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Semifinals</div>
                      <div className="font-bold text-slate-200">Match 3 & 4</div>
                      <div className="text-[9px] text-slate-400 mt-1">Qualifiers</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200">
                      <div className="text-[10px] uppercase font-bold text-amber-400 mb-1">Grand Final</div>
                      <div className="font-black">Championship Match</div>
                      <div className="text-[9px] text-amber-300 mt-1">⭐ {inspectEvent.prizePoolCredits} Credits</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 font-display">Configure Sports Tournament</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tournament Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inter-Department Football Championship 2026"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sport</label>
                  <select
                    value={sport}
                    onChange={e => handleSportChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  >
                    <option value="Football">Football</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Cricket">Cricket</option>
                    <option value="Track & Field">Track & Field / Sprint</option>
                    <option value="Badminton">Badminton</option>
                    <option value="Tennis">Tennis</option>
                    <option value="Volleyball">Volleyball</option>
                    <option value="Swimming">Swimming</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tournament Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  >
                    <option value="Championship">Varsity Championship</option>
                    <option value="Tournament">Knockout Tournament</option>
                    <option value="Campus League">Campus League</option>
                    <option value="Fitness Challenge">Open Fitness Challenge</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Competition Format</label>
                  <select
                    value={format}
                    onChange={e => setFormat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  >
                    <option value="Single Elimination (Knockout)">Single Elimination (Knockout)</option>
                    <option value="Round Robin Group Stage">Round Robin Group Stage</option>
                    <option value="Double Elimination Bracket">Double Elimination Bracket</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Venue</label>
                  <input
                    type="text"
                    required
                    value={venue}
                    onChange={e => setVenue(e.target.value)}
                    placeholder="e.g. Main Campus Stadium"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time Schedule</label>
                  <input
                    type="text"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    placeholder="16:00 - 19:30"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Entry Credits</label>
                  <input
                    type="number"
                    min="0"
                    value={requiredCredits}
                    onChange={e => setRequiredCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-amber-50 text-amber-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Squads/Athletes</label>
                  <input
                    type="number"
                    min="2"
                    value={maxParticipants}
                    onChange={e => setMaxParticipants(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Prize Pool ⭐</label>
                  <input
                    type="number"
                    min="0"
                    value={prizePoolCredits}
                    onChange={e => setPrizePoolCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Gallery Image Upload Field */}
              <ImageUploadField
                label="Tournament Reference Image"
                value={bannerUrl}
                onChange={setBannerUrl}
                sport={sport}
                category={category}
                helperText="Upload a tournament poster from gallery (optional). If left empty, an official sport icon & emoji banner will be generated."
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description & Eligibility</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Format guidelines, team registration requirements, and match length..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="btn-secondary text-xs py-2.5 px-4 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary text-xs py-2.5 font-bold"
                >
                  Publish Tournament to Campus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
