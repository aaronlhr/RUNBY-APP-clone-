import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create a client with service role key (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID is required' 
      }, { status: 400 })
    }

    // Get recent matches (last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const { data: matches, error } = await supabaseAdmin
      .from('matches')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .gte('matched_at', twentyFourHoursAgo)
      .order('matched_at', { ascending: false })

    if (error) {
      console.error('Error fetching recent matches:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    console.log(`Found ${matches?.length || 0} recent matches for user ${userId}`)

    return NextResponse.json({ 
      success: true, 
      message: 'Recent matches fetched successfully',
      data: matches || []
    })

  } catch (error) {
    console.error('Error fetching recent matches:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch recent matches',
      details: error 
    }, { status: 500 })
  }
}
