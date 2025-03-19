"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "../context/auth-context"

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams?.get('email')

  const { verifyEmail } = useAuth()

  useEffect(() => {
    if (!email) {
      setStatus('error')
      setMessage('Invalid verification link')
      return
    }

    setStatus('success')
    setMessage('Your email has been verified successfully!')
  }, [email])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Email Verification</h2>
        
        {status === 'verifying' && (
          <p className="text-center">Verifying your email...</p>
        )}

        {status === 'success' && (
          <>
            <p className="text-center text-green-600 mb-4">{message}</p>
            <p className="text-center mb-4">
              You can now log in to your account.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Go to Login
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <p className="text-center text-red-600 mb-4">{message}</p>
            <button
              onClick={() => router.push('/signup/patient')}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Back to Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  )
}

