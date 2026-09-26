import React from 'react';
import { Sparkles, BookOpen, Gamepad2, Volume2, Star, Award, Heart, ChevronLeft } from 'lucide-react';
import { ViewMode } from '../types';
import { soundFX } from '../utils/soundEffects';

interface HomeScreenProps {
  onSelectView: (view: ViewMode) => void;
  onOpenAudioStatus: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectView, onOpenAudioStatus }) => {
  const handleCardClick = (view: ViewMode) => {
    soundFX.playPop();
    onSelectView(view);
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-8 max-w-5xl mx-auto flex flex-col justify-between">
      {/* Top Banner / Bismillah */}
      <header className="text-center pt-2 pb-6">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-teal-950/70 backdrop-blur-md border border-teal-400/30 text-teal-200 text-xs sm:text-sm font-semibold shadow-lg shadow-teal-950/40 mb-3">
          <Sparkles className="w-4 h-4 text-teal-300 sparkle-anim" />
          <span className="font-arabic text-base sm:text-lg">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
          <Sparkles className="w-4 h-4 text-teal-300 sparkle-anim" />
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white font-arabic tracking-wide drop-shadow-[0_4px_20px_rgba(20,184,166,0.55)] mb-2">
          نورانی قاعدہ
        </h1>
        <p className="text-xl sm:text-2xl text-teal-200 font-arabic font-semibold drop-shadow-sm">
          کھیلیں، سنیں اور سیکھیں
        </p>

        {/* Decorative Floating Clouds and Stars */}
        <div className="flex justify-center items-center gap-3 mt-3 text-teal-300">
          <Star className="w-5 h-5 fill-teal-300 sparkle-anim" />
          <div className="w-12 h-1 bg-teal-500/30 rounded-full"></div>
          <Star className="w-6 h-6 fill-teal-300 floating-anim" />
          <div className="w-12 h-1 bg-teal-500/30 rounded-full"></div>
          <Star className="w-5 h-5 fill-teal-300 sparkle-anim" />
        </div>
      </header>

      {/* Main 3 Big Colorful Cards */}
      <main className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto py-4">
        {/* Card 1: سبق 1 */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleCardClick('lesson-1')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCardClick('lesson-1');
            }
          }}
          className="book-card bg-gradient-to-br from-teal-800/40 via-emerald-900/30 to-teal-950/70 rounded-3xl p-6 sm:p-7 border border-teal-400/35 text-right relative overflow-hidden group cursor-pointer flex flex-col justify-between min-h-[290px] shadow-2xl focus:outline-none focus:ring-4 focus:ring-teal-400/50"
        >
          {/* Decorative Background Letters */}
          <span className="absolute -left-3 -bottom-5 text-8xl font-bold font-arabic text-teal-300/10 select-none pointer-events-none group-hover:scale-110 transition-transform">
            ا ب
          </span>

          <div className="relative z-10">
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-200 border border-teal-400/30 backdrop-blur-sm">
                <BookOpen className="w-3.5 h-3.5 text-teal-300" />
                29 حروف
              </span>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-teal-500/30 text-2xl group-hover:rotate-6 transition-transform">
                📖
              </div>
            </div>

            {/* Lesson Title */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-arabic mb-1 drop-shadow-sm">
              سبق 1
            </h2>
            <p className="text-xl sm:text-2xl font-bold text-teal-200 font-arabic mb-3">
              حروف کی پہچان
            </p>
            <p className="text-xs text-teal-100/70 font-sans">
              Learn individual Arabic letters from Alif to Yaa with clear sounds
            </p>
          </div>

          {/* Letter preview strip & action */}
          <div className="relative z-10 pt-4 mt-2 border-t border-teal-500/20 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-white font-arabic text-xl font-bold bg-black/25 backdrop-blur-sm px-3 py-1 rounded-xl border border-white/10">
              <span>ا</span>
              <span className="text-teal-400">•</span>
              <span>ب</span>
              <span className="text-teal-400">•</span>
              <span>ت</span>
              <span className="text-teal-400">•</span>
              <span>ث</span>
            </div>
            <div className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 group-hover:from-teal-400 group-hover:to-emerald-400 text-white text-xs font-bold rounded-full shadow-md shadow-teal-950/50 transition-all">
              <span>کھولیں</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Card 2: سبق 2 */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleCardClick('lesson-2')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCardClick('lesson-2');
            }
          }}
          className="book-card bg-gradient-to-br from-cyan-900/40 via-teal-900/30 to-emerald-950/70 rounded-3xl p-6 sm:p-7 border border-cyan-400/35 text-right relative overflow-hidden group cursor-pointer flex flex-col justify-between min-h-[290px] shadow-2xl focus:outline-none focus:ring-4 focus:ring-cyan-400/50"
        >
          {/* Decorative Background Letters */}
          <span className="absolute -left-3 -bottom-5 text-8xl font-bold font-arabic text-cyan-300/10 select-none pointer-events-none group-hover:scale-110 transition-transform">
            اَ بَ
          </span>

          <div className="relative z-10">
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 backdrop-blur-sm">
                <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
                29 حروف
              </span>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30 text-2xl group-hover:rotate-6 transition-transform">
                📖
              </div>
            </div>

            {/* Lesson Title */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-arabic mb-1 drop-shadow-sm">
              سبق 2
            </h2>
            <p className="text-xl sm:text-2xl font-bold text-cyan-200 font-arabic mb-3">
              حروف پر زبر
            </p>
            <p className="text-xs text-cyan-100/70 font-sans">
              Learn the short vowel Fatḥah (Zabar) sound on all 29 Arabic letters
            </p>
          </div>

          {/* Letter preview strip & action */}
          <div className="relative z-10 pt-4 mt-2 border-t border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-white font-arabic text-xl font-bold bg-black/25 backdrop-blur-sm px-3 py-1 rounded-xl border border-white/10">
              <span>اَ</span>
              <span className="text-cyan-400">•</span>
              <span>بَ</span>
              <span className="text-cyan-400">•</span>
              <span>تَ</span>
              <span className="text-cyan-400">•</span>
              <span>ثَ</span>
            </div>
            <div className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 group-hover:from-cyan-400 group-hover:to-teal-400 text-white text-xs font-bold rounded-full shadow-md shadow-cyan-950/50 transition-all">
              <span>کھولیں</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Card 3: کھیلو اور سیکھو (QUIZ) */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleCardClick('quiz')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCardClick('quiz');
            }
          }}
          className="book-card bg-gradient-to-br from-blue-900/40 via-teal-900/30 to-indigo-950/70 rounded-3xl p-6 sm:p-7 border border-blue-400/35 text-right relative overflow-hidden group cursor-pointer flex flex-col justify-between min-h-[290px] shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-400/50"
        >
          {/* Decorative Stars Background */}
          <span className="absolute -left-2 -bottom-3 text-7xl text-blue-300/10 select-none pointer-events-none group-hover:rotate-12 transition-transform">
            ⭐ 🎮
          </span>

          <div className="relative z-10">
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30 backdrop-blur-sm">
                <Award className="w-3.5 h-3.5 text-blue-300" />
                10 سوالات
              </span>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 text-2xl group-hover:rotate-6 transition-transform">
                🎮
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-arabic mb-1 drop-shadow-sm">
              کھیلو اور سیکھو
            </h2>
            <p className="text-xl sm:text-2xl font-bold text-blue-200 font-kids tracking-wider mb-3">
              QUIZ
            </p>
            <p className="text-xs text-blue-100/70 font-sans">
              Fun interactive recognition game to test what you learned!
            </p>
          </div>

          {/* Action button */}
          <div className="relative z-10 pt-4 mt-2 border-t border-blue-500/20 flex items-center justify-between">
            <div className="flex items-center gap-1 text-teal-100 text-sm font-semibold bg-black/25 backdrop-blur-sm px-3 py-1 rounded-xl border border-white/10">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>ستارے جیتیں!</span>
            </div>
            <div className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 group-hover:from-blue-400 group-hover:to-teal-400 text-white text-xs font-bold rounded-full shadow-md shadow-blue-950/50 transition-all">
              <span>شروع کریں</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          </div>
        </div>
      </main>

      {/* Child-Friendly Footer & Parent Audio Status */}
      <footer className="mt-8 pt-4 border-t border-teal-800/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-teal-200/70">
        <div className="flex items-center gap-2 text-teal-200">
          <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          <span>بچوں کی دینی تعلیم کے لیے پیارا تحفہ</span>
        </div>

        {/* Developer/Parent Audio Status Button (Subtle & Non-Intrusive) */}
        <button
          onClick={onOpenAudioStatus}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-teal-950/80 hover:bg-teal-900 text-teal-200 border border-teal-500/30 font-sans text-xs transition-colors shadow-lg shadow-teal-950/50 cursor-pointer backdrop-blur-md"
          title="Open Audio Files Upload Diagnostics"
        >
          <Volume2 className="w-3.5 h-3.5 text-teal-300" />
          <span>آڈیو اسٹیٹس / Upload Diagnostics (58 Files)</span>
        </button>
      </footer>
    </div>
  );
};
