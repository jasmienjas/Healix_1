"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, X } from "lucide-react"
import Link from "next/link"
import { useAuth } from "../../context/auth-context"

export default function PatientSignupPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  // Update the state to include verification status
  const [isVerificationSent, setIsVerificationSent] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")

  const router = useRouter()
  const { signup } = useAuth()

  // Update the handleSignup function
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simple validation
    if (!firstName || !lastName || !email || !password || !phoneNumber || !birthDate) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    try {
      const userData = {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        birthDate,
      }

      const result = await signup(userData, "patient")

      if (result.success) {
        if (result.requiresVerification) {
          // Show verification sent screen
          setRegisteredEmail(email)
          setIsVerificationSent(true)
        } else {
          // Successful signup without verification (shouldn't happen with current flow)
          router.push("/dashboard")
        }
      } else {
        setError("An error occurred during signup")
      }
    } catch (err) {
      setError("An error occurred during signup")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Add a function to resend verification email
  const handleResendVerification = async () => {
    setIsLoading(true)
    try {
      // Assuming you have a function called resendVerificationEmail in your auth-context
      const resendVerificationEmail = () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(true)
          }, 1000)
        })
      }
      const success = await resendVerificationEmail(registeredEmail)
      if (!success) {
        setError("Failed to resend verification email. Please try again.")
      }
    } catch (err) {
      setError("An error occurred while resending the verification email")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Update the return statement to conditionally render the verification sent screen
  return (
    <div className="flex min-h-screen">
      {/* Left side with image and logo - UPDATED */}
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

      {/* Right side with signup form or verification message */}
      <div className="w-full md:w-7/12 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="md:hidden absolute top-4 right-4">
            <button className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {!isVerificationSent ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Patient Sign up</h1>
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-blue-600 hover:underline">
                    Log in
                  </Link>
                </p>
              </div>

              {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

              {/* Existing form code */}
              <form onSubmit={handleSignup}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="First Name"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div className="mb-4">
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

                <div className="mb-4">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="flex">
                    <div className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                      <select className="bg-transparent border-0 text-gray-500 text-sm focus:outline-none">
                        <option>+961</option>
                        <option>+1</option>
                        <option>+44</option>
                        <option>+33</option>
                      </select>
                    </div>
                    <input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Birth Date
                  </label>
                  <input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Create password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#023664] text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </button>
              </form>

              <div className="mt-4 text-center text-sm text-gray-600">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </div>
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
              <h2 className="text-2xl font-bold mb-2">Verify your email</h2>
              <p className="text-gray-600 mb-6">
                We've sent a verification link to <strong>{registeredEmail}</strong>
              </p>
              <p className="text-gray-600 mb-6">
                Please check your email and click the verification link to activate your account.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  onClick={handleResendVerification}
                  disabled={isLoading}
                  className="text-blue-600 hover:underline"
                >
                  {isLoading ? "Sending..." : "resend verification email"}
                </button>
              </p>
              <Link href="/login" className="text-blue-600 hover:underline">
                Back to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

