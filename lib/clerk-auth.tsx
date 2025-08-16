'use client'
import { useUser, useAuth } from '@clerk/nextjs'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { DatabaseService } from './database'
import type { User as DatabaseUser } from './supabase'

interface AuthContextType {
  user: DatabaseUser | null
  isLoading: boolean
  isAuthenticated: boolean
  syncUserToDatabase: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function ClerkAuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser()
  const { isSignedIn } = useAuth()
  const [user, setUser] = useState<DatabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const syncUserToDatabase = async () => {
    if (!clerkUser || !isSignedIn) return

    try {
      // Check if user exists in database
      let dbUser = await DatabaseService.getUserByClerkId(clerkUser.id)

      if (!dbUser) {
        // Create new user in database
        const userData = {
          clerk_user_id: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          first_name: clerkUser.firstName || '',
          last_name: clerkUser.lastName || '',
          age: undefined,
          location: undefined,
          bio: undefined,
          photos: clerkUser.imageUrl ? [clerkUser.imageUrl] : [],
          preferred_pace_min: undefined,
          preferred_pace_max: undefined,
          preferred_distance: undefined,
          running_times: [],
          subscription_tier: 'free' as const,
          is_verified: false,
          is_online: true,
        }

        dbUser = await DatabaseService.createUser(userData)
      } else {
        // Update existing user's online status
        await DatabaseService.updateUser(clerkUser.id, {
          is_online: true,
          last_seen: new Date().toISOString(),
        })
      }

      if (dbUser) {
        setUser(dbUser)
      }
    } catch (error) {
      console.error('Error syncing user to database:', error)
    }
  }

  useEffect(() => {
    if (clerkLoaded) {
      if (isSignedIn && clerkUser) {
        syncUserToDatabase()
      } else {
        setUser(null)
      }
      setIsLoading(false)
    }
  }, [clerkLoaded, isSignedIn, clerkUser])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: isSignedIn,
    syncUserToDatabase,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useClerkAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useClerkAuth must be used within a ClerkAuthProvider')
  }
  return context
}
