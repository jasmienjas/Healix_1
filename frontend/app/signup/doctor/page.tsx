"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, X, Calendar, Paperclip } from "lucide-react"
import Link from "next/link"
import { useAuth } from "../../context/auth-context"
import { signupDoctor, checkDoctorApprovalStatus } from "@/services/doctor"

export default function DoctorSignupPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [officeNumber, setOfficeNumber] = useState("")
  const [officeAddress, setOfficeAddress] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [medicalLicense, setMedicalLicense] = useState<File | null>(null)
  const [phdCertificate, setPhdCertificate] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  // Update the state to include approval status
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")
  const [message, setMessage] = useState("")

  const medicalLicenseRef = useRef<HTMLInputElement>(null)
  const phdCertificateRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
  const { signup } = useAuth()

  // Update the handleSignup function
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simple validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phoneNumber ||
      !officeNumber ||
      !officeAddress ||
      !birthDate
    ) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    if (!medicalLicense) {
      setError("Please upload your medical license")
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
        officeNumber,
        officeAddress,
        birthDate,
        medicalLicense,
        phdCertificate,
      }

      const result = await signupDoctor(userData)
      
      // Check if we got a successful response with an ID
      if (result && result.id) {
        setRegisteredEmail(result.email)
        setIsSubmitted(true)
        // You might want to show a success message
        setMessage("Registration successful! Please wait for admin approval.")
      } else {
        setError("Registration failed. Please try again.")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during signup")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Add a function to check approval status
  const [approvalStatus, setApprovalStatus] = useState<"pending" | "approved" | "rejected" | "not_found">("pending")

  const checkStatus = async () => {
    setIsLoading(true)
    try {
      const status = await checkDoctorApprovalStatus(registeredEmail)
      setApprovalStatus(status)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to check status")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  // Update the return statement to conditionally render the approval pending screen
  return (
    <div className="min-h-screen bg-white">
      <div className="absolute top-4 right-4">
        <button className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      <div className="flex justify-center items-center p-8 min-h-screen">
        <div className="w-full max-w-4xl">
          {!isSubmitted ? (
            <>
              <div className="mb-8 text-center">
                <div className="flex justify-center mb-6">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iPLCdILTkVCTPt0ecxQ9Si1shZBv8k.png"
                    alt="HEALIX"
                    width={150}
                    height={60}
                    className="object-contain"
                  />
                </div>
                <h1 className="text-3xl font-bold mb-2">Doctor Sign up</h1>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left column */}
                  <div className="space-y-4">
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
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="flex">
                        <div className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                          <div className="flex items-center gap-1">
                            <Image
                              src="/placeholder.svg?height=20&width=30"
                              alt="Lebanon"
                              width={20}
                              height={15}
                              className="rounded"
                            />
                            <select className="bg-transparent border-0 text-gray-500 text-sm focus:outline-none">
                              <option>+961</option>
                              <option>+1</option>
                              <option>+44</option>
                              <option>+33</option>
                            </select>
                          </div>
                        </div>
                        <input
                          id="phoneNumber"
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="officeNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Office Number
                      </label>
                      <div className="flex">
                        <div className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                          <div className="flex items-center gap-1">
                            <Image
                              src="/placeholder.svg?height=20&width=30"
                              alt="Lebanon"
                              width={20}
                              height={15}
                              className="rounded"
                            />
                            <select className="bg-transparent border-0 text-gray-500 text-sm focus:outline-none">
                              <option>+961</option>
                              <option>+1</option>
                              <option>+44</option>
                              <option>+33</option>
                            </select>
                          </div>
                        </div>
                        <input
                          id="officeNumber"
                          type="tel"
                          value={officeNumber}
                          onChange={(e) => setOfficeNumber(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right column */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="officeAddress" className="block text-sm font-medium text-gray-700 mb-1">
                        Office Address
                      </label>
                      <input
                        id="officeAddress"
                        type="text"
                        value={officeAddress}
                        onChange={(e) => setOfficeAddress(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="medicalLicense" className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Medical License
                      </label>
                      <div
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 cursor-pointer flex items-center"
                        onClick={() => medicalLicenseRef.current?.click()}
                      >
                        <input
                          ref={medicalLicenseRef}
                          id="medicalLicense"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, setMedicalLicense)}
                        />
                        <Paperclip className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-gray-500 truncate flex-1">
                          {medicalLicense ? medicalLicense.name : "Click to upload"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phdCertificate" className="block text-sm font-medium text-gray-700 mb-1">
                        Upload PhD
                      </label>
                      <div
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 cursor-pointer flex items-center"
                        onClick={() => phdCertificateRef.current?.click()}
                      >
                        <input
                          ref={phdCertificateRef}
                          id="phdCertificate"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, setPhdCertificate)}
                        />
                        <Paperclip className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-gray-500 truncate flex-1">
                          {phdCertificate ? phdCertificate.name : "Click to upload"}
                        </span>
                      </div>
                    </div>

                    <div>
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

                    <div>
                      <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Birth Date
                      </label>
                      <div className="relative">
                        <input
                          id="birthDate"
                          type="date"
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#023664] text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
                  >
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </button>
                </div>
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
            <div className="text-center max-w-md mx-auto">
              <div className="flex justify-center mb-6">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iPLCdILTkVCTPt0ecxQ9Si1shZBv8k.png"
                  alt="HEALIX"
                  width={150}
                  height={60}
                  className="object-contain"
                />
              </div>
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Application Submitted</h2>
              <p className="text-gray-600 mb-6">Thank you for applying to join HEALIX as a healthcare provider.</p>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-blue-700 mb-2">What happens next?</h3>
                <ol className="text-left text-gray-600 space-y-2 pl-5 list-decimal">
                  <li>Our admin team will review your application and credentials</li>
                  <li>We'll verify your medical license and professional qualifications</li>
                  <li>You'll receive an email notification once your account is approved</li>
                </ol>
              </div>
              <p className="text-gray-600 mb-6">
                This process typically takes 1-3 business days. You can check your application status anytime.
              </p>
              <div className="flex flex-col space-y-4">
                <button
                  onClick={checkStatus}
                  disabled={isLoading}
                  className="w-full bg-[#023664] text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
                >
                  {isLoading ? "Checking..." : "Check Application Status"}
                </button>
                <Link href="/login" className="text-blue-600 hover:underline">
                  Back to login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

