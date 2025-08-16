import { supabase } from './supabase'
import type { User } from './supabase'

export interface MatchScore {
  userId: string
  score: number
  reasons: string[]
  compatibility: {
    pace: number
    distance: number
    location: number
    time: number
  }
}

export class MatchingService {
  // Calculate compatibility score between two users
  static calculateCompatibility(user1: User, user2: User): MatchScore {
    const reasons: string[] = []
    let totalScore = 0
    const compatibility = {
      pace: 0,
      distance: 0,
      location: 0,
      time: 0
    }

    // Pace compatibility (0-25 points)
    if (user1.preferred_pace_min && user2.preferred_pace_min) {
      const paceDiff = Math.abs(user1.preferred_pace_min - user2.preferred_pace_min)
      if (paceDiff <= 30) {
        compatibility.pace = 25
        reasons.push('Similar running pace')
      } else if (paceDiff <= 60) {
        compatibility.pace = 15
        reasons.push('Compatible running pace')
      } else if (paceDiff <= 120) {
        compatibility.pace = 5
        reasons.push('Different but manageable pace')
      }
    }

    // Distance compatibility (0-25 points)
    if (user1.preferred_distance && user2.preferred_distance) {
      if (user1.preferred_distance === user2.preferred_distance) {
        compatibility.distance = 25
        reasons.push('Same preferred distance')
      } else if (
        (user1.preferred_distance === '5k' && user2.preferred_distance === '10k') ||
        (user1.preferred_distance === '10k' && user2.preferred_distance === '5k')
      ) {
        compatibility.distance = 20
        reasons.push('Compatible distances')
      } else {
        compatibility.distance = 10
        reasons.push('Different distance preferences')
      }
    }

    // Location compatibility (0-25 points)
    if (user1.location && user2.location) {
      // Simple location matching (in real app, would use geolocation)
      if (user1.location === user2.location) {
        compatibility.location = 25
        reasons.push('Same location')
      } else if (user1.location.includes('San Francisco') && user2.location.includes('San Francisco')) {
        compatibility.location = 20
        reasons.push('Same city')
      } else {
        compatibility.location = 5
        reasons.push('Different locations')
      }
    }

    // Time compatibility (0-25 points)
    if (user1.running_times && user2.running_times) {
      const commonTimes = user1.running_times.filter(time => 
        user2.running_times?.includes(time)
      )
      if (commonTimes.length > 0) {
        compatibility.time = 25
        reasons.push(`Both prefer ${commonTimes.join(', ')} runs`)
      } else if (
        (user1.running_times.includes('morning') && user2.running_times.includes('evening')) ||
        (user1.running_times.includes('evening') && user2.running_times.includes('morning'))
      ) {
        compatibility.time = 10
        reasons.push('Different time preferences')
      } else {
        compatibility.time = 5
        reasons.push('Flexible scheduling needed')
      }
    }

    totalScore = compatibility.pace + compatibility.distance + compatibility.location + compatibility.time

    return {
      userId: user2.id,
      score: totalScore,
      reasons,
      compatibility
    }
  }

  // Get potential matches for a user
  static async getPotentialMatches(userId: string, limit: number = 10): Promise<MatchScore[]> {
    try {
      // Get current user
      const { data: currentUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (userError || !currentUser) {
        console.error('Error fetching current user:', userError)
        return []
      }

      // Get all other users (excluding current user and existing matches)
      const { data: allUsers, error: usersError } = await supabase
        .from('users')
        .select('*')
        .neq('id', userId)
        .eq('is_online', true)

      if (usersError) {
        console.error('Error fetching users:', usersError)
        return []
      }

      // Get existing matches to exclude
      const { data: existingMatches, error: matchesError } = await supabase
        .from('matches')
        .select('user1_id, user2_id')
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)

      if (matchesError) {
        console.error('Error fetching existing matches:', matchesError)
        return []
      }

      const matchedUserIds = new Set()
      existingMatches?.forEach(match => {
        if (match.user1_id === userId) {
          matchedUserIds.add(match.user2_id)
        } else {
          matchedUserIds.add(match.user1_id)
        }
      })

      // Filter out already matched users and calculate compatibility
      const potentialMatches = allUsers
        ?.filter(user => !matchedUserIds.has(user.id))
        .map(user => this.calculateCompatibility(currentUser, user))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit) || []

      return potentialMatches
    } catch (error) {
      console.error('Error getting potential matches:', error)
      return []
    }
  }

  // Create a match between two users
  static async createMatch(user1Id: string, user2Id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('matches')
        .insert([{
          user1_id: user1Id,
          user2_id: user2Id,
          status: 'active',
          matched_at: new Date().toISOString(),
        }])

      if (error) {
        console.error('Error creating match:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error creating match:', error)
      return false
    }
  }
}
