import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const incident = await prisma.incident.findUnique({
      where: { id },
      include: {
        indicators: true,
        actions: {
          orderBy: { createdAt: 'desc' }
        },
        recommendations: {
          orderBy: { priority: 'asc' }
        },
        transitions: {
          orderBy: { timestamp: 'desc' }
        }
      }
    })

    if (!incident) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(incident)
  } catch (error) {
    console.error('Error fetching incident:', error)
    return NextResponse.json(
      { error: 'Failed to fetch incident' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, currentStep, severity, type } = body

    const incident = await prisma.incident.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(currentStep && { currentStep }),
        ...(severity && { severity }),
        ...(type && { type }),
        updatedAt: new Date()
      },
      include: {
        indicators: true,
        actions: true,
        recommendations: true,
        transitions: true
      }
    })

    return NextResponse.json(incident)
  } catch (error) {
    console.error('Error updating incident:', error)
    return NextResponse.json(
      { error: 'Failed to update incident' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.incident.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Incident deleted successfully' })
  } catch (error) {
    console.error('Error deleting incident:', error)
    return NextResponse.json(
      { error: 'Failed to delete incident' },
      { status: 500 }
    )
  }
}