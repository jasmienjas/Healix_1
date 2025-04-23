'use client'
import { useState } from 'react'

interface ContactModalProps {
  trigger?: React.ReactNode
}

export default function ContactModal({ trigger }: ContactModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {trigger ? (
        <div onClick={() => setIsOpen(true)} className="inline-block cursor-pointer">
          {trigger}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="text-white hover:text-blue-300 transition-colors"
        >
          Contact
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm">
            <h3 className="text-lg font-semibold text-navy-800 mb-4">Contact Us</h3>
            <p className="text-navy-700 mb-2">📍 Beirut, Lebanon</p>
            <p className="text-navy-700 mb-2">📞 +961 71 123 456</p>
            <p className="text-navy-700 mb-4">📧 contact@healix.com</p>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-2 w-full bg-navy-700 text-white py-2 rounded hover:bg-navy-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
