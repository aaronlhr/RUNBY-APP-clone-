import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create a client with service role key (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function POST() {
  try {
    // First, let's check if we have users
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, clerk_user_id')
      .limit(2)

    if (usersError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch users',
        details: usersError 
      }, { status: 500 })
    }

    if (!users || users.length < 2) {
      return NextResponse.json({ 
        success: false, 
        error: 'Need at least 2 users to create matches',
        users: users 
      }, { status: 400 })
    }

    const user1 = users[0]
    const user2 = users[1]

    // Create a test match
    const { data: match, error: matchError } = await supabaseAdmin
      .from('matches')
      .insert([{
        user1_id: user1.id,
        user2_id: user2.id,
        status: 'active',
        matched_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (matchError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create match',
        details: matchError 
      }, { status: 500 })
    }

    // Create test messages
    const testMessages = [
      {
        match_id: match.id,
        sender_id: user1.id,
        content: "Hey! I saw we matched. Want to go for a run this weekend?",
        message_type: 'text',
        is_read: false,
      },
      {
        match_id: match.id,
        sender_id: user2.id,
        content: "Absolutely! I'm free Saturday morning. What's your preferred pace?",
        message_type: 'text',
        is_read: false,
      },
      {
        match_id: match.id,
        sender_id: user1.id,
        content: "I usually run around 8:30/mile. How about you?",
        message_type: 'text',
        is_read: false,
      }
    ]

    const { data: messages, error: messagesError } = await supabaseAdmin
      .from('messages')
      .insert(testMessages)
      .select()

    if (messagesError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create messages',
        details: messagesError 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Test data created successfully',
      data: {
        users: users.length,
        match: match,
        messages: messages?.length || 0
      }
    })

  } catch (error) {
    console.error('Error setting up test data:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to setup test data',
      details: error 
    }, { status: 500 })
  }
}
