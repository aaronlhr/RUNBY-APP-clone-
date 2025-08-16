import { NextResponse } from 'next/server'
import { DatabaseService } from '../../../lib/database'

export async function POST() {
  try {
    const timestamp = Date.now()
    
    // Create a test user with unique email
    const testUser = {
      clerk_user_id: `test_user_${timestamp}`,
      email: `test${timestamp}@runby.com`,
      first_name: 'Test',
      last_name: 'User',
      age: 25,
      location: 'San Francisco, CA',
      bio: 'Test user for RUNBY app',
      photos: [],
      preferred_pace_min: 480, // 8 minutes per mile
      preferred_pace_max: 600, // 10 minutes per mile
      preferred_distance: '5k',
      running_times: ['morning', 'evening'],
      subscription_tier: 'free' as const,
      is_verified: false,
      is_online: true,
    }

    const createdUser = await DatabaseService.createUser(testUser)

    if (!createdUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create user' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Test user created successfully',
      user: createdUser
    })

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create test user',
      details: error 
    }, { status: 500 })
  }
}
