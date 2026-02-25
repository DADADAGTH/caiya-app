export type WealthBucket = 'emergency' | 'daily' | 'investment' | 'growth';

export interface WealthGrid {
  // Target percentages (0-100)
  emergency: number;
  daily: number;
  investment: number;
  growth: number;
  // Actual amounts (optional, calculated from ledger)
  actual?: {
      emergency: number;
      daily: number;
      investment: number;
      growth: number;
  };
}

export interface UserProfile {
  id: string;
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
  category: 'economic_base' | 'financial_literacy' | 'psychology' | 'risk_profile';
  explanation?: string; // Economic principle explanation
}

export interface KnowledgeCard {
  id: string;
  title: string;
  content: string;
  concept: string; // Economic concept
  action?: string; // Actionable advice
  tags: string[];
  isAiGenerated?: boolean; // New flag
  date?: string; // Generated date
}
