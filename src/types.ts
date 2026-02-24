export type WealthBucket = 'emergency' | 'daily' | 'growth' | 'investment';

export interface WealthGrid {
  emergency: number; // 15-20%
  daily: number;     // 10-15%
  investment: number; // 50-65% (growth/investment combined in prompt as '增值金', prompt uses 'growth' for '成长金' which is different)
  // Prompt definitions:
  // 备用金 (Emergency) 15-20%
  // 日常开销 (Daily) 10-15%
  // 增值金 (Investment/ValueAdd) 50-65%
  // 成长金 (Growth/Self) 10-20%
  growth: number; 
}

export interface UserProfile {
  name: string;
  avatar?: string;
  financialScore: number;
  riskTolerance: 'conservative' | 'balanced' | 'aggressive';
  wealthGrid: WealthGrid;
  // Questionnaire results
  answers: Record<string, any>;
  isOnboarded: boolean;
}

export interface LedgerEntry {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  bucket: WealthBucket; // For expense
  category: string;
  note?: string;
  date: string; // ISO string
}

export interface QuestionOption {
  value: string;
  label: string;
  score?: number; // For scoring logic
}

export interface Question {
  id: string;
  text: string;
  type: 'single' | 'number' | 'multi';
  options?: QuestionOption[];
  category: 'economic_base' | 'financial_literacy' | 'psychology';
  explanation?: string; // Economic principle explanation
}

export interface KnowledgeCard {
  id: string;
  title: string;
  content: string;
  concept: string; // Economic concept
  action?: string; // Actionable advice
  tags: string[];
}
