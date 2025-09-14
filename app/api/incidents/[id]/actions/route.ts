import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mockActions, ActionType } from '@/lib/mock-actions/executors'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { actionType, executedBy = 'analyst' } = body

    if (!actionType || !(actionType in mockActions)) {
      return NextResponse.json(
        { error: 'Invalid action type' },
        { status: 400 }
      )
    }

    const action = await prisma.action.create({
      data: {
        incidentId: id,
        type: actionType,
        status: 'in_progress',
        executedBy
      }
    })

    try {
      const executor = mockActions[actionType as ActionType]
      const result = await executor()

      await prisma.action.update({
        where: { id: action.id },
        data: {
          status: result.success ? 'completed' : 'failed',
          result: JSON.stringify(result),
          executedAt: new Date()
        }
      })

      return NextResponse.json({ action, result })
    } catch (executionError) {
      await prisma.action.update({
        where: { id: action.id },
        data: {
          status: 'failed',
          result: JSON.stringify({
            success: false,
            message: 'Action execution failed',
            error: executionError instanceof Error ? executionError.message : 'Unknown error'
          }),
          executedAt: new Date()
        }
      })

      return NextResponse.json(
        { error: 'Action execution failed' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error executing action:', error)
    return NextResponse.json(
      { error: 'Failed to execute action' },
      { status: 500 }
    )
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