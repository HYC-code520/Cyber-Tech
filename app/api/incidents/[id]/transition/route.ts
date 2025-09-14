import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { incidentStateMachine, IncidentState, IncidentStep } from '@/lib/state-machine/incident-flow'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { toState, toStep, userId = 'analyst', reason } = body

    const incident = await prisma.incident.findUnique({
      where: { id }
    })

    if (!incident) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      )
    }

    const currentState = incident.status as IncidentState
    const currentStep = incident.currentStep as IncidentStep

    let newState: IncidentState = currentState
    let newStep: IncidentStep = currentStep

    if (toState && incidentStateMachine.canTransition(currentState, toState as IncidentState)) {
      newState = toState as IncidentState
      newStep = incidentStateMachine.getStepForState(newState) || currentStep
    } else if (toStep && incidentStateMachine.isValidStep(toStep)) {
      newStep = toStep as IncidentStep
      newState = incidentStateMachine.getStateForStep(newStep)
    } else {
      return NextResponse.json(
        { error: 'Invalid transition' },
        { status: 400 }
      )
    }

    await prisma.stateTransition.create({
      data: {
        incidentId: id,
        fromState: currentState,
        toState: newState,
        reason: reason || `Transitioned from ${currentStep} to ${newStep}`,
        userId
      }
    })

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

    return NextResponse.json(updatedIncident)
  } catch (error) {
    console.error('Error transitioning incident:', error)
    return NextResponse.json(
      { error: 'Failed to transition incident' },
      { status: 500 }
    )
  }
}