export interface LoginAttempt {
  id: string
  email: string
  ipAddress: string
  timestamp: Date
  success: boolean
  userAgent: string
}

export interface AttackPattern {
  type: 'password_spray' | 'credential_stuffing' | 'brute_force'
  confidence: number
  indicators: Record<string, any>
}

export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH'

export class AttackDetector {
  private attempts: Map<string, LoginAttempt[]> = new Map()
  private readonly WINDOW_MINUTES = 5
  private readonly ATTEMPT_THRESHOLDS = {
    WARNING: 3,
    CRITICAL: 5
  }
  private readonly MAX_ATTEMPTS_PER_SECOND = 0.5

  async recordAttempt(
    email: string, 
    ipAddress: string, 
    userAgent: string
  ): Promise<number> {
    const now = new Date()
    const windowStart = new Date(now.getTime() - (this.WINDOW_MINUTES * 60 * 1000))
    
    // Get existing attempts for this user
    let userAttempts = this.attempts.get(email) || []
    
    // Filter to time window - remove old attempts
    userAttempts = userAttempts.filter(a => a.timestamp >= windowStart)
    
    // Add new attempt
    const newAttempt: LoginAttempt = {
      id: crypto.randomUUID(),
      email,
      ipAddress,
      timestamp: now,
      success: false,
      userAgent
    }
    
    userAttempts.push(newAttempt)
    this.attempts.set(email, userAttempts)
    
    // Clean up old entries periodically
    this.cleanupOldAttempts()
    
    return userAttempts.length
  }

  analyzePattern(email: string): AttackPattern | null {
    const userAttempts = this.attempts.get(email) || []
    
    if (userAttempts.length < 3) return null

    const uniqueIPs = new Set(userAttempts.map(a => a.ipAddress))
    const timeSpan = this.calculateTimeSpan(userAttempts)
    const frequency = userAttempts.length / Math.max(timeSpan / 1000, 1) // attempts per second

    // Brute force detection - rapid attempts
    if (frequency > this.MAX_ATTEMPTS_PER_SECOND) {
      return {
        type: 'brute_force',
        confidence: 0.9,
        indicators: {
          attempts_per_second: frequency,
          total_attempts: userAttempts.length,
          unique_ips: uniqueIPs.size,
          time_window_minutes: this.WINDOW_MINUTES
        }
      }
    }

    // Distributed attack detection
    if (uniqueIPs.size > 2) {
      return {
        type: 'credential_stuffing',
        confidence: 0.85,
        indicators: {
          failed_attempts: userAttempts.length,
          unique_ips: uniqueIPs.size,
          time_window_minutes: this.WINDOW_MINUTES,
          distributed_attack: true
        }
      }
    }

    // Password spray detection - multiple attempts from same source
    if (userAttempts.length >= 3) {
      return {
        type: 'password_spray',
        confidence: 0.8,
        indicators: {
          failed_attempts: userAttempts.length,
          time_window_minutes: this.WINDOW_MINUTES,
          unique_ips: uniqueIPs.size,
          primary_ip: userAttempts[0].ipAddress
        }
      }
    }

    return null
  }

  getThreatLevel(attemptCount: number): ThreatLevel {
    if (attemptCount >= this.ATTEMPT_THRESHOLDS.CRITICAL) return 'HIGH'
    if (attemptCount >= this.ATTEMPT_THRESHOLDS.WARNING) return 'MEDIUM'
    return 'LOW'
  }

  getAttemptHistory(email: string): LoginAttempt[] {
    return this.attempts.get(email) || []
  }

  getAllAttempts(): Map<string, LoginAttempt[]> {
    return new Map(this.attempts)
  }

  clearUserAttempts(email: string): void {
    this.attempts.delete(email)
  }

  clearAllAttempts(): void {
    this.attempts.clear()
  }

  getActiveUsers(): string[] {
    const now = new Date()
    const recentThreshold = new Date(now.getTime() - (2 * 60 * 1000)) // 2 minutes
    
    return Array.from(this.attempts.entries())
      .filter(([_, attempts]) => 
        attempts.some(a => a.timestamp >= recentThreshold)
      )
      .map(([email, _]) => email)
  }

  getStatistics() {
    const now = new Date()
    const windowStart = new Date(now.getTime() - (this.WINDOW_MINUTES * 60 * 1000))
    
    let totalAttempts = 0
    let uniqueUsers = 0
    let uniqueIPs = new Set<string>()
    let patterns: { [key: string]: number } = {}

    for (const [email, attempts] of this.attempts.entries()) {
      const recentAttempts = attempts.filter(a => a.timestamp >= windowStart)
      
      if (recentAttempts.length > 0) {
        uniqueUsers++
        totalAttempts += recentAttempts.length
        
        recentAttempts.forEach(a => uniqueIPs.add(a.ipAddress))
        
        const pattern = this.analyzePattern(email)
        if (pattern) {
          patterns[pattern.type] = (patterns[pattern.type] || 0) + 1
        }
      }
    }

    return {
      totalAttempts,
      uniqueUsers,
      uniqueIPs: uniqueIPs.size,
      patterns,
      timeWindow: this.WINDOW_MINUTES,
      lastUpdated: now
    }
  }

  private calculateTimeSpan(attempts: LoginAttempt[]): number {
    if (attempts.length < 2) return 0
    
    const sorted = attempts.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    return sorted[sorted.length - 1].timestamp.getTime() - sorted[0].timestamp.getTime()
  }

  private cleanupOldAttempts(): void {
    const now = new Date()
    const cutoff = new Date(now.getTime() - (this.WINDOW_MINUTES * 2 * 60 * 1000)) // Double the window for cleanup
    
    for (const [email, attempts] of this.attempts.entries()) {
      const filteredAttempts = attempts.filter(a => a.timestamp >= cutoff)
      
      if (filteredAttempts.length === 0) {
        this.attempts.delete(email)
      } else {
        this.attempts.set(email, filteredAttempts)
      }
    }
  }
}

// Singleton instance for the application
export const attackDetector = new AttackDetector()