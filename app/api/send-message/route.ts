import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create a client with service role key (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: Request) {
  try {
    const { matchId, senderId, content, messageType = 'text' } = await request.json()

    if (!matchId || !senderId || !content) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Insert the message
    const { data: message, error } = await supabaseAdmin
      .from('messages')
      .insert([{
        match_id: matchId,
        sender_id: senderId,
        content,
        message_type: messageType,
        is_read: false,
      }])
      .select()
      .single()

    if (error) {
      console.error('Error sending message:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully',
      data: message
    })

  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to send message' 
    }, { status: 500 })
  }
}
