import { NextResponse } from 'next/server'
import { attackDetector } from '@/lib/attack-detector'
import { userManager } from '@/lib/user-manager'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('Resetting demo environment...')
    
    // Clear attack detection data
    attackDetector.clearAllAttempts()
    console.log('Cleared attack detection data')
    
    // Reset all user accounts
    userManager.resetAllAccounts()
    console.log('Reset all user accounts')
    
    // Delete all demo incidents and related data
    const demoIncidents = await prisma.incident.findMany({
      where: {
        createdBy: 'login_monitor'
      },
      select: {
        id: true
      }
    })
    
    const incidentIds = demoIncidents.map(incident => incident.id)
    
    if (incidentIds.length > 0) {
      // Delete related data first (due to foreign key constraints)
      await prisma.stateTransition.deleteMany({
        where: {
          incidentId: {
            in: incidentIds
          }
        }
      })
      
      await prisma.recommendation.deleteMany({
        where: {
          incidentId: {
            in: incidentIds
          }
        }
      })
      
      await prisma.action.deleteMany({
        where: {
          incidentId: {
            in: incidentIds
          }
        }
      })
      
      await prisma.indicator.deleteMany({
        where: {
          incidentId: {
            in: incidentIds
          }
        }
      })
      
      // Finally delete the incidents
      await prisma.incident.deleteMany({
        where: {
          createdBy: 'login_monitor'
        }
      })
      
      console.log(`Deleted ${incidentIds.length} demo incidents and related data`)
    }
    
    console.log('Demo environment reset completed successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Demo environment has been reset successfully',
      resetData: {
        attackAttempts: 'cleared',
        userAccounts: 'reset',
        incidents: incidentIds.length,
        timestamp: new Date()
      }
    })
    
  } catch (error) {
    console.error('Error resetting demo environment:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to reset demo environment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}