import Image from "next/image"
import Link from "next/link"
import ContactModal from "@/components/home/contact-window"


export default function SiteHeader() {
  return (
    <header className="bg-[#023664] text-white py-4 flex justify-between items-center px-8">
      <div className="flex items-center">
        <Link href="/">
          <div className="flex items-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iPLCdILTkVCTPt0ecxQ9Si1shZBv8k.png"
              alt="HEALIX"
              width={120}
              height={50}
              className="object-contain"
            />
          </div>
        </Link>
      </div>

      <nav className="flex items-center space-x-8">
        <Link href="/login" className="hover:text-gray-300 transition-colors">
          Login
        </Link>
        <Link href="/signup" className="hover:text-gray-300 transition-colors">
          Signup
        </Link>
        <ContactModal />
      </nav>
    </header>
  )
}

