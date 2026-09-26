import { useState } from 'react';
import { ViewMode } from './types';
import { LESSON_1, LESSON_2 } from './data/lessons';
import { HomeScreen } from './components/HomeScreen';
import { LessonView } from './components/LessonView';
import { QuizView } from './components/QuizView';
import { AudioStatusModal } from './components/AudioStatusModal';
import { AudioNotificationToast } from './components/AudioNotificationToast';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [isAudioStatusOpen, setIsAudioStatusOpen] = useState<boolean>(false);

  return (
    <div className="relative min-h-screen text-white selection:bg-teal-500/30 selection:text-teal-200">
      {/* Friendly Audio Error Toast */}
      <AudioNotificationToast />

      {/* Developer / Parent Audio Files Diagnostics Modal */}
      <AudioStatusModal
        isOpen={isAudioStatusOpen}
        onClose={() => setIsAudioStatusOpen(false)}
      />

      {/* Main Views */}
      {currentView === 'home' && (
        <HomeScreen
          onSelectView={(view) => setCurrentView(view)}
          onOpenAudioStatus={() => setIsAudioStatusOpen(true)}
        />
      )}

      {currentView === 'lesson-1' && (
        <LessonView
          lesson={LESSON_1}
          onNavigate={(view) => setCurrentView(view)}
          onOpenAudioStatus={() => setIsAudioStatusOpen(true)}
        />
      )}

      {currentView === 'lesson-2' && (
        <LessonView
          lesson={LESSON_2}
          onNavigate={(view) => setCurrentView(view)}
          onOpenAudioStatus={() => setIsAudioStatusOpen(true)}
        />
      )}

      {currentView === 'quiz' && (
        <QuizView
          onNavigate={(view) => setCurrentView(view)}
          onOpenAudioStatus={() => setIsAudioStatusOpen(true)}
        />
      )}
    </div>
  );
}
