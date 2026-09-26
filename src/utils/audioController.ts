import { QaidaItem } from '../types';

export type AudioEventListener = () => void;

class AudioController {
  private audio: HTMLAudioElement | null = null;
  private currentItem: QaidaItem | null = null;
  private currentLessonItems: QaidaItem[] = [];
  private currentItemIndex: number = -1;
  private isListenAllActive: boolean = false;
  private isPlayingState: boolean = false;
  private listeners: Set<AudioEventListener> = new Set();
  private errorListeners: Set<(filename: string, item: QaidaItem) => void> = new Set();
  private autoAdvanceTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      this.setupAudioListeners();
    }
  }

  private setupAudioListeners() {
    if (!this.audio) return;

    this.audio.addEventListener('play', () => {
      this.isPlayingState = true;
      this.notifyListeners();
    });

    this.audio.addEventListener('pause', () => {
      this.isPlayingState = false;
      this.notifyListeners();
    });

    this.audio.addEventListener('ended', () => {
      this.isPlayingState = false;
      this.notifyListeners();
      this.handleTrackEnded();
    });

    this.audio.addEventListener('error', () => {
      this.handleAudioError();
    });
  }

  public subscribe(listener: AudioEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public onError(listener: (filename: string, item: QaidaItem) => void): () => void {
    this.errorListeners.add(listener);
    return () => this.errorListeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach((fn) => fn());
  }

  public getCurrentItem(): QaidaItem | null {
    return this.currentItem;
  }

  public isPlaying(): boolean {
    return this.isPlayingState;
  }

  public isListenAll(): boolean {
    return this.isListenAllActive;
  }

  /**
   * Stop previous audio, reset, load new audio, and play
   */
  public playItem(item: QaidaItem, fromListenAll: boolean = false) {
    if (!fromListenAll) {
      // Manual click stops Listen All sequence
      this.isListenAllActive = false;
    }

    this.clearAdvanceTimeout();
    this.stopAudio();

    this.currentItem = item;

    if (!this.audio) {
      this.audio = new Audio();
      this.setupAudioListeners();
    }

    const audioUrl = item.audio;
    this.audio.src = audioUrl;
    this.audio.currentTime = 0;
    this.audio.load();

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlayingState = true;
          this.notifyListeners();
        })
        .catch(() => {
          this.handleAudioError();
        });
    }
  }

  /**
   * Start 'Listen All': item 1 -> 2 -> ... -> 29
   */
  public startListenAll(items: QaidaItem[], startIndex: number = 0) {
    if (!items || items.length === 0) return;
    this.currentLessonItems = items;
    this.currentItemIndex = Math.max(0, Math.min(startIndex, items.length - 1));
    this.isListenAllActive = true;
    this.notifyListeners();

    const targetItem = this.currentLessonItems[this.currentItemIndex];
    if (targetItem) {
      this.playItem(targetItem, true);
    }
  }

  /**
   * Triggered when an audio track finishes naturally
   */
  private handleTrackEnded() {
    if (this.isListenAllActive && this.currentLessonItems.length > 0) {
      const nextIndex = this.currentItemIndex + 1;
      if (nextIndex < this.currentLessonItems.length) {
        this.currentItemIndex = nextIndex;
        const nextItem = this.currentLessonItems[nextIndex];
        // Brief 250ms breathing gap between letters for small kids
        this.autoAdvanceTimeout = setTimeout(() => {
          this.playItem(nextItem, true);
        }, 300);
      } else {
        // Finished all 29 items
        this.stopAll();
      }
    } else {
      this.currentItem = null;
      this.notifyListeners();
    }
  }

  /**
   * Handles 404 or missing audio file gracefully without crashing
   */
  private handleAudioError() {
    this.isPlayingState = false;
    const item = this.currentItem;
    if (!item) {
      this.notifyListeners();
      return;
    }

    const filename = item.audio.replace(/^\//, '');

    // Notify error listeners to show friendly UI toast
    this.errorListeners.forEach((fn) => fn(filename, item));

    // Try SpeechSynthesis fallback so the child still hears the letter
    this.speakFallback(item.arabic);

    // If Listen All is running, don't get stuck forever; advance after 1.5 seconds
    if (this.isListenAllActive && this.currentLessonItems.length > 0) {
      const nextIndex = this.currentItemIndex + 1;
      if (nextIndex < this.currentLessonItems.length) {
        this.currentItemIndex = nextIndex;
        const nextItem = this.currentLessonItems[nextIndex];
        this.autoAdvanceTimeout = setTimeout(() => {
          if (this.isListenAllActive) {
            this.playItem(nextItem, true);
          }
        }, 1500);
      } else {
        this.stopAll();
      }
    } else {
      this.notifyListeners();
    }
  }

  /**
   * Soft fallback using browser's Arabic SpeechSynthesis if MP3 is missing
   */
  private speakFallback(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85; // gently slower for children
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  }

  /**
   * Stops previous audio and resets
   */
  private stopAudio() {
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.removeAttribute('src');
        this.audio.load();
      } catch {
        // ignore
      }
    }
    this.isPlayingState = false;
  }

  private clearAdvanceTimeout() {
    if (this.autoAdvanceTimeout) {
      clearTimeout(this.autoAdvanceTimeout);
      this.autoAdvanceTimeout = null;
    }
  }

  /**
   * Stop button: immediately stop all audio and sequence
   */
  public stopAll() {
    this.clearAdvanceTimeout();
    this.isListenAllActive = false;
    this.stopAudio();
    this.currentItem = null;
    this.currentItemIndex = -1;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    this.notifyListeners();
  }
}

export const audioController = new AudioController();
