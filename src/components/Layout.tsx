import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, PenTool, BookOpen, User, Sprout } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useStore();
  const location = useLocation();
  
  // Hide nav on onboarding and questionnaire
  const hideNav = !user || location.pathname === '/' || location.pathname === '/questionnaire' || location.pathname === '/auth';

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto scrollbar-hide">
            <div className={`${!hideNav ? 'pb-24' : ''}`}>
                {children}
            </div>
        </main>

        {!hideNav && (
          <nav className="fixed bottom-0 w-full max-w-md bg-white/90 backdrop-blur-md border-t border-gray-100 py-3 px-6 flex justify-between items-center z-50 shadow-lg-up">
            <div className="flex items-center gap-8">
                <NavItem to="/dashboard" icon={<LayoutDashboard size={24} />} label="概览" />
                <NavItem to="/ledger" icon={<PenTool size={24} />} label="记账" />
            </div>
            
            <div className="absolute left-1/2 -top-6 -translate-x-1/2">
                <NavLink to="/chat" className={({ isActive }) => 
                    `flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-all border-4 border-white ${
                        isActive ? 'bg-primary text-black scale-110' : 'bg-black text-primary hover:scale-105'
                    }`
                }>
                    <Sprout size={28} />
                </NavLink>
            </div>

            <div className="flex items-center gap-8">
                <NavItem to="/knowledge" icon={<BookOpen size={24} />} label="知识" />
                <NavItem to="/profile" icon={<User size={24} />} label="我的" />
            </div>
          </nav>
        )}
      </div>
    </div>
  );
};

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center gap-1 transition-colors ${
        isActive ? 'text-black font-bold' : 'text-gray-400 hover:text-gray-600'
      }`
    }
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </NavLink>
);
