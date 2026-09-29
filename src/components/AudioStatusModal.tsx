import React, { useState, useEffect, useTransition } from 'react';
import { X, CheckCircle2, XCircle, Play, RefreshCw, Volume2, HardDrive, Info } from 'lucide-react';
import { LESSON_1, LESSON_2, LESSON_3, LESSON_4 } from '../data/lessons';
import { audioController } from '../utils/audioController';
import { QaidaItem } from '../types';

interface AudioStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FileCheckResult {
  filename: string;
  path: string;
  lessonId: number;
  letter: string;
  name: string;
  item: QaidaItem;
  status: 'checking' | 'found' | 'missing';
}

export const AudioStatusModal: React.FC<AudioStatusModalProps> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState<'all' | 'l1' | 'l2' | 'l3' | 'l4' | 'missing'>('all');
  const [results, setResults] = useState<FileCheckResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [, startTransition] = useTransition();

  const allItems: { lessonId: number; item: QaidaItem }[] = [
    ...LESSON_1.items.map((item) => ({ lessonId: 1, item })),
    ...LESSON_2.items.map((item) => ({ lessonId: 2, item })),
    ...LESSON_3.items.map((item) => ({ lessonId: 3, item })),
    ...LESSON_4.items.map((item) => ({ lessonId: 4, item })),
  ];

  const checkAllFiles = async () => {
    setIsScanning(true);
    const initialList: FileCheckResult[] = allItems.map(({ lessonId, item }) => ({
      filename: item.audio.replace(/^\//, ''),
      path: item.audio,
      lessonId,
      letter: item.arabic,
      name: item.nameEn,
      item,
      status: 'checking',
    }));
    setResults(initialList);

    const updated = [...initialList];
    for (let i = 0; i < updated.length; i++) {
      const file = updated[i];
      try {
        const response = await fetch(file.path, { method: 'HEAD', cache: 'no-cache' });
        // Check if status is 200 and Content-Type indicates audio or ok status
        if (response.ok && response.status < 400) {
          const contentType = response.headers.get('content-type') || '';
          // Avoid HTML fallback from SPA router
          if (contentType.includes('text/html')) {
            updated[i] = { ...file, status: 'missing' };
          } else {
            updated[i] = { ...file, status: 'found' };
          }
        } else {
          updated[i] = { ...file, status: 'missing' };
        }
      } catch {
        updated[i] = { ...file, status: 'missing' };
      }
      if (i % 5 === 0 || i === updated.length - 1) {
        startTransition(() => {
          setResults([...updated]);
        });
      }
    }
    setIsScanning(false);
  };

  useEffect(() => {
    if (isOpen && results.length === 0) {
      checkAllFiles();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const foundCount = results.filter((r) => r.status === 'found').length;
  const missingCount = results.filter((r) => r.status === 'missing').length;

  const filteredResults = results.filter((r) => {
    if (filter === 'l1') return r.lessonId === 1;
    if (filter === 'l2') return r.lessonId === 2;
    if (filter === 'l3') return r.lessonId === 3;
    if (filter === 'l4') return r.lessonId === 4;
    if (filter === 'missing') return r.status === 'missing';
    return true;
  });

  const handleTestPlay = (item: QaidaItem) => {
    audioController.playItem(item);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#052b30]/95 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-teal-400/40 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-white"
        dir="ltr"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <HardDrive className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight font-kids">Audio Files Diagnostic (آڈیو اسٹیٹس)</h2>
              <p className="text-xs text-teal-100 font-sans">Verification for root-level MP3 uploads</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-teal-950/80 border-b border-teal-500/20 px-6 py-3 flex items-start gap-2.5 text-xs text-teal-200">
          <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <div>
            <strong>How to upload:</strong> Place all MP3 files directly into your project root directory (e.g.{' '}
            <code className="bg-teal-900/80 px-1 py-0.5 rounded font-mono font-bold text-teal-100">/001.mp3</code> to{' '}
            <code className="bg-teal-900/80 px-1 py-0.5 rounded font-mono font-bold text-teal-100">/029.mp3</code>,{' '}
            <code className="bg-teal-900/80 px-1 py-0.5 rounded font-mono font-bold text-teal-100">/101.mp3</code> to{' '}
            <code className="bg-teal-900/80 px-1 py-0.5 rounded font-mono font-bold text-teal-100">/129.mp3</code>,{' '}
            <code className="bg-teal-900/80 px-1 py-0.5 rounded font-mono font-bold text-teal-100">/201.mp3</code> to{' '}
            <code className="bg-teal-900/80 px-1 py-0.5 rounded font-mono font-bold text-teal-100">/229.mp3</code>, and{' '}
            <code className="bg-teal-900/80 px-1 py-0.5 rounded font-mono font-bold text-teal-100">/301.mp3</code> to{' '}
            <code className="bg-teal-900/80 px-1 py-0.5 rounded font-mono font-bold text-teal-100">/329.mp3</code>).
          </div>
        </div>

        {/* Stats & Filter Bar */}
        <div className="p-4 border-b border-teal-500/20 bg-teal-950/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Found: {foundCount} / 116
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30">
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
              Missing: {missingCount}
            </span>
          </div>

          <button
            onClick={checkAllFiles}
            disabled={isScanning}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white disabled:opacity-50 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Re-check All'}
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-teal-500/20 px-4 pt-2 gap-1 bg-teal-950/40 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 border-b-2 rounded-t-lg transition-colors cursor-pointer whitespace-nowrap ${
              filter === 'all'
                ? 'border-teal-400 text-teal-200 bg-teal-900/50'
                : 'border-transparent text-teal-300/60 hover:text-teal-200'
            }`}
          >
            All Files (116)
          </button>
          <button
            onClick={() => setFilter('l1')}
            className={`px-3 py-2 border-b-2 rounded-t-lg transition-colors cursor-pointer whitespace-nowrap ${
              filter === 'l1'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/50'
                : 'border-transparent text-teal-300/60 hover:text-teal-200'
            }`}
          >
            Lesson 1 (29)
          </button>
          <button
            onClick={() => setFilter('l2')}
            className={`px-3 py-2 border-b-2 rounded-t-lg transition-colors cursor-pointer whitespace-nowrap ${
              filter === 'l2'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/50'
                : 'border-transparent text-teal-300/60 hover:text-teal-200'
            }`}
          >
            Lesson 2 (29)
          </button>
          <button
            onClick={() => setFilter('l3')}
            className={`px-3 py-2 border-b-2 rounded-t-lg transition-colors cursor-pointer whitespace-nowrap ${
              filter === 'l3'
                ? 'border-teal-300 text-teal-100 bg-teal-950/50'
                : 'border-transparent text-teal-300/60 hover:text-teal-200'
            }`}
          >
            Lesson 3 (29)
          </button>
          <button
            onClick={() => setFilter('l4')}
            className={`px-3 py-2 border-b-2 rounded-t-lg transition-colors cursor-pointer whitespace-nowrap ${
              filter === 'l4'
                ? 'border-sky-300 text-sky-100 bg-sky-950/50'
                : 'border-transparent text-teal-300/60 hover:text-teal-200'
            }`}
          >
            Lesson 4 (29)
          </button>
          <button
            onClick={() => setFilter('missing')}
            className={`px-3 py-2 border-b-2 rounded-t-lg transition-colors cursor-pointer whitespace-nowrap ${
              filter === 'missing'
                ? 'border-rose-400 text-rose-300 bg-rose-950/50'
                : 'border-transparent text-teal-300/60 hover:text-teal-200'
            }`}
          >
            Missing Only ({missingCount})
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-teal-500/10">
          {filteredResults.length === 0 ? (
            <div className="text-center py-12 text-teal-300/50 text-sm">
              No files found matching the filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredResults.map((r) => (
                <div
                  key={r.filename}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    r.status === 'found'
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                      : r.status === 'missing'
                      ? 'bg-rose-950/40 border-rose-500/30 text-rose-200'
                      : 'bg-teal-950/30 border-teal-500/20 text-teal-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-sm">
                      {r.status === 'found' ? (
                        <span className="text-emerald-400 font-bold">✓</span>
                      ) : r.status === 'missing' ? (
                        <span className="text-rose-400 font-bold">✗</span>
                      ) : (
                        <span className="text-teal-400">...</span>
                      )}
                    </span>
                    <div>
                      <div className="font-mono font-semibold text-white">{r.filename}</div>
                      <div className="text-[11px] text-teal-300/70 flex items-center gap-1 font-arabic" dir="rtl">
                        <span className="text-sm font-bold text-teal-100">{r.letter}</span>
                        <span>({r.name})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTestPlay(r.item)}
                      title={`Play ${r.filename}`}
                      className="p-1.5 rounded-lg bg-teal-900/60 hover:bg-teal-800 text-teal-200 border border-teal-500/30 shadow-xs transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-teal-950/80 border-t border-teal-500/20 flex items-center justify-between text-xs text-teal-300/70">
          <span>Total tracked: 87 audio files</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white rounded-full font-semibold transition-all shadow-md cursor-pointer"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
