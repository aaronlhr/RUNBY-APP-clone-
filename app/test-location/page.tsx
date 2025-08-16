'use client'

import { useState, useEffect } from 'react'

export default function TestLocationPage() {
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          Location Services Test
        </h1>

        {/* Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          marginBottom: '24px'
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
              <p style={{ fontWeight: '500', color: '#111827' }}>Location Permission</p>
              <p style={{ 
                fontSize: '14px', 
                color: permission === 'granted' ? '#059669' : 
                       permission === 'denied' ? '#dc2626' : 
                       permission === 'prompt' ? '#d97706' : '#6b7280'
              }}>
                {permission === 'granted' ? 'Granted' : 
                 permission === 'denied' ? 'Denied' : 
                 permission === 'prompt' ? 'Prompt' : 'Unknown'}
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
          <div style={{
            padding: '16px',
            backgroundColor: '#eff6ff',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <h3 style={{ fontWeight: '500', color: '#1e40af', marginBottom: '8px' }}>Current Location</h3>
            <div style={{ fontSize: '14px', color: '#1d4ed8' }}>
              <p style={{ marginBottom: '4px' }}><strong>Latitude:</strong> {location.lat.toFixed(6)}</p>
              <p><strong>Longitude:</strong> {location.lng.toFixed(6)}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            padding: '16px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <p style={{ fontSize: '14px', color: '#dc2626' }}>{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                  alert('Please enable location services in your browser settings:\n\n1. Tap the location icon in the address bar\n2. Select "Allow"\n3. Refresh this page')
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
                How to Enable Location
              </button>
            </div>
          )}
          
          {permission === 'granted' && (
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

          <button
            onClick={() => window.history.back()}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              color: '#374151',
              backgroundColor: '#f9fafb',
              cursor: 'pointer'
            }}
          >
            Back to App
          </button>
        </div>
      </div>
    </div>
  )
}
