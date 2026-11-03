import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Award, CheckCircle2, ArrowRight, ArrowLeft, Clock, Sparkles, X, AlertCircle } from 'lucide-react';
import { SKILL_ASSESSMENT_QUESTIONS } from '../../data/mockData';
import { triggerCelebration } from '../../utils/confetti';

interface CoachQuizModalProps {
  isOpen: boolean;
  coachName: string;
  coachEmail: string;
  sportSpecialization: string;
  onComplete: (scorePct: number) => void;
  onClose: () => void;
}

export const CoachQuizModal: React.FC<CoachQuizModalProps> = ({
  isOpen,
  coachName,
  sportSpecialization,
  onComplete,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);

  if (!isOpen) return null;

  const currentQ = SKILL_ASSESSMENT_QUESTIONS[currentIndex];
  const isLastQuestion = currentIndex === SKILL_ASSESSMENT_QUESTIONS.length - 1;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPct = Math.round(((currentIndex + 1) / SKILL_ASSESSMENT_QUESTIONS.length) * 100);

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
  };

  const handleNext = () => {
    if (selectedAnswers[currentIndex] === undefined) return;

    if (isLastQuestion) {
      // Calculate final score percentage
      let correct = 0;
      SKILL_ASSESSMENT_QUESTIONS.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctOptionIndex) {
          correct++;
        }
      });
      const scorePct = Math.round((correct / SKILL_ASSESSMENT_QUESTIONS.length) * 100);
      setCalculatedScore(scorePct);
      setIsCompleted(true);

      if (scorePct >= 70) {
        triggerCelebration();
      }

      // Automatically complete after short celebratory view
      setTimeout(() => {
        onComplete(scorePct);
      }, 1600);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden relative my-auto"
      >
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 relative">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Collegiate Coach Accreditation Examination</span>
            </div>
            {!isCompleted && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Cancel examination"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            Fitness & Sports Science Evaluation
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Candidate: <strong className="text-slate-200">{coachName}</strong> • Specialization: <strong className="text-slate-200">{sportSpecialization}</strong>
          </p>

          {/* Progress bar */}
          {!isCompleted && (
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                <span>Question {currentIndex + 1} of {SKILL_ASSESSMENT_QUESTIONS.length}</span>
                <span>{answeredCount} / {SKILL_ASSESSMENT_QUESTIONS.length} Answered</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-7">
          <AnimatePresence mode="wait">
            {!isCompleted ? (
              <motion.div
                key={`q-${currentIndex}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Domain Tag */}
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                  {currentQ.sportDomain}
                </span>

                {/* Question Prompt */}
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {currentQ.question}
                </h3>

                {/* Options List */}
                <div className="space-y-2.5 pt-1">
                  {currentQ.options.map((optionText, optIdx) => {
                    const isSelected = selectedAnswers[currentIndex] === optIdx;
                    const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all duration-150 flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold ring-2 ring-emerald-500/30 shadow-sm'
                            : 'bg-white border-slate-200/90 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/20'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="flex-1 leading-relaxed pt-0.5">{optionText}</span>
                        <div
                          className={`w-4 h-4 rounded-full border mt-1 shrink-0 flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={selectedAnswers[currentIndex] === undefined}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] shadow-md shadow-emerald-600/20 disabled:opacity-40 disabled:pointer-events-none transition-all"
                  >
                    {isLastQuestion ? (
                      <>
                        <span>Submit Accreditation Exam</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Next Question</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Completion Success View */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center space-y-4"
              >
                <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Award className="w-8 h-8 text-emerald-600" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-950 font-display">
                    Examination Submitted!
                  </h3>
                  <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-black">
                    <span>Accreditation Score:</span>
                    <span className="text-base text-emerald-600">{calculatedScore}%</span>
                  </div>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
                    Your exam answers have been graded and automatically submitted to the
                    <strong> Campus Athletic Administration</strong> for verification. Redirecting you to sign in...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
