'use client'

import { motion } from 'framer-motion'
import type { User } from '../../lib/supabase'

interface ProfileScreenProps {
  user: User
  onEditProfile: () => void
}

export default function ProfileScreen({ user, onEditProfile }: ProfileScreenProps) {
  const formatPace = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}/km`
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f3e8ff 100%)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-30%',
        right: '-10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '-5%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        zIndex: 0
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          width: '100%',
          maxWidth: '400px',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Large Circular Photo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
          style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            margin: '40px auto 32px',
            background: user.photos && user.photos[0]
              ? `url(${user.photos[0]})`
              : 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '6px solid white',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            position: 'relative'
          }}
        >
          {/* Edit photo indicator */}
          <div style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}>
            <span style={{ fontSize: '16px' }}>📷</span>
          </div>
        </motion.div>

        {/* Profile Info - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            textAlign: 'center',
            marginBottom: '40px'
          }}
        >
          {/* Name */}
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            color: '#1f2937',
            margin: '0 0 8px 0',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {user.first_name} {user.last_name}
          </h1>

          {/* Email */}
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            margin: '0 0 24px 0',
            fontWeight: '500'
          }}>
            📧 {user.email}
          </p>

          {/* Location */}
          {user.location && (
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              margin: '0 0 32px 0',
              fontWeight: '500'
            }}>
              📍 {user.location}
            </p>
          )}
        </motion.div>

        {/* Profile Data Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '40px'
          }}
        >
          {/* Pace Card */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{
              fontSize: '24px',
              marginBottom: '8px'
            }}>
              🏃‍♂️
            </div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#6b7280',
              margin: '0 0 8px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Ritmo Preferido
            </h3>
            <p style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1f2937',
              margin: 0
            }}>
              {user.preferred_pace_min ? formatPace(user.preferred_pace_min) : 'No establecido'}
            </p>
          </div>

          {/* Distance Card */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{
              fontSize: '24px',
              marginBottom: '8px'
            }}>
              📏
            </div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#6b7280',
              margin: '0 0 8px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Distancia Preferida
            </h3>
            <p style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1f2937',
              margin: 0
            }}>
              {user.preferred_distance || 'No establecida'}
            </p>
          </div>

          {/* Running Times Card */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{
              fontSize: '24px',
              marginBottom: '8px'
            }}>
              ⏰
            </div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#6b7280',
              margin: '0 0 8px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Horarios de Running
            </h3>
            <p style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1f2937',
              margin: 0
            }}>
              {user.running_times && user.running_times.length > 0 
                ? user.running_times.join(', ') 
                : 'No establecidos'}
            </p>
          </div>

          {/* Bio Card */}
          {user.bio && (
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                fontSize: '24px',
                marginBottom: '8px'
              }}>
                💬
              </div>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#6b7280',
                margin: '0 0 8px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Sobre Mí
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                margin: 0,
                lineHeight: '1.5'
              }}>
                {user.bio}
              </p>
            </div>
          )}
        </motion.div>

        {/* Action Button - Bottom */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 20px 40px rgba(236, 72, 153, 0.4)'
          }}
          whileTap={{ scale: 0.98 }}
          onClick={onEditProfile}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: '18px 32px',
            fontSize: '18px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 15px 35px rgba(236, 72, 153, 0.3)',
            transition: 'all 0.3s ease',
            marginBottom: '20px'
          }}
        >
          ✏️ Editar Perfil
        </motion.button>
      </motion.div>
    </div>
  )
}
