import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#002B5B] text-white py-12">
      <div className="max-w-[900px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Us Section */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6 relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></span>
            </h2>
            <div className="space-y-4">
              <p>Lebanon, Beirut</p>
              <p>+961(81890345)</p>
              <p>
                <a href="mailto:healix@it.com" className="hover:underline">
                  healix@it.com
                </a>
              </p>
            </div>
          </div>

          {/* Services Section */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6 relative inline-block">
              Services
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></span>
            </h2>
            <ul className="space-y-3">
              <li>
                <Link href="/services/cardiology" className="hover:underline">
                  Cardiology
                </Link>
              </li>
              <li>
                <Link href="/services/pulmonary" className="hover:underline">
                  Pulmonary
                </Link>
              </li>
              <li>
                <Link href="/services/neurology" className="hover:underline">
                  Neurology
                </Link>
              </li>
              <li>
                <Link href="/services/orthopedics" className="hover:underline">
                  Orthopedics
                </Link>
              </li>
              <li>
                <Link href="/services/hepatology" className="hover:underline">
                  Hepatology
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

