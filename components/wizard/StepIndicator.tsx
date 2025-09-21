'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface StepIndicatorProps {
  steps: string[]
  currentStep: number
  className?: string
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center justify-between w-full", className)}>
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                index < currentStep
                  ? "border-green-400 bg-green-500 text-white"
                  : index === currentStep
                  ? "border-primary bg-primary text-white"
                  : "border-muted-foreground/40 bg-muted/20 text-muted-foreground"
              )}
            >
              {index < currentStep ? (
                <Check className="h-5 w-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <div className="mt-2 text-center">
              <span
                className={cn(
                  "text-sm font-medium capitalize",
                  index < currentStep 
                    ? "text-green-300" 
                    : index === currentStep 
                    ? "text-primary-foreground" 
                    : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "mx-4 h-0.5 w-16 transition-colors",
                index < currentStep ? "bg-green-400" : "bg-muted-foreground/30"
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}