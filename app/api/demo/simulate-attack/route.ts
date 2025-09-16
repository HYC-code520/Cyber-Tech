import { NextRequest, NextResponse } from 'next/server'
import { attackDetector } from '@/lib/attack-detector'
import { userManager } from '@/lib/user-manager'
import { createSecurityIncident } from '@/lib/incident-creator'

export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json()
    
    if (!type || !['password_spray', 'brute_force', 'credential_stuffing'].includes(type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid attack type. Must be one of: password_spray, brute_force, credential_stuffing'
      }, { status: 400 })
    }
    
    console.log(`Simulating ${type} attack...`)
    
    // Generate a demo email for the attack simulation
    const demoEmail = `demo.user.${Date.now()}@techcorp.com`
    const demoIP = '192.168.1.100'
    const demoUserAgent = 'Mozilla/5.0 (Automated Attack Simulation)'
    
    let attackData: any = {
      type: `${type}_attack`,
      severity: 'high' as const,
      userId: demoEmail,
      source: 'demo_simulation',
      indicators: []
    }
    
    switch (type) {
      case 'password_spray':
        // Simulate 6 login attempts over 2 minutes
        for (let i = 0; i < 6; i++) {
          await attackDetector.recordAttempt(demoEmail, demoIP, demoUserAgent)
          userManager.recordFailedAttempt(demoEmail)
          // Small delay to simulate realistic timing
          await new Promise(resolve => setTimeout(resolve, 100))
        }
        
        attackData.indicators = [
          { type: 'failed_login_attempts', value: 6, confidence: 1.0 },
          { type: 'attack_pattern', value: 'password_spray', confidence: 0.9 },
          { type: 'source_ip', value: demoIP, confidence: 1.0 },
          { type: 'time_window', value: '2_minutes', confidence: 1.0 },
          { type: 'unique_ips', value: 1, confidence: 1.0 }
        ]
        break
        
      case 'brute_force':
        // Simulate rapid attempts (10 attempts in quick succession)
        for (let i = 0; i < 10; i++) {
          await attackDetector.recordAttempt(demoEmail, demoIP, demoUserAgent)
          userManager.recordFailedAttempt(demoEmail)
          await new Promise(resolve => setTimeout(resolve, 50)) // Very fast attempts
        }
        
        attackData.indicators = [
          { type: 'failed_login_attempts', value: 10, confidence: 1.0 },
          { type: 'attack_pattern', value: 'brute_force', confidence: 0.95 },
          { type: 'source_ip', value: demoIP, confidence: 1.0 },
          { type: 'attempts_per_second', value: 2.0, confidence: 0.9 },
          { type: 'unique_ips', value: 1, confidence: 1.0 }
        ]
        break
        
      case 'credential_stuffing':
        // Simulate distributed attack from multiple IPs
        const ips = ['192.168.1.100', '10.0.0.50', '172.16.1.200', '203.0.113.10']
        for (let i = 0; i < 8; i++) {
          const ip = ips[i % ips.length]
          await attackDetector.recordAttempt(demoEmail, ip, demoUserAgent)
          userManager.recordFailedAttempt(demoEmail)
          await new Promise(resolve => setTimeout(resolve, 75))
        }
        
        attackData.indicators = [
          { type: 'failed_login_attempts', value: 8, confidence: 1.0 },
          { type: 'attack_pattern', value: 'credential_stuffing', confidence: 0.85 },
          { type: 'unique_ips', value: ips.length, confidence: 1.0 },
          { type: 'distributed_attack', value: true, confidence: 0.9 },
          { type: 'time_window', value: '1_minute', confidence: 1.0 }
        ]
        break
    }
    
    // Lock the demo account
    userManager.lockAccount(demoEmail, `Simulated ${type} attack detected`)
    
    // Create the security incident
    const incident = await createSecurityIncident(attackData)
    
    console.log(`Successfully simulated ${type} attack, created incident: ${incident?.id}`)
    
    return NextResponse.json({
      success: true,
      message: `${type} attack simulation completed successfully`,
      attackType: type,
      demoEmail,
      incidentId: incident?.id,
      attackData: {
        attempts: attackData.indicators.find(i => i.type === 'failed_login_attempts')?.value || 0,
        pattern: type,
        uniqueIPs: attackData.indicators.find(i => i.type === 'unique_ips')?.value || 1
      }
    })
    
  } catch (error) {
    console.error('Error simulating attack:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to simulate attack',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}