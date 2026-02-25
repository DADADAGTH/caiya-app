import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { LedgerEntry, UserProfile, WealthGrid, KnowledgeCard } from '../types';

interface AppState {
  user: UserProfile | null;
  ledger: LedgerEntry[];
  aiKnowledgeCards: KnowledgeCard[]; // Store AI generated cards
  readCardIds: string[]; // Store IDs of read cards
  loading: boolean;
  isFetching: boolean; 
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  fetchProfile: () => Promise<void>;
  fetchLedger: () => Promise<void>;
  fetchKnowledge: () => Promise<void>; // New: Fetch AI cards and read history
  completeOnboarding: (answers: Record<string, any>) => Promise<void>;
  addLedgerEntry: (entry: Omit<LedgerEntry, 'id'>) => Promise<void>;
  deleteLedgerEntry: (id: string) => Promise<void>;
  addAiKnowledgeCard: (card: KnowledgeCard) => Promise<void>; // Async now
  markCardAsRead: (id: string) => Promise<void>; // New
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

export const useStore = create<Store>((set, get) => ({
  user: null,
  ledger: [],
  loading: true, 
  isFetching: false,
  aiKnowledgeCards: [],
  readCardIds: [],
  
  setUser: (user) => set({ user }),
  updateUser: (updates) => set((state) => ({ user: state.user ? { ...state.user, ...updates } : null })),

  addAiKnowledgeCard: async (card) => {
      // Optimistic update
      set(state => {
          if (state.aiKnowledgeCards.some(c => c.id === card.id)) return state;
          return { aiKnowledgeCards: [card, ...state.aiKnowledgeCards] };
      });

      // Persist to Supabase
      const { user } = get();
      if (!user) return;

      const { error } = await supabase
          .from('ai_cards')
          .insert({
              id: card.id, // Use the same UUID
              user_id: user.id,
              title: card.title,
              concept: card.concept,
              content: card.content,
              action: card.action,
              tags: card.tags,
              is_ai_generated: true
          });
          
      if (error) console.error('Failed to save AI card:', error);
  },

  markCardAsRead: async (id) => {
      // Optimistic update
      set(state => {
          if (state.readCardIds.includes(id)) return state;
          return { readCardIds: [...state.readCardIds, id] };
      });

      const { user } = get();
      if (!user) return;

      // Persist to Supabase
      const { error } = await supabase
          .from('read_history')
          .insert({
              user_id: user.id,
              card_id: id
          });
          
      if (error && error.code !== '23505') { // Ignore unique violation
          console.error('Failed to mark card as read:', error);
      }
  },

  fetchKnowledge: async () => {
      const { user } = get();
      if (!user) return;

      try {
          // Fetch AI cards
          const { data: aiCards, error: aiError } = await supabase
              .from('ai_cards')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false });
              
          if (aiError) throw aiError;

          // Fetch Read History
          const { data: history, error: historyError } = await supabase
              .from('read_history')
              .select('card_id')
              .eq('user_id', user.id);
              
          if (historyError) throw historyError;

          set({
              aiKnowledgeCards: (aiCards || []).map(c => ({
                  id: c.id,
                  title: c.title,
                  concept: c.concept || '专属建议',
                  content: c.content,
                  action: c.action,
                  tags: c.tags || [],
                  isAiGenerated: true,
                  date: c.created_at
              })),
              readCardIds: (history || []).map(h => h.card_id)
          });
      } catch (err) {
          console.error('Error fetching knowledge:', err);
      }
  },

  fetchProfile: async () => {
    // Lock to prevent concurrent fetching
    if (get().isFetching) return;
    set({ isFetching: true });

    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
            console.log('No session found in fetchProfile');
            set({ user: null, loading: false, isFetching: false }); // Done loading
            return;
        }

        // Try to fetch existing profile with retry logic
         let profile = null;
         let fetchError = null;
         
         // Retry up to 3 times (0ms, 500ms, 1000ms)
         for (let i = 0; i < 3; i++) {
             if (i > 0) {
                 await new Promise(r => setTimeout(r, 500));
             }
             
             const { data, error } = await supabase
               .from('profiles')
               .select('*')
               .eq('id', session.user.id)
               .single();
               
             if (data) {
                 profile = data;
                 fetchError = null;
                 break; // Found it!
             } else {
                 fetchError = error;
                 // If error is not "Not Found", stop retrying immediately (e.g. permission error)
                 if (error && error.code !== 'PGRST116') {
                     break;
                 }
                 // If "Not Found", continue to next retry
             }
         }
 
         if (fetchError && fetchError.code !== 'PGRST116') { 
           console.error('Error fetching profile:', fetchError);
           set({ loading: false, isFetching: false }); // Done loading even on error
           return;
         }

        if (profile) {
            // Profile exists, load it
            set({
                user: {
                    id: profile.id,
                    name: profile.name,
                    financialScore: profile.financial_score,
                    riskTolerance: profile.risk_tolerance,
                    wealthGrid: profile.wealth_grid,
                    answers: profile.answers,
                    isOnboarded: profile.is_onboarded,
                },
                loading: false,
                isFetching: false
            });
            
            // Also fetch ledger and knowledge
            get().fetchLedger();
            get().fetchKnowledge();
        } else {
            // New user, create empty profile
            console.log('No profile found, initializing new user state');
            set({
                user: {
                    id: session.user.id,
                    name: session.user.email?.split('@')[0] || 'User',
                    financialScore: 0,
                    riskTolerance: 'balanced',
                    wealthGrid: { emergency: 20, daily: 15, investment: 50, growth: 15 },
                    answers: {},
                    isOnboarded: false,
                },
                loading: false,
                isFetching: false
            });
        }
    } catch (err) {
        console.error('Fetch profile error:', err);
        set({ loading: false, isFetching: false });
    }
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
    try {
        set({ loading: true }); // Show loading during AI analysis

        // 1. Calculate Wealth Grid using AI
        let grid = { emergency: 20, daily: 15, investment: 50, growth: 15 };
        let aiAnalysis = '';
        
        try {
            const apiKey = localStorage.getItem('openai_key') || 'sk-e9b3e3516466412daf53ec50c362eaba';
            const res = await fetch('https://api.deepseek.com/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        { 
                            role: 'system', 
                            content: `你是一位专业的私人财富规划师。请根据用户的42道问卷答案，基于“标准普尔家庭资产象限图”理论，并结合用户的生命周期、风险偏好、消费心理进行个性化调整。
                            
                            请输出JSON格式：
                            {
                                "grid": { "emergency": number, "daily": number, "investment": number, "growth": number },
                                "analysis": "一段300字左右的深度分析，解释为什么这样配置，并指出用户的潜在风险（如拿铁因子、跟风投资等）和优势。"
                            }
                            注意：grid的四个数值相加必须等于100。emergency=备用金(要花的钱/保命的钱), daily=日常开销(要花的钱), investment=增值金(生钱的钱), growth=成长金(保本升值/自我投资)。` 
                        },
                        { 
                            role: 'user', 
                            content: `用户的问卷答案如下：${JSON.stringify(answers)}` 
                        }
                    ],
                    response_format: { type: 'json_object' }
                })
            });

            const data = await res.json();
            if (data.choices && data.choices[0].message.content) {
                const result = JSON.parse(data.choices[0].message.content);
                grid = result.grid;
                aiAnalysis = result.analysis;
                
                // Store AI analysis as a knowledge card
                get().addAiKnowledgeCard({
                    id: 'ai_onboarding_report',
                    title: '您的专属财富体检报告',
                    concept: '深度分析',
                    content: result.analysis,
                    tags: ['AI定制', '资产配置'],
                    isAiGenerated: true,
                    date: new Date().toISOString()
                });
            }
        } catch (err) {
            console.error('AI Analysis failed, falling back to default:', err);
            // Fallback grid calculation (simplified logic based on age/risk if AI fails)
            // For now, just keep the default or maybe adjust slightly based on age
        }
        
        // Optimistic update: Update local state IMMEDIATELY so UI can proceed
        // We use the existing user data if available, or just set isOnboarded
        const currentUser = get().user;

        // 1. Generate initial ledger entries based on liquid assets
        // Handle exact number if provided, or parse from option range if possible (MVP: use mock map or 0)
        // Since we changed Q8 to options, we need a map or parse logic. 
        // For this demo, let's assume if it's a string like '10000', it parses. If it's a range code, we map it.
        const liquidMap: Record<string, number> = {
            '0': 0, '10000': 20000, '30000': 45000, '60000': 90000, '100000': 200000
        };
        const rawLiquid = answers['liquid_assets'];
         const liquidAssets = typeof rawLiquid === 'number' ? rawLiquid : (liquidMap[rawLiquid as string] || Number(rawLiquid) || 0);
         
         // Check if user already has initial assets to avoid duplication
         const hasInitialAssets = get().ledger.some(l => l.category === '初始资产');
         let initialLedger: LedgerEntry[] = [];
         
         if (liquidAssets > 0 && !hasInitialAssets) {
             // Distribute assets into buckets based on grid percentage
             const buckets: {id: WealthBucket, percent: number}[] = [
                 { id: 'emergency', percent: grid.emergency },
                { id: 'daily', percent: grid.daily },
                { id: 'investment', percent: grid.investment },
                { id: 'growth', percent: grid.growth },
            ];

            initialLedger = buckets.map(b => ({
                id: crypto.randomUUID(),
                user_id: currentUser?.id || 'temp', 
                type: 'income',
                amount: Number(((liquidAssets * b.percent) / 100).toFixed(2)),
                bucket: b.id,
                category: '初始资产',
                note: `初始资产分配 (${b.percent}%)`,
                date: new Date().toISOString(),
            })).filter(entry => entry.amount > 0);
        }
        
        set((state) => ({
          user: {
            ...(currentUser || {
                id: 'temp', // Should be overwritten by real user
                name: 'User',
                financialScore: 60,
                riskTolerance: 'balanced',
                answers: {},
            }),
            wealthGrid: grid,
            answers,
            isOnboarded: true,
          },
          // Append initial assets to ledger
          ledger: [...initialLedger, ...state.ledger],
          loading: false // Stop loading
        }));

        // Now do the async work
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return; // Should not happen if we are logged in

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

        // Try to update Supabase in background
        // Use a timeout so we don't hang if this function is awaited
        const upsertPromise = supabase
          .from('profiles')
          .upsert(profileData);
          
        // Insert initial ledger entries if any
        if (initialLedger.length > 0) {
            console.log('Inserting initial ledger entries:', initialLedger.length);
            const { error: ledgerError } = await supabase
                .from('ledger_entries')
                .insert(initialLedger.map(l => ({ ...l, user_id: user.id })));
            
            if (ledgerError) {
                console.error('Failed to insert initial ledger:', ledgerError);
            } else {
                console.log('Initial ledger inserted successfully');
                // Force fetch ledger again to sync state with DB IDs
                get().fetchLedger();
            }
        }

        const timeoutPromise = new Promise((resolve) => 
            setTimeout(() => resolve({ error: { message: 'Upsert timeout' } }), 10000) // Increased timeout for AI
        );

        const result: any = await Promise.race([upsertPromise, timeoutPromise]);
        
        if (result.error) {
          console.warn('Supabase upsert warning:', result.error);
        }
    } catch (err) {
        console.error('Complete onboarding error:', err);
        set({ loading: false });
    }
  },

  addLedgerEntry: async (entry) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Optimistic update
        const tempId = crypto.randomUUID();
        const newEntry = {
            id: tempId,
            user_id: user.id,
            ...entry
        };

        set((state) => ({
            ledger: [newEntry as LedgerEntry, ...state.ledger]
        }));

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
          // Rollback
          set((state) => ({
              ledger: state.ledger.filter(l => l.id !== tempId)
          }));
          return;
        }

        if (data) {
          // Replace temp entry with real one
          set((state) => ({
            ledger: state.ledger.map(l => l.id === tempId ? (data as LedgerEntry) : l)
          }));
        }
    } catch (err) {
        console.error('Add entry error:', err);
    }
  },

  deleteLedgerEntry: async (id: string) => {
      // Optimistic delete
      const previousLedger = get().ledger;
      set((state) => ({
          ledger: state.ledger.filter(l => l.id !== id)
      }));

      try {
          const { error } = await supabase
              .from('ledger_entries')
              .delete()
              .eq('id', id);

          if (error) {
              console.error('Error deleting entry:', error);
              // Rollback
              set({ ledger: previousLedger });
          }
      } catch (err) {
          console.error('Delete entry error:', err);
          set({ ledger: previousLedger });
      }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, ledger: [] });
  }
}));
