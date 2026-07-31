"use client"

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"
import { getSupabase } from "@/lib/supabase-client"

interface AdminContextType {
  isAdmin: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  login: async () => false,
  logout: () => {},
})

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let cancelled = false
    try {
      getSupabase()
        .auth.getSession()
        .then(({ data }) => {
          if (cancelled) return
          if (data.session) {
            setIsAdmin(true)
          }
        })
        .catch(() => {})
    } catch {
      // Supabase not configured yet
    }
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await getSupabase().auth.signInWithPassword({ email, password })
      if (error) return false
      setIsAdmin(true)
      return true
    } catch {
      return false
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await getSupabase().auth.signOut()
    } catch {
      // Supabase not configured yet
    }
    setIsAdmin(false)
  }, [])

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminContext)
}
