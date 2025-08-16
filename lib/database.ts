import { createClient } from '@supabase/supabase-js'
import type { User, UserPreferences } from './supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create a client with service role key (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export class DatabaseService {
  // User operations
  static async createUser(userData: Partial<User>): Promise<User | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert([userData])
        .select()
        .single()

      if (error) {
        console.error('Error creating user:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error creating user:', error)
      return null
    }
  }

  static async getUserByClerkId(clerkUserId: string): Promise<User | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('clerk_user_id', clerkUserId)
        .single()

      if (error) {
        console.error('Error fetching user:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  }

  static async updateUser(clerkUserId: string, updates: Partial<User>): Promise<User | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .update(updates)
        .eq('clerk_user_id', clerkUserId)
        .select()
        .single()

      if (error) {
        console.error('Error updating user:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error updating user:', error)
      return null
    }
  }

  static async getUsersForMatching(currentUserId: string, preferences: UserPreferences): Promise<User[]> {
    try {
      // Get users within distance and age range
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .neq('clerk_user_id', currentUserId)
        .gte('age', preferences.age_min)
        .lte('age', preferences.age_max)
        .eq('is_online', true)
        .limit(50)

      if (error) {
        console.error('Error fetching users for matching:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching users for matching:', error)
      return []
    }
  }

  // User preferences operations
  static async createUserPreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .insert([preferences])
        .select()
        .single()

      if (error) {
        console.error('Error creating user preferences:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error creating user preferences:', error)
      return null
    }
  }

  static async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching user preferences:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching user preferences:', error)
      return null
    }
  }

  static async updateUserPreferences(userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('Error updating user preferences:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error updating user preferences:', error)
      return null
    }
  }
}
