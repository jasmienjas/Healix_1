"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple validation
    if (!email) {
      setError("Please enter your email address")
      setIsLoading(false)
      return
    }

    // Mock password reset request - in a real app, this would be an API call
    setIsSubmitted(true)
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side with image and logo */}
      <div className="relative hidden md:flex md:w-5/12 bg-[#023664] flex-col items-center justify-center text-white">
        {/* Logo at the top */}
        <div className="absolute top-6 left-0 w-full flex justify-center z-10">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iPLCdILTkVCTPt0ecxQ9Si1shZBv8k.png"
            alt="HEALIX"
            width={180}
            height={70}
            className="object-contain"
          />
        </div>

        {/* New background image with healthcare professionals */}
        <div className="w-full h-full overflow-hidden">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-q4FMYU8IDDV1Fi8jIF2ooIw6hY0CCR.png"
            alt="Healthcare professionals"
            width={600}
            height={800}
            className="object-cover w-full h-full"
            priority
          />
        </div>
      </div>

      {/* Right side with forgot password form */}
      <div className="w-full md:w-7/12 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="md:hidden absolute top-4 right-4">
            <button className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {!isSubmitted ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Reset your password</h1>
                <p className="text-gray-600">
                  Enter your email address and we'll send you a link to reset your password
                </p>
              </div>

              {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email address"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#023664] text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
                >
                  {isLoading ? "Sending..." : "Send reset link"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Check your email</h2>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Didn't receive the email? Check your spam folder or{" "}
                <button onClick={() => setIsSubmitted(false)} className="text-blue-600 hover:underline">
                  try again
                </button>
              </p>
              <Link href="/login" className="text-blue-600 hover:underline">
                Back to login
              </Link>
            </div>
          )}

          {!isSubmitted && (
            <div className="mt-4 text-center">
              <Link href="/login" className="text-blue-600 text-sm hover:underline">
                Back to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

