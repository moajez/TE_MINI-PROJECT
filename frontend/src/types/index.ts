export interface Course {
  id: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  selectedDays: string[];
  excludedDates: string[];
  excludeHolidays: boolean;
  notes: string;
}

export interface ScheduleSummary {
  totalWeeks: number;
  teachingDays: number;
  selectedDays: string[];
  excludedDates: number;
  schedule: string[];
}

export interface User {
  email: string;
  password: string;
}

export type Step = 'home' | 'dateRange' | 'weekdays' | 'filter' | 'summary' | 'syllabusUpload';

export interface StepProgress {
  home: boolean;
  dateRange: boolean;
  weekdays: boolean;
  filter: boolean;
  summary: boolean;
}