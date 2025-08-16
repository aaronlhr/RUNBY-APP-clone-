'use client'

import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  color?: string
  text?: string
}

export default function LoadingSpinner({ 
  size = 'medium', 
  color = '#2563eb',
  text 
}: LoadingSpinnerProps) {
  const sizeMap = {
    small: 24,
    medium: 32,
    large: 48
  }

  const spinnerSize = sizeMap[size]

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    }}>
      <motion.div
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: `3px solid rgba(37, 99, 235, 0.1)`,
          borderTop: `3px solid ${color}`,
          borderRadius: '50%',
          position: 'relative'
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      {text && (
        <motion.p
          style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: 0,
            fontWeight: '500'
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}
