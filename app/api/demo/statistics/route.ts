import { NextResponse } from 'next/server'
import { attackDetector } from '@/lib/attack-detector'
import { userManager } from '@/lib/user-manager'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get attack detection statistics
    const attackStats = attackDetector.getStatistics()
    
    // Get user account statistics
    const userStats = userManager.getAccountStatistics()
    
    // Get recent activity
    const recentActivity = userManager.getRecentActivity(10)
    
    // Get active incidents count
    const activeIncidents = await prisma.incident.count({
      where: {
        status: {
          in: ['triggered', 'confirmed', 'classified', 'contained']
        },
        createdBy: 'login_monitor'
      }
    })
    
    // Format recent activity for the UI
    const formattedActivity = recentActivity.map(account => ({
      timestamp: account.lastLoginAttempt,
      type: account.status === 'locked' ? 'account_locked' : 'login_attempt',
      email: account.email,
      details: account.status === 'locked' ? account.lockReason : `${account.failedAttempts} failed attempts`
    }))
    
    // Add incident creation events
    const recentIncidents = await prisma.incident.findMany({
      where: {
        createdBy: 'login_monitor',
        createdAt: {
          gte: new Date(Date.now() - (10 * 60 * 1000)) // Last 10 minutes
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })
    
    const incidentActivity = recentIncidents.map(incident => ({
      timestamp: incident.createdAt,
      type: 'incident_created',
      email: 'Security System',
      details: `${incident.type} - ${incident.severity} severity`
    }))
    
    // Combine and sort all activity
    const allActivity = [...formattedActivity, ...incidentActivity]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20)
    
    const statistics = {
      totalAttempts: attackStats.totalAttempts,
      uniqueUsers: attackStats.uniqueUsers,
      uniqueIPs: attackStats.uniqueIPs,
      patterns: attackStats.patterns,
      lockedAccounts: userStats.lockedAccounts,
      activeIncidents,
      recentActivity: allActivity,
      lastUpdated: new Date()
    }
    
    return NextResponse.json({
      success: true,
      statistics,
      recentActivity: allActivity
    })
    
  } catch (error) {
    console.error('Error fetching demo statistics:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch demo statistics'
    }, { status: 500 })
  }
}