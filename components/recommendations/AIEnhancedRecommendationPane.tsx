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
  TrendingUp,
  ChevronRight
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

  const handleCitationClick = (citation: string, event: React.MouseEvent) => {
    const link = getCitationLink(citation)
    if (link && link !== '#') {
      console.log(`🚀 Opening citation link: ${link}`)
      // Let the default anchor behavior handle the link opening
      return true
    } else {
      console.warn(`⚠️ No valid link found for citation: "${citation}"`)
      event.preventDefault()
      alert(`No external link available for: ${citation}`)
      return false
    }
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
            {isEnhancing ? (
              <>
                <div className="relative mb-4">
                  <Brain className="h-12 w-12 text-primary mx-auto animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-foreground font-medium">AI Analysis in Progress</p>
                  <p className="text-sm text-muted-foreground">
                    Analyzing incident patterns and generating enhanced recommendations...
                  </p>
                  <div className="flex items-center justify-center space-x-2 mt-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  No recommendations available for this incident type
                </p>
              </>
            )}
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
              <div className="flex items-center space-x-2">
                <div className="animate-spin">
                  <Brain className="h-4 w-4 text-primary/70" />
                </div>
                <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full animate-pulse">
                  Processing...
                </div>
              </div>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAiEnabled(!aiEnabled)}
              className={aiEnabled ? 'bg-primary/10 border-primary/30' : ''}
              disabled={isEnhancing}
            >
              <Brain className="h-4 w-4 mr-1" />
              {aiEnabled ? 'AI On' : 'AI Off'}
            </Button>
          </div>
        </div>
        <CardDescription>
          {isEnhancing ? (
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-primary">
                AI is analyzing incident context and enhancing recommendations...
              </span>
            </div>
          ) : aiEnabled ? (
            'AI-powered recommendations with context analysis and business impact'
          ) : (
            'Standard recommendations without AI enhancement'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        {isEnhancing && enhancedRecommendations.length > 0 && (
          <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm text-primary font-medium">
                AI Enhancement in Progress
              </span>
            </div>
            <p className="text-xs text-primary/80 mt-1">
              Basic recommendations are shown below. Enhanced analysis will update automatically.
            </p>
          </div>
        )}
        
        <ScrollArea className="h-[calc(100vh-16rem)] min-h-[600px] max-h-[1000px]">
          <div className="space-y-4 pr-1">
            {enhancedRecommendations.map((rec, index) => {
              const isExpanded = expandedRecs.has(rec.id || index.toString())
              const recId = rec.id || index.toString()
              
              return (
                <div
                  key={recId}
                  className={`border border-border rounded-lg bg-card/50 hover:bg-card/80 transition-all duration-200 ${
                    isEnhancing ? 'opacity-80' : ''
                  }`}
                >
                  {/* Main Card Content */}
                  <div className="p-3">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        {/* Badges Row */}
                        <div className="flex items-center flex-wrap gap-1 mb-2">
                          <Badge variant={getCategoryBadgeVariant(rec.category)} className="text-xs">
                            {rec.category}
                          </Badge>
                          {getPriorityIcon(rec.priority)}
                          {rec.confidence && (
                            <Badge variant="outline" className="text-xs">
                              {Math.round(rec.confidence * 100)}%
                            </Badge>
                          )}
                          {rec.riskLevel && (
                            <Badge variant="outline" className={`text-xs ${getRiskLevelColor(rec.riskLevel)}`}>
                              {rec.riskLevel}
                            </Badge>
                          )}
                          {isEnhancing && (
                            <Badge variant="outline" className="text-xs text-primary border-primary/30">
                              <div className="w-1 h-1 bg-primary rounded-full animate-pulse mr-1"></div>
                              Updating...
                            </Badge>
                          )}
                        </div>
                        
                        {/* Title */}
                        <h4 className="font-medium text-foreground mb-1 text-sm leading-tight">
                          {rec.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h4>
                        
                        {/* Description */}
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {rec.detailedExplanation || rec.reason}
                        </p>
                      </div>
                      
                      {/* Time estimate */}
                      {rec.estimatedTime && (
                        <div className="flex items-center text-xs text-muted-foreground flex-shrink-0">
                          <Clock className="h-3 w-3 mr-1" />
                          <span className="whitespace-nowrap">{rec.estimatedTime}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SUPER PROMINENT Expand/Collapse Button */}
                  <div 
                    className={`
                      mx-3 mb-3 rounded-lg border-2 transition-all duration-200 cursor-pointer
                      ${isExpanded 
                        ? 'bg-primary/10 border-primary/30 hover:bg-primary/15' 
                        : 'bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 hover:border-primary/40 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 shadow-sm hover:shadow-md'
                      }
                    `}
                    onClick={() => toggleExpanded(recId)}
                  >
                    <div className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center transition-colors
                            ${isExpanded 
                              ? 'bg-primary/20 text-primary' 
                              : 'bg-primary/10 text-primary hover:bg-primary/20'
                            }
                          `}>
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className={`
                                font-medium transition-colors
                                ${isExpanded 
                                  ? 'text-primary' 
                                  : 'text-foreground hover:text-primary'
                                }
                              `}>
                                {isExpanded ? 'Hide AI Analysis' : 'Show AI Analysis'}
                              </span>
                              
                              {!isExpanded && (
                                <Badge className="bg-primary/20 text-primary border-primary/30">
                                  <Brain className="h-3 w-3 mr-1" />
                                  Enhanced
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-xs text-muted-foreground mt-1">
                              {isExpanded 
                                ? 'Collapse detailed analysis and recommendations'
                                : `View ${[
                                    rec.businessImpact && 'business impact',
                                    rec.implementationSteps && 'implementation steps',
                                    rec.contextFactors && 'context analysis'
                                  ].filter(Boolean).join(', ')}`
                              }
                            </p>
                          </div>
                        </div>
                        
                        {/* Visual indicator */}
                        <div className="flex items-center space-x-2">
                          {!isExpanded && (
                            <div className="flex items-center space-x-1">
                              <div className="flex flex-col space-y-1">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-0.5 bg-primary/60 rounded-full"></div>
                                  <div className="w-3 h-0.5 bg-primary/40 rounded-full"></div>
                                  <div className="w-2 h-0.5 bg-primary/60 rounded-full"></div>
                                </div>
                                <div className="flex space-x-1">
                                  <div className="w-1 h-0.5 bg-accent/60 rounded-full"></div>
                                  <div className="w-4 h-0.5 bg-accent/40 rounded-full"></div>
                                  <div className="w-1 h-0.5 bg-accent/60 rounded-full"></div>
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-primary/60" />
                            </div>
                          )}
                          
                          {isExpanded && (
                            <div className="text-primary">
                              <ChevronUp className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="mx-3 mb-3 rounded-lg bg-muted/5 border border-border/30">
                      <div className="p-4 space-y-4">
                        {/* Business Impact */}
                        {rec.businessImpact && (
                          <div>
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <TrendingUp className="h-4 w-4 text-primary" />
                              </div>
                              <span className="text-sm font-semibold text-foreground">Business Impact</span>
                            </div>
                            <p className="text-sm text-muted-foreground pl-8">
                              {rec.businessImpact}
                            </p>
                          </div>
                        )}

                        {/* Context Factors */}
                        {rec.contextFactors && rec.contextFactors.length > 0 && (
                          <div>
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                                <Target className="h-4 w-4 text-accent" />
                              </div>
                              <span className="text-sm font-semibold text-foreground">Context Analysis</span>
                            </div>
                            <ul className="text-sm text-muted-foreground pl-8 space-y-2">
                              {rec.contextFactors.map((factor, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="text-accent mr-2 mt-1">•</span>
                                  <span className="break-words">{factor}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Implementation Steps */}
                        {rec.implementationSteps && rec.implementationSteps.length > 0 && (
                          <div>
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                              </div>
                              <span className="text-sm font-semibold text-foreground">Implementation Guide</span>
                            </div>
                            <ol className="text-sm text-muted-foreground pl-8 space-y-2">
                              {rec.implementationSteps.map((step, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="text-primary mr-3 font-semibold flex-shrink-0 mt-0.5">{idx + 1}.</span>
                                  <span className="break-words">{step.replace(/^\d+\.\s*/, '')}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* Alternatives */}
                        {rec.alternatives && rec.alternatives.length > 0 && (
                          <div>
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                                <Lightbulb className="h-4 w-4 text-accent" />
                              </div>
                              <span className="text-sm font-semibold text-foreground">Alternative Approaches</span>
                            </div>
                            <ul className="text-sm text-muted-foreground pl-8 space-y-2">
                              {rec.alternatives.map((alt, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="text-accent mr-2 mt-1">•</span>
                                  <span className="break-words">{alt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Citation */}
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-6 h-6 rounded-full bg-muted/20 flex items-center justify-center">
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="text-sm font-semibold text-foreground">Source Reference</span>
                          </div>
                          <div className="pl-8">
                            <a
                              href={getCitationLink(rec.citation)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-sm text-primary hover:text-primary/80 hover:underline break-all"
                            >
                              <span>{rec.citation}</span>
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            </a>
                          </div>
                        </div>

                        {/* Action Button */}
                        {currentStep === 'contain' && onExecuteAction && !rec.applied && (
                          <div className="pt-4 border-t border-border/30">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                onExecuteAction?.(rec.action)
                              }}
                              disabled={rec.applied || isExecuting || isEnhancing}
                              className="w-full h-12 text-base font-medium"
                              variant={rec.applied ? "outline" : "default"}
                            >
                              {rec.applied ? (
                                <>
                                  <CheckCircle2 className="h-5 w-5 mr-2" />
                                  Action Applied Successfully
                                </>
                              ) : isExecuting ? (
                                <>
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                  Executing Action...
                                </>
                              ) : isEnhancing ? (
                                <>
                                  <Brain className="h-5 w-5 mr-2 animate-pulse" />
                                  AI Processing...
                                </>
                              ) : (
                                <>
                                  <Shield className="h-5 w-5 mr-2" />
                                  Execute Security Action
                                </>
                              )}
                            </Button>
                          </div>
                        )}
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
