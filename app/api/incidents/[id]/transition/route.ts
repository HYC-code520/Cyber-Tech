import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { toStep, userId = 'analyst', reason } = body

    console.log('📋 Transition request:', { id, toStep, userId, reason })

    // Find the incident
    const incident = await prisma.incident.findUnique({
      where: { id }
    })

    if (!incident) {
      console.error('❌ Incident not found:', id)
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      )
    }

    console.log('✅ Current incident:', {
      id: incident.id,
      status: incident.status,
      currentStep: incident.currentStep
    })

    // For demo: simplified step mapping
    const stepToStateMap: Record<string, string> = {
      'trigger': 'triggered',
      'confirm': 'confirmed', 
      'classify': 'classified',
      'contain': 'contained',
      'recover': 'recovered'
    }

    const newStep = toStep || incident.currentStep
    const newState = stepToStateMap[newStep] || incident.status

    console.log('🔄 Transitioning:', {
      from: { state: incident.status, step: incident.currentStep },
      to: { state: newState, step: newStep }
    })

    // Create transition record (non-critical for demo)
    try {
      await prisma.transition.create({
        data: {
          incidentId: id,
          fromStep: incident.currentStep,
          toStep: newStep,
          notes: reason || `Transition: ${incident.currentStep} → ${newStep}`
        }
      })
      console.log('📝 Transition record created')
    } catch (transitionError) {
      console.warn('⚠️ Transition record failed (continuing anyway):', transitionError)
    }

    // Update incident
    const updatedIncident = await prisma.incident.update({
      where: { id },
      data: {
        status: newState,
        currentStep: newStep,
        updatedAt: new Date()
      },
      include: {
        indicators: true,
        actions: true,
        recommendations: true,
        transitions: {
          orderBy: { timestamp: 'desc' }
        }
      }
    })

    console.log('✅ Incident updated successfully:', {
      id: updatedIncident.id,
      status: updatedIncident.status,
      currentStep: updatedIncident.currentStep
    })

    return NextResponse.json({
      success: true,
      incident: updatedIncident,
      transition: {
        from: incident.currentStep,
        to: newStep
      }
    })

  } catch (error) {
    console.error('💥 Transition API error:', error)
    return NextResponse.json(
      { 
        error: 'Transition failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false
      },
      { status: 500 }
    )
  }
}