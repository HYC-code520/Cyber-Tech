import { NextRequest, NextResponse } from 'next/server'
import { attackDetector } from '@/lib/attack-detector'
import { userManager } from '@/lib/user-manager'
import { createSecurityIncident, mapAttackPatternToIncidentType } from '@/lib/incident-creator'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // Get client information
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     '192.168.1.100' // Demo IP for local testing
    const userAgent = request.headers.get('user-agent') || 'unknown-browser'

    console.log(`Login attempt: ${email} from ${ipAddress}`)

    // Check if account is already locked
    if (userManager.isAccountLocked(email)) {
      console.log(`Blocked login attempt for locked account: ${email}`)
      return NextResponse.json({
        success: false,
        error: 'ACCOUNT_LOCKED',
        message: 'Account has been locked due to security concerns. Contact IT support for assistance.',
        redirect: '/incident/active'
      }, { status: 403 })
    }

    // Demo mode: Always reject login attempts to simulate attacks
    const isValidCredentials = false

    if (!isValidCredentials) {
      // Record the failed attempt in both systems
      const attemptCount = await attackDetector.recordAttempt(email, ipAddress, userAgent)
      userManager.recordFailedAttempt(email)

      console.log(`Failed login attempt ${attemptCount} for ${email}`)

      // Analyze threat level and patterns
      const threatLevel = attackDetector.getThreatLevel(attemptCount)
      const pattern = attackDetector.analyzePattern(email)

      console.log(`Threat level: ${threatLevel}, Pattern: ${pattern?.type || 'none'}`)

      switch (threatLevel) {
        case 'MEDIUM':
          // Create security alert for suspicious activity
          const mediumIncident = await createSecurityIncident({
            type: 'suspicious_login_activity',
            severity: 'medium',
            userId: email,
            source: 'login_monitor',
            indicators: [
              {
                type: 'failed_login_attempts',
                value: attemptCount,
                confidence: 1.0
              },
              {
                type: 'source_ip',
                value: ipAddress,
                confidence: 1.0
              },
              {
                type: 'time_window',
                value: '5_minutes',
                confidence: 1.0
              },
              {
                type: 'user_agent',
                value: userAgent,
                confidence: 0.8
              }
            ]
          })

          return NextResponse.json({
            success: false,
            attempts: attemptCount,
            maxAttempts: 5,
            warning: 'Multiple failed attempts detected. Security monitoring has been activated.',
            alertCreated: true,
            message: 'Invalid email or password. Security team has been notified of suspicious activity.'
          })

        case 'HIGH':
          // Lock account and create critical incident
          const lockReason = 'Multiple failed login attempts detected - potential security threat'
          userManager.lockAccount(email, lockReason)

          const incidentType = pattern 
            ? mapAttackPatternToIncidentType(
                pattern.type, 
                attemptCount, 
                pattern.indicators?.unique_ips || 1
              )
            : 'password_spray_attack'

          const incident = await createSecurityIncident({
            type: incidentType,
            severity: 'high',
            userId: email,
            source: 'login_monitor',
            indicators: [
              {
                type: 'failed_login_attempts',
                value: attemptCount,
                confidence: 1.0
              },
              {
                type: 'attack_pattern',
                value: pattern?.type || 'password_spray',
                confidence: pattern?.confidence || 0.8
              },
              {
                type: 'source_ip',
                value: ipAddress,
                confidence: 1.0
              },
              {
                type: 'automatic_response',
                value: 'account_locked',
                confidence: 1.0
              },
              {
                type: 'unique_ips',
                value: pattern?.indicators?.unique_ips || 1,
                confidence: 1.0
              },
              {
                type: 'user_agent',
                value: userAgent,
                confidence: 0.8
              },
              {
                type: 'attempts_per_second',
                value: pattern?.indicators?.attempts_per_second || 0,
                confidence: 0.9
              }
            ]
          })

          console.log(`Account locked for ${email}, incident created: ${incident.id}`)

          return NextResponse.json({
            success: false,
            error: 'ACCOUNT_LOCKED',
            message: 'Account has been locked due to multiple failed login attempts. Security incident has been created and IT support has been notified.',
            incidentId: incident.id,
            redirect: `/incident/${incident.id}`,
            lockReason,
            pattern: pattern?.type
          }, { status: 403 })

        default:
          return NextResponse.json({
            success: false,
            attempts: attemptCount,
            maxAttempts: 5,
            message: 'Invalid email or password. Please check your credentials and try again.',
            remainingAttempts: 5 - attemptCount
          })
      }
    }

    // Success case (won't happen in demo mode)
    console.log(`Successful login for ${email}`)
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      redirectUrl: '/dashboard'
    })

  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'An internal error occurred. Please try again later.'
    }, { status: 500 })
  }
}