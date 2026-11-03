import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  UserProfile,
  UserRole,
  WorkoutPlan,
  WorkoutProofSubmission,
  SportsEvent,
  FitCreditTransaction,
  TrainerVerificationApplication,
  StudentAssessment,
  ChatMessage,
  PushNotification,
  AthleticDimensions,
  LeaderboardEntry
} from '../types';
import {
  INITIAL_STUDENT_ASSESSMENT,
  INITIAL_STUDENT,
  DEMO_USERS
} from '../data/mockData';
import { api, tokenStorage } from '../services/api';

export const DEFAULT_ADMIN: UserProfile = {
  id: 'admin-1',
  name: 'Shyam Raj',
  email: 'shyamraj@gmail.com',
  password: 'shyam123',
  role: 'admin',
  avatar: '',
  department: 'Intercollegiate Athletics & Sports Administration',
  credentials: ['Director of Athletics', 'Sports Administrator'],
  verificationStatus: 'verified',
  isDemo: false
};

interface FitSphereState {
  currentUser: UserProfile;
  activeRole: UserRole;
  isAuthenticated: boolean;
  users: UserProfile[];
  workouts: WorkoutPlan[];
  proofSubmissions: WorkoutProofSubmission[];
  events: SportsEvent[];
  transactions: FitCreditTransaction[];
  trainerApplications: TrainerVerificationApplication[];
  studentAssessment: StudentAssessment;
  chatMessages: ChatMessage[];
  notifications: PushNotification[];

  // Authentication & Account Management Actions
  login: (email: string, password?: string) => Promise<{ success: boolean; message: string; user?: UserProfile }>;
  loginAsUser: (userId: string) => { success: boolean; user?: UserProfile };
  logout: () => void;
  registerUser: (userData: {
    name: string;
    email: string;
    role: UserRole;
    department?: string;
    sportSpecialization?: string;
    password?: string;
    dormHouse?: string;
    academicYear?: string;
    credentials?: string[];
    bio?: string;
    verificationScore?: number;
  }) => Promise<{ success: boolean; message: string; user: UserProfile }>;
  deleteUser: (userId: string) => { success: boolean; message: string };
  deleteDemoAccounts: () => { success: boolean; count: number };
  restoreDemoAccounts: () => void;

