'use client'

import React, { useState, useEffect } from 'react'

interface LumiMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  state?: 'idle' | 'waving' | 'thinking' | 'speaking' | 'celebrating' | 'loading'
  className?: string
  showGreeting?: boolean
  greetingText?: string
}

export function LumiMascot({ 
  size = 'md', 
  state = 'idle', 
  className = '',
  showGreeting = false,
  greetingText = 'Hi there!'
}: LumiMascotProps) {
  const [isBlinking, setIsBlinking] = useState(false)
  const [currentState, setCurrentState] = useState(state)

  // Auto blink effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 150)
    }, 3000 + Math.random() * 2000)
    
    return () => clearInterval(blinkInterval)
  }, [])

  useEffect(() => {
    setCurrentState(state)
  }, [state])

  const sizeConfig = {
    sm: { container: 'w-12 h-12', eye: 'w-1.5 h-2', pupil: 'w-1 h-1', arm: 'w-2 h-4', hand: 'w-3 h-3' },
    md: { container: 'w-20 h-20', eye: 'w-2.5 h-3', pupil: 'w-1.5 h-1.5', arm: 'w-3 h-6', hand: 'w-4 h-4' },
    lg: { container: 'w-28 h-28', eye: 'w-3.5 h-4', pupil: 'w-2 h-2', arm: 'w-4 h-8', hand: 'w-5 h-5' },
    xl: { container: 'w-36 h-36', eye: 'w-4 h-5', pupil: 'w-2.5 h-2.5', arm: 'w-5 h-10', hand: 'w-6 h-6' },
    '2xl': { container: 'w-48 h-48', eye: 'w-5 h-6', pupil: 'w-3 h-3', arm: 'w-6 h-12', hand: 'w-8 h-8' }
  }

  const config = sizeConfig[size]

  const getStateAnimation = () => {
    switch (currentState) {
      case 'waving':
        return 'animate-bounce-gentle'
      case 'thinking':
        return 'animate-pulse-soft'
      case 'speaking':
        return ''
      case 'celebrating':
        return 'animate-bounce-gentle'
      case 'loading':
        return 'animate-float'
      default:
        return 'animate-float'
    }
  }

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {/* Speech bubble */}
      {showGreeting && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white rounded-xl px-4 py-2 shadow-lg border border-blue-100 whitespace-nowrap animate-fade-in z-10">
          <p className="text-sm font-medium text-foreground">{greetingText}</p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-blue-100 rotate-45" />
        </div>
      )}

      <div className={`relative ${config.container} ${getStateAnimation()}`}>
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 blur-xl opacity-40 ${currentState === 'loading' ? 'animate-glow-pulse' : 'animate-pulse-soft'}`} />
        
        {/* Waving arm (left side) */}
        {currentState === 'waving' && (
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 origin-bottom animate-wave z-20">
            <div className={`${config.arm} bg-gradient-to-br from-blue-400 to-blue-500 rounded-full`} />
            <div className={`${config.hand} bg-gradient-to-br from-blue-300 to-blue-400 rounded-full -mt-1 ml-0.5`} />
          </div>
        )}
        
        {/* Main body */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 shadow-xl shadow-blue-500/30 flex items-center justify-center overflow-hidden">
          {/* Face shine */}
          <div className="absolute top-2 left-1/4 w-1/3 h-1/4 bg-white/25 rounded-full blur-sm" />
          <div className="absolute top-1 right-1/4 w-1/6 h-1/6 bg-white/30 rounded-full blur-xs" />
          
          {/* Eyes container */}
          <div className="flex gap-[18%] items-center mt-[5%]">
            {/* Left eye */}
            <div className="relative">
              <div 
                className={`${config.eye} bg-white rounded-full shadow-inner transition-transform duration-100`}
                style={{ transform: isBlinking ? 'scaleY(0.1)' : 'scaleY(1)' }}
              >
                <div 
                  className={`absolute bottom-[15%] left-1/2 -translate-x-1/2 ${config.pupil} bg-blue-900 rounded-full transition-all duration-200 ${currentState === 'thinking' ? 'animate-thinking' : ''}`}
                  style={{ 
                    transform: currentState === 'speaking' 
                      ? 'translateX(-50%) translateY(-20%)' 
                      : 'translateX(-50%)'
                  }}
                />
              </div>
            </div>
            
            {/* Right eye */}
            <div className="relative">
              <div 
                className={`${config.eye} bg-white rounded-full shadow-inner transition-transform duration-100`}
                style={{ transform: isBlinking ? 'scaleY(0.1)' : 'scaleY(1)' }}
              >
                <div 
                  className={`absolute bottom-[15%] left-1/2 -translate-x-1/2 ${config.pupil} bg-blue-900 rounded-full transition-all duration-200 ${currentState === 'thinking' ? 'animate-thinking' : ''}`}
                  style={{ 
                    transform: currentState === 'speaking' 
                      ? 'translateX(-50%) translateY(-20%)' 
                      : 'translateX(-50%)'
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Mouth */}
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2">
            {currentState === 'speaking' ? (
              <div className="w-[25%] aspect-square bg-blue-900/60 rounded-full animate-pulse" style={{ width: size === 'sm' ? '8px' : size === 'md' ? '12px' : '16px' }} />
            ) : currentState === 'celebrating' ? (
              <div className="w-[35%] h-[15%] bg-blue-900/40 rounded-t-full" style={{ width: size === 'sm' ? '12px' : size === 'md' ? '18px' : '24px', height: size === 'sm' ? '6px' : size === 'md' ? '8px' : '12px' }} />
            ) : (
              <div 
                className="border-b-2 border-white/80 rounded-b-full"
                style={{ 
                  width: size === 'sm' ? '10px' : size === 'md' ? '16px' : size === 'lg' ? '22px' : '28px',
                  height: size === 'sm' ? '3px' : size === 'md' ? '5px' : '7px'
                }}
              />
            )}
          </div>
          
          {/* Antenna */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2">
            <div className="w-0.5 h-3 bg-white/80 rounded-full">
              <div className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/50 ${currentState === 'loading' ? 'animate-pulse' : currentState === 'celebrating' ? 'animate-bounce' : 'animate-pulse-soft'}`} />
            </div>
          </div>

          {/* Cheek blush */}
          <div className="absolute bottom-[30%] left-[15%] w-[12%] h-[8%] bg-pink-400/30 rounded-full blur-sm" />
          <div className="absolute bottom-[30%] right-[15%] w-[12%] h-[8%] bg-pink-400/30 rounded-full blur-sm" />
        </div>

        {/* Thinking dots */}
        {currentState === 'thinking' && (
          <div className="absolute -right-8 top-0 flex gap-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-typing-dot" />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-typing-dot-2" />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-typing-dot-3" />
          </div>
        )}

        {/* Celebration sparkles */}
        {currentState === 'celebrating' && (
          <>
            <div className="absolute -top-2 -left-2 w-3 h-3 text-yellow-400 animate-ping">✨</div>
            <div className="absolute -top-1 -right-3 w-3 h-3 text-yellow-400 animate-ping" style={{ animationDelay: '0.2s' }}>✨</div>
            <div className="absolute -bottom-1 -right-2 w-3 h-3 text-yellow-400 animate-ping" style={{ animationDelay: '0.4s' }}>✨</div>
          </>
        )}
      </div>
    </div>
  )
}

// Loading component with Lumi
export function LumiLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
      <LumiMascot size="lg" state="loading" />
      <div className="mt-4 flex items-center gap-2">
        <span className="text-foreground font-medium">{text}</span>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-typing-dot" />
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-typing-dot-2" />
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-typing-dot-3" />
        </div>
      </div>
    </div>
  )
}

// Thinking component with Lumi
export function LumiThinking({ text = 'Thinking...' }: { text?: string }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-xl animate-fade-in">
      <LumiMascot size="sm" state="thinking" />
      <div className="flex items-center gap-2">
        <span className="text-foreground">{text}</span>
      </div>
    </div>
  )
}
