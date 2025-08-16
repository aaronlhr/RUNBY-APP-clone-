import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create a client with service role key (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function POST() {
  try {
    // Enable realtime for the matches table
    const { data, error } = await supabaseAdmin
      .rpc('enable_realtime', { table_name: 'matches' })

    if (error) {
      console.error('Error enabling realtime:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Realtime enabled for matches table',
      data
    })

  } catch (error) {
    console.error('Error enabling realtime:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to enable realtime',
      details: error 
    }, { status: 500 })
  }
}
