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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Location Status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: permission === 'granted' ? '#10b981' : 
                             permission === 'denied' ? '#ef4444' : '#f59e0b'
          }} />
          <div>
            <p style={{ fontWeight: '500', color: '#111827' }}>Location Services</p>
            <p style={{ 
              fontSize: '14px', 
              color: permission === 'granted' ? '#059669' : 
                     permission === 'denied' ? '#dc2626' : 
                     permission === 'prompt' ? '#d97706' : '#6b7280'
            }}>
              {getLocationStatusText()}
            </p>
          </div>
        </div>
        
        {isLoading && (
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid transparent',
            borderTop: '2px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        )}
      </div>

      {/* Location Coordinates */}
      {location && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '16px',
            backgroundColor: '#eff6ff',
            borderRadius: '8px'
          }}
        >
          <h3 style={{ fontWeight: '500', color: '#1e40af', marginBottom: '8px' }}>Current Location</h3>
          <div style={{ fontSize: '14px', color: '#1d4ed8' }}>
            <p style={{ marginBottom: '4px' }}><strong>Latitude:</strong> {location.lat.toFixed(6)}</p>
            <p><strong>Longitude:</strong> {location.lng.toFixed(6)}</p>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '16px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px'
          }}
        >
          <p style={{ fontSize: '14px', color: '#dc2626' }}>{error}</p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {permission === 'prompt' && (
          <button
            onClick={requestLocationPermission}
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: '#2563eb',
              color: 'white',
              fontWeight: '600',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1
            }}
          >
            {isLoading ? 'Getting Location...' : 'Enable Location Services'}
          </button>
        )}
        
        {permission === 'denied' && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
              Location access is required to find running partners near you.
            </p>
            <button
              onClick={() => {
                alert('Please enable location services in your browser settings to find running partners near you.')
              }}
              style={{
                fontSize: '14px',
                color: '#2563eb',
                textDecoration: 'underline',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Open Browser Settings
            </button>
          </div>
        )}
        
        {permission === 'granted' && location && (
          <button
            onClick={getCurrentLocation}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              color: '#374151',
              backgroundColor: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1
            }}
          >
            {isLoading ? 'Updating...' : 'Refresh Location'}
          </button>
        )}
      </div>

      {/* Location Benefits */}
      <div style={{
        padding: '16px',
        backgroundColor: '#eff6ff',
        borderRadius: '8px'
      }}>
        <h3 style={{ fontWeight: '500', color: '#1e40af', marginBottom: '8px' }}>Why Location Access?</h3>
        <ul style={{ fontSize: '14px', color: '#1d4ed8' }}>
          <li style={{ marginBottom: '4px' }}>• Find running partners in your area</li>
          <li style={{ marginBottom: '4px' }}>• Discover popular running routes nearby</li>
          <li style={{ marginBottom: '4px' }}>• Join local running groups and events</li>
          <li>• Get accurate distance calculations</li>
        </ul>
      </div>
    </div>
  )
}
