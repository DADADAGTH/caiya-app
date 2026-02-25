import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const navigate = useNavigate();
  const { fetchProfile } = useStore();

  // Check connection on mount
  React.useEffect(() => {
    // Only check if we suspect issues
    if (networkStatus !== 'checking') return;

    // Use a flag to avoid setting state if component unmounts
    let mounted = true;

    const checkConnection = async () => {
      try {
        console.log('[Auth] Checking Supabase connection...');
        const healthUrl = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`;
        
        // Increase timeout to 10s for slow connections
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 10000);

        const res = await fetch(healthUrl, { 
          method: 'GET', 
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          signal: controller.signal
        }).catch((err) => {
             if (mounted) console.warn('[Auth] Health check fetch error:', err);
             return null;
        });
        
        clearTimeout(id);
        if (!mounted) return;

        if (res && (res.ok || res.status === 401)) {
            console.log('[Auth] Connection OK');
            setNetworkStatus('online');
        } else {
            console.warn('[Auth] Initial connection check failed');
            setNetworkStatus('offline');
        }
      } catch (err) {
        if (mounted) {
            console.warn('[Auth] Connection check error:', err);
            setNetworkStatus('offline');
        }
      }
    };
    checkConnection();

    return () => {
        mounted = false;
    };
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Skip network check if user insists
    console.log('[Auth] Starting login process for:', email);

    // Use a flag to track if we should still update state
    let isActive = true;

    // 20s timeout protection (increased for slow networks)
    const timeoutId = setTimeout(() => {
        if (isActive) {
            console.warn('[Auth] Request timed out after 20s');
            setLoading(false);
            setError('连接超时。请尝试切换网络环境（如使用手机热点）。');
            isActive = false; 
        }
    }, 20000);

    try {
      if (isLogin) {
        console.log('[Auth] Attempting signInWithPassword via REST...');
        
        // Use direct REST call to bypass Supabase client logic if it hangs
        const { data, error } = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: {
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then(async res => {
            const json = await res.json();
            if (!res.ok) throw new Error(json.msg || json.error_description || 'Login failed');
            return { data: { session: json, user: json.user }, error: null };
        }).catch(err => ({ data: null, error: err }));

        if (!isActive) return; // Timed out already

        if (error) {
            console.error('[Auth] REST login error:', error);
            throw error;
        }

        // Manually set session if successful
        if (data?.session) {
             console.log('[Auth] REST login successful, setting session...');
             // Use a timeout for setSession as well, as it might try to persist to storage and hang
             const setSessionPromise = supabase.auth.setSession(data.session);
             const sessionTimeout = new Promise((resolve) => setTimeout(() => resolve({ error: 'Session persist timeout' }), 2000));
             
             await Promise.race([setSessionPromise, sessionTimeout]);
             
             // Even if setSession hangs or fails, we have the token, so we can force navigate
             // The App.tsx auth listener might pick it up later or we just use local state
             useStore.setState({ 
                 user: { 
                     id: data.user?.id || 'temp',
                     name: data.user?.email?.split('@')[0] || 'User',
                     financialScore: 0,
                     riskTolerance: 'balanced',
                     wealthGrid: { emergency: 20, daily: 15, investment: 50, growth: 15 },
                     answers: {},
                     isOnboarded: false
                 } 
             });
        }
        
        console.log('[Auth] Login successful, clearing timeout');
        clearTimeout(timeoutId);
        isActive = false; 
        
        // Wait for profile but catch error so we don't block
        console.log('[Auth] Starting background profile fetch');
        
        try {
            await fetchProfile();
            console.log('[Auth] Profile fetched successfully');
        } catch (err) {
            console.warn('[Auth] Background fetch failed:', err);
        }
        
        // NO NAVIGATE HERE - Let App.tsx handle it via auth state change
        console.log('[Auth] Handing over to App router...');

      } else {
        console.log('[Auth] Attempting signUp...');
        
        // Get current URL but ensure it's not the auth page itself if possible, or just root
        const redirectTo = window.location.origin;

        // Try standard signUp first
        let signUpData: any = null;
        let signUpError: any = null;

        try {
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                  emailRedirectTo: redirectTo
              }
            });
            signUpData = data;
            signUpError = error;
        } catch (err: any) {
            console.warn('[Auth] Standard signUp failed:', err);
            // Check if it is a fetch error
            if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
                 console.log('[Auth] Trying REST fallback...');
                 try {
                     const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/signup`, {
                        method: 'POST',
                        headers: {
                            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email,
                            password,
                            data: {},
                            gotrue_meta_security: {}
                        })
                    });
                    
                    const json = await res.json();
                    if (!res.ok) {
                        signUpError = new Error(json.msg || json.error_description || 'Signup failed');
                    } else {
                        signUpData = json;
                        signUpError = null;
                    }
                } catch (restErr) {
                    console.error('[Auth] REST fallback also failed:', restErr);
                    signUpError = restErr;
                }
            } else {
                // For other errors, we still treat them as errors
                signUpError = err;
            }
        }

        if (!isActive) return;

        if (signUpError) {
            console.error('[Auth] Supabase signUp error:', signUpError);
            throw signUpError;
        }
        
        console.log('[Auth] SignUp successful', signUpData);
        clearTimeout(timeoutId);
        isActive = false;
        
        setLoading(false); // Reset loading for registration success
        alert('注册成功！请登录。');
        setIsLogin(true);
      }
    } catch (err: any) {
      if (!isActive) return;
      console.error('[Auth] Global Error Handler:', err);
      clearTimeout(timeoutId);
      setLoading(false);
      
      let msg = err.message || '操作失败，请重试';
      if (msg.toLowerCase().includes('rate limit')) {
          msg = '发送邮件过于频繁，请等待约 1 分钟后再试。';
      } else if (msg.toLowerCase().includes('already registered')) {
          msg = '该邮箱已被注册，请直接登录。';
      } else if (msg.toLowerCase().includes('invalid login credentials')) {
          msg = '邮箱或密码错误，请检查。';
      }
      
      setError(msg);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-yellow-100 to-amber-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -ml-20 -mb-20"></div>

      <div className="w-full max-w-sm bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl relative z-10 border border-white/50">
        <h2 className="text-2xl font-black text-black mb-6 text-center tracking-tight">
          {isLogin ? '欢迎回来' : '创建账号'}
        </h2>

        {networkStatus === 'offline' && (
          <div className="mb-4 p-3 bg-amber-50 text-amber-800 text-xs rounded-lg border border-amber-200">
            ⚠️ 检测到网络连接不稳定，可能无法连接到服务器。请检查 VPN 或代理设置。
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 p-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary py-3 flex items-center justify-center gap-2 font-bold text-lg shadow-lg shadow-yellow-200/50 transform active:scale-95 transition-transform"
          >
            {loading ? <Loader2 className="animate-spin text-black" size={24} /> : (
              <>
                {isLogin ? '登录' : '注册'} <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-500 hover:text-black font-medium transition-colors"
          >
            {isLogin ? '还没有账号？去注册' : '已有账号？去登录'}
          </button>
        </div>
      </div>
    </div>
  );
};
