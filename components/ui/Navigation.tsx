'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'discovery', label: 'Discover', icon: '🔍' },
    { id: 'matches', label: 'Matches', icon: '💕' },
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ]

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(229, 231, 235, 0.5)',
      padding: '16px 0 24px 0',
      zIndex: 1000,
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        maxWidth: '400px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '12px 16px',
              borderRadius: '16px',
              transition: 'all 0.2s ease',
              position: 'relative',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              minWidth: '60px'
            }}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  borderRadius: '16px',
                  border: '1px solid rgba(37, 99, 235, 0.2)'
                }}
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span style={{
              fontSize: '24px',
              marginBottom: '4px',
              position: 'relative',
              zIndex: 10,
              filter: activeTab === tab.id ? 'drop-shadow(0 2px 4px rgba(37, 99, 235, 0.3))' : 'none'
            }}>
              {tab.icon}
            </span>
            <span style={{
              fontSize: '12px',
              fontWeight: '600',
              position: 'relative',
              zIndex: 10,
              color: activeTab === tab.id ? '#2563eb' : '#6b7280',
              transition: 'color 0.2s ease'
            }}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
