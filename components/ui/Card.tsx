'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'glass' | 'elevated' | 'outlined'
  padding?: 'none' | 'small' | 'medium' | 'large'
  onClick?: () => void
  hover?: boolean
  className?: string
}

export default function Card({
  children,
  variant = 'default',
  padding = 'medium',
  onClick,
  hover = false,
  className
}: CardProps) {
  const variantStyles = {
    default: {
      backgroundColor: 'white',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(229, 231, 235, 0.5)'
    },
    glass: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    elevated: {
      backgroundColor: 'white',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      border: 'none'
    },
    outlined: {
      backgroundColor: 'transparent',
      boxShadow: 'none',
      border: '2px solid rgba(229, 231, 235, 0.8)'
    }
  }

  const paddingStyles = {
    none: '0',
    small: '16px',
    medium: '24px',
    large: '32px'
  }

  const currentVariant = variantStyles[variant]
  const currentPadding = paddingStyles[padding]

  return (
    <motion.div
      onClick={onClick}
      style={{
        ...currentVariant,
        padding: currentPadding,
        borderRadius: '20px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
      whileHover={hover || onClick ? {
        scale: 1.02,
        y: -4
      } : {}}
      whileTap={onClick ? {
        scale: 0.98
      } : {}}
      onHoverStart={(e) => {
        if (hover || onClick) {
          e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)'
        }
      }}
      onHoverEnd={(e) => {
        if (hover || onClick) {
          e.currentTarget.style.boxShadow = currentVariant.boxShadow
        }
      }}
      className={className}
    >
      {/* Subtle gradient overlay for glass effect */}
      {variant === 'glass' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          pointerEvents: 'none'
        }} />
      )}
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </motion.div>
  )
}
