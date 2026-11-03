import {
  UserProfile,
  WorkoutPlan,
  WorkoutProofSubmission,
  SkillAssessmentQuestion,
  TrainerVerificationApplication,
  SportsEvent,
  FitCreditTransaction,
  StudentAssessment,
  ChatMessage,
  PushNotification,
  LeaderboardEntry
} from '../types';

export const INITIAL_ADMIN: UserProfile = {
  id: 'admin-1',
  name: 'Shyam Raj',
  email: 'shyamraj@gmail.com',
  password: 'shyam123',
  role: 'admin',
  avatar: '',
  department: 'Intercollegiate Athletics & Sports Administration',
  credentials: ['Director of Athletics', 'Sports Administrator'],
  verificationStatus: 'verified',
  isDemo: false,
};

export const INITIAL_STUDENT: UserProfile = INITIAL_ADMIN;
export const INITIAL_TRAINER: UserProfile = INITIAL_ADMIN;

export const DEMO_USERS: UserProfile[] = [
  INITIAL_ADMIN
];


export const INITIAL_STUDENT_ASSESSMENT: StudentAssessment = {
  studentId: 'student-1',
  evaluatedAt: '2026-08-28',
  evaluatedByTrainerId: 'trainer-1',
  baseline: {
    strength: 65,
    speed: 70,
    endurance: 62,
    flexibility: 58,
    skill: 68
  },
  current: {
    strength: 82,
    speed: 88,
    endurance: 79,
    flexibility: 74,
    skill: 86
  },
  trainerNotes: 'Arjun has demonstrated remarkable acceleration out of blocks and improved hamstring eccentric control during Nordic curls. Upper back bracing on compound lifts is significantly tighter.',
  keyStrengths: ['Top-End Sprint Velocity (11.8s 100m)', 'Reactive Jump Agility', 'Aerobic Lactate Recovery'],
  focusAreas: ['Hip Flexor Mobility under Fatigue', 'Deceleration Mechanics from Full Sprint']
};

