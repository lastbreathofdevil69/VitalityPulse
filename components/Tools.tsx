
import React, { useState, useEffect } from 'react';
import { Plus, Droplets, Flame, Trophy, Scale, CheckCircle2, Zap, Clock, BookOpen, Search, Filter, X, PlayCircle, BarChart, Info, Dumbbell } from 'lucide-react';
import { UserProfile, BMIData, WorkoutLog } from '../types';
import { LottiePlayer, ANIMATIONS } from './Animations';

/* --- Workout Library Data --- */

interface LibraryWorkout {
  id: string;
  title: string;
  type: string;
  duration: number;
  calories: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xp: number;
  description: string;
  color: string;
}

const WORKOUT_LIBRARY: LibraryWorkout[] = [
  { id: 'w1', title: 'Morning Mobility Flow', type: 'Yoga', duration: 15, calories: 80, difficulty: 'Beginner', xp: 25, description: 'Gentle stretching to wake up your joints and muscles.', color: 'bg-emerald-500' },
  { id: 'w2', title: 'Tabata Torch', type: 'HIIT', duration: 20, calories: 280, difficulty: 'Advanced', xp: 80, description: 'High-intensity intervals: 20s work, 10s rest. Maximum effort.', color: 'bg-orange-500' },
  { id: 'w3', title: 'Full Body Power', type: 'Strength', duration: 45, calories: 350, difficulty: 'Intermediate', xp: 60, description: 'Compound movements targeting all major muscle groups.', color: 'bg-blue-600' },
  { id: 'w4', title: '5K Tempo Run', type: 'Running', duration: 30, calories: 320, difficulty: 'Intermediate', xp: 70, description: 'Steady state cardio at a challenging but sustainable pace.', color: 'bg-indigo-500' },
  { id: 'w5', title: 'Core Crusher', type: 'Strength', duration: 12, calories: 90, difficulty: 'Intermediate', xp: 30, description: 'Intense ab circuit focusing on stability and strength.', color: 'bg-red-500' },
  { id: 'w6', title: 'Deep Sleep Stretch', type: 'Yoga', duration: 20, calories: 50, difficulty: 'Beginner', xp: 20, description: 'Relaxing poses to calm the nervous system before bed.', color: 'bg-purple-500' },
  { id: 'w7', title: 'Leg Day Destruction', type: 'Strength', duration: 50, calories: 400, difficulty: 'Advanced', xp: 90, description: 'Heavy squats, lunges, and deadlifts. Not for the faint of heart.', color: 'bg-slate-700' },
  { id: 'w8', title: 'Power Walk', type: 'Cardio', duration: 40, calories: 200, difficulty: 'Beginner', xp: 40, description: 'Brisk walking to get the heart rate up without high impact.', color: 'bg-teal-500' },
  { id: 'w9', title: 'Jump Rope Skipping', type: 'Cardio', duration: 15, calories: 180, difficulty: 'Intermediate', xp: 45, description: 'Great for coordination and cardiovascular endurance.', color: 'bg-pink-500' },
  { id: 'w10', title: 'Desk Detox', type: 'Mobility', duration: 5, calories: 20, difficulty: 'Beginner', xp: 10, description: 'Quick stretches to counteract sitting all day.', color: 'bg-cyan-500' },
];

/* --- BMI Calculator Component --- */

