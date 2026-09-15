import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Award,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';
import { QUIZ_QUESTIONS, USER_BADGES } from '../data/mockData';
import { QuizQuestion, UserBadge, ViewMode } from '../types';

interface QuizViewProps {
  onNavigate: (view: ViewMode) => void;
  onBadgeAwarded: (badge: UserBadge) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ onNavigate, onBadgeAwarded }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQ: QuizQuestion = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctAnswerIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
      // Award badge if score is high
      if (score + (selectedOption === currentQ.correctAnswerIndex ? 0 : 0) >= 2) {
        onBadgeAwarded(USER_BADGES[0]);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div id="quiz-view-container" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-700/50 text-cyan-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Peer-Reviewed Science Challenge</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
          Indian Polar Scientific Knowledge Check
        </h1>
        <p className="text-slate-400 text-xs max-w-lg mx-auto">
          Every question is grounded directly in official NCPOR expedition reports, ice core telemetry, and Antarctic research publications.
        </p>
      </div>

      {!quizCompleted ? (
        <div
          id="quiz-card"
          className="p-6 sm:p-8 rounded-3xl bg-[#08172c] border border-cyan-900/80 shadow-2xl space-y-6"
        >
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>
                Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
              </span>
              <span className="text-cyan-400 font-mono">Current Score: {score} XP</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-300"
                style={{
                  width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
              Topic: {currentQ.category}
            </span>
            <h2 className="text-xl font-bold text-white mt-1 leading-snug font-['Outfit']">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctAnswerIndex;

              let btnStyle =
                'bg-[#061224] border-slate-800 text-slate-200 hover:border-cyan-600 hover:bg-[#081a33]';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 font-bold';
                } else {
                  btnStyle = 'bg-[#061224]/50 border-slate-800/50 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl border text-left text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Source Grounding (Shown after answered) */}
          {isAnswered && (
            <div className="p-4 rounded-2xl bg-[#06152b] border border-cyan-900/60 space-y-2 animate-fade-in text-xs">
              <div className="flex items-center gap-1.5 font-bold text-cyan-300 uppercase tracking-wider text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Scientific Peer Explanation</span>
              </div>
              <p className="text-slate-200 leading-relaxed">{currentQ.explanation}</p>
              <div className="text-slate-400 pt-1 border-t border-slate-800 font-mono text-[11px]">
                Grounded Source: <span className="text-cyan-400">{currentQ.sourceCitation}</span>
              </div>
            </div>
          )}

          {/* Next / Submit Button */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all"
              >
                <span>
                  {currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Complete Card */
        <div
          id="quiz-result-card"
          className="p-8 rounded-3xl bg-[#08172c] border-2 border-cyan-400 shadow-2xl text-center space-y-6 animate-fade-in"
        >
          <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 mx-auto flex items-center justify-center text-cyan-300">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white font-['Outfit']">
              Challenge Completed!
            </h2>
            <p className="text-sm text-slate-300">
              You scored <span className="font-bold text-cyan-400">{score}</span> out of{' '}
              <span className="font-bold text-white">{QUIZ_QUESTIONS.length}</span> questions correctly.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#051122] border border-cyan-900/60 max-w-sm mx-auto text-xs text-slate-300">
            <div className="font-bold text-emerald-400">Earned: +{score * 50} Research XP</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Eligible for Antarctic Cryosphere Badge Recognition
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Challenge</span>
            </button>

            <button
              onClick={() => onNavigate('learning')}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              Explore 3D Glacier Lab
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
