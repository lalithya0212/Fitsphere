import React from 'react';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { Link } from 'react-router-dom';
import { UserAvatar } from '../../components/common/UserAvatar';
import {
  ShieldCheck,
  Award,
  Calendar,
  MessageSquare,
  Clock,
  Dumbbell,
  CheckCircle2,
  Mail,
  UserCheck
} from 'lucide-react';

export const MyTrainerPage: React.FC = () => {
  const { currentUser, users } = useFitSphereStore();

  const assignedCoach = users.find(
    u => (currentUser.assignedTrainerId && u.id === currentUser.assignedTrainerId) ||
         (currentUser.assignedTrainerName && u.name === currentUser.assignedTrainerName)
  );

  const isAssigned = !!(currentUser.assignedTrainerId && currentUser.assignedTrainerName && assignedCoach);

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
          My Assigned Collegiate Coach
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Direct supervision by certified university athletic department performance staff.
        </p>
      </div>

      {!isAssigned ? (
        /* Pending Coach Allocation State */
        <div className="bg-white rounded-3xl p-10 border border-slate-200/80 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 mx-auto flex items-center justify-center text-amber-600 shadow-sm">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-display">Faculty Coach Assignment Pending</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              You are registered as a campus student-athlete. Your designated faculty coach will be allocated by the
              <strong> Campus Athletic Administration</strong> based on your sport specialization (
              {currentUser.sportSpecialization || 'Varsity Athletics'}) and academic department.
            </p>
          </div>
          <div className="pt-2 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs font-semibold text-amber-900">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>Status: Awaiting Administrator Allocation</span>
          </div>
        </div>
      ) : (
        /* Main Coach Card */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <UserAvatar
              name={currentUser.assignedTrainerName || assignedCoach.name}
              role="trainer"
              avatar={assignedCoach.avatar}
              size="2xl"
              className="ring-4 ring-emerald-500/20 shadow-md shrink-0"
            />

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-slate-950 font-display">
                  {currentUser.assignedTrainerName}
                </h2>
                <span className="badge-emerald font-bold text-xs flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Athletic Coach
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Faculty Coach — {assignedCoach?.sportSpecialization || currentUser.sportSpecialization || 'Varsity Conditioning'}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-2 pt-1">
                <span>Department of Intercollegiate Athletics</span>
                <span>•</span>
                <span className="text-emerald-600 font-semibold">Active Office Hours: Mon-Fri 14:00 - 18:00</span>
              </p>
            </div>
          </div>

          {/* Credentials & Certifications */}
          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Accreditation</div>
              <div className="text-xs font-black text-slate-900 mt-0.5">Verified Coach</div>
              <div className="text-[10px] text-slate-500">Collegiate Athletic Department</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Specialization</div>
              <div className="text-xs font-black text-slate-900 mt-0.5">
                {assignedCoach?.sportSpecialization || 'Varsity Conditioning'}
              </div>
              <div className="text-[10px] text-slate-500">Tactical Match Conditioning</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Accreditation Status</div>
              <div className="text-xs font-black text-emerald-600 mt-0.5">Officially Certified</div>
              <div className="text-[10px] text-slate-500">Sports Science Examination</div>
            </div>
          </div>

          {/* Philosophy */}
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 text-xs text-slate-700">
            <h4 className="font-bold text-emerald-900 mb-1">Coaching Philosophy</h4>
            <p className="leading-relaxed">
              &quot;My mission is to build robust, injury-resistant collegiate athletes who excel under match pressure.
              We emphasize progressive strength adaptations, movement kinematics, and rigorous recovery protocols to ensure peak performance across the academic year.&quot;
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/student/chat"
              className="btn-primary text-xs py-2.5 px-5 font-bold flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat with Coach</span>
            </Link>

            <Link
              to="/student/workouts"
              className="btn-secondary text-xs py-2.5 px-5 font-bold flex items-center gap-2"
            >
              <Dumbbell className="w-4 h-4" />
              <span>View Assigned Workouts</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