export const INITIAL_WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: 'plan-1',
    title: 'Football Speed & Agility Matrix',
    sport: 'Football',
    targetAudience: 'Football Squad',
    durationMinutes: 45,
    difficulty: 'Advanced',
    rewardCredits: 20,
    intensity: 'High',
    description: 'Elite speed ladder transitions, deceleration brakes, and 40-yard dash explosive burst mechanics to sharpen match fitness.',
    bannerUrl: '',
    assignedByTrainerName: 'Coach Rahul Sharma',
    drills: [
      { id: 'd1', name: 'Agility Ladder Ickey Shuffle', targetMuscle: 'Calves & Adductors', sets: 4, reps: '30 sec continuous', restSeconds: 45, coachingCue: 'Stay on balls of feet; pump elbows at 90 degrees.' },
      { id: 'd2', name: 'Deceleration Cones (5-10-5 Pro Agility)', targetMuscle: 'Quadriceps & Glutes', sets: 5, reps: '3 reps per side', restSeconds: 60, coachingCue: 'Sink hips low when braking; do not cross feet.' },
      { id: 'd3', name: 'Resisted Band Sprint Accelerations', targetMuscle: 'Hamstrings & Hip Flexors', sets: 6, reps: '20 yards sprint', restSeconds: 75, coachingCue: 'Drive knee upward; maintain 45-degree forward torso lean.' },
      { id: 'd4', name: 'Single-Leg Plyometric Hurdle Bounds', targetMuscle: 'Glute Medius & Ankle Stiffeners', sets: 3, reps: '8 bounds each leg', restSeconds: 60, coachingCue: 'Minimize ground contact time; absorb smoothly on landing.' }
    ]
  },
  {
    id: 'plan-2',
    title: 'Varsity Upper Body Armor & Core Power',
    sport: 'Strength & Conditioning',
    targetAudience: 'All Athletes',
    durationMinutes: 50,
    difficulty: 'Intermediate',
    rewardCredits: 15,
    intensity: 'Moderate',
    description: 'Postural reinforcement, rotational core strength, and upper extremity stabilizer development for collision sports resilience.',
    bannerUrl: '',
    assignedByTrainerName: 'Coach Rahul Sharma',
    drills: [
      { id: 'd5', name: 'Barbell Incline Bench Press', targetMuscle: 'Clavicular Pectoralis & Triceps', sets: 4, reps: '8-10 reps', restSeconds: 90, coachingCue: 'Pinch shoulder blades into pad; bar touches upper chest.' },
      { id: 'd6', name: 'Chest-Supported Dumbbell Rows', targetMuscle: 'Rhomboids & Latissimus Dorsi', sets: 4, reps: '10-12 reps', restSeconds: 75, coachingCue: 'Pause for 1 second at top contraction; do not shrug traps.' },
      { id: 'd7', name: 'Medicine Ball Rotational Slams', targetMuscle: 'Internal & External Obliques', sets: 3, reps: '12 slams per side', restSeconds: 60, coachingCue: 'Pivot off rear foot; transfer ground force through hips.' },
      { id: 'd8', name: 'Hanging Leg Raises to Bar', targetMuscle: 'Rectus Abdominis', sets: 3, reps: '12 controlled reps', restSeconds: 60, coachingCue: 'Avoid swinging momentum; curl pelvis at the apex.' }
    ]
  },
  {
    id: 'plan-3',
    title: 'Aerobic Threshold 5K & Lactate Shuttle',
    sport: 'Track & Field',
    targetAudience: 'Track & Field',
    durationMinutes: 40,
    difficulty: 'Advanced',
    rewardCredits: 15,
    intensity: 'High',
    description: 'Negative split distance intervals to train lactate clearance and develop sustained aerobic pacing for campus athletes.',
    bannerUrl: '',
    assignedByTrainerName: 'Coach Rahul Sharma',
    drills: [
      { id: 'd9', name: 'Dynamic Hamstring & Hip Mobility Warm-up', targetMuscle: 'Lower Chain Fascia', sets: 1, reps: '8 mins continuous', restSeconds: 0, coachingCue: 'Gradually increase stride elongation and hip opening.' },
      { id: 'd10', name: '800m Cruise Intervals @ 85% VO2 Max', targetMuscle: 'Cardiovascular System', sets: 4, reps: '800m per interval', restSeconds: 90, coachingCue: 'Keep breath cadence 2-in, 2-out rhythmically.' },
      { id: 'd11', name: 'Strideouts on Stadium Turf', targetMuscle: 'Fast-Twitch Motor Units', sets: 6, reps: '100m bursts', restSeconds: 60, coachingCue: 'Focus on tall posture and relaxed jaw/shoulders.' }
    ]
  },
  {
    id: 'plan-4',
    title: 'Olympic Lifting & Posterior Chain Explosiveness',
    sport: 'Weightlifting & S&C',
    targetAudience: 'Football Squad',
    durationMinutes: 55,
    difficulty: 'Advanced',
    rewardCredits: 25,
    intensity: 'Extreme',
    description: 'Triple extension power from the floor, rapid catch mechanics, and posterior chain injury prevention protocols.',
    bannerUrl: '',
    assignedByTrainerName: 'Coach Rahul Sharma',
    drills: [
      { id: 'd12', name: 'Hang Power Cleans', targetMuscle: 'Hamstrings, Glutes, Trapezius', sets: 5, reps: '3 reps (heavy)', restSeconds: 120, coachingCue: 'Violent hip thrust; snap elbows quickly under the bar.' },
      { id: 'd13', name: 'Nordic Hamstring Eccentric Lowers', targetMuscle: 'Biceps Femoris & Tendons', sets: 4, reps: '6 slow reps', restSeconds: 90, coachingCue: 'Maintain straight line from knees to head; fight the descent.' },
      { id: 'd14', name: 'Trap Bar Deadlift Jumps', targetMuscle: 'Full Posterior Chain', sets: 4, reps: '5 explosive reps', restSeconds: 90, coachingCue: 'Use 25% 1RM; maximize takeoff height on each rep.' }
    ]
  }
];

