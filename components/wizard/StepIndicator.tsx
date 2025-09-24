'use client'

import { cn } from '@/lib/utils'
import { Check, Lock, ChevronRight } from 'lucide-react'

interface StepIndicatorProps {
  steps: string[]
  currentStep: number
  className?: string
  onStepClick?: (stepIndex: number) => void
  isTransitioning?: boolean
}

export function StepIndicator({ 
  steps, 
  currentStep, 
  className, 
  onStepClick,
  isTransitioning = false 
}: StepIndicatorProps) {
  
  const isStepClickable = (stepIndex: number) => {
    // Can click on completed steps or the next step
    return stepIndex <= currentStep + 1 && onStepClick && !isTransitioning
  }

  const handleStepClick = (stepIndex: number) => {
    if (isStepClickable(stepIndex)) {
      onStepClick?.(stepIndex)
    }
  }

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed'
    if (stepIndex === currentStep) return 'current'
    if (stepIndex === currentStep + 1) return 'next'
    return 'future'
  }

  return (
    <div className={cn("flex items-center justify-between w-full", className)}>
      {steps.map((step, index) => {
        const status = getStepStatus(index)
        const isClickable = isStepClickable(index)
        
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center group">
              {/* Step Circle with Multiple Visual Effects */}
              <div className="relative">
                {/* Glow effect for clickable steps */}
                {isClickable && (
                  <div className={cn(
                    "absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    status === 'completed' && "bg-green-400/30 blur-md",
                    status === 'next' && "bg-primary/30 blur-md"
                  )} />
                )}
                
                {/* Pulse ring for next step */}
                {status === 'next' && isClickable && (
                  <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-ping opacity-30" />
                )}
                
                <div
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200",
                    // Completed steps
                    status === 'completed' && [
                      "border-green-400 bg-green-500 text-white",
                      isClickable && "hover:bg-green-600 hover:border-green-300 hover:shadow-lg hover:shadow-green-500/25 cursor-pointer"
                    ],
                    // Current step
                    status === 'current' && [
                      "border-primary bg-primary text-white shadow-lg shadow-primary/25",
                      isTransitioning && "animate-pulse"
                    ],
                    // Next step (clickable)
                    status === 'next' && [
                      "border-primary/60 bg-primary/10 text-primary",
                      isClickable && [
                        "hover:bg-primary hover:text-white hover:border-primary hover:shadow-lg hover:shadow-primary/25 cursor-pointer",
                        "ring-0 hover:ring-2 hover:ring-primary/20 hover:ring-offset-2 hover:ring-offset-background"
                      ],
                      !isClickable && "opacity-50"
                    ],
                    // Future steps
                    status === 'future' && [
                      "border-muted-foreground/40 bg-muted/20 text-muted-foreground",
                      "opacity-50"
                    ],
                    // Global disabled state
                    isTransitioning && "cursor-not-allowed opacity-70"
                  )}
                  onClick={() => handleStepClick(index)}
                  title={
                    isClickable 
                      ? status === 'completed' 
                        ? `Go back to ${step}` 
                        : status === 'next' 
                          ? `Go to ${step}`
                          : `Current: ${step}`
                      : status === 'future' 
                        ? `Complete previous steps to unlock ${step}`
                        : step
                  }
                >
                  {status === 'completed' ? (
                    <Check className="h-5 w-5" />
                  ) : status === 'future' ? (
                    <Lock className="h-3 w-3" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
              </div>
              
              {/* Step Label */}
              <div className="mt-2 text-center relative">
                <span
                  className={cn(
                    "text-sm font-medium capitalize transition-all duration-200",
                    status === 'completed' && [
                      "text-green-400",
                      isClickable && "group-hover:text-green-300"
                    ],
                    status === 'current' && "text-primary font-semibold",
                    status === 'next' && [
                      "text-primary/70",
                      isClickable && "group-hover:text-primary group-hover:font-semibold"
                    ],
                    status === 'future' && "text-muted-foreground/50",
                    isTransitioning && "opacity-70"
                  )}
                >
                  {step}
                </span>
                
                {/* Clickable indicator for next step */}
                {status === 'next' && isClickable && (
                  <div className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1">
                    <ChevronRight className="h-3 w-3 text-primary/60" />
                  </div>
                )}
                
                {/* Subtle underline for clickable steps */}
                {isClickable && (
                  <div className={cn(
                    "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-full transition-all duration-300",
                    status === 'completed' && "bg-green-400",
                    status === 'next' && "bg-primary"
                  )} />
                )}
              </div>
            </div>
            
            {/* Connection Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-4 h-0.5 w-16 transition-all duration-300",
                  index < currentStep ? "bg-green-400 shadow-sm" : "bg-muted-foreground/30"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}