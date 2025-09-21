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

    console.log('Transition request:', { id, toState, toStep, userId, reason })

    const incident = await prisma.incident.findUnique({
      where: { id }
    })

    if (!incident) {
      console.log('Incident not found:', id)
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      )
    }

    console.log('Current incident state:', {
      id: incident.id,
      status: incident.status,
      currentStep: incident.currentStep
    })

    const currentState = incident.status as IncidentState
    const currentStep = incident.currentStep as IncidentStep

    let newState: IncidentState = currentState
    let newStep: IncidentStep = currentStep

    // If we're transitioning by step (which is what the frontend sends)
    if (toStep) {
      console.log('Validating step transition:', { from: currentStep, to: toStep })
      
      if (!incidentStateMachine.isValidStep(toStep)) {
        console.log('Invalid step:', toStep)
        return NextResponse.json(
          { error: `Invalid step: ${toStep}` },
          { status: 400 }
        )
      }

      newStep = toStep as IncidentStep
      newState = incidentStateMachine.getStateForStep(newStep)
      
      console.log('Step transition mapped:', { newStep, newState })

      // Check if this transition is allowed
      if (!incidentStateMachine.canTransition(currentState, newState)) {
        console.log('Transition not allowed:', { from: currentState, to: newState })
        return NextResponse.json(
          { error: `Cannot transition from ${currentState} to ${newState}` },
          { status: 400 }
        )
      }
    } 
    // If we're transitioning by state
    else if (toState) {
      console.log('Validating state transition:', { from: currentState, to: toState })
      
      if (!incidentStateMachine.canTransition(currentState, toState as IncidentState)) {
        console.log('State transition not allowed:', { from: currentState, to: toState })
        return NextResponse.json(
          { error: `Cannot transition from ${currentState} to ${toState}` },
          { status: 400 }
        )
      }

      newState = toState as IncidentState
      newStep = incidentStateMachine.getStepForState(newState) || currentStep
    } 
    else {
      console.log('No transition target provided')
      return NextResponse.json(
        { error: 'Must provide either toState or toStep' },
        { status: 400 }
      )
    }

    console.log('Executing transition:', {
      from: { state: currentState, step: currentStep },
      to: { state: newState, step: newStep }
    })

    // Create transition record using the correct schema
    try {
      await prisma.transition.create({
        data: {
          incidentId: id,
          fromStep: currentStep,
          toStep: newStep,
          notes: reason || `${userId}: Transitioned from ${currentStep} to ${newStep}`
        }
      })
      console.log('Transition record created')
    } catch (dbError) {
      console.error('Error creating transition record:', dbError)
      return NextResponse.json(
        { error: 'Failed to create transition record' },
        { status: 500 }
      )
    }

    // Update the incident
    try {
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

      console.log('Incident updated successfully:', {
        id: updatedIncident.id,
        status: updatedIncident.status,
        currentStep: updatedIncident.currentStep
      })

      return NextResponse.json(updatedIncident)
    } catch (dbError) {
      console.error('Error updating incident:', dbError)
      return NextResponse.json(
        { error: 'Failed to update incident' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error in transition endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}