export const INITIAL_PROOF_SUBMISSIONS: WorkoutProofSubmission[] = [
  {
    id: 'proof-1',
    studentId: 'student-1',
    studentName: 'Arjun Mehta',
    studentAvatar: '',
    workoutId: 'plan-1',
    workoutTitle: 'Football Speed & Agility Matrix',
    submittedAt: '2026-09-07T18:30:00Z',
    proofMediaUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
    proofMediaType: 'image',
    telemetry: {
      durationMinutes: 48,
      caloriesBurned: 435,
      heartRateAvg: 164,
      distanceKm: 4.8,
      repsCompleted: 18
    },
    athleteNotes: 'Completed all 6 sprint ladders and resisted band accelerations on the varsity training turf. Hamstrings felt snappy. Shaved 0.2s off 40m split!',
    status: 'pending',
    creditsAwarded: 20,
  },
  {
    id: 'proof-2',
    studentId: 'student-3',
    studentName: 'Priya Sharma',
    studentAvatar: '',
    workoutId: 'plan-3',
    workoutTitle: 'Aerobic Threshold 5K & Lactate Shuttle',
    submittedAt: '2026-09-06T15:20:00Z',
    proofMediaUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=800&q=80',
    proofMediaType: 'image',
    telemetry: {
      durationMinutes: 23,
      caloriesBurned: 290,
      heartRateAvg: 168,
      distanceKm: 5.02
    },
    athleteNotes: 'Paced strictly at 4:35/km. Negative split on the last 1.5 kilometers with zero pain in the plantar fascia.',
    status: 'approved',
    reviewedByTrainerId: 'trainer-1',
    reviewedByTrainerName: 'Coach Rahul Sharma',
    reviewedAt: '2026-09-06T17:15:00Z',
    creditsAwarded: 20,
    trainerFeedback: 'Flawless pacing Priya! Heart rate recovery between intervals was under 50 seconds. Verified and awarded full +20 FitCredits.'
  },
  {
    id: 'proof-3',
    studentId: 'student-4',
    studentName: 'Marcus Sterling',
    studentAvatar: '',
    workoutId: 'plan-4',
    workoutTitle: 'Olympic Lifting & Posterior Chain Explosiveness',
    submittedAt: '2026-09-05T19:40:00Z',
    proofMediaUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    proofMediaType: 'image',
    telemetry: {
      durationMinutes: 58,
      caloriesBurned: 520,
      heartRateAvg: 152,
      repsCompleted: 24
    },
    status: 'approved',
    reviewedByTrainerId: 'trainer-1',
    reviewedByTrainerName: 'Coach Rahul Sharma',
    reviewedAt: '2026-09-05T20:30:00Z',
    creditsAwarded: 25,
    athleteNotes: 'Hit 95kg on clean catch. Bar path stayed vertical throughout all 5 working sets.',
    trainerFeedback: 'Clean triple extension Marcus. Watch the left knee valgus on the catch dip, otherwise textbook power output.'
  },
  {
    id: 'proof-4',
    studentId: 'student-2',
    studentName: 'Rahul Verma',
    studentAvatar: '',
    workoutId: 'plan-2',
    workoutTitle: 'Varsity Upper Body Armor & Core Power',
    submittedAt: '2026-09-07T12:00:00Z',
    proofMediaUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    proofMediaType: 'image',
    telemetry: {
      durationMinutes: 52,
      caloriesBurned: 440,
      heartRateAvg: 148,
      repsCompleted: 45
    },
    athleteNotes: 'Completed full set rotation before team practice. Rotational core slams felt great.',
    status: 'pending',
    creditsAwarded: 15,
  }
];

export const INITIAL_TRANSACTIONS: FitCreditTransaction[] = [
  {
    id: 'tx-1',
    userId: 'student-1',
    type: 'workout_completed',
    title: 'Completed Football Speed & Agility Matrix',
    amount: 20,
    date: '2026-09-05',
    category: 'Workout'
  },
  {
    id: 'tx-2',
    userId: 'student-1',
    type: 'attendance',
    title: 'Morning Varsity Field Attendance',
    amount: 10,
    date: '2026-09-06',
    category: 'Streak'
  },
  {
    id: 'tx-3',
    userId: 'student-1',
    type: 'achievement',
    title: 'Unlocked: 14-Day Consistency Streak',
    amount: 50,
    date: '2026-09-06',
    category: 'Bonus'
  },
  {
    id: 'tx-4',
    userId: 'student-1',
    type: 'workout_completed',
    title: 'Completed Aerobic Threshold 5K Session',
    amount: 15,
    date: '2026-09-03',
    category: 'Workout'
  },
  {
    id: 'tx-5',
    userId: 'student-1',
    type: 'event_registration',
    title: 'Registered: Inter-Dorm Track Championship',
    amount: -50,
    date: '2026-08-25',
    category: 'Event'
  },
  {
    id: 'tx-6',
    userId: 'student-1',
    type: 'admin_bonus',
    title: 'Athletic Department Dean Honor Roll',
    amount: 100,
    date: '2026-08-20',
    category: 'Bonus'
  }
];

