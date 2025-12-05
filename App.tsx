
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { AppView, UserProfile, WorkoutLog } from './types';
import { WeightChart, ActivityChart } from './components/Charts';
import { BMICalculator, WaterTracker, WorkoutTracker } from './components/Tools';
import { AIAdvisor } from './components/Advisor';
import { Auth } from './components/Auth';
import { Onboarding } from './components/Onboarding';
import { supabase } from './services/supabase';
import { ArrowUpRight, ArrowDownRight, Flame, Footprints, Loader2, Target, TrendingDown, TrendingUp, Minus, ChevronRight, Edit3, Smile, Frown, Meh, Zap, Award } from 'lucide-react';
import { LottiePlayer, ANIMATIONS } from './components/Animations';

/* --- Mock Data --- */
const MOCK_WEIGHT_DATA = [
  { date: 'Mon', weight: 82 },
  { date: 'Tue', weight: 81.8 },
  { date: 'Wed', weight: 81.5 },
  { date: 'Thu', weight: 81.9 },
  { date: 'Fri', weight: 81.2 },
  { date: 'Sat', weight: 81.0 },
  { date: 'Sun', weight: 80.8 },
];

const MOCK_ACTIVITY_DATA = [
  { day: 'Mon', calories: 240 },
  { day: 'Tue', calories: 350 },
  { day: 'Wed', calories: 410 },
  { day: 'Thu', calories: 180 },
  { day: 'Fri', calories: 500 },
  { day: 'Sat', calories: 600 },
  { day: 'Sun', calories: 320 },
];

