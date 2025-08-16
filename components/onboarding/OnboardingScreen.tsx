'use client'

import { motion } from 'framer-motion'

interface OnboardingScreenProps {
  onComplete: () => void
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f3e8ff 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-15%',
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
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          textAlign: 'center',
          maxWidth: '500px',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
          style={{
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
            borderRadius: '50%',
            margin: '0 auto 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 40px rgba(236, 72, 153, 0.3)'
          }}
        >
          <span style={{ fontSize: '60px' }}>🏃‍♀️</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            fontSize: '48px',
            fontWeight: '800',
            color: '#1f2937',
            margin: '0 0 16px 0',
            lineHeight: '1.2',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Encuentra tu
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            compañero de running
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{
            fontSize: '20px',
            color: '#6b7280',
            margin: '0 0 60px 0',
            lineHeight: '1.6',
            fontWeight: '500'
          }}
        >
          Conecta con corredores en tu área y mantén la motivación juntos
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 25px 50px rgba(236, 72, 153, 0.4)'
          }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          style={{
            background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: '20px 60px',
            fontSize: '20px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 15px 35px rgba(236, 72, 153, 0.3)',
            transition: 'all 0.3s ease',
            minWidth: '280px'
          }}
        >
          Comenzar
        </motion.button>
      </motion.div>
    </div>
  )
}
