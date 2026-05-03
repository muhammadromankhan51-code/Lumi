'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Suspense } from 'react'

function ConfirmEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || 'your email'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100/50 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="glass-card-elevated rounded-3xl p-8 text-center">
          {/* Header with Text Logo */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
              Lumi
            </h1>
            <p className="text-sm text-muted-foreground">AI Digital Pharmacist</p>
          </div>

          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full animate-pulse-soft" />
            <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-3">Check Your Email</h2>
          
          <p className="text-muted-foreground mb-2">
            We&apos;ve sent a confirmation link to
          </p>
          <p className="font-semibold text-foreground mb-6 bg-blue-50 rounded-lg py-2 px-4 inline-block">
            {email}
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-100">
            <div className="flex items-start gap-3 text-left">
              <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-foreground font-medium mb-1">Next Steps</p>
                <p className="text-sm text-muted-foreground">
                  Click the link in your email to verify your account, then you can sign in.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 btn-premium"
          >
            Continue to Sign In
            <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="text-xs text-muted-foreground mt-6">
            Didn&apos;t receive the email? Check your spam folder or{' '}
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
              try again
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    }>
      <ConfirmEmailContent />
    </Suspense>
  )
}
