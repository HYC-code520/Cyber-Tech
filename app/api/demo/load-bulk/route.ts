import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ruleEngine } from '@/lib/rules/engine'
import { generateBulkIncidents, generateOverloadScenarios } from '@/lib/mock-data/generator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      scenario = 'standard',
      count = 800,
      clearExisting = false,
      timeRange = 30,
      severityDistribution = {
        low: 60,
        medium: 25,
        high: 10,
        critical: 5
      }
    } = body

    // Clear existing incidents if requested
    if (clearExisting) {
      await prisma.incident.deleteMany()
      console.log('Cleared existing incidents')
    }

    // Generate incidents based on scenario
    let mockIncidents
    const scenarios = generateOverloadScenarios()

    switch(scenario) {
      case 'flashFlood':
        mockIncidents = scenarios.flashFlood()
        break
      case 'slowBurn':
        mockIncidents = scenarios.slowBurn()
        break
      case 'waveAttack':
        mockIncidents = scenarios.waveAttack()
        break
      case 'noiseCampaign':
        mockIncidents = scenarios.noiseCampaign()
        break
      case 'multiVector':
        mockIncidents = scenarios.multiVector()
        break
      default:
        mockIncidents = generateBulkIncidents({
          count,
          timeRange,
          severityDistribution
        })
    }

    console.log(`Generating ${mockIncidents.length} incidents with scenario: ${scenario}`)

    // Create incidents in batches to avoid overwhelming the database
    const batchSize = 50
    const createdIncidents = []

    for (let i = 0; i < mockIncidents.length; i += batchSize) {
      const batch = mockIncidents.slice(i, i + batchSize)

      const batchPromises = batch.map(async (mockIncident) => {
        try {
          // Create the incident
          const incident = await prisma.incident.create({
            data: {
              type: mockIncident.type,
              severity: mockIncident.severity,
              status: 'triggered',
              currentStep: 'trigger',
              createdBy: 'bulk-simulator',
              createdAt: new Date(mockIncident.timestamp)
            }
          })

          // Create indicators
          if (mockIncident.indicators && mockIncident.indicators.length > 0) {
            await prisma.indicator.createMany({
              data: mockIncident.indicators.map((indicator: any) => ({
                incidentId: incident.id,
                type: indicator.type,
                value: JSON.stringify(indicator.value),
                confidence: indicator.confidence || 0.5
              }))
            })

            // Get recommendations for this incident type
            const classification = ruleEngine.classify(mockIncident.indicators)

            if (classification) {
              const recommendations = ruleEngine.getRecommendations(classification.type)

              if (recommendations.length > 0) {
                await prisma.recommendation.createMany({
                  data: recommendations.map(rec => ({
                    incidentId: incident.id,
                    action: rec.action,
                    reason: rec.reason,
                    citation: rec.citation,
                    priority: rec.priority,
                    category: rec.category || 'immediate'
                  }))
                })
              }
            }
          }

          return incident
        } catch (error) {
          console.error(`Error creating incident: ${error}`)
          return null
        }
      })

      const batchResults = await Promise.all(batchPromises)
      createdIncidents.push(...batchResults.filter(Boolean))

      console.log(`Processed batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(mockIncidents.length / batchSize)}`)
    }

    // Get summary statistics
    const stats = await prisma.incident.groupBy({
      by: ['severity'],
      _count: true
    })

    const typeStats = await prisma.incident.groupBy({
      by: ['type'],
      _count: true
    })

    return NextResponse.json({
      success: true,
      message: `Successfully created ${createdIncidents.length} incidents`,
      scenario,
      statistics: {
        total: createdIncidents.length,
        bySeverity: stats.reduce((acc, s) => {
          acc[s.severity] = s._count
          return acc
        }, {} as Record<string, number>),
        byType: typeStats.reduce((acc, t) => {
          acc[t.type || 'unknown'] = t._count
          return acc
        }, {} as Record<string, number>)
      },
      sampleIncidents: createdIncidents.slice(0, 5)
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating bulk incidents:', error)
    return NextResponse.json(
      { error: 'Failed to create bulk incidents', details: error },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const stats = await prisma.incident.groupBy({
      by: ['severity'],
      _count: true
    })

    const typeStats = await prisma.incident.groupBy({
      by: ['type'],
      _count: true
    })

    const totalCount = await prisma.incident.count()

    const recentIncidents = await prisma.incident.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        indicators: true,
        recommendations: true
      }
    })

    return NextResponse.json({
      totalIncidents: totalCount,
      statistics: {
        bySeverity: stats.reduce((acc, s) => {
          acc[s.severity] = s._count
          return acc
        }, {} as Record<string, number>),
        byType: typeStats.reduce((acc, t) => {
          acc[t.type || 'unknown'] = t._count
          return acc
        }, {} as Record<string, number>)
      },
      recentIncidents,
      availableScenarios: [
        {
          id: 'standard',
          name: 'Standard Distribution',
          description: 'Realistic SOC workload with 60% low, 25% medium, 10% high, 5% critical'
        },
        {
          id: 'flashFlood',
          name: 'Flash Flood',
          description: '200 incidents in 10 minutes simulating a sudden attack'
        },
        {
          id: 'slowBurn',
          name: 'Slow Burn',
          description: 'Steady 50 incidents per hour for 16 hours'
        },
        {
          id: 'waveAttack',
          name: 'Wave Attack',
          description: 'Bursts of 100 incidents every 2 hours'
        },
        {
          id: 'noiseCampaign',
          name: 'Noise Campaign',
          description: '500 false positives hiding 10 real threats'
        },
        {
          id: 'multiVector',
          name: 'Multi-Vector Storm',
          description: 'Simultaneous attacks across different vectors'
        }
      ]
    })
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}