'use client'

import React from 'react'

interface LumiAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isAnimated?: boolean
  isSpeaking?: boolean
  className?: string
}

export function LumiAvatar({ size = 'md', isAnimated = true, isSpeaking = false, className = '' }: LumiAvatarProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  }

  const eyeSize = {
    sm: 'w-1.5 h-2',
    md: 'w-2.5 h-3',
    lg: 'w-4 h-5',
    xl: 'w-5 h-6'
  }

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 blur-lg opacity-40 ${isAnimated ? 'animate-pulse-soft' : ''}`} />
      
      {/* Main body */}
      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 flex items-center justify-center overflow-hidden">
        {/* Face shine */}
        <div className="absolute top-1 left-1/4 w-1/3 h-1/4 bg-white/20 rounded-full blur-sm" />
        
        {/* Eyes container */}
        <div className="flex gap-[15%] items-center">
          {/* Left eye */}
          <div className="relative">
            <div className={`${eyeSize[size]} bg-white rounded-full shadow-inner ${isAnimated ? 'animate-blink' : ''}`}>
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-blue-900 rounded-full ${isSpeaking ? 'animate-bounce' : ''}`} />
            </div>
          </div>
          
          {/* Right eye */}
          <div className="relative">
            <div className={`${eyeSize[size]} bg-white rounded-full shadow-inner ${isAnimated ? 'animate-blink' : ''}`}>
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-blue-900 rounded-full ${isSpeaking ? 'animate-bounce' : ''}`} />
            </div>
          </div>
        </div>
        
        {/* Smile */}
        <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[30%] h-[8%] border-b-2 border-white rounded-b-full opacity-80" />
        
        {/* Antenna */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-white/80 rounded-full">
          <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/50 ${isAnimated ? 'animate-pulse' : ''}`} />
        </div>
      </div>
    </div>
  )
}

// CSS Keyframes (add to globals.css)
// @keyframes blink {
//   0%, 90%, 100% { transform: scaleY(1); }
//   95% { transform: scaleY(0.1); }
// }
