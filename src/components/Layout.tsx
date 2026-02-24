import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, PenTool, BookOpen, User } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useStore();
  const location = useLocation();
  
  // Hide nav on onboarding and questionnaire
  const hideNav = !user || location.pathname === '/' || location.pathname === '/questionnaire';

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col">
        <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
          {children}
        </main>

        {!hideNav && (
          <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2 px-6 flex justify-between items-center z-10">
            <NavItem to="/dashboard" icon={<LayoutDashboard size={24} />} label="概览" />
            <NavItem to="/ledger" icon={<PenTool size={24} />} label="记账" />
            <NavItem to="/knowledge" icon={<BookOpen size={24} />} label="知识" />
            <NavItem to="/profile" icon={<User size={24} />} label="我的" />
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
        isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
      }`
    }
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </NavLink>
);
