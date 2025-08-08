'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface LocationServicesProps {
  onLocationUpdate?: (location: { lat: number; lng: number }) => void
  onPermissionGranted?: () => void
}

export default function LocationServices({ onLocationUpdate, onPermissionGranted }: LocationServicesProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkLocationPermission()
  }, [])

  const checkLocationPermission = async () => {
    if (!navigator.permissions) {
      setPermission('unknown')
      return
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName })
      setPermission(result.state as any)
      
      if (result.state === 'granted') {
        onPermissionGranted?.()
        getCurrentLocation()
      }
    } catch (err) {
      console.error('Error checking location permission:', err)
      setPermission('unknown')
    }
  }

  const getCurrentLocation = () => {
    setIsLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser')
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const newLocation = { lat: latitude, lng: longitude }
        
        setLocation(newLocation)
        onLocationUpdate?.(newLocation)
        setIsLoading(false)
        
        console.log('Location updated:', newLocation)
      },
      (error) => {
        console.error('Error getting location:', error)
        setError(getLocationErrorMessage(error.code))
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }

  const requestLocationPermission = () => {
    getCurrentLocation()
  }

  const getLocationErrorMessage = (code: number): string => {
    switch (code) {
      case 1:
        return 'Location access denied. Please enable location services in your browser settings.'
      case 2:
        return 'Location unavailable. Please check your GPS settings.'
      case 3:
        return 'Location request timed out. Please try again.'
      default:
        return 'Unable to get your location. Please try again.'
    }
  }

  const getLocationStatusText = () => {
    switch (permission) {
      case 'granted':
        return location ? 'Location enabled' : 'Getting location...'
      case 'denied':
        return 'Location access denied'
      case 'prompt':
        return 'Location permission needed'
      default:
        return 'Checking location...'
    }
  }

  const getLocationStatusColor = () => {
    switch (permission) {
      case 'granted':
        return 'text-green-600'
      case 'denied':
        return 'text-red-600'
      case 'prompt':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-4">
      {/* Location Status */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            permission === 'granted' ? 'bg-green-500' : 
            permission === 'denied' ? 'bg-red-500' : 
            'bg-yellow-500'
          }`} />
          <div>
            <p className="font-medium text-gray-900">Location Services</p>
            <p className={`text-sm ${getLocationStatusColor()}`}>
              {getLocationStatusText()}
            </p>
          </div>
        </div>
        
        {isLoading && (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600" />
        )}
      </div>

      {/* Location Coordinates */}
      {location && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-primary-50 rounded-lg"
        >
          <h3 className="font-medium text-primary-900 mb-2">Current Location</h3>
          <div className="text-sm text-primary-700 space-y-1">
            <p><strong>Latitude:</strong> {location.lat.toFixed(6)}</p>
            <p><strong>Longitude:</strong> {location.lng.toFixed(6)}</p>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-sm text-red-700">{error}</p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        {permission === 'prompt' && (
          <button
            onClick={requestLocationPermission}
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {isLoading ? 'Getting Location...' : 'Enable Location Services'}
          </button>
        )}
        
        {permission === 'denied' && (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              Location access is required to find running partners near you.
            </p>
            <button
              onClick={() => window.open('chrome://settings/content/location', '_blank')}
              className="text-sm text-primary-600 hover:text-primary-500 underline"
            >
              Open Browser Settings
            </button>
          </div>
        )}
        
        {permission === 'granted' && location && (
          <button
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Refresh Location'}
          </button>
        )}
      </div>

      {/* Location Benefits */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Why Location Access?</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Find running partners in your area</li>
          <li>• Discover popular running routes nearby</li>
          <li>• Join local running groups and events</li>
          <li>• Get accurate distance calculations</li>
        </ul>
      </div>
    </div>
  )
}
