'use client'

import { Target } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

type LoadingSpinnerProps = {
  message?: string
  subMessage?: string
  icon?: LucideIcon
  iconColor?: string
  showDots?: boolean
}

export default function LoadingSpinner({
  message = 'Loading...',
  subMessage,
  icon: Icon = Target as LucideIcon,
  iconColor = 'text-primary',
  showDots = true
}: LoadingSpinnerProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        {/* Animated Icon Container */}
        <div className="relative mb-6 mx-auto w-20 h-20">
          {/* Pulsing background circle */}
          <div className="absolute inset-0 bg-primary/10 rounded-2xl animate-pulse"></div>
          
          {/* Rotating outer ring */}
          <div className={`absolute inset-0 border-4 border-transparent border-t-primary/30 rounded-2xl animate-spin`} style={{ animationDuration: '0.8s' }}></div>
          
          {/* Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className={`w-10 h-10 ${iconColor} animate-pulse`} style={{ animationDuration: '1s' }} />
          </div>
        </div>

        {/* Loading Text */}
        <h3 className="text-xl font-semibold text-foreground mb-2 animate-pulse" style={{ animationDuration: '1s' }}>
          {message}
        </h3>
        
        {subMessage && (
          <p className="text-muted-foreground animate-pulse mb-6" style={{ animationDuration: '1s' }}>
            {subMessage}
          </p>
        )}

        {/* Animated Dots */}
        {showDots && (
          <div className="flex justify-center gap-2 mt-8">
            <div 
              className="w-2 h-2 bg-primary rounded-full animate-bounce" 
              style={{ animationDelay: '0ms', animationDuration: '0.6s' }}
            ></div>
            <div 
              className="w-2 h-2 bg-primary rounded-full animate-bounce" 
              style={{ animationDelay: '120ms', animationDuration: '0.6s' }}
            ></div>
            <div 
              className="w-2 h-2 bg-primary rounded-full animate-bounce" 
              style={{ animationDelay: '240ms', animationDuration: '0.6s' }}
            ></div>
          </div>
        )}
      </div>
    </div>
  )
}

