"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "../context/auth-context"

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()
  const { verifyEmail } = useAuth()

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Get token from URL
        const token = searchParams.get("token")

        if (!token) {
          setError("Invalid verification link. Please try again or request a new verification email.")
          setIsVerifying(false)
          return
        }

        // Verify email with token
        const success = await verifyEmail(token)

        if (success) {
          setIsSuccess(true)
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push("/dashboard")
          }, 3000)
        } else {
          setError("Failed to verify your email. The link may have expired or is invalid.")
        }
      } catch (err) {
        console.error(err)
        setError("An error occurred during verification. Please try again later.")
      } finally {
        setIsVerifying(false)
      }
    }

    verifyToken()
  }, [searchParams, verifyEmail, router])

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

        {/* Background image with healthcare professionals */}
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

      {/* Right side with verification content */}
      <div className="w-full md:w-7/12 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-6 flex justify-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iPLCdILTkVCTPt0ecxQ9Si1shZBv8k.png"
              alt="HEALIX"
              width={120}
              height={50}
              className="mx-auto"
            />
          </div>

          {isVerifying ? (
            <>
              <div className="animate-pulse mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 mx-auto flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-center">Verifying your email</h2>
              <p className="text-gray-600 text-center">Please wait while we verify your email address...</p>
            </>
          ) : isSuccess ? (
            <>
              <div className="mb-4">
                <div className="w-16 h-16 rounded-full bg-green-100 mx-auto flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-center">Email Verified!</h2>
              <p className="text-gray-600 mb-4 text-center">
                Your email has been successfully verified. You are now being redirected to your dashboard.
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div className="bg-blue-600 h-2.5 rounded-full w-full animate-[progress_3s_ease-in-out]"></div>
              </div>
              <p className="text-sm text-gray-500 text-center">
                If you are not redirected automatically, please{" "}
                <Link href="/dashboard" className="text-blue-600 hover:underline">
                  click here
                </Link>
              </p>
            </>
          ) : (
            <>
              <div className="mb-4">
                <div className="w-16 h-16 rounded-full bg-red-100 mx-auto flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-center">Verification Failed</h2>
              <p className="text-gray-600 mb-6 text-center">{error}</p>
              <div className="flex flex-col space-y-4">
                <Link
                  href="/signup"
                  className="w-full bg-[#023664] text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-center"
                >
                  Try Again
                </Link>
                <Link href="/login" className="text-blue-600 hover:underline text-center">
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

