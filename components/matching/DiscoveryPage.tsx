'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SwipeCard from './SwipeCard'

interface User {
  id: string
  name: string
  age: number
  pace: string
  distance: string
  photo: string
  bio: string
  location: string
  runningTimes: string[]
}

// Mock data for development
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 28,
    pace: '8:30',
    distance: '5K',
    photo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop',
    bio: 'Love morning runs along the beach! Training for my first half marathon. Looking for a running buddy to keep me motivated.',
    location: 'San Francisco, CA',
    runningTimes: ['morning', 'evening']
  },
  {
    id: '2',
    name: 'Mike Chen',
    age: 32,
    pace: '7:15',
    distance: '10K',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
    bio: 'Serious runner training for Boston Marathon. Prefer early morning runs and long weekend sessions.',
    location: 'San Francisco, CA',
    runningTimes: ['morning', 'weekend']
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    age: 25,
    pace: '9:00',
    distance: '5K',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop',
    bio: 'Just getting back into running after a break. Looking for someone to run with in Golden Gate Park!',
    location: 'San Francisco, CA',
    runningTimes: ['evening', 'weekend']
  },
  {
    id: '4',
    name: 'David Kim',
    age: 30,
    pace: '6:45',
    distance: 'Half Marathon',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop',
    bio: 'Competitive runner who loves trail running. Always up for a challenge and new routes.',
    location: 'San Francisco, CA',
    runningTimes: ['morning', 'afternoon']
  }
]

export default function DiscoveryPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [matches, setMatches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSwipe = async (userId: string, direction: 'like' | 'pass') => {
    setIsLoading(true)
    
    // TODO: Implement actual matching logic with Supabase
    console.log(`Swiped ${direction} on user ${userId}`)
    
    if (direction === 'like') {
      // Simulate match (50% chance)
      if (Math.random() > 0.5) {
        setMatches(prev => [...prev, userId])
        // Show match notification
        setTimeout(() => {
          alert('It\'s a match! 🎉')
        }, 500)
      }
    }
    
    // Move to next user
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1)
      setIsLoading(false)
    }, 300)
  }

  const handleLike = () => {
    if (currentIndex < users.length) {
      handleSwipe(users[currentIndex].id, 'like')
    }
  }

  const handlePass = () => {
    if (currentIndex < users.length) {
      handleSwipe(users[currentIndex].id, 'pass')
    }
  }

  const currentUser = users[currentIndex]

  if (currentIndex >= users.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-6">🏃‍♀️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No More Runners Nearby
          </h2>
          <p className="text-gray-600 mb-8 max-w-md">
            You've seen all the runners in your area! Check back later for new matches, or try expanding your search radius.
          </p>
          <button
            onClick={() => setCurrentIndex(0)}
            className="btn-primary"
          >
            Refresh
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Runners</h1>
          <p className="text-gray-600">
            Swipe right to like, left to pass
          </p>
        </div>

        {/* Progress */}
        <div className="max-w-sm mx-auto mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{currentIndex + 1} of {users.length}</span>
            <span>{Math.round(((currentIndex + 1) / users.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / users.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Swipe Card */}
        <div className="flex justify-center mb-8">
          <AnimatePresence>
            {currentUser && (
              <motion.div
                key={currentUser.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <SwipeCard
                  user={currentUser}
                  onSwipe={handleSwipe}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePass}
            disabled={isLoading}
            className="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center disabled:opacity-50"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            disabled={isLoading}
            className="w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center disabled:opacity-50"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </motion.button>
        </div>

        {/* User Info */}
        {currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-sm mx-auto mt-8"
          >
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">{currentUser.name}, {currentUser.age}</h3>
              <div className="flex items-center space-x-2 mb-3">
                <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs">
                  🏃‍♂️ {currentUser.pace}/mile
                </span>
                <span className="bg-secondary-100 text-secondary-800 px-2 py-1 rounded-full text-xs">
                  📏 {currentUser.distance}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{currentUser.bio}</p>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {currentUser.location}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
