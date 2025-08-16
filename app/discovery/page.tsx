'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import App from '../../components/App'
import NotificationSystem from '../../components/notifications/NotificationSystem'

export default function DiscoveryPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Wait for Clerk to load
    if (isLoaded) {
      setIsLoading(false)
      
      // If not signed in, redirect to sign-in
      if (!isSignedIn) {
        router.push('/auth/sign-in')
      } else if (user) {
        // Sync user to database
        syncUserToDatabase()
      }
    }
  }, [isLoaded, isSignedIn, user, router])

  const syncUserToDatabase = async () => {
    try {
      const response = await fetch('/api/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        console.log('User synced to database:', result)
      } else {
        console.error('Failed to sync user to database')
      }
    } catch (error) {
      console.error('Error syncing user:', error)
    }
  }

  // Show loading state while Clerk is loading
  if (isLoading || !isLoaded) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '2px solid transparent',
            borderTop: '2px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading RUNBY...</p>
        </div>
      </div>
    )
  }

  // Show redirect message if not signed in
  if (!isSignedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280' }}>Redirecting to sign in...</p>
        </div>
      </div>
    )
  }

           // User is signed in, show the main app with notifications
         return (
           <div style={{ position: 'relative' }}>
             <App />
             <div style={{
               position: 'fixed',
               top: '20px',
               right: '20px',
               zIndex: 1000
             }}>
               <NotificationSystem
                 currentUserId="e72884d7-1c9e-4c19-82b2-ab1b875fd6a8"
                 onNewMatch={(match) => {
                   console.log('New match received in discovery:', match)
                   // You can add additional logic here, like redirecting to matches
                 }}
               />
             </div>
             
             {/* Test Buttons */}
             <div style={{
               position: 'fixed',
               top: '20px',
               left: '20px',
               zIndex: 1000,
               display: 'flex',
               flexDirection: 'column',
               gap: '8px'
             }}>
               <button
                 onClick={async () => {
                   try {
                     const response = await fetch('/api/trigger-match', { method: 'POST' })
                     const result = await response.json()
                     console.log('Match triggered:', result)
                     
                     // Wait a moment for the match to be created, then check for recent matches
                     setTimeout(async () => {
                       try {
                         const checkResponse = await fetch(`/api/recent-matches/e72884d7-1c9e-4c19-82b2-ab1b875fd6a8`)
                         const checkResult = await checkResponse.json()
                         console.log('Recent matches after trigger:', checkResult)
                         
                         if (checkResult.success && checkResult.data && checkResult.data.length > 0) {
                           // Find the most recent match
                           const latestMatch = checkResult.data[0]
                           console.log('Latest match:', latestMatch)
                           
                           // Show notification for the new match
                           const notification = {
                             id: `match-${latestMatch.id}`,
                             type: 'match',
                             title: 'New Match! 🎉',
                             message: `You matched with someone! Check your matches to start chatting.`,
                             timestamp: new Date(latestMatch.matched_at),
                             isRead: false,
                             data: latestMatch
                           }
                           
                           // Create a toast notification
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
                       } catch (error) {
                         console.error('Error checking recent matches after trigger:', error)
                       }
                     }, 1000) // Wait 1 second for the match to be created
                   } catch (error) {
                     console.error('Error triggering match:', error)
                   }
                 }}
                 style={{
                   background: '#f59e0b',
                   color: 'white',
                   border: 'none',
                   padding: '8px 12px',
                   borderRadius: '8px',
                   fontSize: '12px',
                   fontWeight: '600',
                   cursor: 'pointer'
                 }}
               >
                 Trigger Match
               </button>
               
               <button
                 onClick={async () => {
                   try {
                     const response = await fetch(`/api/recent-matches/e72884d7-1c9e-4c19-82b2-ab1b875fd6a8`)
                     const result = await response.json()
                     console.log('Recent matches:', result)
                   } catch (error) {
                     console.error('Error checking recent matches:', error)
                   }
                 }}
                 style={{
                   background: '#06b6d4',
                   color: 'white',
                   border: 'none',
                   padding: '8px 12px',
                   borderRadius: '8px',
                   fontSize: '12px',
                   fontWeight: '600',
                   cursor: 'pointer'
                 }}
               >
                 Check Recent
               </button>
               
               <button
                 onClick={async () => {
                   try {
                     const response = await fetch(`/api/matching/potential-matches?userId=e72884d7-1c9e-4c19-82b2-ab1b875fd6a8&limit=5`)
                     const result = await response.json()
                     console.log('Potential matches:', result)
                     
                     if (result.success && result.data.length > 0) {
                       // Show notification about potential matches
                       const notification = {
                         id: `potential-matches-${Date.now()}`,
                         type: 'match',
                         title: 'Potential Matches Found! 🎯',
                         message: `Found ${result.data.length} compatible runners!`,
                         timestamp: new Date(),
                         isRead: false,
                         data: { count: result.data.length, matches: result.data }
                       }
                       
                       // Create a toast notification
                       const toast = document.createElement('div')
                       toast.style.cssText = `
                         position: fixed;
                         top: 20px;
                         right: 20px;
                         background: linear-gradient(135deg, #10b981, #059669);
                         color: white;
                         padding: 16px 20px;
                         border-radius: 12px;
                         box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
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
                   } catch (error) {
                     console.error('Error checking potential matches:', error)
                   }
                 }}
                 style={{
                   background: '#10b981',
                   color: 'white',
                   border: 'none',
                   padding: '8px 12px',
                   borderRadius: '8px',
                   fontSize: '12px',
                   fontWeight: '600',
                   cursor: 'pointer'
                 }}
               >
                 Find Matches
               </button>
             </div>
           </div>
         )
}
