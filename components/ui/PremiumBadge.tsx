'use client'

import { motion } from 'framer-motion'

interface PremiumBadgeProps {
  tier: 'free' | 'runner' | 'athlete' | 'champion'
  showUpgrade?: boolean
}

export default function PremiumBadge({ tier, showUpgrade = false }: PremiumBadgeProps) {
  const tierConfig = {
    free: { name: 'Free Runner', color: 'bg-gray-500', icon: '🏃‍♂️' },
    runner: { name: 'Runner', color: 'bg-blue-500', icon: '🏃‍♂️' },
    athlete: { name: 'Athlete', color: 'bg-purple-500', icon: '🏆' },
    champion: { name: 'Champion', color: 'bg-gold-500', icon: '👑' }
  }

  const config = tierConfig[tier]

  return (
    <motion.div
      className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium ${config.color}`}
      whileHover={{ scale: 1.05 }}
    >
      <span className="mr-1">{config.icon}</span>
      {config.name}
      {showUpgrade && tier === 'free' && (
        <button className="ml-2 text-xs underline hover:no-underline">
          Upgrade
        </button>
      )}
    </motion.div>
  )
}
