'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageSquare, ScanLine, AlertTriangle, Settings, HelpCircle, Stethoscope } from 'lucide-react'
import { LumiMascot } from '@/components/lumi-mascot'

const mainNavItems = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Chat', href: '/dashboard/chat', icon: MessageSquare },
  { name: 'Scan', href: '/dashboard/scan', icon: ScanLine },
  { name: 'Interactions', href: '/dashboard/interactions', icon: AlertTriangle },
  { name: 'Consult', href: '/dashboard/consult', icon: Stethoscope },
]

const bottomNavItems = [
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Help', href: '/dashboard/help', icon: HelpCircle },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 bg-white border-r border-border/50 flex flex-col z-50 shadow-sm">
      {/* Logo Section */}
      <div className="p-5 border-b border-border/50">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="transition-transform duration-300 group-hover:scale-110">
            <LumiMascot size="sm" state="idle" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Lumi
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">AI Pharmacist</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-primary'} transition-colors`} />
              <span>{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Promotional Card */}
      <div className="px-3 mb-3">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold text-blue-700">Pro Tip</span>
          </div>
          <p className="text-xs text-blue-700/70 leading-relaxed">
            Check drug interactions before taking new medications to stay safe.
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-3 border-t border-border/50 space-y-1">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