export const INITIAL_EVENTS: SportsEvent[] = [
  {
    id: 'evt-1',
    title: 'Annual Inter-College Football Championship',
    sport: 'Football',
    category: 'Championship',
    date: '2026-09-18',
    time: '16:00 - 19:30',
    venue: 'Campus Main Varsity Stadium',
    requiredCredits: 100,
    maxParticipants: 120,
    currentParticipants: 96,
    prizePoolCredits: 2500,
    status: 'Open',
    description: 'The pinnacle collegiate football tournament featuring 8 academic halls competing in a single-elimination bracket under floodlights.',
    eligibility: 'Open to all full-time students with verified medical clearance and minimum 100 FitCredits.',
    rules: [
      'Official FIFA 11v11 rules apply; 45-minute halves with rolling subs for 5 designated slots.',
      'All players must wear college shin guards and official dorm colors.',
      'Accumulation of 2 yellow cards results in a one-match suspension.',
      'Winners receive the coveted University Chancellor Cup and 500 FitCredits each.'
    ],
    bannerUrl: '',
    registeredStudentIds: ['student-2', 'student-4'],
    fixtures: [
      { matchId: 'm1', round: 'Quarter-Final 1', teamA: 'Phoenix House FC', teamB: 'Titan Dorm Wolves', scheduledTime: 'Sep 18, 16:00', venue: 'Pitch 1' },
      { matchId: 'm2', round: 'Quarter-Final 2', teamA: 'Olympus Strikers', teamB: 'Athena United', scheduledTime: 'Sep 18, 17:30', venue: 'Pitch 1' },
      { matchId: 'm3', round: 'Semi-Final', teamA: 'Winner QF1', teamB: 'Winner QF2', scheduledTime: 'Sep 19, 17:00', venue: 'Main Stadium' },
      { matchId: 'm4', round: 'Grand Final', teamA: 'TBD', teamB: 'TBD', scheduledTime: 'Sep 20, 18:00', venue: 'Main Stadium' }
    ]
  },
  {
    id: 'evt-2',
    title: 'Inter-Dorm Cricket Premier Cup (T20)',
    sport: 'Cricket',
    category: 'Tournament',
    date: '2026-09-22',
    time: '09:00 - 18:00',
    venue: 'West Oval Cricket Pavilion',
    requiredCredits: 80,
    maxParticipants: 88,
    currentParticipants: 72,
    prizePoolCredits: 1800,
    status: 'Open',
    description: 'High-octane T20 format with leather ball, white kits, and professional umpires. Live scoring streamed on campus video boards.',
    eligibility: 'Verified university students; full protective gear mandatory.',
    rules: [
      '20 overs per side; max 4 overs per bowler.',
      'Powerplay in overs 1-6 with field restriction ring.',
      'Super Over in event of a tie.'
    ],
    bannerUrl: '',
    registeredStudentIds: ['student-1', 'student-3']
  },
  {
    id: 'evt-3',
    title: 'Varsity 100m & 400m Track Invitational',
    sport: 'Track & Field',
    category: 'Campus League',
    date: '2026-09-26',
    time: '14:00 - 18:00',
    venue: 'Olympic Class Synthetic Track',
    requiredCredits: 50,
    maxParticipants: 64,
    currentParticipants: 48,
    prizePoolCredits: 1200,
    status: 'Open',
    description: 'Electronic laser gate timing, seedings by preliminary heats, and varsity scout scouting session.',
    eligibility: 'Any fitness level welcome; spike shoes up to 6mm permitted.',
    rules: [
      'IAAF false start rules strictly enforced.',
      'Top 8 qualifying times advance to Championship Final.'
    ],
    bannerUrl: '',
    registeredStudentIds: ['student-3', 'student-5']
  },
  {
    id: 'evt-4',
    title: 'University 10K Autumn Campus Run',
    sport: 'Cross Country',
    category: 'Fitness Challenge',
    date: '2026-10-02',
    time: '07:00 - 10:00',
    venue: 'University Quad & Lake Perimeter',
    requiredCredits: 0,
    maxParticipants: 500,
    currentParticipants: 342,
    prizePoolCredits: 1000,
    status: 'Open',
    description: 'Scenic 10K community run celebrating campus wellness. Free entry for all students, faculty, and alumni with timing chip bibs.',
    eligibility: 'All students and staff. Free entry to promote active university lifestyles.',
    rules: [
      'Follow marked trail markers; water stations every 2.5 kilometers.',
      'All finishers receive custom FitSphere medal + 30 bonus FitCredits.'
    ],
    bannerUrl: '',
    registeredStudentIds: ['student-1', 'student-2', 'student-3', 'student-4']
  }
];

