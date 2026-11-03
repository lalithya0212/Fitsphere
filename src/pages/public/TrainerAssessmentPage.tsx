import React, { useState } from 'react';
import { SKILL_ASSESSMENT_QUESTIONS } from '../../data/mockData';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { triggerCelebration } from '../../utils/confetti';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Clock,
  Sparkles,
  UserCheck,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

export const TrainerAssessmentPage: React.FC = () => {
  const { submitTrainerVerification, registerUser, switchRole } = useFitSphereStore();
  const navigate = useNavigate();

  // Registration info step vs quiz step vs result step
  const [step, setStep] = useState<'info' | 'quiz' | 'result'>('info');

  // Trainer Info Form State
  const [trainerName, setTrainerName] = useState('Rahul Sharma');
  const [trainerEmail, setTrainerEmail] = useState('rahul.sharma@athletics.university.edu');
  const [sportSpecialization, setSportSpecialization] = useState('Football Coaching');
  const [experienceYears, setExperienceYears] = useState(7);
  const [bio, setBio] = useState('Experienced collegiate coach focused on sprint mechanics and tactical conditioning.');
  const [certifications, setCertifications] = useState('CSCS (NSCA), UEFA B License');

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [finalScore, setFinalScore] = useState(0);

  const currentQ = SKILL_ASSESSMENT_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === SKILL_ASSESSMENT_QUESTIONS.length - 1;

  const handleSelectAnswer = (optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Calculate score
      let correctCount = 0;
      SKILL_ASSESSMENT_QUESTIONS.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctOptionIndex) {
          correctCount++;
        }
      });
      const scorePct = Math.round((correctCount / SKILL_ASSESSMENT_QUESTIONS.length) * 100);
      setFinalScore(scorePct);

      // Submit into Zustand store for Admin verification
      submitTrainerVerification({
        trainerName,
        trainerEmail,
        avatar: '',
        sportSpecialization,
        experienceYears,
        bio,
        certifications: certifications.split(',').map(s => s.trim()),
        assessmentScore: scorePct
      });

      // Also register coach in users roster with pending verification
      registerUser({
        role: 'trainer',
        name: trainerName.trim(),
        email: trainerEmail.trim(),
        password: 'Password123!',
        department: 'Varsity Athletics & Performance',
        sportSpecialization: sportSpecialization.trim(),
        verificationScore: scorePct,
        credentials: certifications.split(',').map(s => s.trim())
      }).catch(console.error);

      if (scorePct >= 70) {
        triggerCelebration();
      }

      setStep('result');
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Top Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Collegiate Coach Accreditation Protocol</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-950 font-display">
            Trainer Verification & Skill Assessment
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto">
            To ensure the highest standard of student athletic safety and sports science development, all university trainers must pass our 10-Question Skill Examination.
          </p>
        </div>

        {/* STEP 1: Registration Form */}
        {step === 'info' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              1. Candidate Coaching Profile
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Enter your professional credentials and target sport specialization before taking the examination.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={trainerName}
                  onChange={e => setTrainerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Collegiate Email</label>
                  <input
                    type="email"
                    value={trainerEmail}
                    onChange={e => setTrainerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sport Specialization</label>
                  <select
                    value={sportSpecialization}
                    onChange={e => setSportSpecialization(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Football Coaching">Football Coaching</option>
                    <option value="Cricket Coaching">Cricket Coaching</option>
                    <option value="Track & Sprint Biomechanics">Track & Sprint Biomechanics</option>
                    <option value="Strength & Conditioning (S&C)">Strength & Conditioning (S&C)</option>
                    <option value="Aquatics & Swimming Performance">Aquatics & Swimming Performance</option>
                    <option value="Varsity Basketball">Varsity Basketball</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Years of Coaching Experience</label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={e => setExperienceYears(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Licenses & Certifications</label>
                  <input
                    type="text"
                    value={certifications}
                    onChange={e => setCertifications(e.target.value)}
                    placeholder="e.g. CSCS, UEFA B, ASCA"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Coaching Philosophy / Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>10 Questions • Passing score: 70%</span>
                </div>

                <button
                  onClick={() => setStep('quiz')}
                  className="btn-navy text-xs px-6 py-2.5"
                >
                  <span>Begin 10-Question Exam</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Interactive 10-Question Exam */}
        {step === 'quiz' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
            {/* Progress Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Domain: {currentQ.sportDomain}
              </span>
              <span className="text-xs font-bold text-slate-500">
                Question {currentQuestionIndex + 1} of {SKILL_ASSESSMENT_QUESTIONS.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / SKILL_ASSESSMENT_QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-6">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectAnswer(idx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all text-xs sm:text-sm font-medium flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/80 text-blue-950 ring-2 ring-blue-500/20 shadow-xs font-semibold'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 bg-white text-slate-800'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-relaxed pt-0.5">{option}</span>
                    <div
                      className={`w-4 h-4 rounded-full border mt-1 shrink-0 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                className="btn-secondary text-xs px-4 py-2 disabled:opacity-40"
              >
                Previous
              </button>

              <button
                disabled={selectedAnswers[currentQuestionIndex] === undefined}
                onClick={handleNext}
                className="btn-primary text-xs px-6 py-2.5 disabled:opacity-40"
              >
                <span>{isLastQuestion ? 'Submit Exam & Evaluate' : 'Next Question'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Assessment Result & Verification Queue Status */}
        {step === 'result' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-500/10">
              <Award className="w-8 h-8" />
            </div>

            <span className="badge-emerald font-bold mb-2">Examination Completed</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
              Official Assessment Score: {finalScore}%
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto">
              {finalScore >= 70
                ? 'Congratulations! You met the university sports department accreditation threshold (≥ 70%).'
                : 'Score below standard threshold. Further credentials and reassessment required.'}
            </p>

            {/* Candidate Summary Box */}
            <div className="my-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Trainer Name:</span>
                <span className="font-bold text-slate-900">{trainerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sport Specialization:</span>
                <span className="font-bold text-slate-900">{sportSpecialization}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assessment Score:</span>
                <span className="font-bold text-emerald-600">{finalScore}% (Verified)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Verification Status:</span>
                <span className="badge-gold font-bold">Pending Admin Clearance</span>
              </div>
            </div>

            {/* Next Steps Guide */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 max-w-md mx-auto text-left mb-6">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Next Step:</span> Dean Marcus Vance (Sports Administrator) has received this application in the <strong>Admin Command Center</strong> to verify credentials and assign athlete rosters.
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  switchRole('admin');
                  navigate('/admin/trainers');
                }}
                className="btn-navy text-xs px-5 py-3 shadow-md"
              >
                <span>Switch to Admin & Verify This Trainer</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  switchRole('trainer');
                  navigate('/trainer/dashboard');
                }}
                className="btn-secondary text-xs px-5 py-3"
              >
                <span>Go to Trainer Workspace</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
