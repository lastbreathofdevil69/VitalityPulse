
export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // current weight in kg
  startWeight: number; // weight when they started
  targetWeight: number; // goal weight
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
  goal: 'lose_weight' | 'maintain' | 'gain_muscle' | 'improve_endurance';
  
  // Gamification & Tracking
  xp: number;
  level: number;
  badges: string[];
  moodLogs?: { date: string; mood: 'great' | 'good' | 'neutral' | 'tired' | 'stressed' }[];
}

export interface BMIData {
  value: number;
  category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  color: string;
}

export interface WorkoutLog {
  id: string;
  type: string;
  durationMinutes: number;
  caloriesBurned: number;
  date: string;
}

export interface DailyStats {
  waterIntake: number; // ml
  steps: number;
  caloriesConsumed: number;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  TRACKER = 'TRACKER',
  ADVISOR = 'ADVISOR',
  PROFILE = 'PROFILE'
}

export interface AIChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
