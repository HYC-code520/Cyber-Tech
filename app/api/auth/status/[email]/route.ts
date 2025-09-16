import { NextRequest, NextResponse } from 'next/server'
import { userManager } from '@/lib/user-manager'
import { attackDetector } from '@/lib/attack-detector'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const { email } = await params
    const decodedEmail = decodeURIComponent(email)
    
    console.log(`Checking account status for: ${decodedEmail}`)
    
    // Get account information
    const account = userManager.getAccountStatus(decodedEmail)
    const attemptHistory = attackDetector.getAttemptHistory(decodedEmail)
    const currentPattern = attackDetector.analyzePattern(decodedEmail)
    
    // Calculate time until unlock if locked
    let timeUntilUnlock: number | null = null
    if (account.status === 'locked' && account.unlockAt) {
      timeUntilUnlock = Math.max(0, account.unlockAt.getTime() - Date.now())
    }
    
    const response = {
      email: account.email,
      status: account.status,
      isLocked: account.status === 'locked',
      lockReason: account.lockReason,
      lockedAt: account.lockedAt,
      unlockAt: account.unlockAt,
      timeUntilUnlock,
      lastLoginAttempt: account.lastLoginAttempt,
      failedAttempts: account.failedAttempts || 0,
      
      // Security analysis
      recentAttempts: attemptHistory.length,
      detectedPattern: currentPattern?.type,
      patternConfidence: currentPattern?.confidence,
      threatLevel: attackDetector.getThreatLevel(attemptHistory.length),
      
      // Attempt details (last 5 for security monitoring)
      attemptDetails: attemptHistory.slice(-5).map(attempt => ({
        timestamp: attempt.timestamp,
        ipAddress: attempt.ipAddress,
        userAgent: attempt.userAgent
      }))
    }
    
    console.log(`Account status response for ${decodedEmail}:`, {
      status: response.status,
      isLocked: response.isLocked,
      recentAttempts: response.recentAttempts,
      threatLevel: response.threatLevel
    })
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Account status API error:', error)
    return NextResponse.json({
      error: 'Failed to retrieve account status',
      message: 'An internal error occurred while checking account status.'
    }, { status: 500 })
  }
}