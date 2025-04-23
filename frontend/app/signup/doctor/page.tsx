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
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")
  const [message, setMessage] = useState("")

  const medicalLicenseRef = useRef<HTMLInputElement>(null)
  const phdCertificateRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const signupData = {
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
        licenseNumber: ""
      };

      console.log('Submitting data:', {
        ...signupData,
        password: '***',
        medicalLicense: medicalLicense ? `File: ${medicalLicense.name}` : null,
        phdCertificate: phdCertificate ? `File: ${phdCertificate.name}` : null
      });

      await signupDoctor(signupData);
      setIsSubmitted(true);
      setRegisteredEmail(email);
    } catch (error) {
      console.error('Signup error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      e.target.value = '';
      return;
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError("Only JPG, PNG, and PDF files are allowed");
      e.target.value = '';
      return;
    }

    setFile(file);
    setError('');
  };

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden md:flex md:w-5/12 bg-[#023664] flex-col items-center justify-center text-white">
        <div className="absolute top-6 left-0 w-full flex justify-center z-10">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iPLCdILTkVCTPt0ecxQ9Si1shZBv8k.png"
            alt="HEALIX"
            width={180}
            height={70}
            className="object-contain"
          />
        </div>

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
                <h1 className="text-3xl font-bold mb-2">Doctor Sign up</h1>
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-blue-600 hover:underline">
                    Log in
                  </Link>
                </p>
              </div>

              {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

              <form onSubmit={handleSubmit}>
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
                      placeholder="Phone Number"
                    />
                  </div>
                </div>

                <div className="mb-4">
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
                      placeholder="Office Number"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="officeAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    Office Address
                  </label>
                  <input
                    id="officeAddress"
                    type="text"
                    value={officeAddress}
                    onChange={(e) => setOfficeAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Office Address"
                  />
                </div>

                <div className="mb-4">
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

                <div className="mb-4">
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

                <div className="mb-4">
                  <label htmlFor="phdCertificate" className="block text-sm font-medium text-gray-700 mb-1">
                    Upload PhD Certificate
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
            </>
          ) : (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Application Submitted</h2>
              <p className="text-gray-600 mb-6">
                Thank you for applying to join HEALIX as a healthcare provider.
              </p>
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

