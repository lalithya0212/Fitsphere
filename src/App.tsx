import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { TrainerAssessmentPage } from './pages/public/TrainerAssessmentPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { WorkoutModule } from './pages/student/WorkoutModule';
import { SubmitProofPage } from './pages/student/SubmitProofPage';
import { FitCreditsWallet } from './pages/student/FitCreditsWallet';
import { SportsEventsPage } from './pages/student/SportsEventsPage';
import { LeaderboardPage } from './pages/student/LeaderboardPage';
import { ProgressAnalytics } from './pages/student/ProgressAnalytics';
import { StudentChatPage } from './pages/student/StudentChatPage';
import { MyTrainerPage } from './pages/student/MyTrainerPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';

// Trainer Pages
import { TrainerDashboard } from './pages/trainer/TrainerDashboard';
import { StudentRosterPage } from './pages/trainer/StudentRosterPage';
import { TrainingPlansPage } from './pages/trainer/TrainingPlansPage';
import { ProofReviewDeck } from './pages/trainer/ProofReviewDeck';
import { AssessmentsPage } from './pages/trainer/AssessmentsPage';
import { TrainerChatPage } from './pages/trainer/TrainerChatPage';
import { TrainerProfilePage } from './pages/trainer/TrainerProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { TrainerManagementPage } from './pages/admin/TrainerManagementPage';
import { StudentManagementPage } from './pages/admin/StudentManagementPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { CampusAnalyticsPage } from './pages/admin/CampusAnalyticsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Public Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/trainer-assessment" element={<TrainerAssessmentPage />} />

          {/* Student Portal */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/workouts" element={<WorkoutModule />} />
          <Route path="/student/submit-proof" element={<SubmitProofPage />} />
          <Route path="/student/fitcredits" element={<FitCreditsWallet />} />
          <Route path="/student/events" element={<SportsEventsPage />} />
          <Route path="/student/leaderboard" element={<LeaderboardPage />} />
          <Route path="/student/progress" element={<ProgressAnalytics />} />
          <Route path="/student/chat" element={<StudentChatPage />} />
          <Route path="/student/trainer" element={<MyTrainerPage />} />
          <Route path="/student/coach" element={<MyTrainerPage />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />

          {/* Trainer Portal */}
          <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
          <Route path="/trainer/students" element={<StudentRosterPage />} />
          <Route path="/trainer/plans" element={<TrainingPlansPage />} />
          <Route path="/trainer/proof-review" element={<ProofReviewDeck />} />
          <Route path="/trainer/assessments" element={<AssessmentsPage />} />
          <Route path="/trainer/chat" element={<TrainerChatPage />} />
          <Route path="/trainer/profile" element={<TrainerProfilePage />} />

          {/* Admin Portal */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/trainers" element={<TrainerManagementPage />} />
          <Route path="/admin/students" element={<StudentManagementPage />} />
          <Route path="/admin/events" element={<AdminEventsPage />} />
          <Route path="/admin/analytics" element={<CampusAnalyticsPage />} />
          <Route path="/admin/profile" element={<AdminProfilePage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
