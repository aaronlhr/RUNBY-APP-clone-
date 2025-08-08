'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from '../lib/auth'
import Navigation from './ui/Navigation'
import DiscoveryPage from './matching/DiscoveryPage'
import LoginForm from './auth/LoginForm'
import SignupForm from './auth/SignupForm'
import ChatInterface from './chat/ChatInterface'
import LocationServices from './mobile/LocationServices'

type View = 'auth' | 'discovery' | 'matches' | 'chat' | 'profile'

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('auth')
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  // Redirect to discovery if user is authenticated
  if (isAuthenticated && currentView === 'auth') {
    setCurrentView('discovery')
  }

  const handleTabChange = (tab: string) => {
    if (!isAuthenticated) {
      setCurrentView('auth')
      return
    }
    
    switch (tab) {
      case 'discovery':
        setCurrentView('discovery')
        break
      case 'matches':
        setCurrentView('matches')
        break
      case 'chat':
        setCurrentView('chat')
        break
      case 'profile':
        setCurrentView('profile')
        break
    }
  }

  const renderView = () => {
    // Show loading state
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading RUNBY...</p>
          </div>
        </div>
      )
    }

    // Show authentication if not logged in
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
          <AnimatePresence mode="wait">
            {authMode === 'login' ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <LoginForm />
                <div className="text-center mt-4">
                  <button
                    onClick={() => setAuthMode('signup')}
                    className="text-primary-600 hover:text-primary-500 text-sm"
                  >
                    Don't have an account? Sign up
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <SignupForm />
                <div className="text-center mt-4">
                  <button
                    onClick={() => setAuthMode('login')}
                    className="text-primary-600 hover:text-primary-500 text-sm"
                  >
                    Already have an account? Sign in
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )
    }

    // Show main app views
    switch (currentView) {
      case 'discovery':
        return <DiscoveryPage />

      case 'matches':
        return (
          <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 pt-8 pb-20">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Your Matches</h1>
              <div className="max-w-md mx-auto">
                <div className="card text-center">
                  <div className="text-6xl mb-4">💕</div>
                  <h2 className="text-xl font-semibold mb-2">No Matches Yet</h2>
                  <p className="text-gray-600 mb-6">
                    Start swiping to find your running partners!
                  </p>
                  <button
                    onClick={() => setCurrentView('discovery')}
                    className="btn-primary"
                  >
                    Start Discovering
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'chat':
        return (
          <div className="h-screen pb-20">
            <ChatInterface
              matchId="1"
              currentUserId="current"
              otherUser={{
                id: "other",
                name: "Sarah Johnson",
                photo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face",
                isOnline: true
              }}
            />
          </div>
        )

      case 'profile':
        return (
          <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 pt-8 pb-20">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Profile</h1>
              <div className="max-w-md mx-auto space-y-6">
                <div className="card">
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-primary-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl">👤</span>
                    </div>
                    <h2 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
                    <p className="text-gray-600">{user?.location || 'Location not set'}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pace</span>
                      <span className="font-medium">{user?.preferredPace || 'Not set'}/mile</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Distance</span>
                      <span className="font-medium">{user?.preferredDistance || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subscription</span>
                      <span className="font-medium text-primary-600">{user?.subscriptionTier || 'Free'}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <button className="btn-primary w-full">
                      Edit Profile
                    </button>
                    <button className="btn-secondary w-full">
                      Upgrade to Premium
                    </button>
                    <button 
                      onClick={() => {
                        logout()
                        setCurrentView('auth')
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>

                {/* Location Services */}
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Location Services</h3>
                  <LocationServices 
                    onLocationUpdate={(location) => {
                      console.log('Location updated in profile:', location)
                    }}
                    onPermissionGranted={() => {
                      console.log('Location permission granted')
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
      
      {isAuthenticated && (
        <Navigation
          activeTab={currentView}
          onTabChange={handleTabChange}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
