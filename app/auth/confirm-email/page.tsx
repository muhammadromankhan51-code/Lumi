'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, ArrowRight } from 'lucide-react'
import { Suspense } from 'react'

function ConfirmEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || 'your email'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {/* Header with Logo */}
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

          {/* Email Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
              <Mail className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Check Your Email</h2>
            <p className="text-gray-600">
              We&apos;ve sent a confirmation link to
            </p>
            <p className="font-semibold text-gray-900 bg-gray-50 py-2 px-4 rounded-lg inline-block">
              {email}
            </p>
            <p className="text-sm text-gray-500">
              Click the link in the email to verify your account and complete your registration.
            </p>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-900 mb-2">What&apos;s next?</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="font-semibold">1.</span>
                Open your email inbox
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold">2.</span>
                Click the confirmation link from Lumi
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold">3.</span>
                You&apos;ll be redirected to sign in
              </li>
            </ul>
          </div>

          {/* Resend & Sign In Links */}
          <div className="mt-8 space-y-4">
            <p className="text-sm text-gray-500 text-center">
              Didn&apos;t receive the email? Check your spam folder.
            </p>
            <Link
              href="/auth/signin"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue to Sign In
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <ConfirmEmailContent />
    </Suspense>
  )
}
