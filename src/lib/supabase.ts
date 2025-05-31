import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zivunqqfxbrzabjinrjz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppdnVucXFmeGJyemFiamlucmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NDc1MTQsImV4cCI6MjA2NDIyMzUxNH0.SGl6KzqMkE3YBKafC_H2fk2GL9m1J4uP15Ivise4YNE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export type Goal = {
  id: string
  user_id: string
  category: 'spiritual' | 'physical' | 'social' | 'intellectual'
  status: 'planning' | 'active' | 'completed' | 'paused' | 'abandoned'
  outcome: string
  target_date: string
  obstacles?: string[]
  resources?: string[]
  detailed_plan?: string
  why_leverage: string
  progress_percentage?: number
  notes?: string
  created_at?: string
  updated_at?: string
}

export type ActionItem = {
  id: string
  goal_id: string
  action_description: string
  is_completed?: boolean
  due_date?: string
  completed_at?: string
  created_at?: string
  updated_at?: string
}

export type ProgressUpdate = {
  id: string
  goal_id: string
  update_text: string
  progress_percentage?: number
  created_at?: string
} 