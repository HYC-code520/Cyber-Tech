'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Info, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Shield, 
  Brain,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Target,
  TrendingUp
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { citationLinks, getRiskIndicator, timeEstimates } from '@/lib/rules/recommendations'
import { AIEnhancedRecommendation } from '@/lib/ai/recommendation-ai'

interface Recommendation {
  id: string
  action: string
  reason: string
  citation: string
  priority: number
  applied: boolean
  category: 'immediate' | 'follow_up' | 'optional'
}

interface AIEnhancedRecommendationPaneProps {
  recommendations: Recommendation[]
  currentStep: string
  incidentType?: string
  incidentSeverity?: string
  onExecuteAction?: (actionType: string) => void
  isExecuting?: boolean
}

export function AIEnhancedRecommendationPane({ 
  recommendations, 
  currentStep, 
  incidentType,
  incidentSeverity = 'medium',
  onExecuteAction,
  isExecuting = false
}: AIEnhancedRecommendationPaneProps) {
  const [selectedRec, setSelectedRec] = useState<AIEnhancedRecommendation | null>(null)
  const [enhancedRecommendations, setEnhancedRecommendations] = useState<AIEnhancedRecommendation[]>([])
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [expandedRecs, setExpandedRecs] = useState<Set<string>>(new Set())
  const [aiEnabled, setAiEnabled] = useState(true)

  // Enhance recommendations with AI when component mounts or recommendations change
  useEffect(() => {
    if (aiEnabled && recommendations.length > 0 && incidentType) {
      enhanceRecommendationsWithAI()
    } else {
      // Use regular recommendations if AI is disabled
      setEnhancedRecommendations(recommendations.map(rec => ({ ...rec })))
    }
  }, [recommendations, incidentType, incidentSeverity, aiEnabled])

  const enhanceRecommendationsWithAI = async () => {
    setIsEnhancing(true)
    try {
      const response = await fetch('/api/ai/enhance-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          incidentType,
          severity: incidentSeverity,
          indicators: [],
          context: {
            affectedUsers: 1,
            organizationType: 'corporate',
            timeOfDay: new Date().toLocaleTimeString()
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data.enhancedRecommendations) {
          setEnhancedRecommendations(data.data.enhancedRecommendations)
        } else {
          console.warn('AI enhancement failed, using base recommendations')
          setEnhancedRecommendations(recommendations.map(rec => ({ ...rec })))
        }
      } else {
        console.warn('AI service unavailable, using base recommendations')
        setEnhancedRecommendations(recommendations.map(rec => ({ ...rec })))
      }
    } catch (error) {
      console.error('Failed to enhance recommendations:', error)
      setEnhancedRecommendations(recommendations.map(rec => ({ ...rec })))
    } finally {
      setIsEnhancing(false)
    }
  }

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case 'immediate': return 'destructive'
      case 'follow_up': return 'secondary'
      case 'optional': return 'outline'
      default: return 'secondary'
    }
  }

  const getRiskLevelColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'critical': return 'text-destructive'
      case 'high': return 'text-destructive/80'
      case 'medium': return 'text-primary'
      case 'low': return 'text-accent'
      default: return 'text-muted-foreground'
    }
  }

  const getPriorityIcon = (priority: number) => {
    const riskIndicator = getRiskIndicator(priority)
    return (
      <div className={`flex items-center space-x-1 ${riskIndicator.color}`}>
        <riskIndicator.icon className="h-4 w-4" />
        <span className="text-xs font-medium">{riskIndicator.label}</span>
      </div>
    )
  }

  const toggleExpanded = (recId: string) => {
    const newExpanded = new Set(expandedRecs)
    if (newExpanded.has(recId)) {
      newExpanded.delete(recId)
    } else {
      newExpanded.add(recId)
    }
    setExpandedRecs(newExpanded)
  }

  const getCitationLink = (citation: string) => {
    return citationLinks[citation] || '#'
  }

  if (enhancedRecommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>AI-Enhanced Recommendations</span>
          </CardTitle>
          <CardDescription>
            Intelligent recommendations based on incident analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">
              {isEnhancing ? 'AI is analyzing the incident...' : 'No recommendations available for this incident type'}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>AI-Enhanced Recommendations</span>
            {isEnhancing && (
              <div className="animate-spin">
                <Brain className="h-4 w-4 text-primary/70" />
              </div>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAiEnabled(!aiEnabled)}
              className={aiEnabled ? 'bg-primary/10 border-primary/30' : ''}
            >
              <Brain className="h-4 w-4 mr-1" />
              {aiEnabled ? 'AI On' : 'AI Off'}
            </Button>
          </div>
        </div>
        <CardDescription>
          {aiEnabled 
            ? 'AI-powered recommendations with context analysis and business impact' 
            : 'Standard recommendations without AI enhancement'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-16rem)] min-h-[600px] max-h-[1000px]">
          <div className="space-y-4 pr-4">
            {enhancedRecommendations.map((rec, index) => {
              const isExpanded = expandedRecs.has(rec.id || index.toString())
              const recId = rec.id || index.toString()
              
              return (
                <div
                  key={recId}
                  className="border border-border rounded-lg p-4 bg-card/50 hover:bg-card/80 transition-all duration-200"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant={getCategoryBadgeVariant(rec.category)}>
                          {rec.category}
                        </Badge>
                        {getPriorityIcon(rec.priority)}
                        {rec.confidence && (
                          <Badge variant="outline" className="text-xs">
                            {Math.round(rec.confidence * 100)}% confidence
                          </Badge>
                        )}
                        {rec.riskLevel && (
                          <Badge variant="outline" className={getRiskLevelColor(rec.riskLevel)}>
                            {rec.riskLevel} risk
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium text-foreground mb-1">
                        {rec.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {rec.detailedExplanation || rec.reason}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {rec.estimatedTime && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {rec.estimatedTime}
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(recId)}
                        className="h-8 w-8 p-0"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="space-y-4 pt-3 border-t border-border">
                      {/* Business Impact */}
                      {rec.businessImpact && (
                        <div>
                          <div className="flex items-center space-x-1 mb-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-foreground">Business Impact</span>
                          </div>
                          <p className="text-sm text-muted-foreground pl-5">
                            {rec.businessImpact}
                          </p>
                        </div>
                      )}

                      {/* Context Factors */}
                      {rec.contextFactors && rec.contextFactors.length > 0 && (
                        <div>
                          <div className="flex items-center space-x-1 mb-2">
                            <Target className="h-4 w-4 text-accent" />
                            <span className="text-sm font-medium text-foreground">Context Factors</span>
                          </div>
                          <ul className="text-sm text-muted-foreground pl-5 space-y-1">
                            {rec.contextFactors.map((factor, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="text-accent mr-2">•</span>
                                {factor}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Implementation Steps */}
                      {rec.implementationSteps && rec.implementationSteps.length > 0 && (
                        <div>
                          <div className="flex items-center space-x-1 mb-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-foreground">Implementation Steps</span>
                          </div>
                          <ol className="text-sm text-muted-foreground pl-5 space-y-1">
                            {rec.implementationSteps.map((step, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="text-primary mr-2 font-medium">{idx + 1}.</span>
                                {step.replace(/^\d+\.\s*/, '')}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {/* Alternatives */}
                      {rec.alternatives && rec.alternatives.length > 0 && (
                        <div>
                          <div className="flex items-center space-x-1 mb-2">
                            <Lightbulb className="h-4 w-4 text-accent" />
                            <span className="text-sm font-medium text-foreground">Alternative Approaches</span>
                          </div>
                          <ul className="text-sm text-muted-foreground pl-5 space-y-1">
                            {rec.alternatives.map((alt, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="text-accent mr-2">•</span>
                                {alt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Citation */}
                      <div>
                        <div className="flex items-center space-x-1 mb-2">
                          <Info className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">Citation</span>
                        </div>
                        <div className="pl-5">
                          <a
                            href={getCitationLink(rec.citation)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-sm text-primary hover:text-primary/80 hover:underline"
                          >
                            <span>{rec.citation}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-2">
                        <Button
                          onClick={() => onExecuteAction?.(rec.action)}
                          disabled={rec.applied || isExecuting}
                          className="w-full"
                          variant={rec.applied ? "outline" : "default"}
                        >
                          {rec.applied ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Applied
                            </>
                          ) : (
                            <>
                              <Shield className="h-4 w-4 mr-2" />
                              Execute Action
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
