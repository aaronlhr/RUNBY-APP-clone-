'use client'

import { motion } from 'framer-motion'
import type { User } from '../../lib/supabase'

interface EnhancedSwipeCardProps {
  user: User
  onSwipe: (direction: 'left' | 'right') => void
  isActive: boolean
}

export default function EnhancedSwipeCard({ user, onSwipe, isActive }: EnhancedSwipeCardProps) {
  const formatPace = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}/mile`
  }

  return (
    <motion.div
      drag={isActive ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(event, info) => {
        const swipeThreshold = 100
        if (info.offset.x > swipeThreshold) {
          onSwipe('right')
        } else if (info.offset.x < -swipeThreshold) {
          onSwipe('left')
        }
      }}
      whileTap={{ scale: 0.95 }}
      style={{
        width: '100%',
        maxWidth: '400px',
        height: '600px',
        margin: '0 auto',
        borderRadius: '20px',
        overflow: 'hidden',
        backgroundColor: 'white',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
        cursor: isActive ? 'grab' : 'default'
      }}
    >
      {/* Background Image */}
      <div
        style={{
          width: '100%',
          height: '70%',
          backgroundImage: user.photos && user.photos[0] 
            ? `url(${user.photos[0]})`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60%',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
        }} />

        {/* User Info */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px',
          color: 'white'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            margin: '0 0 8px 0',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            {user.first_name} {user.last_name}
          </h2>
          
          {user.location && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '16px',
              opacity: 0.9
            }}>
              📍 {user.location}
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div style={{
        padding: '20px',
        height: '30%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {/* Bio */}
        {user.bio && (
          <p style={{
            fontSize: '16px',
            color: '#374151',
            margin: '0 0 12px 0',
            lineHeight: '1.5',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {user.bio}
          </p>
        )}

        {/* Running Stats */}
        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '12px'
        }}>
          {user.preferred_pace_min && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              🏃‍♂️ {formatPace(user.preferred_pace_min)}
            </div>
          )}
          
          {user.preferred_distance && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              📏 {user.preferred_distance}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => onSwipe('left')}
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
            onClick={() => onSwipe('right')}
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
    </motion.div>
  )
}
