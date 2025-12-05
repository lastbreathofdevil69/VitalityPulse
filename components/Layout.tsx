import React, { useEffect } from 'react';
import { LayoutDashboard, Activity, BrainCircuit, UserCircle, Menu, X, LogOut, Sparkles, Moon, Sun, Zap } from 'lucide-react';
import { AppView, UserProfile } from '../types';
import { supabase } from '../services/supabase';

interface LayoutProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  children: React.ReactNode;
  userProfile?: UserProfile;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const NavItem = ({ 
  view, 
  current, 
  icon: Icon, 
  label, 
  onClick 
}: { 
  view: AppView; 
  current: AppView; 
  icon: any; 
  label: string; 
  onClick: (v: AppView) => void; 
}) => {
  const isActive = view === current;
  return (
    <button
      onClick={() => onClick(view)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full md:w-auto text-left group
        ${isActive 
          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
    >
      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
      <span className="font-medium">{label}</span>
    </button>
  );
};

export const Layout: React.FC<LayoutProps> = ({ currentView, onChangeView, children, userProfile, isDarkMode, toggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // XP Progress calculation
  const getLevelProgress = () => {
    if (!userProfile) return 0;
    const xpForNextLevel = 500; // Fixed 500 XP per level for simplicity
    const currentLevelXP = userProfile.xp % xpForNextLevel;
    return (currentLevelXP / xpForNextLevel) * 100;
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 p-6 z-30 shadow-sm transition-colors duration-300">
        <div className="flex items-center justify-between mb-10 px-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
                    <Activity size={28} strokeWidth={2.5} />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Vitality<span className="text-emerald-500">Pulse</span></h1>
            </div>
        </div>

        {/* User Mini Profile & Level */}
        {userProfile && (
            <div className="mb-8 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg shadow-inner">
                        {userProfile.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="font-bold text-slate-900 dark:text-white text-sm truncate">{userProfile.name}</div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <Zap size={10} fill="currentColor" /> Level {userProfile.level}
                        </div>
                    </div>
                </div>
                {/* XP Bar */}
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-1000" 
                        style={{ width: `${getLevelProgress()}%` }}
                    />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                    <span>{userProfile.xp % 500} XP</span>
                    <span>500 XP</span>
                </div>
            </div>
        )}

        <nav className="flex flex-col gap-2 flex-1">
          <NavItem view={AppView.DASHBOARD} current={currentView} icon={LayoutDashboard} label="Dashboard" onClick={onChangeView} />
          <NavItem view={AppView.TRACKER} current={currentView} icon={Activity} label="Tracker & Tools" onClick={onChangeView} />
          <NavItem view={AppView.ADVISOR} current={currentView} icon={BrainCircuit} label="AI Coach" onClick={onChangeView} />
          <NavItem view={AppView.PROFILE} current={currentView} icon={UserCircle} label="Profile" onClick={onChangeView} />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-2xl border border-emerald-100/50 dark:border-emerald-500/10 shadow-sm">
            <h4 className="font-semibold text-emerald-900 dark:text-emerald-300 text-sm mb-2 flex items-center gap-2">
                <Sparkles size={14} className="text-emerald-500" /> Daily Tip
            </h4>
            <p className="text-xs text-emerald-800 dark:text-emerald-400 leading-relaxed opacity-90">Consistency beats intensity. Small steps every day lead to big results.</p>
          </div>
          
          <div className="flex gap-2">
            <button 
                onClick={toggleTheme}
                className="flex items-center justify-center p-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex-1"
                aria-label="Toggle Dark Mode"
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
                onClick={handleSignOut}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all group flex-[2]"
            >
                <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center sticky top-0 z-40 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1.5 rounded-lg text-emerald-600 dark:text-emerald-500">
             <Activity size={20} />
          </div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">VitalityPulse</h1>
        </div>
        <div className="flex items-center gap-2">
             <button 
                onClick={toggleTheme}
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col bg-white dark:bg-slate-900 animate-in slide-in-from-right-10 duration-200">
           <div className="p-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1.5 rounded-lg text-emerald-600 dark:text-emerald-500">
                  <Activity size={20} />
                </div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Menu</h1>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300">
                <X size={20} />
              </button>
           </div>
           
           <div className="p-4 flex-1 overflow-y-auto">
             {userProfile && (
                <div className="mb-6 flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
                        {userProfile.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-bold text-slate-900 dark:text-white">{userProfile.name}</div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Level {userProfile.level}</div>
                    </div>
                </div>
             )}

             <nav className="flex flex-col gap-2">
              <NavItem view={AppView.DASHBOARD} current={currentView} icon={LayoutDashboard} label="Dashboard" onClick={(v) => { onChangeView(v); setIsMobileMenuOpen(false); }} />
              <NavItem view={AppView.TRACKER} current={currentView} icon={Activity} label="Tracker & Tools" onClick={(v) => { onChangeView(v); setIsMobileMenuOpen(false); }} />
              <NavItem view={AppView.ADVISOR} current={currentView} icon={BrainCircuit} label="AI Coach" onClick={(v) => { onChangeView(v); setIsMobileMenuOpen(false); }} />
              <NavItem view={AppView.PROFILE} current={currentView} icon={UserCircle} label="Profile" onClick={(v) => { onChangeView(v); setIsMobileMenuOpen(false); }} />
             </nav>
           </div>

           <div className="p-4 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-3 px-4 py-4 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 w-full transition-all bg-slate-50 dark:bg-slate-800"
              >
                <LogOut size={20} />
                <span className="font-medium">Sign Out</span>
              </button>
           </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto w-full max-w-[1600px] mx-auto transition-colors duration-300">
        {children}
      </main>
    </div>
  );
};