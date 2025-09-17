import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ruleEngine } from '@/lib/rules/engine'

export async function GET() {
  try {
    const incidents = await prisma.incident.findMany({
      include: {
        indicators: true,
        actions: true,
        recommendations: true,
        transitions: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(incidents)
  } catch (error) {
    console.error('Error fetching incidents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { indicators, createdBy = 'analyst' } = body

    const incident = await prisma.incident.create({
      data: {
        createdBy,
        status: 'triggered',
        currentStep: 'trigger'
      }
    })

    if (indicators && indicators.length > 0) {
      await prisma.indicator.createMany({
        data: indicators.map((indicator: any) => ({
          incidentId: incident.id,
          type: indicator.type,
          value: JSON.stringify(indicator.value),
          confidence: indicator.confidence || 0.5
        }))
      })

      const classification = ruleEngine.classify(indicators)
      
      if (classification) {
        await prisma.incident.update({
          where: { id: incident.id },
          data: {
            type: classification.type,
            severity: classification.severity
          }
        })

        const recommendations = ruleEngine.getRecommendations(classification.type)
        
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
        }
      }
    }

    const fullIncident = await prisma.incident.findUnique({
      where: { id: incident.id },
      include: {
        indicators: true,
        actions: true,
        recommendations: true,
        transitions: true
      }
    })

    return NextResponse.json(fullIncident, { status: 201 })
  } catch (error) {
    console.error('Error creating incident:', error)
    return NextResponse.json(
      { error: 'Failed to create incident' },
      { status: 500 }
    )
  }
}