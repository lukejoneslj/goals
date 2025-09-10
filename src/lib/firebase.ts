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

export type HabitCompletion = {
  id: string
  userId: string
  habitId: string
  completionDate: string
  createdAt: string
}
