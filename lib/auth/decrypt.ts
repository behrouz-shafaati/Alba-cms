// lib/auth/decrypt.ts
import 'server-only'
import { jwtVerify, errors } from 'jose'
import { Session } from './types'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function decrypt(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify<Session>(token, secret, {
      algorithms: ['HS256'],
    })

    return payload
  } catch (error) {
    if (error instanceof errors.JWTExpired) {
      // token منقضی شده → سایلنت
      console.log('Token has expired. Please generate a new one.')
      return null
    }

    // فقط در development لاگ کن
    if (process.env.NODE_ENV === 'development') {
      console.error('[JWT VERIFY ERROR]', error)
    }

    return null
  }
}
