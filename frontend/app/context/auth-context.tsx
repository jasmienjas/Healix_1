"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

interface User {
  id: number;
  username: string;
  email: string;
  user_type: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        console.log('Found stored user:', parsedUser)
        setUser(parsedUser)
      }
    } catch (error) {
      console.error('Error reading stored user:', error)
      localStorage.removeItem('user') // Clear potentially corrupted data
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('1. AuthContext: Starting login attempt')
      const data = await api.auth.login(email, password)
      
      // Store minimal user data
      const userData = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        user_type: data.user.user_type
      }
  
      // Store data in localStorage
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      localStorage.setItem('user', JSON.stringify(userData))
      
      // Set cookies for middleware
      document.cookie = `healix_auth_token=${data.access}; path=/`
      document.cookie = `user_type=${userData.user_type}; path=/`
      
      setUser(userData)
      
      setTimeout(() => {
        console.log('9. Redirecting to dashboard')
        router.push('/dashboard')
      }, 100)
  
      return true
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    // Clear cookies
    document.cookie = 'healix_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    document.cookie = 'user_type=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    setUser(null)
    window.location.replace('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

