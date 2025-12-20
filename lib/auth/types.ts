// lib/auth/types.ts
type User = {
  id: string
}
export interface Session {
  user: User
  sub: string
  email: string
  role: 'admin' | 'editor' | 'user'
  exp: number
}
