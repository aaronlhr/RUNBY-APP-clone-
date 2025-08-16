'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RealtimeService } from '../../lib/realtime'
import type { Message, User } from '../../lib/supabase'

interface RealTimeChatInterfaceProps {
  currentUser: User
  otherUser: User
  matchId: string
}

export default function RealTimeChatInterface({ currentUser, otherUser, matchId }: RealTimeChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [subscription, setSubscription] = useState<any>(null)

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Subscribe to real-time messages
  useEffect(() => {
    const sub = RealtimeService.subscribeToMessages(matchId, (newMessage) => {
      setMessages(prev => [...prev, newMessage])
    })

    setSubscription(sub)

    return () => {
      if (sub) {
        sub.unsubscribe()
      }
    }
  }, [matchId])

  // Load existing messages
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/messages/${matchId}`)
        const result = await response.json()
        
        if (result.success && result.data) {
          setMessages(result.data)
        }
      } catch (error) {
        console.error('Error loading messages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [matchId])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return

    const messageContent = newMessage.trim()
    setNewMessage('')
    setIsSending(true)

    // Debug: Log the current user data
    console.log('Current user:', currentUser)
    console.log('Current user ID:', currentUser?.id)

    try {
      const requestBody = {
        matchId,
        senderId: currentUser?.id || 'e72884d7-1c9e-4c19-82b2-ab1b875fd6a8', // Fallback to test user ID
        content: messageContent,
        messageType: 'text'
      }

      console.log('Sending request:', requestBody)

      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const result = await response.json()
      console.log('API response:', result)

      if (result.success && result.data) {
        setMessages(prev => [...prev, result.data])
        console.log('Message sent successfully:', result.data)
      } else {
        console.error('Failed to send message:', result.error)
        // Add the message back to input if it failed
        setNewMessage(messageContent)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Add the message back to input if it failed
      setNewMessage(messageContent)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      {/* Chat Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '20px',
        borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '16px',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
        }}>
          <span style={{ fontSize: '20px' }}>👤</span>
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontWeight: '700',
            color: '#111827',
            margin: '0 0 4px 0',
            fontSize: '18px'
          }}>
            {otherUser.first_name} {otherUser.last_name}
          </h3>
          <p style={{
            fontSize: '14px',
            color: otherUser.is_online ? '#059669' : '#6b7280',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: otherUser.is_online ? '#059669' : '#6b7280'
            }}></span>
            {otherUser.is_online ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {isLoading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100px'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              border: '2px solid transparent',
              borderTop: '2px solid #2563eb',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  display: 'flex',
                  justifyContent: message.sender_id === currentUser.id ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  backgroundColor: message.sender_id === currentUser.id ? '#2563eb' : '#f3f4f6',
                  color: message.sender_id === currentUser.id ? 'white' : '#111827'
                }}>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}>
                    {message.content}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    margin: '4px 0 0 0',
                    opacity: 0.7
                  }}>
                    {formatTime(message.created_at)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid rgba(229, 231, 235, 0.5)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: '16px',
              border: '2px solid rgba(229, 231, 235, 0.5)',
              borderRadius: '20px',
              fontSize: '16px',
              outline: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#2563eb'
              e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(229, 231, 235, 0.5)'
              e.target.style.boxShadow = 'none'
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            style={{
              padding: '16px 20px',
              background: newMessage.trim() && !isSending 
                ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' 
                : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: newMessage.trim() && !isSending ? 'pointer' : 'not-allowed',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: newMessage.trim() && !isSending 
                ? '0 8px 20px rgba(37, 99, 235, 0.3)' 
                : 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (newMessage.trim() && !isSending) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(37, 99, 235, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (newMessage.trim() && !isSending) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.3)'
              }
            }}
          >
                   {isSending ? (
                     <>
                       <div style={{
                         width: '16px',
                         height: '16px',
                         border: '2px solid transparent',
                         borderTop: '2px solid white',
                         borderRadius: '50%',
                         animation: 'spin 1s linear infinite'
                       }}></div>
                       Sending...
                     </>
                   ) : (
                     'Send'
                   )}
                 </button>
        </div>
      </div>
    </div>
  )
}
