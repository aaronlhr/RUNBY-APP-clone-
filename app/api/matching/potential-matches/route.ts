import { NextResponse } from 'next/server'
import { MatchingService } from '../../../../lib/matching'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID is required' 
      }, { status: 400 })
    }

    const potentialMatches = await MatchingService.getPotentialMatches(userId, limit)

    return NextResponse.json({ 
      success: true, 
      message: 'Potential matches fetched successfully',
      data: potentialMatches
    })

  } catch (error) {
    console.error('Error fetching potential matches:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch potential matches',
      details: error 
    }, { status: 500 })
  }
}
