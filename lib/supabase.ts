import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  clerk_user_id: string
  email: string
  first_name: string
  last_name: string
  age?: number
  location?: string
  bio?: string
  photos?: string[]
  preferred_pace_min?: number
  preferred_pace_max?: number
  preferred_distance?: string
  running_times?: string[]
  subscription_tier: 'free' | 'runner' | 'athlete' | 'champion'
  is_verified: boolean
  is_online: boolean
  last_seen: string
  created_at: string
  updated_at: string
}

export interface Match {
  id: string
  user1_id: string
  user2_id: string
  status: 'active' | 'blocked' | 'unmatched'
  matched_at: string
  updated_at: string
}

export interface Message {
  id: string
  match_id: string
  sender_id: string
  content: string
  message_type: 'text' | 'image' | 'location'
  is_read: boolean
  created_at: string
}

export interface GroupRun {
  id: string
  creator_id: string
  title: string
  description?: string
  location: string
  coordinates?: { x: number; y: number }
  distance?: number
  pace_min?: number
  pace_max?: number
  max_participants: number
  current_participants: number
  run_date: string
  run_time: string
  status: 'scheduled' | 'active' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface UserPreferences {
  id: string
  user_id: string
  max_distance_miles: number
  age_min: number
  age_max: number
  gender_preference?: string
  created_at: string
  updated_at: string
}
