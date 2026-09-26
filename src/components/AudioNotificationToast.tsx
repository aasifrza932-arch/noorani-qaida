import React, { useEffect, useState } from 'react';
import { VolumeX, X, HelpCircle } from 'lucide-react';
import { audioController } from '../utils/audioController';

export const AudioNotificationToast: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<{ filename: string; letter: string } | null>(null);

  useEffect(() => {
    const unsubscribe = audioController.onError((filename, item) => {
      setErrorMessage({ filename, letter: item.arabic });
    });
    return unsubscribe;
  }, []);

  if (!errorMessage) return null;

  return (
    <aside 
      aria-label="Audio alert"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 animate-bounce duration-500"
    >
      <div className="bg-teal-950/90 border border-teal-400/40 text-teal-100 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-start gap-3">
        <div className="p-2 bg-teal-900/80 text-teal-300 rounded-xl shrink-0 mt-0.5 border border-teal-500/30">
          <VolumeX className="w-5 h-5 text-teal-300" />
        </div>
        <div className="flex-1 text-sm">
          <p className="font-bold text-white text-base font-kids">
            Audio not found: <span className="font-mono bg-teal-900/80 px-1.5 py-0.5 rounded text-teal-200 border border-teal-700/50">{errorMessage.filename}</span>
          </p>
          <p className="text-xs text-teal-200/80 mt-1 font-sans">
            حرف: <span className="font-arabic text-lg font-bold mx-1 text-white">{errorMessage.letter}</span> — براہ کرم یہ فائل روٹ میں اپلوڈ کریں۔
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-teal-300/80">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Upload <code className="font-bold text-teal-200">{errorMessage.filename}</code> to project root</span>
          </div>
        </div>
        <button
          onClick={() => setErrorMessage(null)}
          className="text-teal-400 hover:text-white p-1 hover:bg-teal-900/60 rounded-lg transition-colors cursor-pointer"
          title="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};
