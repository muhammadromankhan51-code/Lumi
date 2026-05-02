'use client'

import React from 'react'
import { ShoppingCart, User, Bell, Share2 } from 'lucide-react'

export function ActionButtons() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Order Medicine */}
      <button className="bg-gradient-to-br from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-colors shadow-md hover:shadow-lg">
        <ShoppingCart className="w-8 h-8" />
        <div className="text-center">
          <p className="font-semibold text-sm">Order Medicine</p>
          <p className="text-xs opacity-90">Get medicines delivered</p>
        </div>
      </button>

      {/* Consult Doctor */}
      <button className="bg-gradient-to-br from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-colors shadow-md hover:shadow-lg">
        <User className="w-8 h-8" />
        <div className="text-center">
          <p className="font-semibold text-sm">Consult Doctor</p>
          <p className="text-xs opacity-90">Talk to a doctor online</p>
        </div>
      </button>

      {/* Set Reminder */}
      <button className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-colors shadow-md hover:shadow-lg">
        <Bell className="w-8 h-8" />
        <div className="text-center">
          <p className="font-semibold text-sm">Set Reminder</p>
          <p className="text-xs opacity-90">Never miss your medication</p>
        </div>
      </button>

      {/* Share Report */}
      <button className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-colors shadow-md hover:shadow-lg">
        <Share2 className="w-8 h-8" />
        <div className="text-center">
          <p className="font-semibold text-sm">Share Report</p>
          <p className="text-xs opacity-90">Share analysis with family or doctor</p>
        </div>
      </button>
    </div>
  )
}
