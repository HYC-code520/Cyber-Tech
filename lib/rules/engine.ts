import { Indicator, Classification, Recommendation } from './types'
import { attackPatterns } from './classifications'
import { recommendationMap } from './recommendations'

export class RuleEngine {
  classify(indicators: Indicator[]): Classification | null {
    let bestMatch: Classification | null = null
    let highestConfidence = 0

    for (const pattern of attackPatterns) {
      const matchedIndicators: Indicator[] = []
      let totalConfidence = 0
      let matchCount = 0

      for (const indicator of indicators) {
        const rule = pattern.indicators[indicator.type]
        if (rule && rule(indicator.value)) {
          matchedIndicators.push(indicator)
          totalConfidence += indicator.confidence || 0.5
          matchCount++
        }
      }

      // Calculate average confidence for this pattern
      const avgConfidence = matchCount > 0 ? totalConfidence / matchCount : 0
      
      // Check if this pattern is a better match
      if (matchCount > 0 && avgConfidence >= pattern.confidenceThreshold && avgConfidence > highestConfidence) {
        highestConfidence = avgConfidence
        bestMatch = {
          type: pattern.name,
          confidence: avgConfidence,
          severity: pattern.severity,
          indicators: matchedIndicators
        }
      }
    }

    return bestMatch
  }

  getRecommendations(incidentType: string, category?: 'immediate' | 'follow_up' | 'optional'): Recommendation[] {
    const recommendations = recommendationMap[incidentType]
    
    if (!recommendations) {
      return this.getDefaultRecommendations()
    }

    if (category) {
      return recommendations[category] || []
    }

    // Return all recommendations sorted by priority
    return [
      ...recommendations.immediate,
      ...recommendations.follow_up,
      ...recommendations.optional
    ].sort((a, b) => a.priority - b.priority)
  }

  validateTransition(currentState: string, nextState: string): boolean {
    const validTransitions: Record<string, string[]> = {
      triggered: ['confirmed', 'closed'],
      confirmed: ['classified', 'closed'],
      classified: ['contained', 'closed'],
      contained: ['recovered', 'closed'],
      recovered: ['documented', 'closed'],
      documented: ['closed'],
      closed: []
    }

    const allowedStates = validTransitions[currentState]
    return allowedStates ? allowedStates.includes(nextState) : false
  }

  getNextStep(currentStep: string): string | null {
    const steps = ['trigger', 'confirm', 'classify', 'contain', 'recover']
    const currentIndex = steps.indexOf(currentStep)
    
    if (currentIndex === -1 || currentIndex === steps.length - 1) {
      return null
    }
    
    return steps[currentIndex + 1]
  }

  getPreviousStep(currentStep: string): string | null {
    const steps = ['trigger', 'confirm', 'classify', 'contain', 'recover']
    const currentIndex = steps.indexOf(currentStep)
    
    if (currentIndex <= 0) {
      return null
    }
    
    return steps[currentIndex - 1]
  }

  private getDefaultRecommendations(): Recommendation[] {
    return [
      {
        action: 'investigate_further',
        reason: 'Unable to classify incident automatically',
        citation: 'NIST SP 800-61r2 - Initial Assessment',
        priority: 1,
        category: 'immediate'
      },
      {
        action: 'collect_additional_data',
        reason: 'More information needed for classification',
        citation: 'SANS Incident Response Process',
        priority: 2,
        category: 'immediate'
      },
      {
        action: 'escalate_to_senior_analyst',
        reason: 'Unknown attack pattern detected',
        citation: 'Internal Escalation Procedures',
        priority: 3,
        category: 'follow_up'
      }
    ]
  }
}

export const ruleEngine = new RuleEngine()