"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "../context/auth-context"

export default function CheckStatusPage() {
  const [email, setEmail] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | "not_found" | null>(null)
  const [error, setError] = useState("")

  const { checkApprovalStatus } = useAuth()

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setStatus(null)
    setIsChecking(true)

    if (!email) {
      setError("Please enter your email address")
      setIsChecking(false)
      return
    }

    try {
      const result = await checkApprovalStatus(email)
      setStatus(result)
    } catch (err) {
      console.error(err)
      setError("An error occurred while checking your application status")
    } finally {
      setIsChecking(false)
    }
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

      {/* Right side with check status form */}
      <div className="w-full md:w-7/12 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="md:hidden mb-6">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iPLCdILTkVCTPt0ecxQ9Si1shZBv8k.png"
                alt="HEALIX"
                width={120}
                height={50}
                className="mx-auto"
              />
            </div>

            <h2 className="text-2xl font-bold mb-2">Check Application Status</h2>
            <p className="text-gray-600 mb-6">Enter the email address you used to apply as a healthcare provider</p>

            {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

            <form onSubmit={handleCheckStatus} className="mb-6">
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="doctor@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={isChecking}
                className="w-full bg-[#023664] text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
              >
                {isChecking ? "Checking..." : "Check Status"}
              </button>
            </form>

            {status && (
              <div
                className={`p-4 rounded-lg mb-6 ${
                  status === "pending"
                    ? "bg-yellow-50 text-yellow-800"
                    : status === "approved"
                      ? "bg-green-50 text-green-800"
                      : status === "rejected"
                        ? "bg-red-50 text-red-800"
                        : "bg-gray-50 text-gray-800"
                }`}
              >
                {status === "pending" && (
                  <>
                    <h3 className="font-semibold mb-2">Application Under Review</h3>
                    <p className="mb-2">
                      Your application is currently being reviewed by our admin team. This process typically takes 1-3
                      business days.
                    </p>
                    <p className="text-sm">You will receive an email notification once your account is approved.</p>
                  </>
                )}

                {status === "approved" && (
                  <>
                    <h3 className="font-semibold mb-2">Application Approved!</h3>
                    <p className="mb-2">
                      Congratulations! Your application has been approved. You can now log in to your account.
                    </p>
                    <Link href="/login" className="text-blue-600 hover:underline">
                      Go to login
                    </Link>
                  </>
                )}

                {status === "rejected" && (
                  <>
                    <h3 className="font-semibold mb-2">Application Rejected</h3>
                    <p className="mb-2">
                      We're sorry, but your application has been rejected. Please contact our support team for more
                      information.
                    </p>
                    <a href="mailto:support@healix.com" className="text-blue-600 hover:underline">
                      Contact Support
                    </a>
                  </>
                )}

                {status === "not_found" && (
                  <>
                    <h3 className="font-semibold mb-2">Application Not Found</h3>
                    <p className="mb-2">
                      We couldn't find an application associated with this email address. Please check the email address
                      and try again.
                    </p>
                    <Link href="/signup/doctor" className="text-blue-600 hover:underline">
                      Apply as a Doctor
                    </Link>
                  </>
                )}
              </div>
            )}

            <div className="mt-6 text-center">
              <Link href="/login" className="text-blue-600 hover:underline">
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

