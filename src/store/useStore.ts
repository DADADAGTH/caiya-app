import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { LedgerEntry, UserProfile, WealthGrid } from '../types';

interface AppState {
  user: UserProfile | null;
  ledger: LedgerEntry[];
  loading: boolean;
  
  // Actions
  fetchProfile: () => Promise<void>;
  fetchLedger: () => Promise<void>;
  completeOnboarding: (answers: Record<string, any>) => Promise<void>;
  addLedgerEntry: (entry: Omit<LedgerEntry, 'id'>) => Promise<void>;
  signOut: () => Promise<void>;
}

// Reuse mock logic for now, but apply to real data
const calculateWealthGrid = (answers: Record<string, any>): WealthGrid => {
  let grid = {
    emergency: 20,
    daily: 15,
    investment: 50,
    growth: 15
  };
  const age = answers['age_stage'];
  if (age === '18-22') {
    grid = { emergency: 10, daily: 40, investment: 10, growth: 40 };
  } else if (age === '23-28') {
    grid = { emergency: 15, daily: 30, investment: 30, growth: 25 };
  }
  return grid;
};

export const useStore = create<AppState>((set, get) => ({
  user: null,
  ledger: [],
  loading: false,

  fetchProfile: async () => {
    // Prevent setting loading=true if we are just refreshing data and user is already there
    // But here we need to ensure UI knows we are fetching
    // set({ loading: true }); // <--- Removed this to prevent App.tsx from showing full screen loader
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ user: null, loading: false });
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profile) {
      set({
        user: {
          name: profile.name || user.email?.split('@')[0] || 'User',
          financialScore: profile.financial_score,
          riskTolerance: profile.risk_tolerance,
          wealthGrid: profile.wealth_grid,
          answers: profile.answers,
          isOnboarded: profile.is_onboarded,
        }
      });
    } else {
      // User exists in Auth but not in Profiles (e.g. just registered)
      set({
        user: {
          name: user.email?.split('@')[0] || 'User',
          financialScore: 0,
          riskTolerance: 'balanced',
          wealthGrid: { emergency: 20, daily: 15, investment: 50, growth: 15 }, // Default
          answers: {},
          isOnboarded: false,
        }
      });
    }
    set({ loading: false });
  },

  fetchLedger: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('ledger_entries')
      .select('*')
      .order('date', { ascending: false });

    if (data) {
      set({ ledger: data as LedgerEntry[] });
    }
  },

  completeOnboarding: async (answers) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const grid = calculateWealthGrid(answers);
    const profileData = {
      id: user.id,
      name: user.email?.split('@')[0],
      financial_score: 60,
      risk_tolerance: 'balanced', // Mock logic
      wealth_grid: grid,
      answers,
      is_onboarded: true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(profileData);

    if (error) {
      console.error('Error saving profile:', error);
      throw error;
    }

    // Update local state
    set({
      user: {
        name: profileData.name!,
        financialScore: profileData.financial_score,
        riskTolerance: 'balanced',
        wealthGrid: grid,
        answers,
        isOnboarded: true,
      }
    });
  },

  addLedgerEntry: async (entry) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('ledger_entries')
      .insert({
        user_id: user.id,
        ...entry
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding entry:', error);
      throw error;
    }

    if (data) {
      set((state) => ({
        ledger: [data as LedgerEntry, ...state.ledger]
      }));
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, ledger: [] });
  }
}));
