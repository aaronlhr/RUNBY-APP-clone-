import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create a client with service role key (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function POST() {
  try {
    // First create a new test user
    const timestamp = Date.now()
    const { data: newUser, error: userError } = await supabaseAdmin
      .from('users')
      .insert([{
        clerk_user_id: `trigger_user_${timestamp}`,
        email: `trigger${timestamp}@runby.com`,
        first_name: 'Trigger',
        last_name: 'User',
        subscription_tier: 'free',
        is_verified: false,
        is_online: true,
      }])
      .select()
      .single()

    if (userError) {
      console.error('Error creating user:', userError)
      return NextResponse.json({ 
        success: false, 
        error: userError.message 
      }, { status: 500 })
    }

    // Create a new match to trigger real-time notification
    const { data: match, error } = await supabaseAdmin
      .from('matches')
      .insert([{
        user1_id: 'e72884d7-1c9e-4c19-82b2-ab1b875fd6a8',
        user2_id: newUser.id,
        status: 'active',
        matched_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating match:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Match triggered successfully',
      data: { match, newUser }
    })

  } catch (error) {
    console.error('Error triggering match:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to trigger match',
      details: error 
    }, { status: 500 })
  }
}
