import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ArrowRight, Check, Activity, Target, User, Ruler, Flame, Armchair, Footprints, Dumbbell } from 'lucide-react';
import { LottiePlayer, ANIMATIONS } from './Animations';

interface OnboardingProps {
  initialName: string;
  onComplete: (profile: UserProfile) => void;
}

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise, desk job', icon: Armchair },
  { id: 'light', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week', icon: Footprints },
  { id: 'moderate', label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week', icon: Dumbbell },
  { id: 'active', label: 'Very Active', desc: 'Hard exercise 6-7 days/week', icon: Flame },
];

export const Onboarding: React.FC<OnboardingProps> = ({ initialName, onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: initialName,
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'lose_weight'
  });

  const updateField = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleSubmit = () => {
    // Validate and cast to UserProfile
    const profile: UserProfile = {
      name: formData.name || 'User',
      age: Number(formData.age) || 25,
      gender: formData.gender as any,
      height: Number(formData.height) || 170,
      weight: Number(formData.weight) || 70,
      startWeight: Number(formData.weight) || 70, // Set start weight same as current initially
      targetWeight: Number(formData.targetWeight) || 70,
      activityLevel: formData.activityLevel as any,
      goal: formData.goal as any,
      // Initialize gamification fields
      xp: 0,
      level: 1,
      badges: []
    };
    onComplete(profile);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side - Visual */}
        <div className="w-full md:w-2/5 bg-slate-900 p-8 flex flex-col justify-between text-white relative overflow-hidden shrink-0">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8 text-emerald-400">
              <Activity size={24} />
              <span className="font-bold tracking-tight">VitalityPulse</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Let's get to know you.</h2>
            <p className="text-slate-400 text-sm leading-relaxed">We need a few details to personalize your fitness plan and track your progress effectively.</p>
          </div>
          
          <div className="flex-1 flex items-center justify-center relative z-10 my-4">
              <LottiePlayer src={ANIMATIONS.ROBOT} className="w-48 h-48" />
          </div>
          
          <div className="relative z-10 flex gap-2 mt-8 md:mt-0">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step >= i ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-700'}`} />
            ))}
          </div>

          {/* Abstract BG Shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-3/5 p-6 md:p-12 flex flex-col">
          <div className="flex-1">
            {step === 1 && (
              <div className="animate-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <User className="text-emerald-500" size={20} />
                  Basic Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
                    <input 
                      value={formData.name} 
                      onChange={e => updateField('name', e.target.value)}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                      <input 
                        type="number"
                        value={formData.age || ''} 
                        onChange={e => updateField('age', e.target.value)}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="e.g. 28"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                      <select 
                        value={formData.gender}
                        onChange={e => updateField('gender', e.target.value)}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in slide-in-from-right-4 duration-300">
                 <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Ruler className="text-emerald-500" size={20} />
                  Body Metrics
                </h3>
                <div className="space-y-5">
                   <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
                      <input 
                        type="number"
                        value={formData.height || ''} 
                        onChange={e => updateField('height', e.target.value)}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="e.g. 175"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
                      <input 
                        type="number"
                        value={formData.weight || ''} 
                        onChange={e => updateField('weight', e.target.value)}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="e.g. 75"
                      />
                    </div>
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Activity Level</label>
                      <div className="space-y-2">
                        {ACTIVITY_LEVELS.map(level => {
                          const Icon = level.icon;
                          return (
                            <button
                              key={level.id}
                              onClick={() => updateField('activityLevel', level.id)}
                              className={`w-full p-3 flex items-center gap-3 rounded-xl border transition-all text-left ${
                                formData.activityLevel === level.id 
                                  ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-1 ring-emerald-500' 
                                  : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                              }`}
                            >
                              <div className={`p-2 rounded-lg shrink-0 ${formData.activityLevel === level.id ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                <Icon size={20} />
                              </div>
                              <div className="flex-1 min-w-0">
                                  <div className={`font-semibold text-sm ${formData.activityLevel === level.id ? 'text-emerald-900' : 'text-slate-900'}`}>{level.label}</div>
                                  <div className="text-xs text-slate-500 truncate">{level.desc}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                   </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Target className="text-emerald-500" size={20} />
                  Your Goal
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">What's your main focus?</label>
                    <div className="space-y-2">
                      {[
                        { id: 'lose_weight', label: 'Lose Weight', desc: 'Burn fat and get leaner' },
                        { id: 'maintain', label: 'Maintain Weight', desc: 'Stay healthy and fit' },
                        { id: 'gain_muscle', label: 'Build Muscle', desc: 'Gain mass and strength' },
                      ].map(g => (
                         <button
                            key={g.id}
                            onClick={() => updateField('goal', g.id)}
                            className={`w-full p-3.5 flex items-center justify-between rounded-xl border transition-all ${
                                formData.goal === g.id 
                                ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-1 ring-emerald-500' 
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="text-left">
                              <div className={`font-semibold text-sm ${formData.goal === g.id ? 'text-emerald-900' : 'text-slate-900'}`}>{g.label}</div>
                              <div className="text-xs text-slate-500">{g.desc}</div>
                            </div>
                            {formData.goal === g.id && <Check size={18} className="text-emerald-500" />}
                          </button>
                      ))}
                    </div>
                  </div>
                  
                  {formData.goal !== 'maintain' && (
                    <div className="animate-in fade-in slide-in-from-top-2 bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Target Weight (kg)</label>
                       <input 
                        type="number"
                        value={formData.targetWeight || ''} 
                        onChange={e => updateField('targetWeight', e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="What is your goal weight?"
                      />
                      <p className="text-xs text-slate-500 mt-2">
                          We'll use this to track your progress on the dashboard.
                      </p>
                    </div>
                  )}
                  {formData.goal === 'maintain' && (
                     <div className="animate-in fade-in slide-in-from-top-2 bg-emerald-50 p-4 rounded-xl border border-emerald-100 mt-2 text-sm text-emerald-800">
                        Awesome! We'll focus on workouts and nutrition to keep you feeling your best at your current weight.
                     </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-between items-center pt-6 border-t border-slate-100">
            {step > 1 ? (
              <button 
                onClick={() => setStep(prev => prev - 1)}
                className="text-slate-500 font-medium hover:text-slate-800 text-sm px-2"
              >
                Back
              </button>
            ) : <div />}
            
            {step < 3 ? (
              <button 
                onClick={handleNext}
                disabled={step === 1 && !formData.age}
                className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-md"
              >
                Next Step <ArrowRight size={16} />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-200 text-sm"
              >
                Start Journey <Check size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};