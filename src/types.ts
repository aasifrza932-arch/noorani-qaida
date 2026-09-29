export interface QaidaItem {
  number: number;
  arabic: string;
  nameUrdu: string;
  nameEn: string;
  audio: string;
}

export interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  items: QaidaItem[];
}

export type ViewMode = 'home' | 'lesson-1' | 'lesson-2' | 'lesson-3' | 'lesson-4' | 'quiz';

export interface AudioStatusItem {
  filename: string;
  path: string;
  lessonId: number;
  number: number;
  letter: string;
  status: 'checking' | 'available' | 'missing';
}