const MoodTracker = ({ onSelect, currentMood }: { onSelect: (m: any) => void, currentMood?: string }) => {
  const moods = [
    { id: 'great', icon: Smile, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { id: 'good', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { id: 'neutral', icon: Meh, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { id: 'tired', icon: Frown, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800' },
    { id: 'stressed', icon: ActivityChart, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' }, // Placeholder icon for stressed
  ];

  if (currentMood) {
    const m = moods.find(x => x.id === currentMood);
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
        <div>
          <h4 className="font-bold text-slate-800 dark:text-white mb-1">Today's Vibe</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">Thanks for checking in!</p>
        </div>
        <div className={`p-3 rounded-xl ${m?.bg} ${m?.color}`}>
          {m && <m.icon size={28} />}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
      <h4 className="font-bold text-slate-800 dark:text-white mb-4">How are you feeling today?</h4>
      <div className="flex justify-between gap-2">
        {moods.map((m) => (
          <button 
            key={m.id} 
            onClick={() => onSelect(m.id)}
            className={`p-3 rounded-xl transition-all hover:scale-110 active:scale-95 flex flex-col items-center gap-1 ${m.bg}`}
          >
            <m.icon size={24} className={m.color} />
          </button>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  // Auth State
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // App State
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [waterIntake, setWaterIntake] = useState(1250);
  const [greeting, setGreeting] = useState('');
  const [greetingAnim, setGreetingAnim] = useState(ANIMATIONS.SUN);
  const [todaysMood, setTodaysMood] = useState<string | null>(null);
  
  // Notification State
  const [notification, setNotification] = useState<{message: string, type: 'xp' | 'success'} | null>(null);

  // Dark Mode Init
  useEffect(() => {
    if (localStorage.theme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
      // Optional: Explicitly set it to light in localStorage if you want to persist the default immediately
      // localStorage.theme = 'light'; 
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  // Greeting Logic
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
      setGreetingAnim(ANIMATIONS.SUN);
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
      setGreetingAnim(ANIMATIONS.SUN);
    } else {
      setGreeting('Good Evening');
      setGreetingAnim(ANIMATIONS.MOON);
    }
  }, []);

  // Load Profile Helper
  const loadProfile = (userId: string, email?: string) => {
    const stored = localStorage.getItem(`vitality_profile_${userId}`);
    if (stored) {
      const p = JSON.parse(stored);
      // Ensure new fields exist for legacy data
      if (!p.xp) p.xp = 0;
      if (!p.level) p.level = 1;
      if (!p.badges) p.badges = [];
      setProfile(p);
    } else {
      setProfile(null);
    }
  };

  // Handle Auth Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadProfile(session.user.id, session.user.email);
      }
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        loadProfile(session.user.id, session.user.email);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    if (session?.user) {
      const p = { ...newProfile, xp: 100, level: 1, badges: ['Newcomer'] }; // Starting bonus
      localStorage.setItem(`vitality_profile_${session.user.id}`, JSON.stringify(p));
      setProfile(p);
    }
  };

  const persistProfile = (p: UserProfile) => {
    if (session?.user) {
      localStorage.setItem(`vitality_profile_${session.user.id}`, JSON.stringify(p));
      setProfile(p);
    }
  };

  /* --- Gamification Logic --- */
  const handleXPGain = (amount: number) => {
    if (!profile) return;
    
    setNotification({ message: `+${amount} XP`, type: 'xp' });
    setTimeout(() => setNotification(null), 2000);

    let newXP = profile.xp + amount;
    let newLevel = profile.level;
    const xpForNextLevel = 500; // Fixed threshold for now

    // Check level up
    if (Math.floor(newXP / xpForNextLevel) > Math.floor(profile.xp / xpForNextLevel)) {
       newLevel += 1;
       // Add level up badge logic later
       setTimeout(() => alert(`🎉 Level Up! You are now Level ${newLevel}!`), 500);
    }

    persistProfile({ ...profile, xp: newXP, level: newLevel });
  };
  
  // Calculated State
  const calculateBMI = (h: number, w: number): string => {
     const val = w / ((h/100) * (h/100));
     if (val < 18.5) return 'Underweight';
     if (val < 25) return 'Normal';
     if (val < 30) return 'Overweight';
     return 'Obese';
  };

  const handleUpdateProfile = (height: number, weight: number) => {
    if (!profile) return;
    persistProfile({ ...profile, height, weight });
    handleXPGain(20); // Bonus for tracking
  };

  const handleAddWater = (amount: number) => {
    setWaterIntake(prev => prev + amount);
  };

  const handleAddWorkout = (workout: Omit<WorkoutLog, 'id'>) => {
    const newWorkout = {
      ...workout,
      id: Math.random().toString(36).substr(2, 9)
    };
    setWorkouts(prev => [...prev, newWorkout]);
  };

  const handleMoodSelect = (mood: string) => {
    setTodaysMood(mood);
    handleXPGain(10); // Mood check-in bonus
  };

  // Dashboard Progress Logic
  const getProgressStats = () => {
    if (!profile) return null;
    
    const weightDiff = profile.weight - profile.startWeight; 
    const goalDiff = profile.targetWeight ? profile.weight - profile.targetWeight : 0;
    
    let progressPercent = 0;
    if (profile.goal === 'lose_weight' && profile.targetWeight < profile.startWeight) {
        const totalToLose = profile.startWeight - profile.targetWeight;
        const lostSoFar = profile.startWeight - profile.weight;
        progressPercent = Math.min(100, Math.max(0, (lostSoFar / totalToLose) * 100));
    } else if (profile.goal === 'gain_muscle' && profile.targetWeight > profile.startWeight) {
        const totalToGain = profile.targetWeight - profile.startWeight;
        const gainedSoFar = profile.weight - profile.startWeight;
        progressPercent = Math.min(100, Math.max(0, (gainedSoFar / totalToGain) * 100));
    }

    return { weightDiff, goalDiff, progressPercent };
  };

  const progress = getProgressStats();
  const currentBMICategory = profile ? calculateBMI(profile.height, profile.weight) : 'Normal';

  // Views
  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* Weight / Progress Card */}
        <div className="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between relative overflow-hidden group min-h-[180px]">
            {profile?.goal !== 'maintain' && (
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Target size={80} className="text-emerald-500" />
              </div>
            )}
            
            <div className="flex justify-between items-start z-10 mb-2">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Current Weight</p>
                    <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{profile?.weight} <span className="text-sm text-slate-400 font-normal">kg</span></h3>
                      {progress && progress.weightDiff !== 0 && (
                        <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center ${progress.weightDiff < 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                           {progress.weightDiff < 0 ? <TrendingDown size={12} className="mr-1"/> : <TrendingUp size={12} className="mr-1"/>}
                           {Math.abs(progress.weightDiff).toFixed(1)} kg
                        </span>
                      )}
                    </div>
                </div>
            </div>
            
            <div className="mt-auto z-10 w-full">
               {profile?.goal === 'maintain' ? (
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 border border-slate-200 dark:border-slate-600">
                    <div className="text-emerald-700 dark:text-emerald-400 font-semibold text-sm flex items-center gap-2 mb-1">
                        <Minus size={16} /> Maintenance Mode
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">You are currently maintaining your weight.</p>
                  </div>
               ) : (
                  <>
                     <div className="relative pt-4 pb-2 w-full">
                        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full w-full"></div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-300 dark:bg-slate-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-200 dark:bg-emerald-800 rounded-full border-2 border-white dark:border-slate-800"></div>
                        <div 
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-2 bg-emerald-500 rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${progress?.progressPercent || 5}%` }}
                        ></div>
                        <div 
                          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-600 rounded-full border-2 border-white dark:border-slate-800 shadow-md transition-all duration-1000 ease-out z-10 flex items-center justify-center"
                          style={{ left: `${progress?.progressPercent || 5}%`, transform: 'translate(-50%, -50%)' }}
                        >
                        </div>
                     </div>
                     <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                        <span>Start: {profile?.startWeight}</span>
                        <span>Goal: {profile?.targetWeight}</span>
                     </div>
                  </>
               )}
            </div>
        </div>

        {/* Calories Card */}
        <div className="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between min-h-[160px]">
             <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Calories</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                        {workouts.reduce((acc, curr) => acc + curr.caloriesBurned, 0) + 450} 
                        <span className="text-sm text-slate-400 font-normal">kcal</span>
                    </h3>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 p-2 rounded-lg">
                    <Flame size={20} />
                </div>
            </div>
            <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                Daily goal: 2,400 kcal
            </div>
        </div>

        {/* Mood Tracker Widget (New) */}
        <MoodTracker onSelect={handleMoodSelect} currentMood={todaysMood || undefined} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-slate-800 p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Weight History</h3>
            <WeightChart data={MOCK_WEIGHT_DATA} />
        </div>
        <div className="xl:col-span-1 bg-white dark:bg-slate-800 p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Weekly Activity</h3>
            <ActivityChart data={MOCK_ACTIVITY_DATA} />
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
         <div className="h-full min-h-[250px]">
            <WaterTracker current={waterIntake} onAdd={handleAddWater} onXPGain={handleXPGain} />
         </div>
         <div 
            onClick={() => setCurrentView(AppView.ADVISOR)}
            className="cursor-pointer group relative bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white overflow-hidden shadow-lg transition-transform hover:scale-[1.01] min-h-[250px]"
        >
            <div className="relative z-10 h-full flex flex-col justify-center items-start">
                <div className="bg-white/10 p-2 rounded-lg mb-4 backdrop-blur-sm">
                   <Target className="text-purple-200" size={24} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">Need a plan, {profile?.name}?</h3>
                <p className="text-indigo-100 mb-6 max-w-xs text-sm leading-relaxed">
                  Your goal is to <span className="font-semibold text-white lowercase">{profile?.goal.replace('_', ' ')}</span>. Ask AI for a customized routine.
                </p>
                <button className="bg-white text-indigo-700 px-6 py-2 rounded-xl font-semibold text-sm group-hover:bg-indigo-50 transition-colors shadow-sm">
                    Create Plan
                </button>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-20 group-hover:opacity-30 transition-opacity">
                <Flame size={180} />
            </div>
         </div>
      </div>
    </div>
  );

  const renderTracker = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="h-fit">
          {profile && <BMICalculator profile={profile} onUpdate={handleUpdateProfile} />}
       </div>
       <div className="flex flex-col gap-4 md:gap-6">
          <WorkoutTracker workouts={workouts} onAddWorkout={handleAddWorkout} onXPGain={handleXPGain} />
          <div className="min-h-[200px]">
            <WaterTracker current={waterIntake} onAdd={handleAddWater} onXPGain={handleXPGain} />
          </div>
       </div>
    </div>
  );

  if (authLoading) {
      return (
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
              <Loader2 className="animate-spin text-emerald-500" size={40} />
          </div>
      );
  }

  if (!session) {
      return <Auth />;
  }

  if (!profile) {
      return <Onboarding initialName={session.user.email?.split('@')[0] || 'User'} onComplete={handleOnboardingComplete} />;
  }

  return (
    <Layout currentView={currentView} onChangeView={setCurrentView} userProfile={profile} isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
      <div className="w-full relative">
        {notification && (
          <div className="absolute top-0 right-0 z-50 animate-in slide-in-from-top-4 duration-300">
             <div className="bg-slate-900 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 font-bold text-sm">
                <Zap size={16} className="text-yellow-400" fill="currentColor" /> {notification.message}
             </div>
          </div>
        )}

        <div className="mb-6 md:mb-8 flex justify-between items-end">
            <div>
              <div className="flex items-center gap-2 mb-1 text-emerald-600 dark:text-emerald-400 font-medium text-sm animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
                  <LottiePlayer src={greetingAnim} className="w-8 h-8" /> 
                  <span>{greeting}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight animate-in fade-in slide-in-from-left-4 duration-500">
                  {currentView === AppView.DASHBOARD && `Welcome back, ${profile.name}!`}
                  {currentView === AppView.TRACKER && 'Tools & Tracker'}
                  {currentView === AppView.ADVISOR && 'AI Fitness Coach'}
                  {currentView === AppView.PROFILE && 'Your Profile'}
              </h2>
            </div>
        </div>

        {currentView === AppView.DASHBOARD && renderDashboard()}
        {currentView === AppView.TRACKER && renderTracker()}
        {currentView === AppView.ADVISOR && <AIAdvisor profile={profile} bmiCategory={currentBMICategory} />}
        
        {currentView === AppView.PROFILE && (
            <div className="bg-white dark:bg-slate-800 p-6 md:p-12 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center animate-in fade-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-inner border-4 border-emerald-50 dark:border-emerald-800/30">
                    {profile.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{profile.name}</h3>
                <div className="flex items-center justify-center gap-2 mb-8 mt-2">
                    <span className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300">Level {profile.level}</span>
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full text-xs font-bold text-yellow-700 dark:text-yellow-400 flex items-center gap-1"><Zap size={10} fill="currentColor" /> {profile.xp} XP</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl text-left border border-slate-100 dark:border-slate-700">
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                             <TrendingUp size={18} className="text-emerald-500" /> Stats
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                                <span className="text-slate-500 dark:text-slate-400">Height</span>
                                <span className="font-semibold text-slate-900 dark:text-white">{profile.height} cm</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                                <span className="text-slate-500 dark:text-slate-400">Current Weight</span>
                                <span className="font-semibold text-slate-900 dark:text-white">{profile.weight} kg</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl text-left border border-slate-100 dark:border-slate-700">
                         <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                             <Target size={18} className="text-blue-500" /> Goals
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                                <span className="text-slate-500 dark:text-slate-400">Main Goal</span>
                                <span className="font-semibold capitalize text-emerald-600 dark:text-emerald-400">{profile.goal.replace('_', ' ')}</span>
                            </div>
                             <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                                <span className="text-slate-500 dark:text-slate-400">Activity Level</span>
                                <span className="font-semibold capitalize text-slate-900 dark:text-white">{profile.activityLevel}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <button 
                  onClick={() => {
                    localStorage.removeItem(`vitality_profile_${session.user.id}`);
                    setProfile(null);
                  }}
                  className="mt-8 text-slate-400 hover:text-red-500 text-sm transition-colors"
                >
                  Reset Profile Data
                </button>
            </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
