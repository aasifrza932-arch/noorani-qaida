import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, ArrowLeft, Play, Square, Volume2, Sparkles, Check, Home } from 'lucide-react';
import { Lesson, QaidaItem, ViewMode } from '../types';
import { audioController } from '../utils/audioController';
import { soundFX } from '../utils/soundEffects';

interface LessonViewProps {
  lesson: Lesson;
  onNavigate: (view: ViewMode) => void;
  onOpenAudioStatus: () => void;
}

// Harmonious blue and green gradient palettes with glass-like subtle transparency
const CARD_PALETTES = [
  {
    bg: 'from-teal-800/40 via-emerald-900/30 to-teal-950/60',
    border: 'border-teal-400/30 hover:border-teal-300/60',
    activeBorder: 'border-teal-300 ring-4 ring-teal-400/40',
    text: 'text-white',
    badge: 'bg-teal-500/20 text-teal-200 border border-teal-400/25',
    numBadge: 'bg-teal-500 text-white shadow-xs',
    speaker: 'text-teal-300',
  },
  {
    bg: 'from-cyan-800/40 via-teal-900/30 to-slate-950/60',
    border: 'border-cyan-400/30 hover:border-cyan-300/60',
    activeBorder: 'border-cyan-300 ring-4 ring-cyan-400/40',
    text: 'text-white',
    badge: 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/25',
    numBadge: 'bg-cyan-500 text-white shadow-xs',
    speaker: 'text-cyan-300',
  },
  {
    bg: 'from-blue-800/40 via-teal-900/30 to-blue-950/60',
    border: 'border-blue-400/30 hover:border-blue-300/60',
    activeBorder: 'border-blue-300 ring-4 ring-blue-400/40',
    text: 'text-white',
    badge: 'bg-blue-500/20 text-blue-200 border border-blue-400/25',
    numBadge: 'bg-blue-500 text-white shadow-xs',
    speaker: 'text-blue-300',
  },
  {
    bg: 'from-emerald-800/40 via-teal-900/30 to-emerald-950/60',
    border: 'border-emerald-400/30 hover:border-emerald-300/60',
    activeBorder: 'border-emerald-300 ring-4 ring-emerald-400/40',
    text: 'text-white',
    badge: 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/25',
    numBadge: 'bg-emerald-500 text-white shadow-xs',
    speaker: 'text-emerald-300',
  },
  {
    bg: 'from-teal-700/40 via-cyan-900/30 to-teal-950/60',
    border: 'border-teal-300/30 hover:border-teal-200/60',
    activeBorder: 'border-teal-200 ring-4 ring-teal-300/40',
    text: 'text-white',
    badge: 'bg-teal-400/20 text-teal-100 border border-teal-300/25',
    numBadge: 'bg-teal-600 text-white shadow-xs',
    speaker: 'text-teal-200',
  },
  {
    bg: 'from-sky-800/40 via-cyan-900/30 to-blue-950/60',
    border: 'border-sky-400/30 hover:border-sky-300/60',
    activeBorder: 'border-sky-300 ring-4 ring-sky-400/40',
    text: 'text-white',
    badge: 'bg-sky-500/20 text-sky-200 border border-sky-400/25',
    numBadge: 'bg-sky-500 text-white shadow-xs',
    speaker: 'text-sky-300',
  },
  {
    bg: 'from-green-800/40 via-teal-900/30 to-green-950/60',
    border: 'border-green-400/30 hover:border-green-300/60',
    activeBorder: 'border-green-300 ring-4 ring-green-400/40',
    text: 'text-white',
    badge: 'bg-green-500/20 text-green-200 border border-green-400/25',
    numBadge: 'bg-green-600 text-white shadow-xs',
    speaker: 'text-green-300',
  },
];

