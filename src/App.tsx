import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Onboarding } from './pages/Onboarding';
import { Auth } from './pages/Auth';
import { Questionnaire } from './pages/Questionnaire';
import { Dashboard } from './pages/Dashboard';
import { DailyLedger } from './pages/DailyLedger';
import { Knowledge } from './pages/Knowledge';
import { AIChat } from './pages/AIChat';
import { supabase } from './lib/supabase';
import { useStore } from './store/useStore';
import { Profile } from './pages/Profile';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, fetchProfile, loading } = useStore();
  
  useEffect(() => {
    // Initial fetch
    fetchProfile();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Force loading state when signing in
        if (event === 'SIGNED_IN') {
             useStore.setState({ loading: true });
        }
        fetchProfile();
      } else if (event === 'SIGNED_OUT') {
        useStore.setState({ user: null, ledger: [] });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="flex flex-col items-center gap-4 text-black">
                  <Loader2 size={48} className="animate-spin text-primary" />
                  <p className="font-bold">加载中...</p>
              </div>
          </div>
      );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Onboarding />} />
          <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
          <Route path="/questionnaire" element={
            user?.isOnboarded ? <Navigate to="/dashboard" /> : (user ? <Questionnaire /> : <Navigate to="/auth" />)
          } />
          
          <Route path="/dashboard" element={user ? (user.isOnboarded ? <Dashboard /> : <Navigate to="/questionnaire" />) : <Navigate to="/auth" />} />
          <Route path="/ledger" element={user ? <DailyLedger /> : <Navigate to="/auth" />} />
          <Route path="/chat" element={user ? <AIChat /> : <Navigate to="/auth" />} />
          <Route path="/knowledge" element={user ? <Knowledge /> : <Navigate to="/auth" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
