import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create a client with service role key (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: Request) {
  try {
    const { user1Id, user2Id } = await request.json()

    if (!user1Id || !user2Id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: user1Id and user2Id' 
      }, { status: 400 })
    }

    // Check if match already exists
    const { data: existingMatch, error: checkError } = await supabaseAdmin
      .from('matches')
      .select('*')
      .or(`user1_id.eq.${user1Id},user2_id.eq.${user1Id}`)
      .or(`user1_id.eq.${user2Id},user2_id.eq.${user2Id}`)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      return NextResponse.json({ 
        success: false, 
        error: 'Error checking existing match',
        details: checkError 
      }, { status: 500 })
    }

    if (existingMatch) {
      return NextResponse.json({ 
        success: false, 
        error: 'Match already exists',
        data: existingMatch
      }, { status: 409 })
    }

    // Create new match
    const { data: match, error } = await supabaseAdmin
      .from('matches')
      .insert([{
        user1_id: user1Id,
        user2_id: user2Id,
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
      message: 'Match created successfully',
      data: match
    })

  } catch (error) {
    console.error('Error creating match:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create match',
      details: error 
    }, { status: 500 })
  }
}
