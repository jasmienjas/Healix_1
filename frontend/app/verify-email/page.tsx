"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get token from URL
        const fullUrl = window.location.href
        const token = fullUrl.split('token=')[1]

        if (!token) {
          setError('Invalid verification link')
          setIsVerifying(false)
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/accounts/verify-email/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          // Redirect to login with success message
          router.push('/login?verified=true')
        } else {
          setError(data.message || 'Verification failed')
          setIsVerifying(false)
        }
      } catch (err) {
        setError('An error occurred during verification')
        setIsVerifying(false)
      }
    }

    verifyEmail()
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="mb-8">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iPLCdILTkVCTPt0ecxQ9Si1shZBv8k.png"
          alt="HEALIX"
          width={180}
          height={70}
          className="object-contain"
        />
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        
        {isVerifying ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p>Verifying your email...</p>
          </div>
        ) : error ? (
          <div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Go to Login
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}