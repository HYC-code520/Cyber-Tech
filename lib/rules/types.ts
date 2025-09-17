export interface Indicator {
  type: string
  value: unknown
  confidence?: number
}

export interface Classification {
  type: string
  confidence: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  indicators: Indicator[]
}

export interface Recommendation {
  action: string
  reason: string
  citation: string
  priority: number
  category: 'immediate' | 'follow_up' | 'optional'
}

export interface AttackPattern {
  name: string
  displayName: string
  indicators: {
    [key: string]: (value: unknown) => boolean
  }
  confidenceThreshold: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  mitreId?: string | null
}