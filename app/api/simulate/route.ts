import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ruleEngine } from '@/lib/rules/engine'
import demoCases from '@/data/demo-cases.json'

export async function GET() {
  try {
    return NextResponse.json(demoCases.cases)
  } catch (error) {
    console.error('Error fetching demo cases:', error)
    return NextResponse.json(
      { error: 'Failed to fetch demo cases' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { caseId } = body

    const demoCase = demoCases.cases.find(c => c.id === caseId)
    
    if (!demoCase) {
      return NextResponse.json(
        { error: 'Demo case not found' },
        { status: 404 }
      )
    }

    const incident = await prisma.incident.create({
      data: {
        type: demoCase.type,
        severity: demoCase.severity,
        status: 'triggered',
        currentStep: 'trigger',
        createdBy: 'simulator'
      }
    })

    await prisma.indicator.createMany({
      data: demoCase.indicators.map(indicator => ({
        incidentId: incident.id,
        type: indicator.type,
        value: JSON.stringify(indicator.value),
        confidence: indicator.confidence
      }))
    })

    const classification = ruleEngine.classify(demoCase.indicators as any)
    
    if (classification) {
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

    const fullIncident = await prisma.incident.findUnique({
      where: { id: incident.id },
      include: {
        indicators: true,
        actions: true,
        recommendations: true,
        transitions: true
      }
    })

    return NextResponse.json({
      incident: fullIncident,
      demoCase: {
        ...demoCase,
        timeline: demoCase.timeline || []
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating simulation:', error)
    return NextResponse.json(
      { error: 'Failed to create simulation' },
      { status: 500 }
    )
  }
}