export const BMICalculator = ({ 
  profile, 
  onUpdate 
}: { 
  profile: UserProfile; 
  onUpdate: (h: number, w: number) => void 
}) => {
  const [height, setHeight] = useState(profile.height.toString());
  const [weight, setWeight] = useState(profile.weight.toString());
  const [showSuccess, setShowSuccess] = useState(false);

  const calculateBMI = (): BMIData => {
    const hM = parseFloat(height) / 100;
    const w = parseFloat(weight);
    const val = w / (hM * hM);
    
    if (isNaN(val)) return { value: 0, category: 'Normal', color: 'bg-slate-200 dark:bg-slate-700' };

    let category: BMIData['category'] = 'Normal';
    let color = 'bg-emerald-500';

    if (val < 18.5) { category = 'Underweight'; color = 'bg-blue-400'; }
    else if (val < 25) { category = 'Normal'; color = 'bg-emerald-500'; }
    else if (val < 30) { category = 'Overweight'; color = 'bg-orange-400'; }
    else { category = 'Obese'; color = 'bg-red-500'; }

    return { value: val, category, color };
  };

  const bmi = calculateBMI();

  const handleUpdate = () => {
    onUpdate(parseFloat(height), parseFloat(weight));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-full flex flex-col relative overflow-hidden transition-colors group">
      {showSuccess && (
         <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center animate-in fade-in duration-300">
            <LottiePlayer src={ANIMATIONS.TROPHY} className="w-32 h-32" loop={false} />
            <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-2">Profile Updated!</p>
         </div>
      )}

      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
          <Scale size={20} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">BMI Calculator</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Height (cm)</label>
          <input 
            type="number" 
            value={height} 
            onChange={(e) => setHeight(e.target.value)}
            className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Weight (kg)</label>
          <input 
            type="number" 
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 text-center mb-6 relative overflow-hidden border border-slate-100 dark:border-slate-700 flex-1 flex flex-col justify-center items-center group-hover:border-indigo-200 dark:group-hover:border-indigo-800 transition-colors">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Your Body Mass Index</p>
        <div className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-2 relative z-10">
          {bmi.value.toFixed(1)}
        </div>
        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-sm ${bmi.color} relative z-10`}>
          {bmi.category}
        </span>
        
        {/* Subtle BMI Visual Background */}
        <div className={`absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-blue-300 via-emerald-400 to-red-400 opacity-20`} />
        <div 
            className="absolute bottom-0 w-1 h-3 bg-slate-800 dark:bg-white transition-all duration-500" 
            style={{ left: `${Math.min(Math.max((bmi.value - 15) * 3.3, 0), 100)}%` }} 
        />
      </div>

      <button 
        onClick={handleUpdate}
        className="w-full bg-slate-900 dark:bg-slate-700 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors shadow-lg shadow-slate-200 dark:shadow-none"
      >
        Update Profile
      </button>
    </div>
  );
};

/* --- Water Tracker Component --- */

export const WaterTracker = ({ 
  current, 
  onAdd,
  onXPGain
}: { 
  current: number; 
  onAdd: (amount: number) => void;
  onXPGain?: (amount: number) => void;
}) => {
  const [animating, setAnimating] = useState(false);
  const percent = Math.min((current / 2500) * 100, 100);

  const handleAdd = (amt: number) => {
    onAdd(amt);
    if (onXPGain) onXPGain(5); // +5 XP per drink log
    setAnimating(true);
    setTimeout(() => setAnimating(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white h-full relative overflow-hidden flex flex-col justify-between group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none">
          {animating && <LottiePlayer src={ANIMATIONS.WATER} loop={false} className="w-full h-full" />}
      </div>
      
      {!animating && <Droplets className="absolute -bottom-4 -right-4 text-white opacity-10 group-hover:scale-110 transition-transform duration-700" size={120} />}
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold opacity-90">Hydration</h3>
            <p className="text-sm opacity-75">Daily Goal: 2500ml</p>
          </div>
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <Droplets size={20} />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-2">
             <div className="text-3xl md:text-4xl font-bold">{current} <span className="text-lg font-normal opacity-80">ml</span></div>
             {percent >= 100 && (
                <div className="animate-in zoom-in duration-300 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Trophy size={12} /> Goal
                </div>
             )}
          </div>
          <div className="w-full bg-black/20 h-3 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-700 shadow-sm relative" 
              style={{ width: `${percent}%` }} 
            >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[250, 500, 750].map(amt => (
            <button
              key={amt}
              onClick={() => handleAdd(amt)}
              className="bg-white/20 hover:bg-white/30 py-3 rounded-xl text-xs font-bold backdrop-blur-sm transition-all active:scale-95 border border-white/10 flex flex-col items-center justify-center gap-1 group/btn"
            >
              <Plus size={14} className="opacity-70" /> {amt}ml
              <span className="text-[10px] text-cyan-100 opacity-0 group-hover/btn:opacity-100 transition-opacity">+5 XP</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* --- Workout Library Modal --- */

const WorkoutLibraryModal = ({ 
  onClose, 
  onLog 
}: { 
  onClose: () => void; 
  onLog: (workout: LibraryWorkout) => void 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredWorkouts = WORKOUT_LIBRARY.filter(w => {
    const matchesSearch = w.title.toLowerCase().includes(searchTerm.toLowerCase()) || w.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || w.type === filter || w.difficulty === filter;
    return matchesSearch && matchesFilter;
  });

  const categories = ['All', 'HIIT', 'Strength', 'Yoga', 'Cardio', 'Running', 'Mobility', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom-10 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 sticky top-0 z-10">
           <div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <BookOpen className="text-indigo-500" /> Workout Library
             </h2>
             <p className="text-slate-500 dark:text-slate-400 text-sm">Browse our curated collection of exercises.</p>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
             <X size={24} className="text-slate-500" />
           </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 bg-slate-50 dark:bg-slate-900/50">
           <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search workouts..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
              />
           </div>
           <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    filter === cat 
                      ? 'bg-indigo-500 text-white shadow-md' 
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950/50 custom-scrollbar">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWorkouts.map(workout => (
                <div key={workout.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all group flex flex-col">
                   <div className="flex justify-between items-start mb-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${workout.color}`}>
                        {workout.type}
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                        <Zap size={12} fill="currentColor" /> {workout.xp} XP
                      </div>
                   </div>
                   
                   <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{workout.title}</h3>
                   <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">{workout.description}</p>
                   
                   <div className="mt-auto space-y-4">
                     <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <span className="flex items-center gap-1"><Clock size={14} /> {workout.duration} min</span>
                        <span className="flex items-center gap-1"><Flame size={14} /> {workout.calories} kcal</span>
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded ${
                          workout.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          workout.difficulty === 'Intermediate' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                           <BarChart size={12} /> {workout.difficulty}
                        </span>
                     </div>
                     
                     <button 
                       onClick={() => onLog(workout)}
                       className="w-full py-2.5 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-semibold text-sm hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"
                     >
                       <PlayCircle size={16} /> Log Workout
                     </button>
                   </div>
                </div>
              ))}
              {filteredWorkouts.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">
                   <Info className="mx-auto mb-2 opacity-50" size={32} />
                   <p>No workouts found matching your criteria.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

/* --- Workout Log Component --- */

export const WorkoutTracker = ({
  workouts,
  onAddWorkout,
  onXPGain
}: {
  workouts: WorkoutLog[];
  onAddWorkout: (workout: Omit<WorkoutLog, 'id'>) => void;
  onXPGain?: (amount: number) => void;
}) => {
  const [type, setType] = useState('Running');
  const [duration, setDuration] = useState('30');
  const [calories, setCalories] = useState('300');
  const [isCelebration, setIsCelebration] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  const QUICK_WORKOUTS = [
    { type: 'Running', mins: 30, cal: 300 },
    { type: 'Cycling', mins: 45, cal: 400 },
    { type: 'Yoga', mins: 20, cal: 100 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitWorkout(type, parseInt(duration) || 0, parseInt(calories) || 0);
  };

  const submitWorkout = (t: string, d: number, c: number, xpReward = 50) => {
    onAddWorkout({
      type: t,
      durationMinutes: d,
      caloriesBurned: c,
      date: new Date().toISOString()
    });
    if (onXPGain) onXPGain(xpReward);
    
    // Reset form
    setType('Running');
    setDuration('');
    setCalories('');
    setIsCelebration(true);
    setTimeout(() => setIsCelebration(false), 3000);
  };

  const handleLibraryLog = (workout: LibraryWorkout) => {
    submitWorkout(workout.title, workout.duration, workout.calories, workout.xp);
    setShowLibrary(false);
  };

  return (
    <>
      {showLibrary && <WorkoutLibraryModal onClose={() => setShowLibrary(false)} onLog={handleLibraryLog} />}
      
      <div className="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden transition-colors flex flex-col h-full group">
        {isCelebration && (
          <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
              <LottiePlayer src={ANIMATIONS.TROPHY} loop={false} className="w-64 h-64" />
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
              <Flame size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Quick Log</h3>
          </div>
          
          <button 
             onClick={() => setShowLibrary(true)}
             className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
          >
             <BookOpen size={14} /> Library
          </button>
        </div>

        {/* Smart Suggestions */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
              <Clock size={14} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Add</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {QUICK_WORKOUTS.map((qw, i) => (
                  <button 
                      key={i}
                      onClick={() => submitWorkout(qw.type, qw.mins, qw.cal)}
                      className="flex-shrink-0 bg-slate-50 dark:bg-slate-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 border border-slate-200 dark:border-slate-600 hover:border-orange-200 dark:hover:border-orange-500/30 rounded-lg p-2 px-3 text-left transition-all active:scale-95"
                  >
                      <div className="font-bold text-slate-700 dark:text-slate-200 text-sm">{qw.type}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{qw.mins}m • {qw.cal}cal</div>
                  </button>
              ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6 relative z-10">
          <div className="flex gap-3">
              <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="flex-[2] border border-slate-200 dark:border-slate-600 rounded-xl p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
              >
              <option>Running</option>
              <option>Cycling</option>
              <option>Weightlifting</option>
              <option>Yoga</option>
              <option>HIIT</option>
              <option>Swimming</option>
              </select>
              
              <button type="submit" className="bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 px-4 font-bold shadow-md shadow-orange-100 dark:shadow-none active:scale-95">
                  <Plus size={20} />
              </button>
          </div>
          
          <div className="flex gap-3">
              <div className="flex-1 relative">
                  <input 
                      type="number" 
                      placeholder="Mins" 
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                  />
                  <span className="absolute right-3 top-3.5 text-slate-400 text-xs font-bold pointer-events-none">MIN</span>
              </div>

              <div className="flex-1 relative">
                  <input 
                      type="number" 
                      placeholder="Kcal" 
                      value={calories}
                      onChange={(e) => setCalories(e.target.value)}
                      className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                  />
                  <span className="absolute right-3 top-3.5 text-slate-400 text-xs font-bold pointer-events-none">KCAL</span>
              </div>
          </div>
        </form>

        <div className="space-y-3 relative z-10 flex-1 overflow-y-auto max-h-[200px] pr-1 custom-scrollbar">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Today's Activity</h4>
          {workouts.length === 0 && (
              <div className="text-center py-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-slate-400 text-sm italic">No workouts logged yet today.</p>
              </div>
          )}
          {workouts.slice().reverse().map(w => (
            <div key={w.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 transition-colors animate-in slide-in-from-left-2 duration-300">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-orange-500 shadow-sm border border-slate-100 dark:border-slate-700">
                    <Trophy size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{w.type}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{new Date(w.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {w.durationMinutes} mins</div>
                  </div>
              </div>
              <div className="font-bold text-orange-600 dark:text-orange-400 text-sm flex items-center gap-1">
                  <Flame size={12} fill="currentColor" /> {w.caloriesBurned}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
