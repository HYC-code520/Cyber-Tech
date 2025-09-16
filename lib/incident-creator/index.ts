import { prisma } from '@/lib/prisma'
import { ruleEngine } from '@/lib/rules/engine'

interface IncidentIndicator {
  type: string
  value: any
  confidence: number
}

interface IncidentData {
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  userId: string
  source: string
  indicators: IncidentIndicator[]
  description?: string
}

export async function createSecurityIncident(data: IncidentData) {
  try {
    console.log('Creating security incident:', data.type, 'for user:', data.userId)

    // Create the incident record
    const incident = await prisma.incident.create({
      data: {
        type: data.type,
        severity: data.severity,
        status: 'triggered',
        currentStep: 'trigger',
        createdBy: data.source || 'login_monitor'
      }
    })

    console.log('Created incident with ID:', incident.id)

    // Create indicators
    if (data.indicators && data.indicators.length > 0) {
      await prisma.indicator.createMany({
        data: data.indicators.map(indicator => ({
          incidentId: incident.id,
          type: indicator.type,
          value: JSON.stringify(indicator.value),
          confidence: indicator.confidence
        }))
      })

      console.log(`Created ${data.indicators.length} indicators for incident ${incident.id}`)
    }

    // Generate recommendations using existing rule engine
    try {
      const recommendations = ruleEngine.getRecommendations(data.type)
      
      if (recommendations.length > 0) {
        await prisma.recommendation.createMany({
          data: recommendations.map(rec => ({
            incidentId: incident.id,
            action: rec.action,
            reason: rec.reason,
            citation: rec.citation,
            priority: rec.priority
          }))
        })

        console.log(`Generated ${recommendations.length} recommendations for incident ${incident.id}`)
      }
    } catch (error) {
      console.warn('Failed to generate recommendations, using fallback:', error)
      
      // Fallback recommendations for login attacks
      const fallbackRecommendations = getFallbackRecommendations(data.type)
      if (fallbackRecommendations.length > 0) {
        await prisma.recommendation.createMany({
          data: fallbackRecommendations.map(rec => ({
            incidentId: incident.id,
            action: rec.action,
            reason: rec.reason,
            citation: rec.citation,
            priority: rec.priority
          }))
        })
      }
    }

    // Create initial state transition
    await prisma.stateTransition.create({
      data: {
        incident: {
          connect: {
            id: incident.id
          }
        },
        fromState: null,
        toState: 'triggered',
        triggeredBy: data.source || 'login_monitor',
        reason: 'Incident automatically created by security monitoring system'
      }
    })

    // Fetch complete incident with all relations
    const fullIncident = await prisma.incident.findUnique({
      where: { id: incident.id },
      include: {
        indicators: true,
        actions: true,
        recommendations: true,
        transitions: true
      }
    })

    console.log('Successfully created security incident:', fullIncident?.id)
    return fullIncident

  } catch (error) {
    console.error('Error creating security incident:', error)
    throw new Error(`Failed to create security incident: ${error}`)
  }
}

function getFallbackRecommendations(incidentType: string) {
  const baseRecommendations = [
    {
      action: 'disable_user_account',
      reason: 'Prevent further unauthorized access attempts',
      citation: 'NIST Cybersecurity Framework - Respond',
      priority: 1
    },
    {
      action: 'revoke_user_tokens',
      reason: 'Invalidate any potentially compromised sessions',
      citation: 'MITRE ATT&CK - Credential Access',
      priority: 1
    },
    {
      action: 'reset_user_mfa',
      reason: 'Reset authentication factors to secure baseline',
      citation: 'CISA Multi-Factor Authentication Guidelines',
      priority: 2
    }
  ]

  // Add specific recommendations based on attack type
  switch (incidentType) {
    case 'password_spray_attack':
      return [
        ...baseRecommendations,
        {
          action: 'implement_account_lockout',
          reason: 'Implement progressive account lockout policies',
          citation: 'OWASP Authentication Cheat Sheet',
          priority: 2
        },
        {
          action: 'block_source_ips',
          reason: 'Block IP addresses showing attack patterns',
          citation: 'MITRE ATT&CK - T1110.003',
          priority: 2
        }
      ]

    case 'brute_force_attack':
      return [
        ...baseRecommendations,
        {
          action: 'implement_captcha',
          reason: 'Add CAPTCHA to prevent automated attacks',
          citation: 'NIST SP 800-63B Authentication Guidelines',
          priority: 2
        },
        {
          action: 'block_source_ips',
          reason: 'Block attacking IP addresses immediately',
          citation: 'MITRE ATT&CK - T1110.001',
          priority: 1
        }
      ]

    case 'credential_stuffing':
      return [
        ...baseRecommendations,
        {
          action: 'force_password_reset_all',
          reason: 'Force password reset if credentials may be compromised',
          citation: 'MITRE ATT&CK - T1110.004',
          priority: 3
        },
        {
          action: 'enforce_mfa',
          reason: 'Enforce multi-factor authentication for all users',
          citation: 'CISA Emergency Directive 22-02',
          priority: 2
        }
      ]

    case 'suspicious_login_activity':
      return [
        {
          action: 'verify_with_user',
          reason: 'Confirm login attempts with the legitimate user',
          citation: 'NIST Cybersecurity Framework - Detect',
          priority: 1
        },
        {
          action: 'require_mfa_reauthentication',
          reason: 'Require additional authentication verification',
          citation: 'CISA Multi-Factor Authentication Guidelines',
          priority: 2
        }
      ]

    default:
      return baseRecommendations
  }
}

// Enhanced function to map attack patterns to incident types
export function mapAttackPatternToIncidentType(
  pattern: string, 
  attemptCount: number, 
  uniqueIPs: number
): string {
  switch (pattern) {
    case 'brute_force':
      return 'brute_force_attack'
    case 'credential_stuffing':
      return 'credential_stuffing'
    case 'password_spray':
      return 'password_spray_attack'
    default:
      // Determine based on attempt characteristics
      if (attemptCount >= 10) return 'brute_force_attack'
      if (uniqueIPs > 2) return 'credential_stuffing'
      return 'password_spray_attack'
  }
}