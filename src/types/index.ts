export type UserRole = 'student' | 'trainer' | 'admin';

export type AthleteJourneyStage = 'beginner' | 'intermediate' | 'advanced' | 'athlete';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar: string;
  department?: string;
  dormHouse?: string;
  studentId?: string;
  academicYear?: string;
  sportSpecialization?: string;
  fitnessLevel?: AthleteJourneyStage;
  fitnessScore?: number;
  fitnessScoreDelta?: number;
  assignedTrainerId?: string;
  assignedTrainerName?: string;
  credentials?: string[];
  verificationStatus?: 'verified' | 'pending' | 'rejected';
  verificationScore?: number;
  fitCredits?: number;
  streakDays?: number;
  isDemo?: boolean;
  password?: string;
}

export interface AthleticDimensions {
  strength: number; // 0-100
  speed: number;
  endurance: number;
  flexibility: number;
  skill: number;
}

export interface StudentAssessment {
  studentId: string;
  evaluatedAt: string;
  evaluatedByTrainerId: string;
  baseline: AthleticDimensions;
  current: AthleticDimensions;
  trainerNotes: string;
  keyStrengths: string[];
  focusAreas: string[];
}

export interface FitCreditTransaction {
  id: string;
  userId: string;
  type: 'workout_completed' | 'attendance' | 'achievement' | 'event_registration' | 'admin_bonus' | 'merch_redemption';
  title: string;
  amount: number; // positive for earn, negative for spend
  date: string;
  category: 'Workout' | 'Event' | 'Streak' | 'Bonus' | 'Reward';
  referenceId?: string;
}

export interface DrillItem {
  id: string;
  name: string;
  targetMuscle: string;
  sets: number;
  reps: string; // e.g. "12 reps" or "45 sec"
  restSeconds: number;
  coachingCue: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  sport: string;
  targetAudience: 'All Athletes' | 'Football Squad' | 'Track & Field' | 'Cricket Team' | 'General Campus';
  durationMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rewardCredits: number;
  intensity: 'Low' | 'Moderate' | 'High' | 'Extreme';
  description: string;
  drills: DrillItem[];
  bannerUrl: string;
  assignedByTrainerName: string;
  trainerId?: string;
}

export interface TelemetryData {
  durationMinutes: number;
  caloriesBurned: number;
  heartRateAvg: number;
  distanceKm?: number;
  repsCompleted?: number;
}

export interface WorkoutProofSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  workoutId: string;
  workoutTitle: string;
  submittedAt: string;
  proofMediaUrl: string;
  proofMediaType: 'image' | 'video';
  telemetry: TelemetryData;
  athleteNotes: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedByTrainerId?: string;
  reviewedByTrainerName?: string;
  reviewedAt?: string;
  creditsAwarded: number;
  trainerFeedback?: string;
}

export interface SkillAssessmentQuestion {
  id: number;
  question: string;
  sportDomain: string;
  options: [string, string, string, string];
  correctOptionIndex: number;
  explanation: string;
}

export interface TrainerVerificationApplication {
  id: string;
  trainerName: string;
  trainerEmail: string;
  avatar: string;
  sportSpecialization: string;
  experienceYears: number;
  bio: string;
  certifications: string[];
  assessmentScore: number; // e.g. 88%
  passed: boolean;
  status: 'verified' | 'pending' | 'rejected';
  submittedAt: string;
  verifiedAt?: string;
  verifiedByAdminName?: string;
}

export interface TournamentMatch {
  matchId: string;
  round: string;
  teamA: string;
  teamB: string;
  scoreA?: number;
  scoreB?: number;
  winner?: string;
  scheduledTime: string;
  venue: string;
}

export interface SportsEvent {
  id: string;
  title: string;
  sport: string;
  category: 'Championship' | 'Tournament' | 'Campus League' | 'Fitness Challenge';
  date: string;
  time: string;
  venue: string;
  requiredCredits: number;
  maxParticipants: number;
  currentParticipants: number;
  prizePoolCredits: number;
  status: 'Open' | 'Full' | 'In Progress' | 'Completed';
  description: string;
  eligibility: string;
  rules: string[];
  bannerUrl: string;
  registeredStudentIds: string[];
  fixtures?: TournamentMatch[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  receiverId: string;
  content: string;
  timestamp: string;
  attachmentUrl?: string;
}

export interface PushNotification {
  id: string;
  recipientRole: UserRole | 'all';
  recipientUserId?: string;
  title: string;
  message: string;
  type: 'workout' | 'credit' | 'event' | 'proof' | 'assessment' | 'system';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  name: string;
  avatar: string;
  department: string;
  dormHouse: string;
  sport: string;
  fitCredits: number;
  fitnessScore: number;
  streakDays: number;
  isCurrentUser?: boolean;
}
