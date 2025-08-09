import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Find users who haven't checked in past their trigger_after period
    const { data: expiredHeartbeats, error: heartbeatError } = await supabase
      .from('heartbeats')
      .select('user_id, last_seen, trigger_after')
      .lt('last_seen', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Basic check for testing

    if (heartbeatError) throw heartbeatError

    for (const heartbeat of expiredHeartbeats || []) {
      // Get user's confessions
      const { data: confessions, error: confessionError } = await supabase
        .from('confessions')
        .select('id, encrypted_content')
        .eq('user_id', heartbeat.user_id)

      if (confessionError) throw confessionError

      for (const confession of confessions || []) {
        // Get recipients for this confession
        const { data: recipients, error: recipientError } = await supabase
          .from('recipients')
          .select('email, decrypt_key')
          .eq('confession_id', confession.id)

        if (recipientError) throw recipientError

        // Send to each recipient (for now just log - in production would send email)
        for (const recipient of recipients || []) {
          const decryptUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/recipient/${confession.id}?key=${encodeURIComponent(recipient.decrypt_key)}`
          
          console.log(`Would send to ${recipient.email}: ${decryptUrl}`)
          
          // In production, send email here with the decrypt URL
          // await sendEmail(recipient.email, decryptUrl)
        }

        // Mark confession as delivered (add delivered field to schema if needed)
        console.log(`Confession ${confession.id} triggered for user ${heartbeat.user_id}`)
      }
    }

    res.status(200).json({ message: 'Triggers checked', processed: expiredHeartbeats?.length || 0 })
  } catch (error) {
    console.error('Error checking triggers:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
