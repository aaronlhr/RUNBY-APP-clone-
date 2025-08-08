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
      className="w-80 h-96 bg-white rounded-2xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05 }}
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 relative">
          <img
            src={user.photo}
            alt={user.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-bold mb-2">
            {user.name}, {user.age}
          </h3>
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-blue-500 px-2 py-1 rounded-full text-xs">
              🏃‍♂️ {user.pace}/mile
            </span>
            <span className="bg-green-500 px-2 py-1 rounded-full text-xs">
              📏 {user.distance} miles
            </span>
          </div>
          <p className="text-sm opacity-90 line-clamp-2">{user.bio}</p>
        </div>
      </div>
    </motion.div>
  )
}
