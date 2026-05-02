'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Home, Eye, Pill, AlertTriangle, Bell, User, MessageCircle, Settings, LogOut } from 'lucide-react'

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    { icon: Home, label: 'Home', href: '/dashboard' },
    { icon: Eye, label: 'Scan Prescription', href: '/dashboard/scan' },
    { icon: Pill, label: 'My Medicines', href: '/dashboard/medicines' },
    { icon: AlertTriangle, label: 'Drug Interactions', href: '/dashboard/interactions' },
    { icon: Bell, label: 'Reminders', href: '/dashboard/reminders' },
    { icon: User, label: 'Patient Profile', href: '/dashboard/profile' },
    { icon: MessageCircle, label: 'AI Chat Assistant', href: '/dashboard/chat' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ]

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const isActive = (href: string) => pathname === href

  return (
    <div className="w-56 bg-background border-r border-border h-screen flex flex-col p-6 fixed left-0 top-0 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-lg font-bold text-primary-foreground">⚡</span>
        </div>
        <div>
          <h1 className="font-bold text-lg text-foreground">Lumi</h1>
          <p className="text-xs text-muted-foreground leading-tight">AI Digital Pharmacist</p>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground hover:bg-accent/50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* AI Chat Widget */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 mb-6 border border-primary/20">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm">😊</span>
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">Hi! I&apos;m Lumi</p>
            <p className="text-xs text-muted-foreground">Your AI Pharmacist</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-4">How can I help you today?</p>
        <button
          onClick={() => router.push('/dashboard/chat')}
          className="w-full py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg transition-colors"
        >
          Talk to Lumi
        </button>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-2 px-4 py-3 rounded-lg border border-border hover:bg-destructive/5 hover:border-destructive/30 text-foreground transition-colors text-sm font-medium"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  )
}
