'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  icon?: ReactNode
  className?: string
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  className
}: ButtonProps) {
  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      color: 'white',
      shadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
      hoverShadow: '0 12px 25px rgba(37, 99, 235, 0.4)'
    },
    secondary: {
      background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
      color: 'white',
      shadow: '0 8px 20px rgba(107, 114, 128, 0.3)',
      hoverShadow: '0 12px 25px rgba(107, 114, 128, 0.4)'
    },
    success: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      shadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
      hoverShadow: '0 12px 25px rgba(16, 185, 129, 0.4)'
    },
    danger: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      shadow: '0 8px 20px rgba(239, 68, 68, 0.3)',
      hoverShadow: '0 12px 25px rgba(239, 68, 68, 0.4)'
    },
    ghost: {
      background: 'rgba(255, 255, 255, 0.9)',
      color: '#374151',
      shadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      hoverShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(229, 231, 235, 0.5)'
    }
  }

  const sizeStyles = {
    small: {
      padding: '8px 16px',
      fontSize: '14px',
      borderRadius: '8px'
    },
    medium: {
      padding: '12px 24px',
      fontSize: '16px',
      borderRadius: '12px'
    },
    large: {
      padding: '16px 32px',
      fontSize: '18px',
      borderRadius: '16px'
    }
  }

  const currentVariant = variantStyles[variant]
  const currentSize = sizeStyles[size]

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...currentVariant,
        ...currentSize,
        width: fullWidth ? '100%' : 'auto',
        border: 'none',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.2s ease',
        opacity: disabled || loading ? 0.6 : 1,
        position: 'relative',
        overflow: 'hidden'
      }}
      whileHover={!disabled && !loading ? {
        scale: 1.02,
        y: -2
      } : {}}
      whileTap={!disabled && !loading ? {
        scale: 0.98
      } : {}}
      onHoverStart={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.boxShadow = currentVariant.hoverShadow
        }
      }}
      onHoverEnd={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.boxShadow = currentVariant.shadow
        }
      }}
      className={className}
    >
      {loading && (
        <motion.div
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid transparent',
            borderTop: '2px solid currentColor',
            borderRadius: '50%',
            position: 'absolute'
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      )}
      
      {!loading && icon && (
        <span style={{ fontSize: '18px' }}>
          {icon}
        </span>
      )}
      
      <span style={{
        opacity: loading ? 0 : 1,
        transition: 'opacity 0.2s ease'
      }}>
        {children}
      </span>
    </motion.button>
  )
}
