export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  ESSAY = 'ESSAY', // Tự luận
  THINKING = 'THINKING', // Tư duy
  GAME = 'GAME' // Trò chơi/Đố vui
}

export enum Level {
  BASIC = 'BASIC',
  ADVANCED = 'ADVANCED',
  CHALLENGE = 'CHALLENGE'
}

export interface Question {
  id: string;
  type: QuestionType;
  questionText: string;
  options?: string[]; // For multiple choice
  correctAnswer: string; // Text answer or option index
  explanation?: string; // Guide for parents
  points: number;
  image?: string; // Optional emoji/image representation
  metadata?: any; // For custom rendering data
}

export enum Subject {
  MATH = 'MATH',
  VIETNAMESE = 'VIETNAMESE'
}

export interface TestStructure {
  id: string;
  subject: Subject;
  level: Level;
  title: string;
  subTitle: string;
  colorTheme: string;
  questions: {
    part1: Question[]; // Trắc nghiệm
    part2: Question[]; // Tự luận
    part3: Question[]; // Tư duy
    part4: Question[]; // Trò chơi
  };
  advice: string; // Advice for parents
  welcomeMessage?: string; // Message for the student
}