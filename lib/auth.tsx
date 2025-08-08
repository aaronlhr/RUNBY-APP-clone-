'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  age?: number
  bio?: string
  preferredPace?: string
  preferredDistance?: string
  location?: string
  runningTimes?: string[]
  subscriptionTier?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (userData: any) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data for development
const mockUsers = [
  {
    id: '1',
    email: 'demo@runby.com',
    password: 'demo123',
    firstName: 'John',
    lastName: 'Doe',
    age: 28,
    bio: 'Love morning runs and training for my first marathon!',
    preferredPace: '8:00',
    preferredDistance: '5K',
    location: 'San Francisco, CA',
    runningTimes: ['morning', 'evening'],
    subscriptionTier: 'free'
  },
  {
    id: '2',
    email: 'sarah@runby.com',
    password: 'demo123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    age: 25,
    bio: 'Casual runner looking for motivation and running buddies!',
    preferredPace: '9:00',
    preferredDistance: '5K',
    location: 'San Francisco, CA',
    runningTimes: ['evening', 'weekend'],
    subscriptionTier: 'free'
  }
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('runby_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('runby_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Find user in mock data
      const foundUser = mockUsers.find(u => u.email === email && u.password === password)
      
      if (foundUser) {
        // Remove password from user object
        const { password: _, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        localStorage.setItem('runby_user', JSON.stringify(userWithoutPassword))
        return true
      } else {
        throw new Error('Invalid email or password')
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData: any): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === userData.email)
      if (existingUser) {
        throw new Error('User with this email already exists')
      }
      
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        age: parseInt(userData.age) || undefined,
        bio: userData.bio || '',
        preferredPace: userData.preferredPace || '8:00',
        preferredDistance: userData.preferredDistance || '5K',
        location: userData.location || '',
        runningTimes: userData.runningTimes || ['morning', 'evening'],
        subscriptionTier: 'free'
      }
      
      setUser(newUser)
      localStorage.setItem('runby_user', JSON.stringify(newUser))
      return true
    } catch (error) {
      console.error('Signup error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('runby_user')
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem('runby_user', JSON.stringify(updatedUser))
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
