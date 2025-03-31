"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { toast } from "sonner"

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      toast.error("Invalid verification token.")
      return
    }

    console.log('Token from URL:', token);

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()
      console.log('Verify email response:', data);

      if (response.ok) {
        toast.success("Email verified successfully")
        router.push('/login')
      } else {
        toast.error(data.error || "Failed to verify email")
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iPLCdILTkVCTPt0ecxQ9Si1shZBv8k.png"
            alt="HEALIX"
            width={180}
            height={70}
            className="object-contain"
          />
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h2 className="text-2xl font-bold text-center mb-8">Verify Your Email</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Please verify your email address by clicking the link we sent to your inbox. 
                  <br />
                  If you did not receive the email, you can try verifying again.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#023664] text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

