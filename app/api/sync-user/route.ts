import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { DatabaseService } from '../../../lib/database'

export async function POST() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not authenticated' 
      }, { status: 401 })
    }

    // Get user data from Clerk
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch user from Clerk' 
      }, { status: 500 })
    }

    const clerkUser = await response.json()

    // Check if user already exists in database
    let dbUser = await DatabaseService.getUserByClerkId(userId)

    if (!dbUser) {
      // Create new user in database
      const userData = {
        clerk_user_id: userId,
        email: clerkUser.email_addresses[0]?.email_address || '',
        first_name: clerkUser.first_name || '',
        last_name: clerkUser.last_name || '',
        photos: clerkUser.image_url ? [clerkUser.image_url] : [],
        subscription_tier: 'free' as const,
        is_verified: false,
        is_online: true,
      }

      dbUser = await DatabaseService.createUser(userData)

      if (!dbUser) {
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to create user in database' 
        }, { status: 500 })
      }
    } else {
      // Update existing user
      await DatabaseService.updateUser(userId, {
        is_online: true,
        last_seen: new Date().toISOString(),
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'User synced successfully',
      user: dbUser
    })

  } catch (error) {
    console.error('Error syncing user:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to sync user',
      details: error 
    }, { status: 500 })
  }
}
