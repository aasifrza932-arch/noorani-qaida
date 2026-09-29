import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, RefreshCw, Home, Volume2, Sparkles, CheckCircle2, Award, Heart } from 'lucide-react';
import { LESSON_1, LESSON_2, LESSON_3, LESSON_4 } from '../data/lessons';
import { QaidaItem, ViewMode } from '../types';
import { audioController } from '../utils/audioController';
import { soundFX } from '../utils/soundEffects';

interface QuizViewProps {
  onNavigate: (view: ViewMode) => void;
  onOpenAudioStatus: () => void;
}

interface QuizQuestion {
  item: QaidaItem;
  lessonId: number;
  options: QaidaItem[];
}

export const QuizView: React.FC<QuizViewProps> = ({ onNavigate, onOpenAudioStatus }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [hasScoredThisQuestion, setHasScoredThisQuestion] = useState<boolean>(false);

  // Generate 10 randomized questions from Lesson 1, Lesson 2, Lesson 3 and Lesson 4 without repeating
  const generateQuiz = () => {
    const allLessonItems: { item: QaidaItem; lessonId: number }[] = [
      ...LESSON_1.items.map((item) => ({ item, lessonId: 1 })),
      ...LESSON_2.items.map((item) => ({ item, lessonId: 2 })),
      ...LESSON_3.items.map((item) => ({ item, lessonId: 3 })),
      ...LESSON_4.items.map((item) => ({ item, lessonId: 4 })),
    ];

    // Shuffle all items
    const shuffled = [...allLessonItems].sort(() => 0.5 - Math.random());
    const selected10 = shuffled.slice(0, 10);

    const generatedQuestions: QuizQuestion[] = selected10.map(({ item, lessonId }) => {
      // Find 3 distractors from the same lesson or pool with different Arabic characters
      const pool = allLessonItems.filter((candidate) => candidate.item.arabic !== item.arabic);
      const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
      const distractors = shuffledPool.slice(0, 3).map((d) => d.item);

      // 4 choices shuffled
      const options = [item, ...distractors].sort(() => 0.5 - Math.random());
      return { item, lessonId, options };
    });

    setQuestions(generatedQuestions);
    setCurrentIndex(0);
    setScore(0);
    setFeedback(null);
    setSelectedAnswer(null);
    setIsCompleted(false);
    setHasScoredThisQuestion(false);
  };

  useEffect(() => {
    generateQuiz();
    return () => {
      audioController.stopAll();
    };
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (option: QaidaItem) => {
    if (!currentQuestion || feedback === 'correct') return;

    setSelectedAnswer(option.number);

    if (option.arabic === currentQuestion.item.arabic) {
      // Correct!
      soundFX.playSuccess();
      setFeedback('correct');

      if (!hasScoredThisQuestion) {
        setScore((prev) => prev + 1);
        setHasScoredThisQuestion(true);
      }

      // Automatically play letter audio
      audioController.playItem(currentQuestion.item);

      // Advance after a sweet encouraging pause
      setTimeout(() => {
        if (currentIndex < 9) {
          setCurrentIndex((prev) => prev + 1);
          setFeedback(null);
          setSelectedAnswer(null);
          setHasScoredThisQuestion(false);
        } else {
          setIsCompleted(true);
          soundFX.playFanfare();
        }
      }, 1400);
    } else {
      // Wrong!
      soundFX.playRetry();
      setFeedback('wrong');
    }
  };

  const handlePlayLetterAudio = () => {
    if (currentQuestion) {
      audioController.playItem(currentQuestion.item);
    }
  };

  // Option button styles - harmonious blue and green gradient options with glass effect
  const OPTION_COLORS = [
    'from-teal-600/90 via-emerald-600/90 to-teal-700/90 hover:from-teal-500 hover:to-emerald-500 text-white border border-teal-300/30 shadow-lg shadow-teal-950/50',
    'from-cyan-600/90 via-teal-600/90 to-blue-700/90 hover:from-cyan-500 hover:to-teal-500 text-white border border-cyan-300/30 shadow-lg shadow-cyan-950/50',
    'from-blue-600/90 via-indigo-600/90 to-teal-700/90 hover:from-blue-500 hover:to-indigo-500 text-white border border-blue-300/30 shadow-lg shadow-blue-950/50',
    'from-emerald-600/90 via-teal-600/90 to-cyan-700/90 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-300/30 shadow-lg shadow-emerald-950/50',
  ];

  return (
    <div className="min-h-screen py-4 px-3 sm:px-6 max-w-4xl mx-auto flex flex-col justify-between" dir="rtl">
      {/* Top Header */}
      <header className="mb-4">
        <div className="flex items-center justify-between pb-3 border-b border-teal-800/40">
          <button
            onClick={() => {
              audioController.stopAll();
              onNavigate('home');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-950/70 hover:bg-teal-900 text-teal-200 border border-teal-400/30 font-arabic font-bold text-sm sm:text-base shadow-lg shadow-teal-950/50 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 text-teal-300" />
            <span>← واپس</span>
          </button>

          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-arabic drop-shadow-[0_2px_14px_rgba(20,184,166,0.6)]">
              🎮 کھیلو اور سیکھو
            </h1>
            <span className="text-xs sm:text-sm font-bold text-teal-300 font-kids tracking-wider">
              QUIZ
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAudioStatus}
              title="آڈیو اسٹیٹس"
              className="p-2.5 rounded-full bg-teal-950/70 hover:bg-teal-900 text-teal-200 border border-teal-400/30 shadow-md backdrop-blur-md transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                audioController.stopAll();
                onNavigate('home');
              }}
              title="مین اسکرین"
              className="p-2.5 rounded-full bg-teal-950/70 hover:bg-teal-900 text-teal-200 border border-teal-400/30 shadow-md backdrop-blur-md transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Score */}
        {!isCompleted && (
          <div className="mt-4 flex items-center justify-between bg-gradient-to-r from-teal-900/60 via-emerald-950/60 to-cyan-950/60 backdrop-blur-xl p-4 rounded-3xl border border-teal-400/30 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-teal-950/80 text-teal-200 border border-teal-400/30 font-arabic font-bold text-sm sm:text-base">
                سوال {currentIndex + 1} / 10
              </span>
              <div className="hidden sm:flex gap-1.5">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all ${
                      i < currentIndex
                        ? 'bg-emerald-400 scale-100 shadow-xs shadow-emerald-400/50'
                        : i === currentIndex
                        ? 'bg-teal-300 scale-125 shadow-md shadow-teal-300/80'
                        : 'bg-teal-950/80 border border-teal-700/40'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-300/40 text-amber-200 font-bold text-sm sm:text-base backdrop-blur-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Score: {score}</span>
            </div>
          </div>
        )}
      </header>

      {/* Main Quiz Area */}
      <main className="my-auto py-2">
        {!isCompleted && currentQuestion ? (
          <div className="flex flex-col items-center">
            {/* Question Prompt */}
            <div className="text-center mb-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-arabic drop-shadow-sm">
                یہ کون سا حرف ہے؟
              </h2>
              <p className="text-xs sm:text-sm text-teal-200/80 mt-1 font-arabic">
                نیچے دیے گئے چار جوابوں میں سے درست پر کلک کریں
              </p>
            </div>

            {/* Arabic Letter Big Card */}
            <div className="relative group my-2">
              <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-3xl bg-gradient-to-tr from-teal-800/50 via-emerald-900/40 to-cyan-950/70 backdrop-blur-2xl border-2 border-teal-400/40 shadow-[0_16px_40px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center p-4 relative overflow-hidden transition-transform">
                <span className="text-7xl sm:text-8xl md:text-9xl font-arabic font-extrabold text-white leading-none select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                  {currentQuestion.item.arabic}
                </span>

                {/* Listen button on card */}
                <button
                  onClick={handlePlayLetterAudio}
                  className="absolute bottom-3 left-3 p-2.5 rounded-full bg-teal-950/80 hover:bg-teal-900 text-teal-200 border border-teal-400/40 shadow-lg shadow-teal-950/60 backdrop-blur-md transition-transform active:scale-95 cursor-pointer"
                  title="سنیں (Listen)"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Feedback Message */}
            <div className="h-14 flex items-center justify-center my-2">
              {feedback === 'correct' && (
                <div className="animate-bounce flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-200 font-arabic font-extrabold text-lg sm:text-xl shadow-lg shadow-emerald-950/60 backdrop-blur-md">
                  <span>⭐ شاباش! 👏 بہت خوب!</span>
                </div>
              )}
              {feedback === 'wrong' && (
                <div className="animate-shake flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-500/20 border-2 border-rose-400 text-rose-200 font-arabic font-bold text-base sm:text-lg shadow-lg shadow-rose-950/60 backdrop-blur-md">
                  <span>🙂 دوبارہ کوشش کرو</span>
                </div>
              )}
            </div>

            {/* 4 Colorful Answer Buttons */}
            <div className="w-full max-w-lg grid grid-cols-2 gap-3 sm:gap-4 mt-2">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswer === option.number;
                const isCorrect = option.arabic === currentQuestion.item.arabic;

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(option)}
                    disabled={feedback === 'correct'}
                    className={`book-card p-4 sm:p-5 rounded-2xl bg-gradient-to-r ${OPTION_COLORS[idx % OPTION_COLORS.length]} font-arabic font-extrabold text-xl sm:text-2xl shadow-md flex items-center justify-center gap-2 border cursor-pointer active:scale-95 transition-all ${
                      isSelected && feedback === 'wrong'
                        ? 'ring-4 ring-rose-400 opacity-80'
                        : ''
                    } ${
                      isSelected && isCorrect
                        ? 'ring-4 ring-emerald-300 scale-105'
                        : ''
                    }`}
                  >
                    <span>{option.nameUrdu}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Quiz Completed Screen */
          <div className="bg-gradient-to-b from-teal-950/85 via-emerald-950/80 to-[#042428]/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-teal-400/40 shadow-2xl text-center max-w-md mx-auto animate-in zoom-in-95 duration-300">
            {/* Celebration Icon */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 mx-auto flex items-center justify-center text-4xl shadow-lg shadow-teal-500/40 mb-4 floating-anim text-white">
              🎉
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-arabic mb-1 drop-shadow-sm">
              شاباش!
            </h2>
            <p className="text-lg font-bold text-teal-300 font-kids tracking-wider mb-4">
              Quiz Complete
            </p>

            {/* Score Box */}
            <div className="bg-teal-900/50 rounded-2xl p-5 border border-teal-400/30 mb-6 backdrop-blur-md">
              <span className="block text-sm text-teal-200/80 font-kids mb-1">Your Score:</span>
              <div className="text-5xl font-extrabold text-teal-300 font-kids drop-shadow-sm">
                {score} <span className="text-2xl text-teal-200/60 font-normal">/ 10</span>
              </div>

              {/* Stars based on score */}
              <div className="flex justify-center items-center gap-2 mt-3">
                <Star
                  className={`w-8 h-8 ${
                    score >= 4
                      ? 'fill-amber-400 text-amber-400 sparkle-anim'
                      : 'text-teal-950/80'
                  }`}
                />
                <Star
                  className={`w-10 h-10 ${
                    score >= 7
                      ? 'fill-amber-400 text-amber-400 sparkle-anim'
                      : 'text-teal-950/80'
                  }`}
                />
                <Star
                  className={`w-8 h-8 ${
                    score >= 9
                      ? 'fill-amber-400 text-amber-400 sparkle-anim'
                      : 'text-teal-950/80'
                  }`}
                />
              </div>

              <p className="text-sm font-arabic font-bold text-teal-200 mt-3">
                {score === 10
                  ? 'ماشاءاللہ! تمام جوابات درست ہیں! ⭐⭐⭐'
                  : score >= 7
                  ? 'بہت خوب! آپ نے بہت اچھا سیکھا ہے! 👏'
                  : 'شاباش! دوبارہ کھیل کر مزید ستارے جیتیں! ✨'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={generateQuiz}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-arabic font-extrabold text-base shadow-lg shadow-teal-500/30 transition-all active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>🔄 دوبارہ کھیلیں</span>
              </button>

              <button
                onClick={() => {
                  audioController.stopAll();
                  onNavigate('home');
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-arabic font-bold text-base shadow-lg backdrop-blur-md transition-all active:scale-95 cursor-pointer"
              >
                <Home className="w-4 h-4 text-teal-300" />
                <span>🏠 گھر جائیں</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer spacer */}
      <footer className="mt-4 pt-3 border-t border-teal-800/40 flex items-center justify-center text-xs text-teal-200/70">
        <span>کھیلیں اور حروف کی پہچان پکی کریں</span>
      </footer>
    </div>
  );
};
