import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Key is missing! Check your .env file.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true, // Try to persist session
    autoRefreshToken: false, // Disable auto refresh to reduce complexity
    detectSessionInUrl: false,
  },
  // Remove global fetch override as it might be interfering with internal Supabase logic
});
