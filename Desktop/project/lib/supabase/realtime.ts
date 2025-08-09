import { RealtimeChannel } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'
import { getSupabaseClient } from './client'

/**
 * Realtime subscriptions for therapist dashboards and processing tools.
 * Includes typed payloads and cleanup helpers.
 */

type ReactionRow = Database['public']['Tables']['reactions']['Row']
type ProcessingNoteRow = Database['public']['Tables']['processing_notes']['Row']
type EmotionalJourneyRow = Database['public']['Tables']['emotional_journey']['Row']

export interface RealtimeSubscriptions {
  channels: RealtimeChannel[]
  /** Unsubscribe from all realtime channels */
  unsubscribeAll: () => void
}

/**
 * Subscribe to new reactions (insert) for a given project (therapist view).
 * Requires RLS to allow therapist to read related reactions via assignments/relationship.
 */
export function subscribeToNewReactions(
  params: {
    projectId?: string
  },
  onInsert: (row: ReactionRow) => void,
  onError?: (err: unknown) => void
): RealtimeSubscriptions {
  const supabase = getSupabaseClient()
  const channels: RealtimeChannel[] = []
  const schema = 'public'
  const table = 'reactions'

  const filter = params.projectId
    ? `answer_id=in.(select id from public.answers where project_id=eq.${params.projectId})`
    : ''

  const channel = supabase
    .channel(`reactions-insert-${params.projectId ?? 'all'}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema,
        table,
        filter,
      } as any,
      (payload: any) => {
        try {
          onInsert(payload.new as ReactionRow)
        } catch (err) {
          if (onError) onError(err)
        }
      }
    )
    .subscribe((status) => {
      if (status === 'CHANNEL_ERROR' && onError) onError(new Error('Realtime channel error: reactions'))
    })

  channels.push(channel)

  return {
    channels,
    unsubscribeAll: () => {
      for (const ch of channels) ch.unsubscribe()
    },
  }
}

/**
 * Subscribe to processing notes updates (insert/update/delete) for a project.
 */
export function subscribeToProcessingNotes(
  params: { projectId: string },
  handlers: {
    onInsert?: (row: ProcessingNoteRow) => void
    onUpdate?: (row: ProcessingNoteRow) => void
    onDelete?: (row: ProcessingNoteRow) => void
  },
  onError?: (err: unknown) => void
): RealtimeSubscriptions {
  const supabase = getSupabaseClient()
  const channels: RealtimeChannel[] = []
  const schema = 'public'
  const table = 'processing_notes'
  const filter = `project_id=eq.${params.projectId}`

  const channel = supabase
    .channel(`processing-notes-${params.projectId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema, table, filter } as any,
      (payload: any) => {
        try { handlers.onInsert?.(payload.new as ProcessingNoteRow) } catch (err) { onError?.(err) }
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema, table, filter } as any,
      (payload: any) => {
        try { handlers.onUpdate?.(payload.new as ProcessingNoteRow) } catch (err) { onError?.(err) }
      }
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema, table, filter } as any,
      (payload: any) => {
        try { handlers.onDelete?.(payload.old as ProcessingNoteRow) } catch (err) { onError?.(err) }
      }
    )
    .subscribe((status) => {
      if (status === 'CHANNEL_ERROR' && onError) onError(new Error('Realtime channel error: processing_notes'))
    })

  channels.push(channel)

  return {
    channels,
    unsubscribeAll: () => { for (const ch of channels) ch.unsubscribe() },
  }
}

/**
 * Subscribe to emotional journey tracking events for a user within a project.
 */
export function subscribeToEmotionalJourney(
  params: { projectId: string; userId?: string },
  handlers: {
    onInsert?: (row: EmotionalJourneyRow) => void
    onUpdate?: (row: EmotionalJourneyRow) => void
  },
  onError?: (err: unknown) => void
): RealtimeSubscriptions {
  const supabase = getSupabaseClient()
  const channels: RealtimeChannel[] = []
  const schema = 'public'
  const table = 'emotional_journey'
  const filter = params.userId
    ? `project_id=eq.${params.projectId}&user_id=eq.${params.userId}`
    : `project_id=eq.${params.projectId}`

  const channel = supabase
    .channel(`emotional-journey-${params.projectId}-${params.userId ?? 'all'}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema, table, filter } as any,
      (payload: any) => {
        try { handlers.onInsert?.(payload.new as EmotionalJourneyRow) } catch (err) { onError?.(err) }
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema, table, filter } as any,
      (payload: any) => {
        try { handlers.onUpdate?.(payload.new as EmotionalJourneyRow) } catch (err) { onError?.(err) }
      }
    )
    .subscribe((status) => {
      if (status === 'CHANNEL_ERROR' && onError) onError(new Error('Realtime channel error: emotional_journey'))
    })

  channels.push(channel)

  return {
    channels,
    unsubscribeAll: () => { for (const ch of channels) ch.unsubscribe() },
  }
}


