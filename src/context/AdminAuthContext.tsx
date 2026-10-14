import React, { createContext, useContext, useState, useEffect } from 'react'

export const ADMIN_PASSWORD = 'obaid12345'
const AUTH_STORAGE_KEY = 'hafiz_g_admin_authenticated'

interface AdminAuthContextType {
  isAuthenticated: boolean
  login: (password: string, remember?: boolean) => { success: boolean; error?: string }
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    try {
      const session = sessionStorage.getItem(AUTH_STORAGE_KEY)
      const local = localStorage.getItem(AUTH_STORAGE_KEY)
      return session === 'true' || local === 'true'
    } catch {
      return false
    }
  })

  // Sync state if storage changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const session = sessionStorage.getItem(AUTH_STORAGE_KEY)
      const local = localStorage.getItem(AUTH_STORAGE_KEY)
      if (session === 'true' || local === 'true') {
        setIsAuthenticated(true)
      }
    } catch {
      // Ignore storage errors
    }
  }, [])

  const login = (password: string, remember: boolean = false): { success: boolean; error?: string } => {
    if (password.trim() === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      try {
        sessionStorage.setItem(AUTH_STORAGE_KEY, 'true')
        if (remember) {
          localStorage.setItem(AUTH_STORAGE_KEY, 'true')
        }
      } catch {
        // Ignore
      }
      return { success: true }
    } else {
      return {
        success: false,
        error: 'Incorrect password! Please enter valid password (غلط پاس ورڈ، درست پاس ورڈ درج کریں).'
      }
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY)
      localStorage.removeItem(AUTH_STORAGE_KEY)
    } catch {
      // Ignore
    }
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth(): AdminAuthContextType {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
