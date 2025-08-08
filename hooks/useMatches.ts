import { useState, useEffect } from 'react'
import { supabase, Match, User } from '../lib/supabase'

export function useMatches(userId: string) {
  const [matches, setMatches] = useState<(Match & { user: User })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMatches() {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          user1:users!matches_user1_id_fkey(*),
          user2:users!matches_user2_id_fkey(*)
        `)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .eq('status', 'active')

      if (data) {
        const formattedMatches = data.map(match => ({
          ...match,
          user: match.user1_id === userId ? match.user2 : match.user1
        }))
        setMatches(formattedMatches)
      }
      
      setLoading(false)
    }

    if (userId) {
      fetchMatches()
    }
  }, [userId])

  return { matches, loading }
}
