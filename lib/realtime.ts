import { supabase } from './supabase'
import type { Message, User } from './supabase'

export class RealtimeService {
  // Subscribe to new messages in a match
  static subscribeToMessages(matchId: string, callback: (message: Message) => void) {
    return supabase
      .channel(`messages:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          callback(payload.new as Message)
        }
      )
      .subscribe()
  }

  // Subscribe to user online status changes
  static subscribeToUserStatus(userId: string, callback: (user: User) => void) {
    return supabase
      .channel(`user_status:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as User)
        }
      )
      .subscribe()
  }

  // Subscribe to new matches
  static subscribeToMatches(userId: string, callback: (match: any) => void) {
    console.log('🔔 Setting up matches subscription for user:', userId)
    
    const channel = supabase
      .channel(`matches:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
          filter: `user1_id=eq.${userId} OR user2_id=eq.${userId}`,
        },
        (payload) => {
          console.log('📨 Match INSERT event received:', payload)
          callback(payload.new)
        }
      )
      .subscribe((status) => {
        console.log('🔔 Matches subscription status:', status)
      })

    console.log('🔔 Matches subscription channel created:', channel)
    return channel
  }

  // Update user's online status
  static async updateUserStatus(userId: string, isOnline: boolean) {
    const { error } = await supabase
      .from('users')
      .update({
        is_online: isOnline,
        last_seen: new Date().toISOString(),
      })
      .eq('id', userId)

    return !error
  }

  // Send a message
  static async sendMessage(matchId: string, senderId: string, content: string, messageType: 'text' | 'image' | 'location' = 'text') {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            match_id: matchId,
            sender_id: senderId,
            content,
            message_type: messageType,
            is_read: false,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error('Error sending message:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error sending message:', error)
      return null
    }
  }

  // Mark messages as read
  static async markMessagesAsRead(matchId: string, userId: string) {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('match_id', matchId)
      .neq('sender_id', userId)

    return !error
  }
}
