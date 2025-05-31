"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

// Mock authentication for demo purposes
// In a real app, this would be replaced with Firebase Auth

type User = {
  id: string
  email: string
  name: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => void
  signInWithGoogle: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("lexibot-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Redirect to login if accessing protected routes without authentication
  useEffect(() => {
    if (!loading && !user && pathname?.startsWith("/dashboard")) {
      router.push("/login")
    }
  }, [loading, user, pathname, router])

  const signIn = async (email: string, password: string) => {
    // Mock authentication - in a real app, this would call Firebase
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: "user123",
          email,
          name: email.split("@")[0],
        }
        setUser(mockUser)
        localStorage.setItem("lexibot-user", JSON.stringify(mockUser))
        resolve()
      }, 1000)
    })
  }

  const signUp = async (email: string, password: string) => {
    // Mock registration - in a real app, this would call Firebase
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: "user123",
          email,
          name: email.split("@")[0],
        }
        setUser(mockUser)
        localStorage.setItem("lexibot-user", JSON.stringify(mockUser))
        resolve()
      }, 1000)
    })
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("lexibot-user")
    if (pathname?.startsWith("/dashboard")) {
      router.push("/login")
    }
  }

  const signInWithGoogle = async () => {
    // Mock Google authentication - in a real app, this would call Firebase
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: "google123",
          email: "user@gmail.com",
          name: "Google User",
        }
        setUser(mockUser)
        localStorage.setItem("lexibot-user", JSON.stringify(mockUser))
        resolve()
      }, 1000)
    })
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
