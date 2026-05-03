'use client'

import Link from 'next/link'
import Image from 'next/image'
import { AlertCircle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image
                src="/lumi-logo.png"
                alt="RX Lumi"
                width={180}
                height={60}
                className="h-12 w-auto"
                style={{ filter: 'invert(36%) sepia(85%) saturate(1200%) hue-rotate(190deg) brightness(95%) contrast(101%)' }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">AI Digital Pharmacist</p>
          </div>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Error</h2>
              <p className="text-sm text-gray-600">
                Something went wrong during authentication. Please try again.
              </p>
            </div>
            <Link
              href="/auth/signin"
              className="inline-block w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors mt-4"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
