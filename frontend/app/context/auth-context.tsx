"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: "patient" | "doctor" | "admin"
}

// Update the AuthContextType interface to include new methods
interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (
    userData: any,
    role: "patient" | "doctor",
  ) => Promise<{ success: boolean; requiresVerification?: boolean; requiresApproval?: boolean }>
  verifyEmail: (token: string) => Promise<boolean>
  resendVerificationEmail: (email: string) => Promise<boolean>
  checkApprovalStatus: (email: string) => Promise<"pending" | "approved" | "rejected" | "not_found">
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would be an API call to validate the session
        const storedUser = localStorage.getItem("healix_user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Authentication error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)
    try {
      // In a real app, this would be an API call
      // Mock authentication
      if (email === "user@example.com" && password === "password") {
        const mockUser: User = {
          id: "1",
          name: "Amany Sal",
          email: "user@example.com",
          role: "patient",
        }

        setUser(mockUser)
        localStorage.setItem("healix_user", JSON.stringify(mockUser))
        return true
      }

      if (email === "doctor@example.com" && password === "password") {
        const mockUser: User = {
          id: "2",
          name: "Dr. Karim Mansour",
          email: "doctor@example.com",
          role: "doctor",
        }

        setUser(mockUser)
        localStorage.setItem("healix_user", JSON.stringify(mockUser))
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Update the signup method in the AuthProvider component
  const signup = async (
    userData: any,
    role: "patient" | "doctor",
  ): Promise<{ success: boolean; requiresVerification?: boolean; requiresApproval?: boolean }> => {
    setLoading(true)
    try {
      // In a real app, this would be an API call
      // Mock signup
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        role: role,
      }

      // For patients, we'll require email verification
      if (role === "patient") {
        // In a real app, we would send a verification email here
        console.log(`Sending verification email to ${userData.email}`)

        // Store user data in localStorage but mark as unverified
        localStorage.setItem(`healix_unverified_${userData.email}`, JSON.stringify(mockUser))

        return { success: true, requiresVerification: true }
      }

      // For doctors, we'll require admin approval
      if (role === "doctor") {
        // In a real app, we would send the doctor's data to admin for approval
        console.log(`Sending doctor ${userData.email}'s data to admin for approval`)

        // Store doctor data in localStorage but mark as pending approval
        localStorage.setItem(
          `healix_pending_${userData.email}`,
          JSON.stringify({
            ...mockUser,
            documents: {
              medicalLicense: userData.medicalLicense,
              phdCertificate: userData.phdCertificate,
            },
            submittedAt: new Date().toISOString(),
          }),
        )

        return { success: true, requiresApproval: true }
      }

      // This should not happen with the current UI flow
      return { success: false }
    } catch (error) {
      console.error("Signup error:", error)
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  // Add new methods to verify email, resend verification, and check approval status
  const verifyEmail = async (token: string): Promise<boolean> => {
    // In a real app, this would validate the token with the backend
    // For this mock implementation, we'll just simulate success
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, we would validate the token and get the user email
      // For this mock, we'll extract the email from the token (assuming token is the email)
      const email = token

      const unverifiedUserData = localStorage.getItem(`healix_unverified_${email}`)
      if (!unverifiedUserData) {
        return false
      }

      const userData = JSON.parse(unverifiedUserData)

      // Remove unverified user data and set as verified
      localStorage.removeItem(`healix_unverified_${email}`)
      localStorage.setItem("healix_user", JSON.stringify(userData))

      // Update current user state
      setUser(userData)

      return true
    } catch (error) {
      console.error("Email verification error:", error)
      return false
    }
  }

  const resendVerificationEmail = async (email: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if unverified user exists
      const unverifiedUserData = localStorage.getItem(`healix_unverified_${email}`)
      if (!unverifiedUserData) {
        return false
      }

      // In a real app, we would resend the verification email
      console.log(`Resending verification email to ${email}`)

      return true
    } catch (error) {
      console.error("Resend verification error:", error)
      return false
    }
  }

  const checkApprovalStatus = async (email: string): Promise<"pending" | "approved" | "rejected" | "not_found"> => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if pending doctor exists
      const pendingDoctorData = localStorage.getItem(`healix_pending_${email}`)
      if (!pendingDoctorData) {
        return "not_found"
      }

      // In a real app, we would check the approval status from the backend
      // For this mock, we'll simulate a pending status
      return "pending"
    } catch (error) {
      console.error("Check approval status error:", error)
      return "not_found"
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("healix_user")
    router.push("/login")
  }

  // Update the AuthContext.Provider value to include the new methods
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        verifyEmail,
        resendVerificationEmail,
        checkApprovalStatus,
        logout,
        isAuthenticated: !!user,
      }}
    >
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

