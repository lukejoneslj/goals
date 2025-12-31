// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHW0jkBfmQSpYkhrKJJwojCRxjovyocaE",
  authDomain: "repent-7d4a5.firebaseapp.com",
  projectId: "repent-7d4a5",
  storageBucket: "repent-7d4a5.firebasestorage.app",
  messagingSenderId: "812196878966",
  appId: "1:812196878966:web:139ef97e23275156215d57",
  measurementId: "G-79C2K0NSN0"
};

// Initialize Firebase
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

// Initialize Firebase only on client side
if (typeof window !== 'undefined') {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);

  // Set authentication persistence to LOCAL for better persistence
  // This helps maintain authentication state across browser sessions
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error('Error setting auth persistence:', error);
  });

  db = getFirestore(app);
}

// Export Firebase services
export { auth, db };

// Initialize Analytics (only in browser environment)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined' && app) {
  analytics = getAnalytics(app);
}
export { analytics };

// Types for our database (matching the original Supabase types)
export type Goal = {
  id: string
  userId: string
  category: 'spiritual' | 'physical' | 'social' | 'intellectual'
  status: 'planning' | 'active' | 'completed' | 'paused' | 'abandoned'
  outcome: string
  targetDate: string
  obstacles?: string[]
  resources?: string[]
  detailedPlan?: string
  whyLeverage: string
  progressPercentage?: number
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export type ActionItem = {
  id: string
  userId: string
  goalId: string
  actionDescription: string
  isCompleted?: boolean
  dueDate?: string
  completedAt?: string
  createdAt?: string
  updatedAt?: string
}

// Helper function to get current timestamp
export const getTimestamp = () => new Date().toISOString();

// Types for habits and habit completions
export type Habit = {
  id: string
  userId: string
  name: string
  description?: string
  category?: 'spiritual' | 'physical' | 'social' | 'intellectual'
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
  currentStreak: number
  longestStreak: number
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export type UserELO = {
  id: string
  userId: string
  displayName?: string
  email?: string
  eloRating: number
  currentRank: ELO_RANK
  totalWins: number
  totalLosses: number
  winStreak: number
  bestWinStreak: number
  createdAt: string
  updatedAt?: string
}

export type ELO_RANK =
  | 'Bronze III'
  | 'Bronze II'
  | 'Bronze I'
  | 'Silver III'
  | 'Silver II'
  | 'Silver I'
  | 'Gold III'
  | 'Gold II'
  | 'Gold I'
  | 'Platinum III'
  | 'Platinum II'
  | 'Platinum I'
  | 'Diamond III'
  | 'Diamond II'
  | 'Diamond I'
  | 'Master'
  | 'Grandmaster'
  | 'Challenger'

export type HabitCompletion = {
  id: string
  userId: string
  habitId: string
  completionDate: string
  createdAt: string
}

export type Todo = {
  id: string
  userId: string
  title: string
  description?: string
  category?: 'spiritual' | 'physical' | 'social' | 'intellectual'
  isCompleted: boolean
  dueDate: string // ISO date string for the day this todo is due
  completedAt?: string
  createdAt: string
  updatedAt?: string
}

// Running Plan Types
export type WorkoutTemplate = {
  week: number
  day: number
  date: string
  workoutType: 'easy_run' | 'long_run' | 'tempo_run' | 'intervals' | 'recovery' | 'rest' | 'race'
  distance?: number
  duration?: string
  description: string
  notes?: string
}

export type RunningPlan = {
  id: string
  userId: string
  raceType: string // e.g., "5K", "10K", "Half Marathon", "Marathon"
  raceDate: string // Target race date
  previousRaceTime?: string // Previous time for this race distance
  mileTime?: string // Current mile time
  sixMileTime?: string // Current 6-mile time
  restDays: string[] // e.g., ["Sunday", "Wednesday"]
  concerns: string[] // User's concerns/worries about the race
  additionalInfo?: string // Any other relevant information
  plan: WorkoutTemplate[] // The generated workout plan template
  currentWeek: number // Current week in the training plan
  status: 'active' | 'completed' | 'paused'
  createdAt: string
  updatedAt?: string
}

export type RunningWorkout = {
  id: string
  planId: string
  userId: string
  week: number
  day: number // Day of the week (1-7)
  date: string // Specific date for this workout
  workoutType: 'easy_run' | 'long_run' | 'tempo_run' | 'intervals' | 'recovery' | 'rest' | 'race'
  distance?: number // Distance in miles
  duration?: string // Expected duration or time goal
  description: string // Detailed workout description
  notes?: string // AI-generated notes or tips
  isCompleted: boolean
  completedAt?: string
  actualTime?: string // User's actual completion time
  actualDistance?: number // User's actual distance
  userNotes?: string // User's notes after completing
  createdAt: string
  updatedAt?: string
}
