"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, X } from "lucide-react"
import Link from "next/link"
import { useAuth } from "../context/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simple validation
    if (!email || !password) {
      setError("Please enter both email and password")
      setIsLoading(false)
      return
    }

    try {
      const success = await login(email, password)

      if (success) {
        // Successful login
        router.push("/dashboard")
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred during login")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

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

      {/* Right side with login form */}
      <div className="w-full md:w-7/12 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="md:hidden absolute top-4 right-4">
            <button className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-gray-600">
              New to Healix?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

          <form onSubmit={handleLogin}>
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

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Your password
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
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#023664] text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/forgot-password" className="text-blue-600 text-sm hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

