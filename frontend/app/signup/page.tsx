"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import Link from "next/link"

export default function SignupTypePage() {
  const router = useRouter()

  const handleSelectUserType = (type: "patient" | "doctor") => {
    router.push(`/signup/${type}`)
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

      {/* Right side with user type selection */}
      <div className="w-full md:w-7/12 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="md:hidden absolute top-4 right-4">
            <button className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Join HEALIX</h1>
            <p className="text-gray-600">Choose how you want to use our platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => handleSelectUserType("patient")}
              className="flex flex-col items-center p-8 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">I'm a Patient</h3>
              <p className="text-gray-500 text-center text-sm">
                Find doctors, book appointments, and manage your health
              </p>
            </button>

            <button
              onClick={() => handleSelectUserType("doctor")}
              className="flex flex-col items-center p-8 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">I'm a Doctor</h3>
              <p className="text-gray-500 text-center text-sm">Manage your practice, patients, and appointments</p>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

