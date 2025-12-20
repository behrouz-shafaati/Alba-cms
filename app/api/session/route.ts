import { decrypt } from '@/lib/auth/decrypt'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  if (!session) {
    return Response.json(null)
  }
  return Response.json(await decrypt(session))
}
