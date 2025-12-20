// lib/auth/get-session.ts
import 'server-only'
import { cookies } from 'next/headers'
import { cache } from 'react'
import { decrypt } from './decrypt'
import type { Session } from './types'

export const getSession = cache(async (): Promise<Session | null> => {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value
    if (!session) return { user: { roles: ['guest'] } }

    return await decrypt(session)
  } catch (err) {
    console.error('❌ cookies() called outside request context', err)
    return { user: { roles: ['guest'] } }
  }
})