export const SKILL_ASSESSMENT_QUESTIONS: SkillAssessmentQuestion[] = [
  {
    id: 1,
    question: "A fast bowler repeatedly delivers the ball above the batter's head height, making it unsafe to play. What should the umpire primarily consider?",
    sportDomain: 'Cricket Officiating & Safety',
    options: [
      'Awarding the batter an automatic six',
      'Calling the delivery a no-ball or wide according to the situation and applicable rules',
      'Allowing the bowler to continue without any action',
      'Removing the batter from the match'
    ],
    correctOptionIndex: 1,
    explanation: 'Under the Laws of Cricket, dangerous and unfair bowling (deliveries above head height) must be penalized by calling a no-ball or wide depending on whether the ball passes without being hit, with warnings issued for unfair repeat deliveries.'
  },
  {
    id: 2,
    question: "A fielder catches a ball close to the boundary. While completing the catch, the fielder's feet touch the boundary rope. What is the correct outcome?",
    sportDomain: 'Cricket Boundary Rules',
    options: [
      'The catch is valid because the ball was caught',
      'The batter is automatically out',
      'The catch is not valid and the boundary rules apply',
      'The umpire must replay the delivery'
    ],
    correctOptionIndex: 2,
    explanation: "If any part of the fielder's person is in contact with the boundary rope or grounded beyond the boundary while touching the ball, the catch is invalid and boundary rules apply."
  },
  {
    id: 3,
    question: 'A defender deliberately handles the ball inside their own penalty area and prevents an obvious goal-scoring opportunity. What is the most appropriate decision?',
    sportDomain: 'Football (Soccer) Rules & Disciplinary Laws',
    options: [
      'Corner kick only',
      'Penalty kick and disciplinary action according to the circumstances',
      'Throw-in',
      'Drop ball'
    ],
    correctOptionIndex: 1,
    explanation: 'Denying an obvious goal-scoring opportunity by deliberately handling the ball inside the penalty area results in a penalty kick and appropriate disciplinary action (red card for DOGSO).'
  },
  {
    id: 4,
    question: 'A player is in an offside position but does not interfere with an opponent or become involved in active play. What should happen?',
    sportDomain: 'Football (Soccer) Offside Rules',
    options: [
      'Offside must always be called',
      'The player should automatically receive a yellow card',
      'Play may continue because being in an offside position alone is not an offence',
      'The attacking team loses possession automatically'
    ],
    correctOptionIndex: 2,
    explanation: 'Under Law 11, simply being in an offside position is not an offence in itself; play continues unless the player interferes with play, interferes with an opponent, or gains an advantage.'
  },
  {
    id: 5,
    question: 'A swimmer becomes extremely fatigued during training and their technique begins to deteriorate significantly. What should a responsible trainer do first?',
    sportDomain: 'Aquatics Coaching & Athlete Safety',
    options: [
      'Increase the intensity to build mental toughness',
      'Continue the session because the swimmer must finish the planned distance',
      'Reduce or stop the activity and assess the swimmer\'s condition',
      'Ask the swimmer to race another athlete'
    ],
    correctOptionIndex: 2,
    explanation: 'When acute fatigue causes severe technique breakdown in the pool, safety is paramount. The trainer must reduce or stop the activity and assess the swimmer before continuing.'
  },
  {
    id: 6,
    question: 'Why is proper breathing technique important during swimming?',
    sportDomain: 'Swimming Biomechanics & Physiology',
    options: [
      'It only helps swimmers swim faster',
      'It helps maintain oxygen supply, rhythm, and efficient technique',
      'It eliminates the need for rest periods',
      'It prevents all swimming injuries'
    ],
    correctOptionIndex: 1,
    explanation: 'Proper rhythmic breathing maintains cellular oxygen delivery, preserves streamlined hydrodynamic posture, and sustains efficient stroke mechanics.'
  },
  {
    id: 7,
    question: 'A basketball player stops dribbling, holds the ball with both hands, and then starts dribbling again. What violation may have occurred?',
    sportDomain: 'Basketball Officiating & Ball Handling',
    options: [
      'Traveling',
      'Double dribble',
      'Three-second violation',
      'Shot-clock violation'
    ],
    correctOptionIndex: 1,
    explanation: 'A double dribble occurs when a player dribbles, touches or rests the ball with both hands simultaneously or brings it to a stop, and resumes dribbling without another player touching it.'
  },
  {
    id: 8,
    question: 'A trainer notices that a basketball player consistently lands with poor knee alignment after jumping. What should the trainer prioritize?',
    sportDomain: 'Basketball Injury Prevention & Biomechanics',
    options: [
      'Immediately increase the player\'s jumping repetitions',
      'Ignore the technique if the player can score',
      'Correct the landing mechanics and reduce unnecessary risk before increasing intensity',
      'Replace all strength exercises with sprinting'
    ],
    correctOptionIndex: 2,
    explanation: 'Knee valgus or stiff-legged landing mechanics vastly elevate non-contact ACL injury risk. Neuromuscular mechanics must be corrected before progressing load or volume.'
  },
  {
    id: 9,
    question: 'A beginner has good cardiovascular endurance but poor movement technique during a strength exercise. What should a trainer prioritize?',
    sportDomain: 'Strength & Conditioning Fundamentals',
    options: [
      'Increasing the weight immediately',
      'Correct movement technique before increasing resistance',
      'Training to complete as many repetitions as possible',
      'Removing warm-up exercises'
    ],
    correctOptionIndex: 1,
    explanation: 'Movement quality and technique must always precede loading to build proper motor engrams and protect joints and connective tissues from overload injuries.'
  },
  {
    id: 10,
    question: 'A student has missed several training sessions and returns wanting to immediately perform at their previous training intensity. What is the most appropriate approach?',
    sportDomain: 'Training Progression & Return-to-Play',
    options: [
      'Start at maximum intensity to recover lost progress',
      'Gradually return to training and adjust intensity according to current readiness',
      'Double the training volume for the first session',
      'Skip warm-up because the student has trained before'
    ],
    correctOptionIndex: 1,
    explanation: 'A graduated reload strategy prevents acute-to-chronic workload spikes, mitigates severe DOMS, and minimizes soft tissue strain upon return to training.'
  }
];

