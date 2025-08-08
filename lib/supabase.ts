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
  bio?: string
  photos?: string[]
  preferred_pace_min?: number
  preferred_pace_max?: number
  subscription_tier: 'free' | 'runner' | 'athlete' | 'champion'
  created_at: string
}

export interface Match {
  id: string
  user1_id: string
  user2_id: string
  status: 'active' | 'blocked'
  matched_at: string
}

export interface Message {
  id: string
  match_id: string
  sender_id: string
  content: string
  created_at: string
}
