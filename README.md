# 🏋️ VitalityPulse - AI-Powered Fitness Tracker

A modern, intelligent fitness tracking application built with React, TypeScript, and powered by AI. VitalityPulse helps you monitor your health metrics, track workouts, and achieve your fitness goals with personalized AI coaching.

## ✨ Key Features

### 📊 Dashboard & Analytics
- **Real-time Progress Tracking**: Visual progress bars showing your journey toward fitness goals
- **Weight History Charts**: Interactive weight trend visualization
- **Activity Analytics**: Weekly calorie burn tracking and analysis
- **Dynamic Stats Cards**: Current weight, calories burned, and mood tracking at a glance

### 🎮 Gamification System
- **Experience Points (XP)**: Earn XP for completing health activities
  - +20 XP for updating body metrics
  - +10 XP for mood check-ins
  - +50 XP for workout logging
- **Level System**: Progress through levels with increasing XP thresholds (500 XP per level)
- **Achievement Badges**: Earn badges for milestones (e.g., "Newcomer" badge on signup)
- **Real-time Notifications**: Instant feedback on XP gains and level-ups

### 💪 Comprehensive Tracking Tools
- **BMI Calculator**: Calculate and track Body Mass Index with real-time updates
- **Water Intake Tracker**: Monitor daily water consumption
- **Workout Logger**: Record exercises with duration, intensity, and calories burned
- **Mood Tracker**: Daily mood check-ins with 5 mood levels (Great, Good, Neutral, Tired, Stressed)

### 🤖 AI Fitness Coach
- **Personalized Routines**: AI-generated workout plans based on your goals and fitness level
- **Smart Recommendations**: Get customized fitness advice from Google Gemini AI
- **Context-Aware Suggestions**: AI considers your BMI category, fitness goals, and activity level

### 🎨 User Experience
- **Dark Mode Support**: Automatic dark/light theme switching with localStorage persistence
- **Responsive Design**: Fully responsive layout optimized for mobile, tablet, and desktop
- **Smooth Animations**: Lottie animations for greetings, smooth transitions, and visual feedback
- **Intuitive Navigation**: Multi-view interface (Dashboard, Tracker, AI Advisor, Profile)

### 👤 User Management
- **Authentication**: Secure login/signup with Supabase
- **User Profiles**: Comprehensive profile management with personal health metrics
- **Onboarding Flow**: Interactive setup wizard for new users
- **Data Persistence**: LocalStorage-based data backup with user-specific profiles

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React 18.3, TypeScript 5.8 |
| **Build Tool** | Vite 6.2 |
| **Styling** | Tailwind CSS |
| **UI Components** | Lucide React Icons, Lottie Animations |
| **Charts & Graphs** | Recharts 3.5 |
| **Backend/Database** | Supabase 2.42.0 |
| **AI** | Google Generative AI 1.30.0 |
| **Additional** | React Markdown for rich text rendering |

## 📋 Project Structure

```
VitalityPulse/
├── App.tsx                 # Main application component
├── types.ts                # TypeScript type definitions
├── index.tsx               # React entry point
├── index.html              # HTML template
├── components/             # Reusable React components
│   ├── Layout.tsx          # Main layout wrapper
│   ├── Auth.tsx            # Authentication components
│   ├── Onboarding.tsx      # User onboarding flow
│   ├── Charts.tsx          # Weight and Activity charts
│   ├── Tools.tsx           # BMI, Water, Workout trackers
│   ├── Advisor.tsx         # AI fitness coach
│   └── Animations.tsx      # Lottie animations
├── services/               # External service integrations
│   └── supabase.ts         # Supabase client setup
├── package.json            # Project dependencies
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── metadata.json           # Project metadata
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ 
- **npm** or **yarn** package manager
- Supabase account (for authentication and backend)
- Google API key (for Gemini AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lastbreathofdevil69/VitalityPulse.git
   cd VitalityPulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GOOGLE_API_KEY=your_google_gemini_api_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production
```bash
npm run build
npm run preview
```

## 📱 Application Views

### 1. **Dashboard** (Home)
Main view displaying:
- Current weight with trends
- Active calories burned
- Weekly weight history chart
- Weekly activity chart
- Mood tracker
- Water intake tracker
- Quick access to AI coach

### 2. **Tools & Tracker**
Dedicated tracking interface with:
- BMI Calculator
- Workout Logger
- Water Intake Tracker
- Detailed fitness metrics

### 3. **AI Fitness Coach**
Intelligent recommendation engine featuring:
- Personalized workout plans
- AI-powered fitness advice
- Goal-specific recommendations
- Real-time chat interface with Gemini AI

### 4. **Profile**
User profile management showing:
- User stats (height, current weight)
- Fitness goals
- Activity level
- XP and level progression
- Achievement badges
- Option to reset profile data

## 🎯 Fitness Goals Supported

- **Lose Weight**: BMI reduction focused
- **Gain Muscle**: Muscle mass increase focused
- **Maintain**: Weight maintenance mode

## 📊 Data Models

### UserProfile
```typescript
{
  name: string;
  age: number;
  height: number;           // in cm
  weight: number;           // in kg
  startWeight: number;      // initial weight
  targetWeight: number;     // goal weight
  goal: 'lose_weight' | 'gain_muscle' | 'maintain';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  xp: number;              // experience points
  level: number;           // user level
  badges: string[];        // earned badges
}
```

### WorkoutLog
```typescript
{
  id: string;
  name: string;
  duration: number;        // in minutes
  intensity: 'light' | 'moderate' | 'intense';
  caloriesBurned: number;
  date: Date;
}
```

## 🎮 Gamification Mechanics

| Action | XP Reward |
|--------|-----------|
| Update body metrics | +20 |
| Mood check-in | +10 |
| Log workout | +50 |
| Level up threshold | 500 XP |

## 🔐 Authentication Flow

1. User signs up/logs in via Supabase
2. Session is established and persisted
3. User completes onboarding (if new user)
4. Profile data is loaded from localStorage
5. Full application access granted

## 🌙 Dark Mode

- Automatic detection of system theme preference
- Manual toggle in navigation
- Persistent storage in localStorage
- Smooth transitions between themes

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/VitalityPulse.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Make your changes** and commit
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/AmazingFeature
   ```

5. **Open a Pull Request** describing your changes

## 📝 Development Guidelines

- Use TypeScript for type safety
- Follow React hooks best practices
- Keep components modular and reusable
- Use Tailwind CSS for styling
- Write descriptive commit messages

## 🐛 Known Issues & Future Enhancements

### Planned Features
- [ ] Backend API integration for persistent data storage
- [ ] Social features (friend challenges, leaderboards)
- [ ] Advanced analytics and reports
- [ ] Mobile app (React Native)
- [ ] Integration with fitness wearables
- [ ] Nutrition tracking
- [ ] Meal planning

## 📄 License

This project is open source and available under the MIT License. 

## 👨‍💻 Author

**Saurabh Rajput** - [GitHub](https://github.com/lastbreathofdevil69)

## 🤝 Support & Feedback

Found an issue or have suggestions? Please open an [issue](https://github.com/lastbreathofdevil69/VitalityPulse/issues) on GitHub.

## 🔗 Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase Docs](https://supabase.com/docs)
- [Google Generative AI](https://ai.google.dev)
- [Vite Documentation](https://vitejs.dev)

---

**Made with ❤️ by Saurabh Rajput**