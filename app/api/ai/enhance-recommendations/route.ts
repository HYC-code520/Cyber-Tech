import { NextRequest, NextResponse } from 'next/server'
import { recommendationAI } from '@/lib/ai/recommendation-ai'
import { ruleEngine } from '@/lib/rules/engine'

export async function POST(request: NextRequest) {
  try {
    const { incidentType, severity, indicators, context } = await request.json()

    // Get base recommendations from existing rule engine
    const baseRecommendations = ruleEngine.getRecommendations(incidentType)
    
    if (baseRecommendations.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No base recommendations found for incident type'
      }, { status: 404 })
    }

    // Enhance recommendations with AI
    const enhancedRecommendations = await recommendationAI.enhanceRecommendations(
      baseRecommendations,
      {
        type: incidentType,
        severity: severity || 'medium',
        indicators: indicators || [],
        affectedUsers: context?.affectedUsers,
        timeOfDay: new Date().toLocaleTimeString(),
        organizationType: context?.organizationType || 'corporate',
        ...context
      }
    )

    return NextResponse.json({
      success: true,
      data: {
        baseRecommendations,
        enhancedRecommendations,
        aiEnhanced: true,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('AI enhancement error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to enhance recommendations',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Test endpoint to verify AI functionality
export async function GET() {
  try {
    // Test with a simple recommendation
    const testRecommendation = {
      action: 'disable_user_account',
      reason: 'Prevent further unauthorized access attempts',
      citation: 'NIST Cybersecurity Framework - Respond',
      priority: 1,
      category: 'immediate' as const
    }

    const testContext = {
      type: 'brute_force_attack',
      severity: 'high',
      indicators: [],
      affectedUsers: 1,
      timeOfDay: new Date().toLocaleTimeString()
    }

    const enhanced = await recommendationAI.enhanceRecommendations(
      [testRecommendation],
      testContext
    )

    return NextResponse.json({
      success: true,
      message: 'AI service is working',
      data: {
        original: testRecommendation,
        enhanced: enhanced[0],
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'AI service test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
