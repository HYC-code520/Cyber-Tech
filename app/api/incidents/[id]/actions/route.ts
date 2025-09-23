import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Import just the basic mockActions for now to avoid import issues
import { mockActions, ActionType } from '@/lib/mock-actions/executors'

// Safe action executor with built-in fallback
async function safeExecuteAction(actionType: string) {
  console.log(`🎯 SafeExecuteAction called with: "${actionType}"`)
  
  try {
    if (actionType in mockActions) {
      console.log(`✅ Found action "${actionType}" in mockActions`)
      const executor = mockActions[actionType as ActionType]
      const result = await executor()
      console.log(`✅ Action "${actionType}" executed successfully:`, result)
      return result
    } else {
      console.warn(`⚠️ Action "${actionType}" not found, available actions:`, Object.keys(mockActions))
      
      // Return a generic success result for unknown actions
      return {
        success: true,
        message: `Security action executed: ${actionType.replace(/_/g, ' ')}`,
        details: {
          action_type: actionType,
          execution_method: 'simulated',
          note: 'This action was simulated as the specific handler was not found'
        },
        timestamp: new Date().toISOString()
      }
    }
  } catch (actionError) {
    console.error(`💥 Error executing action "${actionType}":`, actionError)
    
    return {
      success: false,
      message: `Failed to execute action: ${actionType}`,
      details: {
        error: actionError instanceof Error ? actionError.message : 'Unknown execution error'
      },
      timestamp: new Date().toISOString()
    }
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('🚀 Action API endpoint called')
  
  try {
    const { id } = await params
    console.log(`📋 Incident ID: ${id}`)
    
    // Parse request body with error handling
    let body
    try {
      body = await request.json()
      console.log('📦 Request body:', body)
    } catch (parseError) {
      console.error('💥 Failed to parse request body:', parseError)
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { actionType, executedBy = 'analyst' } = body

    // Validate required fields
    if (!actionType) {
      console.error('❌ No actionType provided')
      return NextResponse.json(
        { error: 'actionType is required' },
        { status: 400 }
      )
    }

    if (typeof actionType !== 'string') {
      console.error('❌ actionType must be a string, got:', typeof actionType)
      return NextResponse.json(
        { error: 'actionType must be a string' },
        { status: 400 }
      )
    }

    console.log(`🔄 Processing action: "${actionType}" for incident: ${id}`)

    // Check if incident exists
    let incident
    try {
      incident = await prisma.incident.findUnique({
        where: { id }
      })
      
      if (!incident) {
        console.error(`❌ Incident not found: ${id}`)
        return NextResponse.json(
          { error: `Incident not found: ${id}` },
          { status: 404 }
        )
      }
      
      console.log(`✅ Incident found: ${incident.id}`)
    } catch (dbError) {
      console.error('💥 Database error finding incident:', dbError)
      return NextResponse.json(
        { error: 'Database error finding incident' },
        { status: 500 }
      )
    }

    // Create action record
    let action
    try {
      action = await prisma.action.create({
        data: {
          incidentId: id,
          type: actionType,
          status: 'in_progress',
          executedBy
        }
      })
      console.log(`📝 Action record created:`, action)
    } catch (dbError) {
      console.error('💥 Database error creating action:', dbError)
      return NextResponse.json(
        { error: 'Failed to create action record' },
        { status: 500 }
      )
    }

    // Execute the action
    console.log(`🤖 Executing action: "${actionType}"`)
    
    let executionResult
    try {
      executionResult = await safeExecuteAction(actionType)
      console.log(`✅ Action execution completed:`, executionResult)
    } catch (executionError) {
      console.error('💥 Action execution failed:', executionError)
      
      // Update action as failed
      try {
        await prisma.action.update({
          where: { id: action.id },
          data: {
            status: 'failed',
            result: JSON.stringify({
              success: false,
              error: executionError instanceof Error ? executionError.message : 'Unknown error'
            }),
            executedAt: new Date()
          }
        })
      } catch (updateError) {
        console.error('💥 Failed to update action as failed:', updateError)
      }

      return NextResponse.json(
        { error: 'Action execution failed', details: executionError instanceof Error ? executionError.message : 'Unknown error' },
        { status: 500 }
      )
    }

    // Update action with result
    let updatedAction
    try {
      updatedAction = await prisma.action.update({
        where: { id: action.id },
        data: {
          status: executionResult.success ? 'completed' : 'failed',
          result: JSON.stringify(executionResult),
          executedAt: new Date()
        }
      })
      console.log(`📊 Action updated successfully:`, updatedAction)
    } catch (dbError) {
      console.error('💥 Database error updating action:', dbError)
      return NextResponse.json(
        { error: 'Failed to update action result' },
        { status: 500 }
      )
    }

    // Return success response
    const response = {
      success: true,
      action: updatedAction,
      result: executionResult
    }
    
    console.log(`🎉 Action API completed successfully:`, response)
    return NextResponse.json(response)

  } catch (error) {
    console.error('💥 Unexpected error in action endpoint:', error)
    
    // Create a detailed error response
    const errorResponse = {
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }
    
    console.error('📤 Returning error response:', errorResponse)
    return NextResponse.json(errorResponse, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const actions = await prisma.action.findMany({
      where: { incidentId: id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(actions)
  } catch (error) {
    console.error('Error fetching actions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch actions' },
      { status: 500 }
    )
  }
}