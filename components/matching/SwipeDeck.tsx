'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { User } from '../../lib/supabase'

interface SwipeDeckProps {
  currentUserId: string
}

export default function SwipeDeck({ currentUserId }: SwipeDeckProps) {
  const [users, setUsers] = useState<User[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPotentialMatches()
  }, [currentUserId])

  const fetchPotentialMatches = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/matching/potential-matches?userId=${currentUserId}&limit=10`)
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.data)
      }
    } catch (error) {
      console.error('Error fetching potential matches:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (currentIndex >= users.length) return

    const currentUser = users[currentIndex]
    
    if (direction === 'right') {
      // Create match
      try {
        await fetch('/api/trigger-match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user1Id: currentUserId,
            user2Id: currentUser.id
          })
        })
      } catch (error) {
        console.error('Error creating match:', error)
      }
    }

    setCurrentIndex(prev => prev + 1)
  }

  const formatPace = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}/km`
  }

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #f3f4f6',
          borderTop: '3px solid #ec4899',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    )
  }

  if (currentIndex >= users.length) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        textAlign: 'center',
        padding: '40px'
      }}>
        <div style={{
          fontSize: '80px',
          marginBottom: '20px',
          opacity: 0.5
        }}>
          🏃‍♀️
        </div>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#374151',
          margin: '0 0 12px 0'
        }}>
          No hay más perfiles
        </h3>
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          margin: '0 0 24px 0'
        }}>
          Vuelve más tarde para ver nuevos corredores
        </p>
        <button
          onClick={() => {
            setCurrentIndex(0)
            fetchPotentialMatches()
          }}
          style={{
            background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(236, 72, 153, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 12px 25px rgba(236, 72, 153, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(236, 72, 153, 0.3)'
          }}
        >
          Recargar
        </button>
      </div>
    )
  }

  const currentUser = users[currentIndex]

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      padding: '20px'
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentUser.id}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.3 }}
          style={{
            width: '100%',
            maxWidth: '350px',
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Profile Image */}
          <div style={{
            width: '100%',
            height: '200px',
            background: currentUser.photos && currentUser.photos[0]
              ? `url(${currentUser.photos[0]})`
              : 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60%',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.3))'
            }} />
          </div>

          {/* Profile Info */}
          <div style={{
            padding: '24px',
            textAlign: 'center'
          }}>
            {/* Circular Avatar */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              margin: '-60px auto 16px',
              background: currentUser.photos && currentUser.photos[0]
                ? `url(${currentUser.photos[0]})`
                : 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '4px solid white',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
              position: 'relative',
              zIndex: 1
            }} />

            {/* Name */}
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              {currentUser.first_name} {currentUser.last_name}
            </h3>

            {/* Pace */}
            {currentUser.preferred_pace_min && (
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                margin: '0 0 16px 0',
                fontWeight: '500'
              }}>
                🏃‍♂️ {formatPace(currentUser.preferred_pace_min)}
              </p>
            )}

            {/* Location */}
            {currentUser.location && (
              <p style={{
                fontSize: '14px',
                color: '#9ca3af',
                margin: '0 0 20px 0'
              }}>
                📍 {currentUser.location}
              </p>
            )}

            {/* Bio */}
            {currentUser.bio && (
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.5',
                margin: 0
              }}>
                {currentUser.bio}
              </p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Swipe Actions */}
      <div style={{
        display: 'flex',
        gap: '20px',
        marginTop: '20px'
      }}>
        <button
          onClick={() => handleSwipe('left')}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: '3px solid #ef4444',
            backgroundColor: 'white',
            color: '#ef4444',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
            e.currentTarget.style.backgroundColor = '#ef4444'
            e.currentTarget.style.color = 'white'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.backgroundColor = 'white'
            e.currentTarget.style.color = '#ef4444'
          }}
        >
          ✕
        </button>

        <button
          onClick={() => handleSwipe('right')}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: '3px solid #10b981',
            backgroundColor: 'white',
            color: '#10b981',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
            e.currentTarget.style.backgroundColor = '#10b981'
            e.currentTarget.style.color = 'white'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.backgroundColor = 'white'
            e.currentTarget.style.color = '#10b981'
          }}
        >
          ♥
        </button>
      </div>
    </div>
  )
}