  // Actions
  switchRole: (role: UserRole) => void;
  submitWorkoutProof: (data: {
    workoutId: string;
    workoutTitle: string;
    proofMediaUrl: string;
    proofMediaType: 'image' | 'video';
    telemetry: {
      durationMinutes: number;
      caloriesBurned: number;
      heartRateAvg: number;
      distanceKm?: number;
      repsCompleted?: number;
    };
    athleteNotes: string;
  }) => void;
  reviewWorkoutProof: (
    proofId: string,
    action: 'approve' | 'reject',
    trainerFeedback: string,
    creditsToAward?: number
  ) => void;
  registerForEvent: (eventId: string) => { success: boolean; message: string };
  createSportsEvent: (eventData: Omit<SportsEvent, 'id' | 'currentParticipants' | 'registeredStudentIds'>) => void;
  deleteSportsEvent: (eventId: string) => void;
  adminRemoveEventRegistration: (eventId: string, studentId: string) => void;
  createWorkoutPlan: (plan: Omit<WorkoutPlan, 'id' | 'assignedByTrainerName'>) => void;
  updateStudentAssessment: (
    studentId: string,
    newDimensions: AthleticDimensions,
    notes: string,
    keyStrengths: string[],
    focusAreas: string[]
  ) => void;
  submitTrainerVerification: (data: {
    trainerName: string;
    trainerEmail: string;
    avatar: string;
    sportSpecialization: string;
    experienceYears: number;
    bio: string;
    certifications: string[];
    assessmentScore: number;
  }) => void;
  verifyTrainer: (applicationId: string, action: 'approve' | 'reject') => void;
  assignTrainerToStudent: (studentId: string, trainerId?: string | null) => void;
  unassignTrainerFromStudent: (studentId: string) => void;
  grantAdminBonusCredits: (studentId: string, amount: number, reason: string) => void;
  sendChatMessage: (content: string, receiverId?: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  getLeaderboard: () => LeaderboardEntry[];
  resetToDefaults: () => void;
}

export const useFitSphereStore = create<FitSphereState>()(
  persist(
    (set, get) => ({
      currentUser: DEFAULT_ADMIN,
      activeRole: 'admin',
      isAuthenticated: false,
      users: [DEFAULT_ADMIN],
      workouts: [],
      proofSubmissions: [],
      events: [],
      transactions: [],
      trainerApplications: [],
      studentAssessment: INITIAL_STUDENT_ASSESSMENT,
      chatMessages: [],
      notifications: [],

      login: async (email: string, password?: string) => {
        const { users } = get();
        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password ? password.trim() : '';

        // 1. Authenticate with Spring Boot Backend REST API (MySQL)
        try {
          const backendData = await api.login(cleanEmail, cleanPassword);
          if (backendData && backendData.user) {
            const bUser = backendData.user;
            const mappedRole = bUser.role.toLowerCase() as UserRole;

            const authUser: UserProfile = {
              id: `user-${bUser.id}`,
              name: bUser.name,
              email: bUser.email.toLowerCase(),
              phone: bUser.phone,
              role: mappedRole,
              avatar: '',
              department: mappedRole === 'admin'
                ? 'Intercollegiate Athletics & Sports Administration'
                : (mappedRole === 'trainer' ? 'Varsity Athletics & Performance' : 'General Athletics'),
              sportSpecialization: mappedRole === 'student' ? 'Track & Field' : undefined,
              verificationStatus: mappedRole === 'student' ? undefined : 'verified',
              fitCredits: mappedRole === 'student' ? 250 : undefined,
              streakDays: 1,
              isDemo: false
            };

            const existingIndex = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
            const updatedUsers = existingIndex >= 0
              ? users.map((u, i) => i === existingIndex ? authUser : u)
              : [...users, authUser];

            set({
              currentUser: authUser,
              activeRole: mappedRole,
              isAuthenticated: true,
              users: updatedUsers
            });

            return {
              success: true,
              message: `Welcome back, ${authUser.name}!`,
              user: authUser
            };
          }
        } catch (backendError: any) {
          const errMsg = backendError?.message || '';
          // If backend provided an explicit rejection message
          if (
            errMsg.includes('Invalid') ||
            errMsg.includes('password') ||
            errMsg.includes('credentials') ||
            errMsg.includes('deactivated')
          ) {
            return {
              success: false,
              message: errMsg
            };
          }
          console.warn('Backend server not responding, checking local store:', errMsg);
        }

        // 2. Fallback to local accounts (e.g. if Spring Boot server hasn't started yet)
        const foundUser = users.find(u => u.email.toLowerCase() === cleanEmail);
        if (!foundUser) {
          return {
            success: false,
            message: 'No account found with this email. Please check your credentials or register.'
          };
        }

        if (foundUser.password && (!password || foundUser.password !== cleanPassword)) {
          return {
            success: false,
            message: 'Incorrect password. Please verify your credentials.'
          };
        }

        const userWithCredits: UserProfile = {
          ...foundUser,
          fitCredits: foundUser.role === 'student' ? (foundUser.fitCredits && foundUser.fitCredits > 0 ? foundUser.fitCredits : 250) : foundUser.fitCredits
        };

        set({
          currentUser: userWithCredits,
          activeRole: userWithCredits.role,
          isAuthenticated: true
        });

        return {
          success: true,
          message: `Welcome back, ${userWithCredits.name}!`,
          user: userWithCredits
        };
      },

      loginAsUser: (userId: string) => {
        const { users } = get();
        const foundUser = users.find(u => u.id === userId);
        if (!foundUser) {
          return { success: false, message: 'User not found.' };
        }

        set({
          currentUser: foundUser,
          activeRole: foundUser.role,
          isAuthenticated: true
        });

        return { success: true, user: foundUser };
      },

      logout: () => {
        tokenStorage.clear();
        set({
          isAuthenticated: false
        });
      },

      registerUser: async (userData) => {
        const { users, notifications, transactions } = get();
        const cleanEmail = userData.email.trim().toLowerCase();
        const cleanPassword = userData.password ? userData.password.trim() : 'Password123!';

        if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
          return {
            success: false,
            message: 'An account with this email already exists. Please sign in instead.',
            user: users.find(u => u.email.toLowerCase() === cleanEmail)!
          };
        }

        // Register directly into Spring Boot Backend (MySQL)
        let backendUser: any = null;
        try {
          if (userData.role === 'student') {
            backendUser = await api.registerStudent({
              name: userData.name.trim(),
              email: cleanEmail,
              password: cleanPassword,
              phone: '+1 (555) 000-0000'
            });
          } else if (userData.role === 'trainer') {
            backendUser = await api.registerTrainer({
              name: userData.name.trim(),
              email: cleanEmail,
              password: cleanPassword,
              phone: '+1 (555) 000-0000'
            });
          }
        } catch (backendError: any) {
          const errMsg = backendError?.message || '';
          if (errMsg.includes('already in use') || errMsg.includes('already exists') || errMsg.includes('409')) {
            return {
              success: false,
              message: 'This email is already registered in the database. Please sign in.',
              user: users.find(u => u.email.toLowerCase() === cleanEmail) || DEFAULT_ADMIN
            };
          }
          console.warn('Backend registration failed, saving locally:', errMsg);
        }

        const newId = backendUser ? `user-${backendUser.id}` : `${userData.role}-${Date.now()}`;
        const avatar = '';

        const newUser: UserProfile = {
          id: newId,
          name: userData.name.trim(),
          email: cleanEmail,
          password: cleanPassword,
          role: userData.role,
          avatar,
          department: userData.department || (userData.role === 'student' ? 'General Athletics' : 'Sports Science & Athletics'),
          dormHouse: userData.dormHouse || (userData.role === 'student' ? 'Campus Quad' : undefined),
          studentId: userData.role === 'student' ? `ATH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
          academicYear: userData.academicYear || (userData.role === 'student' ? 'Freshman (Year 1)' : undefined),
          sportSpecialization: userData.sportSpecialization || (userData.role === 'student' ? 'Track & Field' : 'Varsity Conditioning'),
          fitnessLevel: userData.role === 'student' ? 'intermediate' : undefined,
          fitnessScore: userData.role === 'student' ? 78 : undefined,
          fitnessScoreDelta: userData.role === 'student' ? 5 : undefined,
          assignedTrainerId: undefined,
          assignedTrainerName: undefined,
          credentials: userData.credentials || (userData.role === 'trainer' ? ['Certified Athletic Coach'] : undefined),
          verificationStatus: userData.role === 'trainer' ? 'pending' : (userData.role === 'admin' ? 'verified' : undefined),
          verificationScore: userData.verificationScore !== undefined ? userData.verificationScore : (userData.role === 'trainer' ? 0 : undefined),
          fitCredits: userData.role === 'student' ? 250 : undefined,
          streakDays: 1,
          isDemo: false
        };

        const welcomeNotif: PushNotification = {
          id: `notif-${Date.now()}`,
          title: 'Welcome to FitSphere!',
          message: userData.role === 'student'
            ? 'Your collegiate athletic profile is active with 250 bonus FitCredits. Start logging your workouts!'
            : 'Your coach registration has been submitted. Awaiting administrator verification before athlete assignment.',
          type: 'system',
          timestamp: new Date().toISOString(),
          read: false,
          recipientRole: userData.role,
          recipientUserId: newId
        };

        let updatedNotifications = [welcomeNotif, ...notifications];
        let updatedTrainerApplications = get().trainerApplications;

        if (userData.role === 'trainer') {
          const appExists = updatedTrainerApplications.some(a => a.trainerEmail.toLowerCase() === cleanEmail);
          if (!appExists) {
            const newApp: TrainerVerificationApplication = {
              id: `app-${Date.now()}`,
              trainerName: userData.name.trim(),
              trainerEmail: cleanEmail,
              avatar: avatar || '',
              sportSpecialization: userData.sportSpecialization || 'Varsity Conditioning',
              experienceYears: 4,
              bio: userData.bio || `Collegiate coach candidate specializing in ${userData.sportSpecialization || 'Varsity Conditioning'}`,
              certifications: userData.credentials || ['Collegiate Coach Candidate'],
              assessmentScore: userData.verificationScore !== undefined ? userData.verificationScore : 85,
              passed: (userData.verificationScore !== undefined ? userData.verificationScore : 85) >= 70,
              status: 'pending',
              submittedAt: new Date().toISOString().split('T')[0]
            };
            updatedTrainerApplications = [newApp, ...updatedTrainerApplications];
          }

          const adminNotif: PushNotification = {
            id: `notif-${Date.now()}-admin`,
            title: 'New Coach Verification Pending 📋',
            message: `Coach candidate ${userData.name.trim()} has registered and requires administrator verification.`,
            type: 'system',
            timestamp: new Date().toISOString(),
            read: false,
            recipientRole: 'admin',
            link: '/admin/trainers'
          };
          updatedNotifications = [adminNotif, ...updatedNotifications];
        }

        let updatedTransactions = transactions;
        if (userData.role === 'student') {
          const welcomeTx: FitCreditTransaction = {
            id: `tx-${Date.now()}`,
            userId: newId,
            type: 'admin_bonus',
            title: 'New Athlete Welcome Grant & Orientation Bonus',
            amount: 250,
            date: new Date().toISOString().split('T')[0],
            category: 'Bonus'
          };
          updatedTransactions = [welcomeTx, ...transactions];
        }

        set({
          users: [newUser, ...users],
          currentUser: newUser,
          activeRole: newUser.role,
          isAuthenticated: false,
          notifications: updatedNotifications,
          trainerApplications: updatedTrainerApplications,
          transactions: updatedTransactions
        });

        return {
          success: true,
          message: `Account created successfully! Welcome, ${newUser.name}.`,
          user: newUser
        };
      },

      deleteUser: (userId: string) => {
        const { users, currentUser } = get();
        const remainingUsers = users
          .filter(u => u.id !== userId)
          .map(u => {
            if (u.assignedTrainerId === userId) {
              return {
                ...u,
                assignedTrainerId: undefined,
                assignedTrainerName: undefined
              };
            }
            return u;
          });
        const wasCurrentUser = currentUser.id === userId;

        let nextUser = currentUser;
        if (wasCurrentUser) {
          nextUser = remainingUsers.length > 0 ? remainingUsers[0] : DEFAULT_ADMIN;
        } else if (currentUser.assignedTrainerId === userId) {
          nextUser = {
            ...currentUser,
            assignedTrainerId: undefined,
            assignedTrainerName: undefined
          };
        }

        set({
          users: remainingUsers,
          currentUser: nextUser,
          activeRole: nextUser.role,
          isAuthenticated: wasCurrentUser ? false : get().isAuthenticated
        });

        return { success: true, message: 'Account deleted successfully.' };
      },

      deleteDemoAccounts: () => {
        const { users, currentUser } = get();
        const demoIds = ['student-1', 'student-2', 'student-3', 'student-4', 'student-5', 'trainer-1', 'trainer-2'];
        const nonDemoUsers = users.filter(u => !u.isDemo && !demoIds.includes(u.id));
        const deletedCount = users.length - nonDemoUsers.length;

        const isCurrentDemo = currentUser.isDemo || demoIds.includes(currentUser.id);
        let nextUser = currentUser;

        if (isCurrentDemo) {
          nextUser = nonDemoUsers.length > 0 ? nonDemoUsers[0] : DEFAULT_ADMIN;
        }

        set({
          users: nonDemoUsers,
          currentUser: nextUser,
          activeRole: nextUser.role,
          isAuthenticated: isCurrentDemo ? false : get().isAuthenticated
        });

        return { success: true, count: deletedCount };
      },

      restoreDemoAccounts: () => {
        // Production-ready store: no mock demo accounts restored
      },

      switchRole: (role: UserRole) => {
        const { users } = get();
        const targetUser = users.find(u => u.role === role) || DEFAULT_ADMIN;

        set({
          activeRole: role,
          currentUser: targetUser
        });
      },

      submitWorkoutProof: (data) => {
        const { currentUser, proofSubmissions, notifications, workouts } = get();
        const workout = workouts.find(w => w.id === data.workoutId);
        const reward = workout ? workout.rewardCredits : 15;

        const newProof: WorkoutProofSubmission = {
          id: `proof-${Date.now()}`,
          studentId: currentUser.id,
          studentName: currentUser.name,
          studentAvatar: currentUser.avatar,
          workoutId: data.workoutId,
          workoutTitle: data.workoutTitle,
          submittedAt: new Date().toISOString(),
          proofMediaUrl: data.proofMediaUrl,
          proofMediaType: data.proofMediaType,
          telemetry: data.telemetry,
          athleteNotes: data.athleteNotes,
          status: 'pending',
          creditsAwarded: reward,
        };

        const trainerNotif: PushNotification = {
          id: `notif-${Date.now()}`,
          recipientRole: 'trainer',
          recipientUserId: currentUser.assignedTrainerId || 'trainer-1',
          title: 'New Student Proof Submission 📥',
          message: `${currentUser.name} submitted proof for "${data.workoutTitle}". Review now to award credits.`,
          type: 'proof',
          timestamp: new Date().toISOString(),
          read: false,
          link: '/trainer/proof-review'
        };

        set({
          proofSubmissions: [newProof, ...proofSubmissions],
          notifications: [trainerNotif, ...notifications]
        });
      },

      reviewWorkoutProof: (proofId, action, trainerFeedback, creditsToAward) => {
        const { proofSubmissions, users, currentUser, transactions, notifications } = get();
        const proof = proofSubmissions.find(p => p.id === proofId);
        if (!proof) return;

        const credits = creditsToAward !== undefined ? creditsToAward : proof.creditsAwarded;
        const isApproved = action === 'approve';

        // Update proof status
        const updatedProofs = proofSubmissions.map(p => {
          if (p.id === proofId) {
            return {
              ...p,
              status: action === 'approve' ? ('approved' as const) : ('rejected' as const),
              reviewedByTrainerId: currentUser.id,
              reviewedByTrainerName: currentUser.name,
              reviewedAt: new Date().toISOString(),
              trainerFeedback,
              creditsAwarded: isApproved ? credits : 0
            };
          }
          return p;
        });

        // If approved, update student's credits, streak, and log transaction
        let updatedUsers = [...users];
        let updatedTransactions = [...transactions];
        let newNotifs = [...notifications];

        if (isApproved) {
          updatedUsers = users.map(u => {
            if (u.id === proof.studentId) {
              const newBalance = (u.fitCredits || 0) + credits;
              const newStreak = (u.streakDays || 0) + 1;
              return {
                ...u,
                fitCredits: newBalance,
                streakDays: newStreak
              };
            }
            return u;
          });

          // Add transaction
          const newTx: FitCreditTransaction = {
            id: `tx-${Date.now()}`,
            userId: proof.studentId,
            type: 'workout_completed',
            title: `Proof Approved: ${proof.workoutTitle}`,
            amount: credits,
            date: new Date().toISOString().split('T')[0],
            category: 'Workout'
          };
          updatedTransactions = [newTx, ...transactions];

          // Notify student
          newNotifs.unshift({
            id: `notif-${Date.now()}`,
            recipientRole: 'student',
            recipientUserId: proof.studentId,
            title: 'Workout Proof Approved! ⭐',
            message: `${currentUser.name} approved your "${proof.workoutTitle}" proof and awarded +${credits} FitCredits!`,
            type: 'credit',
            timestamp: new Date().toISOString(),
            read: false,
            link: '/student/fitcredits'
          });
        } else {
          // Notify student of rejection/revision
          newNotifs.unshift({
            id: `notif-${Date.now()}`,
            recipientRole: 'student',
            recipientUserId: proof.studentId,
            title: 'Workout Revision Requested ⚠️',
            message: `${currentUser.name} reviewed your "${proof.workoutTitle}" submission: "${trainerFeedback}"`,
            type: 'proof',
            timestamp: new Date().toISOString(),
            read: false,
            link: '/student/submit-proof'
          });
        }

        // Update current user if student is active
        const updatedCurrentUser = updatedUsers.find(u => u.id === currentUser.id) || currentUser;

        set({
          proofSubmissions: updatedProofs,
          users: updatedUsers,
          currentUser: updatedCurrentUser,
          transactions: updatedTransactions,
          notifications: newNotifs
        });
      },

      registerForEvent: (eventId) => {
        const { events, currentUser, users, transactions, notifications } = get();
        const event = events.find(e => e.id === eventId);
        if (!event) return { success: false, message: 'Event not found.' };

        if (event.registeredStudentIds.includes(currentUser.id)) {
          return { success: false, message: 'You are already registered for this event.' };
        }

        const currentCredits = currentUser.fitCredits || 0;
        if (currentCredits < event.requiredCredits) {
          return {
            success: false,
            message: `Insufficient FitCredits. You need ${event.requiredCredits} credits, but have ${currentCredits}.`
          };
        }

        // Deduct credits
        const remainingCredits = currentCredits - event.requiredCredits;
        const updatedUsers = users.map(u => {
          if (u.id === currentUser.id) {
            return { ...u, fitCredits: remainingCredits };
          }
          return u;
        });

        // Update event
        const updatedEvents = events.map(e => {
          if (e.id === eventId) {
            return {
              ...e,
              currentParticipants: e.currentParticipants + 1,
              registeredStudentIds: [...e.registeredStudentIds, currentUser.id]
            };
          }
          return e;
        });

        // Log transaction if requiredCredits > 0
        let updatedTransactions = [...transactions];
        if (event.requiredCredits > 0) {
          updatedTransactions.unshift({
            id: `tx-${Date.now()}`,
            userId: currentUser.id,
            type: 'event_registration',
            title: `Entry Pass: ${event.title}`,
            amount: -event.requiredCredits,
            date: new Date().toISOString().split('T')[0],
            category: 'Event'
          });
        }

        // Add confirmation notification to student
        const newNotif: PushNotification = {
          id: `notif-${Date.now()}`,
          recipientRole: 'student',
          recipientUserId: currentUser.id,
          title: 'Event Registration Confirmed! 🏆',
          message: `You are officially registered for ${event.title}. Bib details and schedule sent to your campus portal.`,
          type: 'event',
          timestamp: new Date().toISOString(),
          read: false,
          link: '/student/events'
        };

        // Add real-time notification to admin
        const adminEventNotif: PushNotification = {
          id: `notif-${Date.now()}-admin`,
          recipientRole: 'admin',
          title: 'Student Tournament Registration 🏅',
          message: `${currentUser.name} (${currentUser.department || 'Student Athlete'}) registered for "${event.title}".`,
          type: 'event',
          timestamp: new Date().toISOString(),
          read: false,
          link: '/admin/events'
        };

        set({
          events: updatedEvents,
          users: updatedUsers,
          currentUser: { ...currentUser, fitCredits: remainingCredits },
          transactions: updatedTransactions,
          notifications: [newNotif, adminEventNotif, ...notifications]
        });

        return { success: true, message: `Successfully registered for ${event.title}!` };
      },

      createWorkoutPlan: (plan) => {
        const { workouts, currentUser, notifications } = get();
        const newPlan: WorkoutPlan = {
          ...plan,
          id: `plan-${Date.now()}`,
          trainerId: currentUser.id,
          assignedByTrainerName: currentUser.name
        };

        const newNotif: PushNotification = {
          id: `notif-${Date.now()}`,
          recipientRole: 'student',
          title: 'New Training Plan Assigned! 🏋️',
          message: `${currentUser.name} assigned a new workout: "${plan.title}" (${plan.durationMinutes} mins, +${plan.rewardCredits} Credits).`,
          type: 'workout',
          timestamp: new Date().toISOString(),
          read: false,
          link: '/student/workouts'
        };

        set({
          workouts: [newPlan, ...workouts],
          notifications: [newNotif, ...notifications]
        });
      },

      updateStudentAssessment: (studentId, newDimensions, notes, keyStrengths, focusAreas) => {
        const { studentAssessment, users, currentUser } = get();

        // Calculate new fitness score: weighted average of the 5 dimensions
        const calculatedScore = Math.round(
          (newDimensions.strength +
            newDimensions.speed +
            newDimensions.endurance +
            newDimensions.flexibility +
            newDimensions.skill) / 5
        );

        const updatedAssessment: StudentAssessment = {
          ...studentAssessment,
          evaluatedAt: new Date().toISOString().split('T')[0],
          evaluatedByTrainerId: currentUser.id,
          current: newDimensions,
          trainerNotes: notes,
          keyStrengths,
          focusAreas
        };

        const updatedUsers = users.map(u => {
          if (u.id === studentId) {
            const oldScore = u.fitnessScore || 80;
            return {
              ...u,
              fitnessScore: calculatedScore,
              fitnessScoreDelta: calculatedScore - oldScore
            };
          }
          return u;
        });

        set({
          studentAssessment: updatedAssessment,
          users: updatedUsers
        });
      },

      submitTrainerVerification: (data) => {
        const { trainerApplications, notifications } = get();
        const newApp: TrainerVerificationApplication = {
          id: `app-${Date.now()}`,
          trainerName: data.trainerName,
          trainerEmail: data.trainerEmail,
          avatar: data.avatar || '',
          sportSpecialization: data.sportSpecialization,
          experienceYears: data.experienceYears,
          bio: data.bio,
          certifications: data.certifications,
          assessmentScore: data.assessmentScore,
          passed: data.assessmentScore >= 70,
          status: 'pending',
          submittedAt: new Date().toISOString().split('T')[0]
        };

        const adminNotif: PushNotification = {
          id: `notif-${Date.now()}`,
          recipientRole: 'admin',
          title: 'Trainer Verification Application 📋',
          message: `${data.trainerName} completed the 10-Question Skill Assessment with ${data.assessmentScore}%. Awaiting your verification.`,
          type: 'system',
          timestamp: new Date().toISOString(),
          read: false,
          link: '/admin/trainers'
        };

        set({
          trainerApplications: [newApp, ...trainerApplications],
          notifications: [adminNotif, ...notifications]
        });
      },

      verifyTrainer: (applicationId, action) => {
        const { trainerApplications, users, currentUser, notifications } = get();
        let app = trainerApplications.find(a => a.id === applicationId);
        
        const targetTrainer = app 
          ? users.find(u => u.email.toLowerCase() === app!.trainerEmail.toLowerCase())
          : users.find(u => u.id === applicationId || `app-${u.id}` === applicationId || u.email.toLowerCase() === applicationId.toLowerCase());

        if (!app && targetTrainer) {
          app = {
            id: `app-${targetTrainer.id}`,
            trainerName: targetTrainer.name,
            trainerEmail: targetTrainer.email,
            avatar: targetTrainer.avatar || '',
            sportSpecialization: targetTrainer.sportSpecialization || 'Varsity Conditioning',
            experienceYears: 4,
            bio: `Collegiate coach candidate`,
            certifications: targetTrainer.credentials || ['Collegiate Coach Candidate'],
            assessmentScore: targetTrainer.verificationScore || 85,
            passed: (targetTrainer.verificationScore || 85) >= 70,
            status: action === 'approve' ? ('verified' as const) : ('rejected' as const),
            submittedAt: new Date().toISOString().split('T')[0],
            verifiedAt: new Date().toISOString().split('T')[0],
            verifiedByAdminName: currentUser.name
          };
        }

        if (!app && !targetTrainer) return;

        const targetEmail = (app?.trainerEmail || targetTrainer?.email || '').toLowerCase();

        const updatedApps = trainerApplications.some(a => a.id === app!.id)
          ? trainerApplications.map(a => {
              if (a.id === app!.id) {
                return {
                  ...a,
                  status: action === 'approve' ? ('verified' as const) : ('rejected' as const),
                  verifiedAt: new Date().toISOString().split('T')[0],
                  verifiedByAdminName: currentUser.name
                };
              }
              return a;
            })
          : [app!, ...trainerApplications];

        let updatedUsers = users.map(u => {
          if (u.email.toLowerCase() === targetEmail || u.id === applicationId || `app-${u.id}` === applicationId) {
            return {
              ...u,
              verificationStatus: action === 'approve' ? ('verified' as const) : ('rejected' as const),
              verificationScore: app?.assessmentScore || u.verificationScore || 85
            };
          }
          return u;
        });

        // If trainer not in users yet, add them
        if (action === 'approve' && !updatedUsers.some(u => u.email.toLowerCase() === targetEmail)) {
          const newTrainerUser: UserProfile = {
            id: `trainer-${Date.now()}`,
            name: app?.trainerName || 'Coach',
            email: targetEmail,
            role: 'trainer',
            avatar: app?.avatar || '',
            department: 'Varsity Athletics & Coaching',
            sportSpecialization: app?.sportSpecialization || 'Varsity Conditioning',
            credentials: app?.certifications || ['Certified Athletic Coach'],
            verificationStatus: 'verified',
            verificationScore: app?.assessmentScore || 85,
            streakDays: 1
          };
          updatedUsers.push(newTrainerUser);
        }

        const trainerUser = updatedUsers.find(u => u.email.toLowerCase() === targetEmail);

        const coachNotif: PushNotification = {
          id: `notif-${Date.now()}-coach`,
          title: action === 'approve' ? 'Accreditation Approved! 🏅' : 'Accreditation Update',
          message: action === 'approve'
            ? 'Your collegiate coach credentials have been officially verified by the administrator. Student-athletes can now be assigned to your roster.'
            : 'Your coach accreditation application was not approved by the administrator.',
          type: 'system',
          timestamp: new Date().toISOString(),
          read: false,
          recipientRole: 'trainer',
          recipientUserId: trainerUser?.id
        };

        const updatedCurrentUser = trainerUser && currentUser.id === trainerUser.id
          ? { ...currentUser, verificationStatus: action === 'approve' ? ('verified' as const) : ('rejected' as const) }
          : currentUser;

        set({
          trainerApplications: updatedApps,
          users: updatedUsers,
          currentUser: updatedCurrentUser,
          notifications: [coachNotif, ...notifications]
        });
      },

      assignTrainerToStudent: (studentId, trainerId) => {
        const { users, currentUser, notifications } = get();
        const trainer = trainerId ? users.find(u => u.id === trainerId) : null;

        // ONLY verified trainers can be assigned to students!
        if (trainer && trainer.verificationStatus !== 'verified') {
          return;
        }

        const targetStudent = users.find(u => u.id === studentId);

        const updatedUsers = users.map(u => {
          if (u.id === studentId) {
            return {
              ...u,
              assignedTrainerId: trainer ? trainer.id : undefined,
              assignedTrainerName: trainer ? trainer.name : undefined
            };
          }
          return u;
        });

        const updatedCurrentUser = currentUser.id === studentId
          ? {
              ...currentUser,
              assignedTrainerId: trainer ? trainer.id : undefined,
              assignedTrainerName: trainer ? trainer.name : undefined
            }
          : currentUser;

        const newNotifs = [...notifications];
        if (trainer && targetStudent) {
          newNotifs.unshift({
            id: `notif-${Date.now()}-assign-student`,
            title: 'Coach Assigned! 🏃',
            message: `${trainer.name} has been assigned as your varsity athletic coach. Your personalized training plans and drills are now available.`,
            type: 'system',
            timestamp: new Date().toISOString(),
            read: false,
            recipientRole: 'student',
            recipientUserId: studentId,
            link: '/student/coach'
          });

          newNotifs.unshift({
            id: `notif-${Date.now()}-assign-trainer`,
            title: 'New Student-Athlete Assigned 👥',
            message: `${targetStudent.name} (${targetStudent.sportSpecialization || 'Varsity Athlete'}) has been assigned to your coaching roster by the administrator.`,
            type: 'system',
            timestamp: new Date().toISOString(),
            read: false,
            recipientRole: 'trainer',
            recipientUserId: trainer.id,
            link: '/trainer/students'
          });
        }

        set({ users: updatedUsers, currentUser: updatedCurrentUser, notifications: newNotifs });
      },

      unassignTrainerFromStudent: (studentId) => {
        const { users, currentUser } = get();
        const updatedUsers = users.map(u => {
          if (u.id === studentId) {
            return {
              ...u,
              assignedTrainerId: undefined,
              assignedTrainerName: undefined
            };
          }
          return u;
        });

        const updatedCurrentUser = currentUser.id === studentId
          ? {
              ...currentUser,
              assignedTrainerId: undefined,
              assignedTrainerName: undefined
            }
          : currentUser;

        set({ users: updatedUsers, currentUser: updatedCurrentUser });
      },

      grantAdminBonusCredits: (studentId, amount, reason) => {
        const { users, transactions, notifications } = get();
        const updatedUsers = users.map(u => {
          if (u.id === studentId) {
            return { ...u, fitCredits: (u.fitCredits || 0) + amount };
          }
          return u;
        });

        const newTx: FitCreditTransaction = {
          id: `tx-${Date.now()}`,
          userId: studentId,
          type: 'admin_bonus',
          title: `Dean Athletic Grant: ${reason}`,
          amount,
          date: new Date().toISOString().split('T')[0],
          category: 'Bonus'
        };

        const newNotif: PushNotification = {
          id: `notif-${Date.now()}`,
          recipientRole: 'student',
          recipientUserId: studentId,
          title: 'Special FitCredits Awarded! 🎖️',
          message: `You received +${amount} FitCredits: "${reason}". Keep up the varsity standard!`,
          type: 'credit',
          timestamp: new Date().toISOString(),
          read: false,
          link: '/student/fitcredits'
        };

        set({
          users: updatedUsers,
          transactions: [newTx, ...transactions],
          notifications: [newNotif, ...notifications]
        });
      },

      createSportsEvent: (eventData) => {
        const { events, notifications } = get();
        const newEvent: SportsEvent = {
          ...eventData,
          id: `evt-${Date.now()}`,
          currentParticipants: 0,
          registeredStudentIds: []
        };

        const eventNotif: PushNotification = {
          id: `notif-${Date.now()}`,
          recipientRole: 'all',
          title: `New Tournament Announced: ${eventData.title} 🏆`,
          message: `Join ${eventData.title} at ${eventData.venue}. Entry requires ${eventData.requiredCredits} FitCredits.`,
          type: 'event',
          timestamp: new Date().toISOString(),
          read: false,
          link: '/student/events'
        };

        set({
          events: [newEvent, ...events],
          notifications: [eventNotif, ...notifications]
        });
      },

      deleteSportsEvent: (eventId) => {
        const { events } = get();
        set({
          events: events.filter(e => e.id !== eventId)
        });
      },

      adminRemoveEventRegistration: (eventId: string, studentId: string) => {
        const { events, users, transactions, notifications } = get();
        const event = events.find(e => e.id === eventId);
        const student = users.find(u => u.id === studentId);
        if (!event || !student) return;

        const updatedEvents = events.map(e => {
          if (e.id === eventId) {
            return {
              ...e,
              currentParticipants: Math.max(0, e.currentParticipants - 1),
              registeredStudentIds: (e.registeredStudentIds || []).filter(id => id !== studentId)
            };
          }
          return e;
        });

        let updatedUsers = [...users];
        let updatedTransactions = [...transactions];

        if (event.requiredCredits > 0) {
          updatedUsers = users.map(u => {
            if (u.id === studentId) {
              return {
                ...u,
                fitCredits: (u.fitCredits || 0) + event.requiredCredits
              };
            }
            return u;
          });

          updatedTransactions.unshift({
            id: `tx-${Date.now()}`,
            userId: studentId,
            type: 'admin_bonus',
            title: `Tournament Fee Refund: ${event.title}`,
            amount: event.requiredCredits,
            date: new Date().toISOString().split('T')[0],
            category: 'Event'
          });
        }

        const studentNotif: PushNotification = {
          id: `notif-${Date.now()}-unreg`,
          recipientRole: 'student',
          recipientUserId: studentId,
          title: 'Tournament Roster Update ℹ️',
          message: `Your registration for "${event.title}" has been modified by Athletics Administration.${
            event.requiredCredits > 0 ? ` +${event.requiredCredits} FitCredits refunded to your wallet.` : ''
          }`,
          type: 'event',
          timestamp: new Date().toISOString(),
          read: false,
          link: '/student/events'
        };

        set({
          events: updatedEvents,
          users: updatedUsers,
          transactions: updatedTransactions,
          notifications: [studentNotif, ...notifications]
        });
      },

      sendChatMessage: (content, receiverId) => {
        const { chatMessages, currentUser } = get();
        const targetReceiver = receiverId || currentUser.assignedTrainerId || '';

        const userMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderRole: currentUser.role,
          senderAvatar: currentUser.avatar || '',
          receiverId: targetReceiver,
          content,
          timestamp: new Date().toISOString()
        };

        set({ chatMessages: [...chatMessages, userMsg] });
      },

      markNotificationAsRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
        }));
      },

      markAllNotificationsAsRead: () => {
        const { activeRole, currentUser } = get();
        set(state => ({
          notifications: state.notifications.map(n => {
            const belongs =
              (n.recipientUserId && n.recipientUserId === currentUser.id) ||
              (!n.recipientUserId && (n.recipientRole === activeRole || n.recipientRole === 'all'));
            return belongs ? { ...n, read: true } : n;
          })
        }));
      },

      getLeaderboard: () => {
        const { users, currentUser } = get();
        const students = users.filter(u => u.role === 'student');

        // Sort by fitCredits desc
        const sorted = [...students].sort((a, b) => (b.fitCredits || 0) - (a.fitCredits || 0));

        return sorted.map((s, index) => ({
          rank: index + 1,
          studentId: s.id,
          name: s.name,
          avatar: s.avatar,
          department: s.department || 'General Studies',
          dormHouse: s.dormHouse || 'Campus Dorm',
          sport: s.sportSpecialization || 'Varsity Athletics',
          fitCredits: s.fitCredits || 0,
          fitnessScore: s.fitnessScore || 75,
          streakDays: s.streakDays || 0,
          isCurrentUser: s.id === currentUser.id
        }));
      },

      resetToDefaults: () => {
        set({
          currentUser: DEFAULT_ADMIN,
          activeRole: 'admin',
          isAuthenticated: false,
          users: [DEFAULT_ADMIN],
          workouts: [],
          proofSubmissions: [],
          events: [],
          transactions: [],
          trainerApplications: [],
          studentAssessment: INITIAL_STUDENT_ASSESSMENT,
          chatMessages: [],
          notifications: []
        });
      }
    }),
    {
      name: 'fitsphere_store_v6',
    }
  )
);

// Real-time synchronization across browser tabs and windows
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'fitsphere_store_v6') {
      useFitSphereStore.persist?.rehydrate();
    }
  });
}

