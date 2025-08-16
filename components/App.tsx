'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import Navigation from './ui/Navigation'
import DiscoveryPage from './matching/DiscoveryPage'
import RealTimeChatInterface from './chat/RealTimeChatInterface'
import LocationServices from './mobile/LocationServices'
import OnboardingScreen from './onboarding/OnboardingScreen'
import SwipeDeck from './matching/SwipeDeck'
import ProfileScreen from './profile/ProfileScreen'

type View = 'discovery' | 'matches' | 'chat' | 'profile'

export default function App() {
  const [currentView, setCurrentView] = useState<View>('discovery')
  const { user } = useUser()

           // Use Clerk user data or fallback to mock data
         const userData = user ? {
           id: 'e72884d7-1c9e-4c19-82b2-ab1b875fd6a8', // Use the test user ID for now
           clerk_user_id: user.id,
           email: user.emailAddresses[0]?.emailAddress || '',
           first_name: user.firstName || 'User',
           last_name: user.lastName || '',
           location: 'San Francisco, CA', // Could be from user metadata
           preferred_pace_min: 480,
           preferred_distance: '5k',
           subscription_tier: 'free',
           is_verified: false,
           is_online: true,
           last_seen: new Date().toISOString(),
           created_at: new Date().toISOString(),
           updated_at: new Date().toISOString()
         } : {
           id: 'e72884d7-1c9e-4c19-82b2-ab1b875fd6a8',
           clerk_user_id: 'test_user',
           email: 'test@example.com',
           first_name: 'John',
           last_name: 'Doe',
           location: 'San Francisco, CA',
           preferred_pace_min: 480,
           preferred_distance: '5k',
           subscription_tier: 'free',
           is_verified: false,
           is_online: true,
           last_seen: new Date().toISOString(),
           created_at: new Date().toISOString(),
           updated_at: new Date().toISOString()
         }

  const handleTabChange = (tab: string) => {
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
    switch (currentView) {
      case 'discovery':
        return (
          <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
            paddingTop: '32px',
            paddingBottom: '80px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background decoration */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-20%',
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              zIndex: 0
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-30%',
              left: '-10%',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              zIndex: 0
            }} />
            
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', position: 'relative', zIndex: 1 }}>
              <h1 style={{
                fontSize: '36px',
                fontWeight: '800',
                textAlign: 'center',
                color: '#1f2937',
                marginBottom: '8px',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>Discover Running Partners</h1>
              <p style={{
                fontSize: '18px',
                textAlign: 'center',
                color: '#6b7280',
                marginBottom: '40px',
                fontWeight: '500'
              }}>Desliza para encontrar tu compañero perfecto</p>
              
              <SwipeDeck currentUserId={userData.id} />
            </div>
          </div>
        )

                   case 'matches':
               return (
                 <div style={{
                   minHeight: '100vh',
                   background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
                   paddingTop: '32px',
                   paddingBottom: '80px'
                 }}>
                   <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
                     <h1 style={{
                       fontSize: '32px',
                       fontWeight: 'bold',
                       textAlign: 'center',
                       color: '#1f2937',
                       marginBottom: '32px',
                       textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                     }}>Your Matches</h1>
                     <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                       <div style={{
                         backgroundColor: 'rgba(255, 255, 255, 0.9)',
                         backdropFilter: 'blur(20px)',
                         borderRadius: '20px',
                         padding: '40px 32px',
                         boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                         textAlign: 'center',
                         border: '1px solid rgba(255, 255, 255, 0.2)'
                       }}>
                         <div style={{
                           fontSize: '80px',
                           marginBottom: '20px',
                           filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                         }}>
                           💕
                         </div>
                         <h2 style={{
                           fontSize: '24px',
                           fontWeight: '700',
                           marginBottom: '12px',
                           color: '#1f2937'
                         }}>No Matches Yet</h2>
                         <p style={{
                           color: '#6b7280',
                           marginBottom: '32px',
                           fontSize: '16px',
                           lineHeight: '1.5'
                         }}>
                           Start swiping to find your perfect running partners!
                         </p>
                         <button
                           onClick={() => setCurrentView('discovery')}
                           style={{
                             background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                             color: 'white',
                             fontWeight: '600',
                             padding: '16px 32px',
                             borderRadius: '12px',
                             border: 'none',
                             cursor: 'pointer',
                             fontSize: '16px',
                             boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
                             transition: 'all 0.2s ease'
                           }}
                           onMouseEnter={(e) => {
                             e.currentTarget.style.transform = 'translateY(-2px)'
                             e.currentTarget.style.boxShadow = '0 12px 25px rgba(37, 99, 235, 0.4)'
                           }}
                           onMouseLeave={(e) => {
                             e.currentTarget.style.transform = 'translateY(0)'
                             e.currentTarget.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.3)'
                           }}
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
          <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
            paddingTop: '32px',
            paddingBottom: '80px'
          }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
              <h1 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#1f2937',
                marginBottom: '32px',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>Real-time Chat</h1>
              <div style={{
                maxWidth: '600px',
                margin: '0 auto',
                height: '70vh',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <RealTimeChatInterface
                  matchId="078cd1cf-b26d-479d-8f3b-7b9e89c439bb"
                  currentUser={userData}
                  otherUser={{
                    id: "other",
                    clerk_user_id: "other_user",
                    email: "sarah@example.com",
                    first_name: "Sarah",
                    last_name: "Johnson",
                    age: 28,
                    location: "San Francisco, CA",
                    bio: "Love running in the morning!",
                    photos: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face"],
                    preferred_pace_min: 450,
                    preferred_pace_max: 540,
                    preferred_distance: "5k",
                    running_times: ["morning"],
                    subscription_tier: "free" as const,
                    is_verified: true,
                    is_online: true,
                    last_seen: new Date().toISOString(),
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  }}
                />
              </div>
            </div>
          </div>
        )

      case 'profile':
        return (
          <ProfileScreen 
            user={userData}
            onEditProfile={() => {
              alert('Edit Profile feature coming soon!')
            }}
          />
        )

      default:
        return null
    }
  }

  return (
    <div style={{ position: 'relative' }}>
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
      
      <Navigation
        activeTab={currentView}
        onTabChange={handleTabChange}
      />
    </div>
  )
}
