"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Layout from "../components/layout"
import { useAuth } from '../context/auth-context'
import DoctorDashboard from '../components/DoctorDashboard'
import PatientDashboard from '../components/PatientDashboard'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    const checkAuth = () => {
      // Add more detailed logging
      console.log('Dashboard - Current URL:', window.location.href)
      console.log('Dashboard - Auth Status:', {
        isLoading,
        hasUser: !!user,
        userType: user?.user_type
      })
      
      // Try to get user from localStorage if not in context
      const storedUser = localStorage.getItem('user')
      console.log('Dashboard - Stored User:', storedUser)
      
      if (!isLoading && !user && !storedUser) {
        console.log('No auth found, redirecting to home')
        router.push('/')
        return
      }

      // Log the effective user that will be used
      const effectiveUser = user || (storedUser ? JSON.parse(storedUser) : null)
      console.log('Dashboard - Effective User:', effectiveUser)
    }

    checkAuth()
  }, [user, isLoading, router])

  // Show loading state while checking auth
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Loading authentication status...</p>
    </div>
  }

  // Get user from context or localStorage
  const effectiveUser = user || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null)

  if (!effectiveUser) {
    return <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Redirecting to login...</p>
    </div>
  }

  console.log('Dashboard - Rendering for user type:', effectiveUser.user_type)

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {effectiveUser.user_type === 'doctor' ? (
          <DoctorDashboard />
        ) : effectiveUser.user_type === 'patient' ? (
          <PatientDashboard />
        ) : (
          <div className="text-center py-8">
            <p className="text-red-500">Invalid user type: {effectiveUser.user_type}</p>
          </div>
        )}
      </div>
    </Layout>
  )
}