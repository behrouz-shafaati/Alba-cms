'use server'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import { decrypt, encrypt } from './utils'
import { Session } from '@/types'

const durationOfSessionValidity = 60 * 60 * 12 * 1000 // 12 ساعت به میلی‌ثانیه

export async function logout() {
  // Destroy the session
  const cookieStore = await cookies()
  cookieStore.set('session', '', { expires: new Date(0) })
  redirect('/login')
}

export async function getSession(): Promise<Session> {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value
    if (!session) return { user: { roles: ['guest'] } }
    return await decrypt(session)
  } catch (err) {
    console.error('❌ cookies() called outside request context', err)
    return { user: { roles: ['guest'] } }
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  if (!session) return

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session)
  parsed.expires = new Date(Date.now() + durationOfSessionValidity)
  const res = NextResponse.next()
  res.cookies.set({
    name: 'session',
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  })
  return res
}
