'use client'
import { createContext, useContext } from 'react'

export type SessionPayload = {
  id: string
  username: string
  isAdmin: boolean
  canViewInventory: boolean
  canManageSystem: boolean
  canAddStock: boolean
  canDrawToProject: boolean
  canConsume: boolean
}

const SessionContext = createContext<SessionPayload | null>(null)

export function SessionProvider({ session, children }: { session: SessionPayload | null, children: React.ReactNode }) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  return useContext(SessionContext)
}
