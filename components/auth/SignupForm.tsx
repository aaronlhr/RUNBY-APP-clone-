'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../lib/auth'

export default function SignupForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    age: '',
    bio: '',
    preferredPace: '8:00',
    preferredDistance: '5k',
    runningTimes: ['morning', 'evening'],
    location: ''
  })
  const [error, setError] = useState('')
  const { signup, isLoading } = useAuth()

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateStep = (currentStep: number): boolean => {
    setError('')
    
    switch (currentStep) {
      case 1:
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
          setError('Please fill in all required fields')
          return false
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          return false
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long')
          return false
        }
        if (!formData.email.includes('@')) {
          setError('Please enter a valid email address')
          return false
        }
        break
      case 2:
        if (!formData.age) {
          setError('Please enter your age')
          return false
        }
        const age = parseInt(formData.age)
        if (age < 18 || age > 100) {
          setError('Age must be between 18 and 100')
          return false
        }
        break
      case 3:
        if (!formData.location) {
          setError('Please enter your location')
          return false
        }
        break
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(step)) {
      return
    }
    
    if (step < 3) {
      setStep(step + 1)
      return
    }

    // Final step - create account
    const success = await signup(formData)
    
    if (!success) {
      setError('Failed to create account. Please try again.')
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="input-field"
            placeholder="John"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="input-field"
            placeholder="Doe"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="input-field"
          placeholder="john@example.com"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password *
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          className="input-field"
          placeholder="Create a secure password"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password *
        </label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          className="input-field"
          placeholder="Confirm your password"
          required
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Age *
        </label>
        <input
          type="number"
          value={formData.age}
          onChange={(e) => handleInputChange('age', e.target.value)}
          className="input-field"
          placeholder="25"
          min="18"
          max="100"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          className="input-field"
          rows={3}
          placeholder="Tell other runners about yourself..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Pace (per mile)
        </label>
        <select
          value={formData.preferredPace}
          onChange={(e) => handleInputChange('preferredPace', e.target.value)}
          className="input-field"
        >
          <option value="6:00">6:00 - Very Fast</option>
          <option value="7:00">7:00 - Fast</option>
          <option value="8:00">8:00 - Moderate</option>
          <option value="9:00">9:00 - Easy</option>
          <option value="10:00">10:00 - Very Easy</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Distance
        </label>
        <select
          value={formData.preferredDistance}
          onChange={(e) => handleInputChange('preferredDistance', e.target.value)}
          className="input-field"
        >
          <option value="5k">5K</option>
          <option value="10k">10K</option>
          <option value="half-marathon">Half Marathon</option>
          <option value="marathon">Marathon</option>
          <option value="ultra">Ultra</option>
        </select>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          When do you like to run?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {['morning', 'afternoon', 'evening', 'night'].map((time) => (
            <label key={time} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.runningTimes.includes(time)}
                onChange={(e) => {
                  const newTimes = e.target.checked
                    ? [...formData.runningTimes, time]
                    : formData.runningTimes.filter(t => t !== time)
                  handleInputChange('runningTimes', newTimes)
                }}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700 capitalize">{time}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location (City, State) *
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          className="input-field"
          placeholder="San Francisco, CA"
          required
        />
      </div>
      
      <div className="bg-primary-50 p-4 rounded-lg">
        <h4 className="font-medium text-primary-900 mb-2">🎯 Your Running Profile</h4>
        <div className="text-sm text-primary-700 space-y-1">
          <p><strong>Pace:</strong> {formData.preferredPace}/mile</p>
          <p><strong>Distance:</strong> {formData.preferredDistance}</p>
          <p><strong>Times:</strong> {formData.runningTimes.join(', ')}</p>
          <p><strong>Location:</strong> {formData.location || 'Not set'}</p>
        </div>
      </div>
    </div>
  )

  const getStepContent = () => {
    switch (step) {
      case 1: return renderStep1()
      case 2: return renderStep2()
      case 3: return renderStep3()
      default: return renderStep1()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="card">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🏃‍♀️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Join RUNBY</h2>
          <p className="text-gray-600">Create your account and find running partners</p>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {step} of 3</span>
            <span>{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-700">{error}</p>
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {getStepContent()}
          
          <div className="flex justify-between pt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                ← Back
              </button>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {step === 3 ? 'Creating Account...' : 'Next'}
                </div>
              ) : (
                step === 3 ? 'Create Account' : 'Next'
              )}
            </button>
          </div>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </a>
        </p>
      </div>
    </motion.div>
  )
}
