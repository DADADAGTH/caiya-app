import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { User, LogOut, RefreshCcw, Trash2, Shield, Settings, ChevronRight, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user, fetchProfile } = useStore();
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    useStore.setState({ user: null, ledger: [] });
    navigate('/auth');
  };

  const handleResetOnboarding = async () => {
    if (confirm('确定要重新进行财商测试吗？这将覆盖目前的四宫格配置。')) {
      // Optimistic update
      useStore.setState(state => ({
        user: state.user ? { ...state.user, isOnboarded: false } : null
      }));
      
      // Sync to backend
      if (user?.id) {
          await supabase.from('profiles').update({ is_onboarded: false }).eq('id', user.id);
      }
      
      navigate('/questionnaire');
    }
  };

  const handleClearData = async () => {
    if (confirm('⚠️ 警告：这将清空所有记账数据！确定继续吗？')) {
        // Optimistic
        useStore.setState({ ledger: [] });
        
        if (user?.id) {
            await supabase.from('ledger_entries').delete().eq('user_id', user.id);
        }
        alert('数据已清空');
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-bold mb-6">个人中心</h1>

      {/* User Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
          {user.name?.[0]?.toUpperCase() || <User />}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{user.name || 'User'}</h2>
          <p className="text-gray-500 text-sm">{user.riskTolerance === 'aggressive' ? '进取型' : user.riskTolerance === 'conservative' ? '保守型' : '平衡型'}投资者</p>
        </div>
      </div>

      {/* Financial Score */}
      <div className="bg-gradient-to-r from-primary to-blue-600 p-6 rounded-2xl shadow-lg text-white mb-8 relative overflow-hidden">
        <div className="relative z-10">
            <p className="text-blue-100 text-sm mb-1">当前财商分</p>
            <h3 className="text-4xl font-bold">{user.financialScore || 60}</h3>
            <div className="mt-4 bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full" style={{ width: `${user.financialScore || 60}%` }} />
            </div>
            <p className="text-xs text-blue-100 mt-2">击败了 45% 的用户，继续加油！</p>
        </div>
        <Shield className="absolute right-4 bottom-4 text-white/10" size={120} />
      </div>

      {/* Settings List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Install Button or Help */}
        {deferredPrompt ? (
            <button 
                onClick={handleInstallClick}
                className="w-full p-4 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 transition-colors bg-yellow-50/50"
            >
                <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 bg-primary text-black rounded-lg shadow-sm">
                        <Download size={20} />
                    </div>
                    <span className="font-bold text-black">安装到桌面</span>
                </div>
                <ChevronRight size={20} className="text-gray-300" />
            </button>
        ) : (
            <button 
                onClick={() => setShowInstallHelp(true)}
                className="w-full p-4 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                        <Download size={20} />
                    </div>
                    <span>如何安装 App？</span>
                </div>
                <ChevronRight size={20} className="text-gray-300" />
            </button>
        )}

        <button 
            onClick={handleResetOnboarding}
            className="w-full p-4 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
            <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <RefreshCcw size={20} />
                </div>
                <span>重测财商问卷</span>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
        </button>

        <button 
            onClick={handleClearData}
            className="w-full p-4 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
            <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                    <Trash2 size={20} />
                </div>
                <span>清空记账数据</span>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
        </button>
        
        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                    <Settings size={20} />
                </div>
                <span>通用设置</span>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
        </button>
      </div>

      <button 
        onClick={handleSignOut}
        className="mt-8 w-full btn btn-outline border-red-200 text-red-500 hover:bg-red-50 py-3 flex items-center justify-center gap-2"
      >
        <LogOut size={20} /> 退出登录
      </button>

      <p className="text-center text-xs text-gray-400 mt-8">Version 1.0.0 (Beta)</p>

      {/* Install Help Modal */}
      {showInstallHelp && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setShowInstallHelp(false)}>
              <div className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-6 relative animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
                  <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden" />
                  
                  <h3 className="text-xl font-bold mb-4">📲 如何安装到手机？</h3>
                  
                  <div className="space-y-6">
                      <div>
                          <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                              <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">1</span>
                              iPhone (Safari)
                          </h4>
                          <div className="text-sm text-gray-600 pl-8 space-y-1">
                              <p>1. 点击底部中间的 <span className="font-bold">分享按钮</span> <span className="inline-block border border-gray-300 rounded px-1">⎋</span></p>
                              <p>2. 向下滑动找到 <span className="font-bold">“添加到主屏幕”</span></p>
                              <p>3. 点击右上角的 <span className="font-bold">“添加”</span></p>
                          </div>
                      </div>

                      <div>
                          <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                              <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">2</span>
                              Android (Chrome)
                          </h4>
                          <div className="text-sm text-gray-600 pl-8 space-y-1">
                              <p>1. 点击右上角的 <span className="font-bold">菜单按钮</span> <span className="inline-block border border-gray-300 rounded px-1">⋮</span></p>
                              <p>2. 选择 <span className="font-bold">“安装应用”</span> 或 <span className="font-bold">“添加到主屏幕”</span></p>
                          </div>
                      </div>
                  </div>

                  <button 
                    onClick={() => setShowInstallHelp(false)}
                    className="mt-8 w-full btn btn-primary py-3"
                  >
                    知道了
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};
