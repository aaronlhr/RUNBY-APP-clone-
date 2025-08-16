'use client'

import { motion, useMotionValue, useTransform } from 'framer-motion'

interface SwipeCardProps {
  user: {
    id: string
    name: string
    age: number
    pace: string
    distance: string
    photo: string
    bio: string
  }
  onSwipe: (userId: string, direction: 'like' | 'pass') => void
}

export default function SwipeCard({ user, onSwipe }: SwipeCardProps) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const handleDragEnd = () => {
    const threshold = 100
    if (x.get() > threshold) {
      onSwipe(user.id, 'like')
    } else if (x.get() < -threshold) {
      onSwipe(user.id, 'pass')
    }
  }

  return (
    <motion.div
      style={{
        width: '100%',
        maxWidth: '400px',
        height: '600px',
        margin: '0 auto',
        borderRadius: '20px',
        overflow: 'hidden',
        backgroundColor: 'white',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        border: '1px solid #e5e7eb',
        cursor: 'grab',
        position: 'relative',
        x,
        rotate,
        opacity
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05 }}
    >
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <img
            src={user.photo}
            alt={user.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
          }} />
        </div>
        
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px',
          color: 'white'
        }}>
          <h3 style={{
            fontSize: '28px',
            fontWeight: '700',
            margin: '0 0 12px 0',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            {user.name}, {user.age}
          </h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
            flexWrap: 'wrap'
          }}>
            <span style={{
              backgroundColor: 'rgba(59, 130, 246, 0.9)',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              backdropFilter: 'blur(10px)'
            }}>
              🏃‍♂️ {user.pace}/mile
            </span>
            <span style={{
              backgroundColor: 'rgba(16, 185, 129, 0.9)',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              backdropFilter: 'blur(10px)'
            }}>
              📏 {user.distance} miles
            </span>
          </div>
          <p style={{
            fontSize: '14px',
            opacity: 0.9,
            lineHeight: '1.5',
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {user.bio}
          </p>
        </div>
      </div>

      {/* Swipe Indicators */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '20px',
          transform: 'translateY(-50%)',
          fontSize: '48px',
          color: '#ef4444',
          opacity: 0,
          pointerEvents: 'none',
          textShadow: '0 4px 8px rgba(0,0,0,0.3)'
        }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        ✕
      </motion.div>
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          right: '20px',
          transform: 'translateY(-50%)',
          fontSize: '48px',
          color: '#10b981',
          opacity: 0,
          pointerEvents: 'none',
          textShadow: '0 4px 8px rgba(0,0,0,0.3)'
        }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, delay: 0.25 }}
      >
        ♥
      </motion.div>
    </motion.div>
  )
}
