'use client'

import { Session } from '@/types'
import { createContext, useContext, useState, ReactNode } from 'react'

type UserSession = {
  id: string
  name: string
  email: string
  roles: string[]
  image: string
}
interface SessionContextType {
  session: Session | null // Define the type of your session object
  user: UserSession | null
  setSession: (session: any) => void
  clearSession: () => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export const SessionProvider = ({
  children,
  session: inputSession,
}: {
  children: ReactNode
  session: Session
}) => {
  const [session, setSessionState] = useState<Session | null>(inputSession)
  const user = session?.user || null

  const setSession = (session: any) => {
    setSessionState(session)
  }

  const clearSession = () => {
    setSessionState(null)
  }

  return (
    <SessionContext.Provider
      value={{ session, user, setSession, clearSession }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}
