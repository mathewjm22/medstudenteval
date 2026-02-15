
export interface Competency {
  id: string;
  title: string;
  description?: string;
  isDone: boolean;
  isHighlighted?: boolean;
}

export interface EvaluationSkills {
  historyTaking: number | null;
  physicalExam: number | null;
  reasoning: number | null;
  diagnostics: number | null;
  treatmentPlan: number | null;
}

export interface EvaluationSkillComments {
  historyTaking?: string;
  physicalExam?: string;
  reasoning?: string;
  diagnostics?: string;
  treatmentPlan?: string;
}

export interface Preceptor {
  name: string;
  avatar: string;
}

export interface Evaluation {
  id: string;
  title: string;
  date: string;
  score: number;
  comment: string;
  conditions?: string[];
  skills?: EvaluationSkills;
  skillComments?: EvaluationSkillComments;
  taughtConcepts?: string[];
  evaluator: {
    name: string;
    avatar: string;
  };
}

export interface Assignment {
  id: string;
  title: string;
  dueDate?: string;
  completedDate?: string;
  status: 'pending' | 'done';
}

export type Phase = 'early' | 'mid' | 'late';

export interface Student {
  name: string;
  year: string;
  status: 'Active' | 'Inactive';
  rotation: string;
  startDate: string;
  endDate: string;
  week: number;
  patientsCount: number;
  avgEval: number;
  progressPercent: number;
  weeksRemaining: number;
  avatar: string;
}
