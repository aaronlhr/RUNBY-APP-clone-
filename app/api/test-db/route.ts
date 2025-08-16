import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create a client with service role key (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function GET() {
  try {
    // Test database connection
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(5)

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error 
      }, { status: 500 })
    }

    // Test creating a user
    const testUser = {
      clerk_user_id: 'test_user_' + Date.now(),
      email: 'test@runby.com',
      first_name: 'Test',
      last_name: 'User',
      subscription_tier: 'free',
      is_verified: false,
      is_online: true,
    }

    const { data: newUser, error: createError } = await supabaseAdmin
      .from('users')
      .insert([testUser])
      .select()
      .single()

    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      userCount: users?.length || 0,
      users: users,
      createTest: {
        success: !createError,
        error: createError?.message,
        newUser: newUser
      }
    })

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Database connection failed',
      details: error 
    }, { status: 500 })
  }
}
