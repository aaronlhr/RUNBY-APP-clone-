'use client'

import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="container">
      <motion.div
        className="content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="logo">🏃‍♀️</div>
        <h2 className="title">RUNBY</h2>
        <p className="subtitle">Find Your Running Partner</p>
        <div className="card">
          <h3 className="card-title">🚀 Development Ready!</h3>
          <p className="card-text">Your RUNBY app is running successfully!</p>
        </div>
      </motion.div>
    </div>
  )
}