export const INITIAL_TRAINER_APPLICATIONS: TrainerVerificationApplication[] = [
  {
    id: 'app-1',
    trainerName: 'Rahul Sharma',
    trainerEmail: 'rahul.sharma@athletics.university.edu',
    avatar: '',
    sportSpecialization: 'Football & Strength Conditioning',
    experienceYears: 7,
    bio: 'Former collegiate defensive midfielder with NSCA-CSCS certification and UEFA B credential. Passionate about athlete durability, sprint mechanics, and character development.',
    certifications: ['CSCS (NSCA)', 'UEFA B License', 'EXOS Performance Specialist'],
    assessmentScore: 88,
    passed: true,
    status: 'verified',
    submittedAt: '2026-08-15',
    verifiedAt: '2026-08-16',
    verifiedByAdminName: 'Dr. Marcus Vance'
  },
  {
    id: 'app-2',
    trainerName: 'David Miller',
    trainerEmail: 'david.miller@athletics.university.edu',
    avatar: '',
    sportSpecialization: 'Track & Sprint Biomechanics',
    experienceYears: 5,
    bio: 'Track & Field coach specializing in 100m/200m linear acceleration mechanics, force-velocity profiling, and youth athlete motor development.',
    certifications: ['USATF Level 2 Sprints', 'NASM-PES'],
    assessmentScore: 86,
    passed: true,
    status: 'pending',
    submittedAt: '2026-09-04'
  },
  {
    id: 'app-3',
    trainerName: 'Kavita Sundaram',
    trainerEmail: 'kavita.s@athletics.university.edu',
    avatar: '',
    sportSpecialization: 'Badminton & Agility Conditioning',
    experienceYears: 4,
    bio: 'National badminton competitor with strong focus on multi-directional footwork agility, rotator cuff stabilization, and core rotational power.',
    certifications: ['BWF Coach Level 1', 'ACE Certified Trainer'],
    assessmentScore: 92,
    passed: true,
    status: 'pending',
    submittedAt: '2026-09-06'
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    studentId: 'student-2',
    name: 'Rahul Verma',
    avatar: '',
    department: 'Computer Science',
    dormHouse: 'Olympus Hall',
    sport: 'Basketball',
    fitCredits: 520,
    fitnessScore: 94,
    streakDays: 28,
  },
  {
    rank: 2,
    studentId: 'student-3',
    name: 'Priya Sharma',
    avatar: '',
    department: 'Biomedical Eng.',
    dormHouse: 'Titan Dormitory',
    sport: 'Track & Field',
    fitCredits: 420,
    fitnessScore: 89,
    streakDays: 21,
  },
  {
    rank: 3,
    studentId: 'student-4',
    name: 'Marcus Sterling',
    avatar: '',
    department: 'Business & Finance',
    dormHouse: 'Phoenix House',
    sport: 'Rowing',
    fitCredits: 380,
    fitnessScore: 86,
    streakDays: 19,
  },
  {
    rank: 4,
    studentId: 'student-5',
    name: 'Anya Chen',
    avatar: '',
    department: 'Materials Science',
    dormHouse: 'Athena Court',
    sport: 'Badminton',
    fitCredits: 340,
    fitnessScore: 85,
    streakDays: 12,
  },
  {
    rank: 5,
    studentId: 'student-1',
    name: 'Arjun Mehta',
    avatar: '',
    department: 'Mechanical Eng.',
    dormHouse: 'Phoenix House',
    sport: 'Football',
    fitCredits: 250,
    fitnessScore: 82,
    streakDays: 14,
    isCurrentUser: true
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [];

export const INITIAL_NOTIFICATIONS: PushNotification[] = [
  {
    id: 'notif-1',
    recipientRole: 'student',
    recipientUserId: 'student-1',
    title: 'Workout Proof Approved! ⭐',
    message: 'Coach Rahul reviewed your Aerobic Threshold session and awarded +20 FitCredits to your wallet.',
    type: 'credit',
    timestamp: '1 hour ago',
    read: false,
    link: '/student/fitcredits'
  },
  {
    id: 'notif-2',
    recipientRole: 'student',
    recipientUserId: 'student-1',
    title: 'New Event: Inter-College Championship 🏆',
    message: 'Registrations are now open for the Annual Football Championship. 100 FitCredits required to secure your spot.',
    type: 'event',
    timestamp: '4 hours ago',
    read: false,
    link: '/student/events'
  },
  {
    id: 'notif-3',
    recipientRole: 'trainer',
    recipientUserId: 'trainer-1',
    title: 'New Student Proof Submission 📥',
    message: 'Arjun Mehta submitted video & telemetry proof for "Football Speed & Agility Matrix". Awaiting review.',
    type: 'proof',
    timestamp: '20 mins ago',
    read: false,
    link: '/trainer/proof-review'
  },
  {
    id: 'notif-4',
    recipientRole: 'admin',
    recipientUserId: 'admin-1',
    title: 'Trainer Verification Application 📋',
    message: 'Coach David Miller scored 86% on the Skill Assessment and is awaiting administrative credential approval.',
    type: 'system',
    timestamp: '2 hours ago',
    read: false,
    link: '/admin/trainers'
  }
];
