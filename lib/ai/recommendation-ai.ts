import OpenAI from 'openai'
import { Recommendation } from '@/lib/rules/types'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface AIEnhancedRecommendation extends Recommendation {
  detailedExplanation?: string
  contextFactors?: string[]
  confidence?: number
  alternatives?: string[]
  potentialImpact?: string
  businessImpact?: string
  implementationSteps?: string[]
  riskLevel?: 'low' | 'medium' | 'high' | 'critical'
  estimatedTime?: string
}

export interface IncidentContext {
  type: string
  severity: string
  indicators: any[]
  userRole?: string
  organizationType?: string
  timeOfDay?: string
  affectedUsers?: number
  attackDuration?: string
}

export class RecommendationAI {
  private static instance: RecommendationAI
  private cache: Map<string, AIEnhancedRecommendation[]> = new Map()

  static getInstance(): RecommendationAI {
    if (!RecommendationAI.instance) {
      RecommendationAI.instance = new RecommendationAI()
    }
    return RecommendationAI.instance
  }

  async enhanceRecommendations(
    baseRecommendations: Recommendation[],
    context: IncidentContext
  ): Promise<AIEnhancedRecommendation[]> {
    try {
      const cacheKey = this.generateCacheKey(baseRecommendations, context)
      
      // Check cache first
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey)!
      }

      const enhanced = await Promise.all(
        baseRecommendations.map(rec => this.enhanceRecommendation(rec, context))
      )

      // Cache the results
      this.cache.set(cacheKey, enhanced)
      
      return enhanced
    } catch (error) {
      console.error('AI enhancement failed, returning base recommendations:', error)
      return baseRecommendations.map(rec => ({ ...rec }))
    }
  }

  private async enhanceRecommendation(
    recommendation: Recommendation,
    context: IncidentContext
  ): Promise<AIEnhancedRecommendation> {
    try {
      const prompt = this.buildEnhancementPrompt(recommendation, context)
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a cybersecurity expert providing detailed analysis of incident response recommendations. Provide practical, actionable insights based on current security frameworks.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      })

      const aiResponse = completion.choices[0]?.message?.content
      if (!aiResponse) {
        throw new Error('No response from AI')
      }

      return this.parseAIResponse(recommendation, aiResponse, context)
    } catch (error) {
      console.error('Failed to enhance recommendation:', error)
      return { ...recommendation }
    }
  }

  private buildEnhancementPrompt(
    recommendation: Recommendation,
    context: IncidentContext
  ): string {
    return `
Analyze this cybersecurity incident and enhance the recommendation:

INCIDENT CONTEXT:
- Type: ${context.type}
- Severity: ${context.severity}
- Affected Users: ${context.affectedUsers || 'Unknown'}
- Time of Day: ${context.timeOfDay || 'Unknown'}
- Organization: ${context.organizationType || 'Corporate'}

CURRENT RECOMMENDATION:
- Action: ${recommendation.action}
- Reason: ${recommendation.reason}
- Citation: ${recommendation.citation}
- Priority: ${recommendation.priority}
- Category: ${recommendation.category}

Please provide a JSON response with these fields:
{
  "detailedExplanation": "Detailed explanation of why this action is needed (2-3 sentences)",
  "contextFactors": ["factor1", "factor2", "factor3"],
  "confidence": 0.95,
  "potentialImpact": "What happens if this action is not taken",
  "businessImpact": "Business impact in plain language",
  "implementationSteps": ["step1", "step2", "step3"],
  "riskLevel": "high",
  "estimatedTime": "15-30 minutes",
  "alternatives": ["alternative1", "alternative2"]
}

Focus on practical, actionable insights that help security analysts understand the urgency and importance of this recommendation.
`
  }

  private parseAIResponse(
    baseRecommendation: Recommendation,
    aiResponse: string,
    context: IncidentContext
  ): AIEnhancedRecommendation {
    try {
      // Extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response')
      }

      const parsed = JSON.parse(jsonMatch[0])
      
      return {
        ...baseRecommendation,
        detailedExplanation: parsed.detailedExplanation || baseRecommendation.reason,
        contextFactors: parsed.contextFactors || [],
        confidence: parsed.confidence || 0.8,
        alternatives: parsed.alternatives || [],
        potentialImpact: parsed.potentialImpact || 'Impact assessment unavailable',
        businessImpact: parsed.businessImpact || 'Business impact analysis pending',
        implementationSteps: parsed.implementationSteps || [],
        riskLevel: parsed.riskLevel || this.inferRiskLevel(context.severity),
        estimatedTime: parsed.estimatedTime || this.estimateTime(baseRecommendation.action)
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error)
      return {
        ...baseRecommendation,
        detailedExplanation: baseRecommendation.reason,
        confidence: 0.7,
        riskLevel: this.inferRiskLevel(context.severity),
        estimatedTime: this.estimateTime(baseRecommendation.action)
      }
    }
  }

  private inferRiskLevel(severity: string): 'low' | 'medium' | 'high' | 'critical' {
    switch (severity.toLowerCase()) {
      case 'critical': return 'critical'
      case 'high': return 'high'
      case 'medium': return 'medium'
      default: return 'low'
    }
  }

  private estimateTime(action: string): string {
    const timeEstimates: Record<string, string> = {
      'disable_user_account': '2-5 minutes',
      'revoke_user_tokens': '1-3 minutes',
      'reset_user_password': '5-10 minutes',
      'block_source_ips': '3-7 minutes',
      'implement_mfa': '15-30 minutes',
      'force_password_reset_all': '30-60 minutes',
      'investigate_further': '30-120 minutes'
    }
    
    return timeEstimates[action] || '10-20 minutes'
  }

  private generateCacheKey(recommendations: Recommendation[], context: IncidentContext): string {
    const recString = recommendations.map(r => `${r.action}-${r.priority}`).join('|')
    const contextString = `${context.type}-${context.severity}-${context.affectedUsers}`
    return Buffer.from(`${recString}-${contextString}`).toString('base64').slice(0, 32)
  }

  // Method to analyze citations and provide context
  async analyzeCitation(citation: string, incidentType: string): Promise<string> {
    try {
      const prompt = `
Explain this cybersecurity citation in the context of a ${incidentType} incident:

Citation: ${citation}

Provide a brief explanation (2-3 sentences) of:
1. What this citation covers
2. Why it's relevant to this incident type
3. Key recommendations from this source

Keep it concise and practical for security analysts.
`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a cybersecurity expert explaining security frameworks and citations to analysts.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 200
      })

      return completion.choices[0]?.message?.content || 'Citation analysis unavailable'
    } catch (error) {
      console.error('Failed to analyze citation:', error)
      return 'Citation analysis unavailable'
    }
  }

  // Clear cache (useful for testing or memory management)
  clearCache(): void {
    this.cache.clear()
  }
}

export const recommendationAI = RecommendationAI.getInstance()
