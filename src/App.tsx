import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Onboarding } from './pages/Onboarding';
import { Auth } from './pages/Auth';
import { Questionnaire } from './pages/Questionnaire';
import { Dashboard } from './pages/Dashboard';
import { DailyLedger } from './pages/DailyLedger';
import { Knowledge } from './pages/Knowledge';
import { useStore } from './store/useStore';
import { supabase } from './lib/supabase';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, fetchProfile, fetchLedger, loading } = useStore();
  const [init, setInit] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    // Only use the auth state listener to handle initialization and updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      if (!mounted) return;
      
      if (session) {
        // Only fetch if we don't have user data yet or if session changed
        const currentUser = useStore.getState().user;
        if (!currentUser) {
           console.log('Fetching user profile...');
           try {
             await fetchProfile();
             await fetchLedger();
           } catch (err) {
             console.error('Failed to fetch user data:', err);
             // Consider clearing session if data fetch fails repeatedly
           }
        }
      } else {
        console.log('No session, clearing user state');
        useStore.setState({ user: null, ledger: [] });
      }
      if (mounted) setInit(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Remove dependencies to run only once

  if (init) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      );
    }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Onboarding />} />
          <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
          
          <Route path="/questionnaire" element={
            !user ? <Navigate to="/auth" /> : 
            user.isOnboarded ? <Navigate to="/dashboard" /> : 
            <Questionnaire />
          } />
          
          <Route path="/dashboard" element={
            !user ? <Navigate to="/auth" /> : 
            !user.isOnboarded ? <Navigate to="/questionnaire" /> :
            <Dashboard />
          } />
          
          <Route path="/ledger" element={user ? <DailyLedger /> : <Navigate to="/auth" />} />
          <Route path="/knowledge" element={user ? <Knowledge /> : <Navigate to="/auth" />} />
          <Route path="/profile" element={
            user ? (
              <div className="p-6 text-center">
                <h2 className="text-xl font-bold mb-4">个人中心</h2>
                <p className="mb-6 text-gray-500">当前账号: {user.name}</p>
                <button 
                  onClick={() => supabase.auth.signOut()}
                  className="btn btn-outline w-full text-red-500 border-red-200 hover:bg-red-50"
                >
                  退出登录
                </button>
              </div>
            ) : <Navigate to="/auth" />
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