export const LessonView: React.FC<LessonViewProps> = ({ lesson, onNavigate, onOpenAudioStatus }) => {
  const [playingItem, setPlayingItem] = useState<QaidaItem | null>(null);
  const [isListenAllActive, setIsListenAllActive] = useState<boolean>(false);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Listen to audio controller updates
  useEffect(() => {
    const handleUpdate = () => {
      setPlayingItem(audioController.getCurrentItem());
      setIsListenAllActive(audioController.isListenAll());
    };

    const unsubscribe = audioController.subscribe(handleUpdate);
    return () => {
      unsubscribe();
      audioController.stopAll();
    };
  }, [lesson.id]);

  // Scroll active card into view during Listen All if out of viewport
  useEffect(() => {
    if (playingItem && isListenAllActive) {
      const el = cardRefs.current.get(playingItem.number);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [playingItem, isListenAllActive]);

  const handleCardClick = (item: QaidaItem) => {
    soundFX.playPop();
    audioController.playItem(item);
  };

  const handleStartListenAll = () => {
    soundFX.playPop();
    audioController.startListenAll(lesson.items);
  };

  const handleStopAll = () => {
    soundFX.playPop();
    audioController.stopAll();
  };

  // Current progress calculation
  const currentProgressNumber = playingItem ? playingItem.number : 1;

  return (
    <div className="min-h-screen py-4 px-3 sm:px-6 max-w-6xl mx-auto flex flex-col justify-between" dir="rtl">
      {/* Top Header Section */}
      <header className="mb-4">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-teal-800/40">
          {/* Back Button */}
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

          {/* Center App Branding */}
          <div className="text-center">
            <span className="font-arabic font-extrabold text-2xl sm:text-3xl text-white drop-shadow-[0_2px_14px_rgba(20,184,166,0.6)]">
              نورانی قاعدہ
            </span>
          </div>

          {/* Quick Home / Diagnostic icon */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAudioStatus}
              title="آڈیو اسٹیٹس چیک کریں"
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

        {/* Lesson Subheader & Action Controls */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-teal-900/60 via-emerald-950/60 to-cyan-950/60 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-teal-400/30 shadow-2xl">
          {/* Lesson Title & Progress */}
          <div className="text-center sm:text-right">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-arabic drop-shadow-sm">
                {lesson.title}
              </h1>
              <span className="text-xl sm:text-2xl font-bold text-teal-200 font-arabic">
                - {lesson.subtitle}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold bg-teal-950/80 text-teal-200 border border-teal-400/30 shadow-xs font-arabic">
                <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                <span>حرف {currentProgressNumber} / 29</span>
              </span>
              {isListenAllActive && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-md shadow-emerald-950/50 animate-pulse">
                  <span>سب چل رہا ہے...</span>
                </span>
              )}
            </div>
          </div>

          {/* Listen All & Stop Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
            {/* Listen All Button */}
            <button
              onClick={handleStartListenAll}
              disabled={isListenAllActive}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-arabic font-extrabold text-base sm:text-lg shadow-lg transition-all active:scale-95 cursor-pointer ${
                isListenAllActive
                  ? 'bg-emerald-500 text-white ring-4 ring-emerald-300/50 shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white shadow-teal-500/30 hover:shadow-teal-400/40'
              }`}
            >
              <Play className="w-5 h-5 fill-current" />
              <span>▶️ Listen All (سب سنیں)</span>
            </button>

            {/* Stop Button */}
            <button
              onClick={handleStopAll}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-arabic font-extrabold text-base sm:text-lg shadow-lg shadow-rose-950/40 transition-all active:scale-95 cursor-pointer"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>⏹ Stop</span>
            </button>
          </div>
        </div>
      </header>

      {/* 29 Arabic Cards Grid */}
      <main className="my-2 flex-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4.5">
          {lesson.items.map((item, index) => {
            const palette = CARD_PALETTES[index % CARD_PALETTES.length];
            const isThisPlaying = playingItem?.number === item.number;
            const isLesson3Or4 = lesson.id === 3 || lesson.id === 4;

            if (!isLesson3Or4) {
              /* Lesson 1 & Lesson 2: Untouched Original Layout */
              return (
                <div
                  key={item.number}
                  ref={(el) => {
                    if (el) cardRefs.current.set(item.number, el);
                    else cardRefs.current.delete(item.number);
                  }}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCardClick(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardClick(item);
                    }
                  }}
                  className={`book-card relative rounded-3xl p-3 sm:p-4 border-2 bg-gradient-to-b ${palette.bg} ${
                    isThisPlaying ? palette.activeBorder + ' card-playing' : palette.border
                  } flex flex-col justify-between items-center min-h-[140px] sm:min-h-[160px] cursor-pointer select-none focus:outline-none`}
                >
                  {/* Top Item Bar: Number & Speaker */}
                  <div className="w-full flex items-center justify-between text-xs">
                    {/* Number Badge */}
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${palette.numBadge} shadow-xs font-kids`}>
                      {item.number}
                    </span>

                    {/* Speaker Icon / Wave */}
                    <div
                      className={`p-1.5 rounded-full ${
                        isThisPlaying ? 'bg-teal-400 text-slate-950 sound-wave-active' : palette.badge
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Large Center Arabic Letter */}
                  <div className="my-auto py-1 text-center w-full">
                    <span
                      className={`text-5xl sm:text-6xl md:text-7xl font-arabic font-extrabold ${palette.text} leading-none block drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] transition-transform ${
                        isThisPlaying ? 'scale-110' : ''
                      }`}
                    >
                      {item.arabic}
                    </span>
                  </div>

                  {/* Bottom Label / Playing Indicator */}
                  <div className="w-full text-center mt-1">
                    {isThisPlaying ? (
                      <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-bold bg-teal-400 text-slate-950 shadow-md shadow-teal-950/60 font-arabic animate-pulse">
                        <span>سن رہے ہیں...</span>
                      </span>
                    ) : (
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${palette.badge} font-kids tracking-wide backdrop-blur-xs`}>
                        {item.nameEn}
                      </span>
                    )}
                  </div>
                </div>
              );
            }

            /* Lesson 3 Only: Dedicated Layout with Clear Vertical Gap and Distinct Zer/Kasra Visibility */
            return (
              <div
                key={item.number}
                ref={(el) => {
                  if (el) cardRefs.current.set(item.number, el);
                  else cardRefs.current.delete(item.number);
                }}
                role="button"
                tabIndex={0}
                onClick={() => handleCardClick(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(item);
                  }
                }}
                className={`book-card relative rounded-3xl p-3 sm:p-4 border-2 bg-gradient-to-b ${palette.bg} ${
                  isThisPlaying ? palette.activeBorder + ' card-playing' : palette.border
                } flex flex-col justify-between items-center min-h-[175px] sm:min-h-[190px] cursor-pointer select-none focus:outline-none`}
              >
                {/* 1. Top Item Bar: Number & Speaker */}
                <div className="w-full flex items-center justify-between text-xs">
                  {/* Number Badge */}
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${palette.numBadge} shadow-xs font-kids`}>
                    {item.number}
                  </span>

                  {/* Speaker Icon / Wave */}
                  <div
                    className={`p-1.5 rounded-full ${
                      isThisPlaying ? 'bg-teal-400 text-slate-950 sound-wave-active' : palette.badge
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </div>
                </div>

                {/* 2. Dedicated Arabic Display Area: Vertically Centered with Fixed/Minimum Height */}
                <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[92px] sm:min-h-[102px] pt-1.5 pb-2 text-center overflow-visible">
                  <span
                    dir="rtl"
                    lang="ar"
                    className={`font-['Noto_Naskh_Arabic','Amiri',serif] font-bold text-5xl sm:text-6xl md:text-7xl ${palette.text} leading-[1.3] block drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] select-none transition-transform ${
                      isThisPlaying ? 'scale-110' : ''
                    }`}
                  >
                    {item.arabic}
                  </span>
                </div>

                {/* 3. Dedicated English Label Area: Anchored Below with a Clear Vertical Gap */}
                <div className="w-full text-center mt-auto pt-2 pb-0.5">
                  {isThisPlaying ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-teal-400 text-slate-950 shadow-md shadow-teal-950/60 font-arabic animate-pulse">
                      <span>سن رہے ہیں...</span>
                    </span>
                  ) : (
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${palette.badge} font-kids tracking-wide backdrop-blur-xs shadow-xs`}>
                      {item.nameEn}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Bottom Navigation (Previous & Next) */}
      <footer className="mt-6 pt-4 border-t border-teal-800/40 flex items-center justify-between gap-4">
        {/* Previous Button */}
        {lesson.id === 1 ? (
          <button
            disabled
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 text-white/30 border border-white/10 font-arabic font-bold text-base cursor-not-allowed opacity-60"
          >
            <ArrowRight className="w-4 h-4" />
            <span>← Previous (پچھلا سبق)</span>
          </button>
        ) : lesson.id === 2 ? (
          <button
            onClick={() => {
              audioController.stopAll();
              onNavigate('lesson-1');
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-teal-950/70 hover:bg-teal-900 text-white border border-teal-400/30 font-arabic font-bold text-base shadow-lg shadow-teal-950/40 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 text-teal-300" />
            <span>← سبق 1 (حروف کی پہچان)</span>
          </button>
        ) : lesson.id === 3 ? (
          <button
            onClick={() => {
              audioController.stopAll();
              onNavigate('lesson-2');
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-teal-950/70 hover:bg-teal-900 text-white border border-teal-400/30 font-arabic font-bold text-base shadow-lg shadow-teal-950/40 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 text-teal-300" />
            <span>← سبق 2 (حروف پر زبر)</span>
          </button>
        ) : (
          <button
            onClick={() => {
              audioController.stopAll();
              onNavigate('lesson-3');
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-teal-950/70 hover:bg-teal-900 text-white border border-teal-400/30 font-arabic font-bold text-base shadow-lg shadow-teal-950/40 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 text-teal-300" />
            <span>← سبق 3 (حروف کے نیچے زیر)</span>
          </button>
        )}

        {/* Center Progress Dot indicator */}
        <div className="hidden sm:flex items-center gap-2 text-teal-200 font-bold font-arabic text-sm">
          <span>سبق {lesson.id} از 4</span>
        </div>

        {/* Next Button */}
        {lesson.id === 1 ? (
          <button
            onClick={() => {
              audioController.stopAll();
              onNavigate('lesson-2');
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-arabic font-extrabold text-base shadow-lg shadow-teal-500/30 transition-all active:scale-95 cursor-pointer"
          >
            <span>Next (سبق 2: زبر) →</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : lesson.id === 2 ? (
          <button
            onClick={() => {
              audioController.stopAll();
              onNavigate('lesson-3');
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-arabic font-extrabold text-base shadow-lg shadow-teal-500/30 transition-all active:scale-95 cursor-pointer"
          >
            <span>Next (سبق 3: زیر) →</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : lesson.id === 3 ? (
          <button
            onClick={() => {
              audioController.stopAll();
              onNavigate('lesson-4');
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-arabic font-extrabold text-base shadow-lg shadow-teal-500/30 transition-all active:scale-95 cursor-pointer"
          >
            <span>Next (سبق 4: پیش) →</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => {
              audioController.stopAll();
              onNavigate('quiz');
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-400 hover:to-teal-400 text-white font-arabic font-extrabold text-base shadow-lg shadow-blue-500/30 transition-all active:scale-95 cursor-pointer"
          >
            <span>کھیلو اور سیکھو (QUIZ) 🎮 →</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
      </footer>
    </div>
  );
};
