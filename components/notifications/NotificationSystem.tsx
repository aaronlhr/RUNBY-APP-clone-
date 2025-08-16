'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RealtimeService } from '../../lib/realtime'
import type { Match, User } from '../../lib/supabase'

interface NotificationSystemProps {
  currentUserId: string
  onNewMatch?: (match: Match) => void
}

interface Notification {
  id: string
  type: 'match' | 'message' | 'system' | 'achievement' | 'reminder'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  data?: any
  priority?: 'low' | 'medium' | 'high'
}

export default function NotificationSystem({ currentUserId, onNewMatch }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [subscription, setSubscription] = useState<any>(null)
  const [filter, setFilter] = useState<'all' | 'matches' | 'achievements' | 'reminders'>('all')

  // Add test notification function
  const addTestNotification = () => {
    const testNotifications: Notification[] = [
      {
        id: `test-match-${Date.now()}`,
        type: 'match',
        title: 'New Match! 🎉',
        message: 'You matched with Sarah! Start chatting now.',
        timestamp: new Date(),
        isRead: false,
        data: { id: 'test-match' },
        priority: 'high'
      },
      {
        id: `test-achievement-${Date.now()}`,
        type: 'achievement',
        title: 'Achievement Unlocked! 🏆',
        message: 'First 5k run completed! Keep up the great work!',
        timestamp: new Date(),
        isRead: false,
        data: { achievement: 'first_5k' },
        priority: 'medium'
      },
      {
        id: `test-reminder-${Date.now()}`,
        type: 'reminder',
        title: 'Running Reminder! ⏰',
        message: 'Time for your evening run! Perfect weather outside.',
        timestamp: new Date(),
        isRead: false,
        data: { reminder: 'evening_run' },
        priority: 'low'
      }
    ]

    testNotifications.forEach(notification => {
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
      showToastNotification(notification)
    })
  }

  // Check for recent matches manually
  const checkRecentMatches = async () => {
    try {
      console.log('🔍 Checking for recent matches...')
      const response = await fetch(`/api/recent-matches/${currentUserId}`)
      const result = await response.json()
      
      if (result.success && result.data && result.data.length > 0) {
        console.log('🔍 Found recent matches:', result.data)
        
        // Only show notifications for matches from the last 5 minutes
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
        
        const recentMatches = result.data.filter((match: any) => 
          new Date(match.matched_at) > fiveMinutesAgo
        )
        
        if (recentMatches.length > 0) {
          recentMatches.forEach((match: any) => {
            const notification: Notification = {
              id: `match-${match.id}`,
              type: 'match',
              title: 'New Match! 🎉',
              message: `You matched with someone! Check your matches to start chatting.`,
              timestamp: new Date(match.matched_at),
              isRead: false,
              data: match
            }

            setNotifications(prev => [notification, ...prev])
            setUnreadCount(prev => prev + 1)
            showToastNotification(notification)
          })
        } else {
          // Show a notification that we found matches but they're older
          const notification: Notification = {
            id: `matches-found-${Date.now()}`,
            type: 'match',
            title: 'Matches Found! 📋',
            message: `Found ${result.data.length} recent matches. Check your matches tab!`,
            timestamp: new Date(),
            isRead: false,
            data: { count: result.data.length }
          }

          setNotifications(prev => [notification, ...prev])
          setUnreadCount(prev => prev + 1)
          showToastNotification(notification)
        }
      } else {
        console.log('🔍 No recent matches found')
        
        // Show a notification that no matches were found
        const notification: Notification = {
          id: `no-matches-${Date.now()}`,
          type: 'system',
          title: 'No Recent Matches 📭',
          message: 'No recent matches found. Keep swiping to find running partners!',
          timestamp: new Date(),
          isRead: false,
          data: {}
        }

        setNotifications(prev => [notification, ...prev])
        setUnreadCount(prev => prev + 1)
        showToastNotification(notification)
      }
    } catch (error) {
      console.error('Error checking recent matches:', error)
    }
  }

  // Subscribe to new matches
  useEffect(() => {
    console.log('Setting up real-time subscription for user:', currentUserId)
    
    const sub = RealtimeService.subscribeToMatches(currentUserId, (newMatch) => {
      console.log('🎉 New match received via real-time:', newMatch)
      
      const notification: Notification = {
        id: `match-${newMatch.id}`,
        type: 'match',
        title: 'New Match! 🎉',
        message: `You matched with someone! Check your matches to start chatting.`,
        timestamp: new Date(),
        isRead: false,
        data: newMatch
      }

      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
      
      // Call the callback if provided
      onNewMatch?.(newMatch)
      
      // Show toast notification
      showToastNotification(notification)
    })

    setSubscription(sub)
    console.log('Real-time subscription set up:', sub)

    return () => {
      if (sub) {
        console.log('Cleaning up real-time subscription')
        sub.unsubscribe()
      }
    }
  }, [currentUserId, onNewMatch])

  const showToastNotification = (notification: Notification) => {
    // Create a toast element
    const toast = document.createElement('div')
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
      z-index: 10000;
      max-width: 300px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `
    
    toast.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 4px;">${notification.title}</div>
      <div style="font-size: 14px; opacity: 0.9;">${notification.message}</div>
    `
    
    document.body.appendChild(toast)
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)'
    }, 100)
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)'
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }, 5000)
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    )
    setUnreadCount(0)
  }

  const clearNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
    setUnreadCount(prev => {
      const notification = notifications.find(n => n.id === notificationId)
      return notification && !notification.isRead ? Math.max(0, prev - 1) : prev
    })
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Test Buttons */}
      <button
        onClick={addTestNotification}
        style={{
          background: '#10b981',
          color: 'white',
          border: 'none',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '600',
          cursor: 'pointer',
          marginRight: '8px'
        }}
      >
        Test Notification
      </button>
      
      <button
        onClick={checkRecentMatches}
        style={{
          background: '#8b5cf6',
          color: 'white',
          border: 'none',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '600',
          cursor: 'pointer',
          marginRight: '8px'
        }}
      >
        Check Matches
      </button>

      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{ fontSize: '24px' }}>🔔</div>
        {unreadCount > 0 && (
          <div style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            background: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '12px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              width: '320px',
              maxHeight: '400px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: '1px solid #e5e7eb',
              zIndex: 1000,
              overflow: 'hidden'
            }}
          >
                               {/* Header */}
                   <div style={{
                     padding: '16px',
                     borderBottom: '1px solid #e5e7eb'
                   }}>
                     <div style={{
                       display: 'flex',
                       justifyContent: 'space-between',
                       alignItems: 'center',
                       marginBottom: '12px'
                     }}>
                       <h3 style={{
                         margin: 0,
                         fontSize: '16px',
                         fontWeight: '600',
                         color: '#111827'
                       }}>
                         Notifications
                       </h3>
                       {unreadCount > 0 && (
                         <button
                           onClick={markAllAsRead}
                           style={{
                             background: 'none',
                             border: 'none',
                             color: '#2563eb',
                             fontSize: '14px',
                             cursor: 'pointer',
                             fontWeight: '500'
                           }}
                         >
                           Mark all read
                         </button>
                       )}
                     </div>
                     
                     {/* Filter Tabs */}
                     <div style={{
                       display: 'flex',
                       gap: '4px',
                       borderBottom: '1px solid #e5e7eb'
                     }}>
                       {[
                         { key: 'all', label: 'All', icon: '🔔' },
                         { key: 'matches', label: 'Matches', icon: '💕' },
                         { key: 'achievements', label: 'Achievements', icon: '🏆' },
                         { key: 'reminders', label: 'Reminders', icon: '⏰' }
                       ].map(({ key, label, icon }) => (
                         <button
                           key={key}
                           onClick={() => setFilter(key as any)}
                           style={{
                             flex: 1,
                             padding: '8px 12px',
                             background: filter === key ? '#2563eb' : 'transparent',
                             color: filter === key ? 'white' : '#6b7280',
                             border: 'none',
                             borderRadius: '6px 6px 0 0',
                             fontSize: '12px',
                             cursor: 'pointer',
                             fontWeight: '500'
                           }}
                         >
                           <span style={{ marginRight: '4px' }}>{icon}</span>
                           {label}
                         </button>
                       ))}
                     </div>
                   </div>

            {/* Notifications List */}
            <div style={{
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
                                   {(() => {
                       const filteredNotifications = notifications.filter(notification => {
                         if (filter === 'all') return true
                         if (filter === 'matches') return notification.type === 'match'
                         if (filter === 'achievements') return notification.type === 'achievement'
                         if (filter === 'reminders') return notification.type === 'reminder'
                         return true
                       })

                       if (filteredNotifications.length === 0) {
                         return (
                           <div style={{
                             padding: '32px 16px',
                             textAlign: 'center',
                             color: '#6b7280'
                           }}>
                             <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                               {filter === 'matches' ? '💕' : 
                                filter === 'achievements' ? '🏆' : 
                                filter === 'reminders' ? '⏰' : '🔔'}
                             </div>
                             <p style={{ margin: 0, fontSize: '14px' }}>
                               No {filter === 'all' ? '' : filter} notifications yet
                             </p>
                           </div>
                         )
                       }

                       return filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer',
                      backgroundColor: notification.isRead ? 'white' : '#f0f9ff',
                      transition: 'background-color 0.2s'
                    }}
                    onClick={() => markAsRead(notification.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = notification.isRead ? '#f9fafb' : '#e0f2fe'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = notification.isRead ? 'white' : '#f0f9ff'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '4px'
                        }}>
                          <span style={{
                            fontSize: '16px',
                            color: notification.type === 'match' ? '#059669' : 
                                   notification.type === 'achievement' ? '#f59e0b' :
                                   notification.type === 'reminder' ? '#8b5cf6' : '#2563eb'
                          }}>
                            {notification.type === 'match' ? '💕' : 
                             notification.type === 'achievement' ? '🏆' :
                             notification.type === 'reminder' ? '⏰' : '🔔'}
                          </span>
                          <h4 style={{
                            margin: 0,
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#111827'
                          }}>
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: notification.priority === 'high' ? '#ef4444' :
                                               notification.priority === 'medium' ? '#f59e0b' : '#2563eb',
                              borderRadius: '50%',
                              flexShrink: 0
                            }} />
                          )}
                        </div>
                        <p style={{
                          margin: 0,
                          fontSize: '13px',
                          color: '#6b7280',
                          lineHeight: '1.4'
                        }}>
                          {notification.message}
                        </p>
                        <p style={{
                          margin: '4px 0 0 0',
                          fontSize: '12px',
                          color: '#9ca3af'
                        }}>
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          clearNotification(notification.id)
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#9ca3af',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </motion.div>
                ))
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
