'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Info, ExternalLink, AlertCircle, CheckCircle2, Clock, Shield } from 'lucide-react'
import { useState } from 'react'
import { citationLinks, getRiskIndicator, timeEstimates } from '@/lib/rules/recommendations'

interface Recommendation {
  id: string
  action: string
  reason: string
  citation: string
  priority: number
  applied: boolean
  category: 'immediate' | 'follow_up' | 'optional'
}

interface RecommendationPaneProps {
  recommendations: Recommendation[]
  currentStep: string
  incidentType?: string
  onExecuteAction?: (actionType: string) => void
  isExecuting?: boolean
}

export function RecommendationPane({ 
  recommendations, 
  currentStep, 
  incidentType,
  onExecuteAction,
  isExecuting = false
}: RecommendationPaneProps) {
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'immediate': return 'bg-red-100 text-red-800 border-red-200'
      case 'follow_up': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'optional': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  const getPriorityIcon = (priority: number) => {
    const riskIndicator = getRiskIndicator(priority)
    return (
      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${riskIndicator.bgColor} ${riskIndicator.color} ${riskIndicator.borderColor} border`}>
        <span>{riskIndicator.icon}</span>
        <span>{riskIndicator.text}</span>
      </div>
    )
  }

  const getStepRecommendations = () => {
    if (currentStep === 'contain' && recommendations.length > 0) {
      return recommendations.filter(r => r.category === 'immediate')
    }
    return recommendations
  }

  const stepRecommendations = getStepRecommendations()

  const handleCitationClick = (citation: string) => {
    const link = citationLinks[citation]
    if (link && link !== '#') {
      window.open(link, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="w-full h-full bg-slate-50 border-l border-slate-200 flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-slate-900">Why & Citations</h2>
        </div>
        <p className="text-sm text-slate-600">
          Evidence-based recommendations with risk indicators and time estimates
        </p>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {incidentType && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-900 text-sm">Incident Classification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-800 font-medium capitalize">
                  {incidentType.replace('_', ' ')}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Automatically classified using threat intelligence patterns
                </p>
              </CardContent>
            </Card>
          )}

          {stepRecommendations.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-slate-500">
                  <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recommendations available for current step</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            stepRecommendations.map((rec, index) => {
              const riskIndicator = getRiskIndicator(rec.priority)
              const timeEstimate = timeEstimates[rec.action] || 'Unknown'
              const citationLink = citationLinks[rec.citation]
              
              return (
                <Card 
                  key={rec.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedRec?.id === rec.id ? 'ring-2 ring-blue-500' : ''
                  } ${rec.applied ? 'opacity-60' : ''}`}
                  onClick={() => setSelectedRec(selectedRec?.id === rec.id ? null : rec)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getPriorityIcon(rec.priority)}
                        <CardTitle className="text-sm">{rec.action.replace(/_/g, ' ')}</CardTitle>
                        {rec.applied && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                      </div>
                      <Badge className={getCategoryColor(rec.category)} variant="outline">
                        {rec.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 mb-3">{rec.reason}</p>
                    
                    {/* Time Estimate */}
                    <div className="flex items-center space-x-1 mb-3">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span className="text-xs text-slate-500">Est. {timeEstimate}</span>
                    </div>
                    
                    {selectedRec?.id === rec.id && (
                      <>
                        <Separator className="my-3" />
                        <div className="space-y-3">
                          {/* Risk Level Details */}
                          <div>
                            <h4 className="text-xs font-medium text-slate-900 mb-1">Risk Level</h4>
                            <div className={`flex items-center space-x-2 p-2 rounded ${riskIndicator.bgColor} ${riskIndicator.borderColor} border`}>
                              <span className="text-sm">{riskIndicator.icon}</span>
                              <div>
                                <p className={`text-xs font-medium ${riskIndicator.color}`}>{riskIndicator.text}</p>
                                <p className="text-xs text-slate-600">{riskIndicator.description}</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Citation */}
                          <div>
                            <h4 className="text-xs font-medium text-slate-900 mb-1">Citation</h4>
                            <div className="flex items-center justify-between text-xs text-slate-600">
                              <span className="flex-1">{rec.citation}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-2 ml-2"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCitationClick(rec.citation)
                                }}
                                disabled={!citationLink || citationLink === '#'}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                            {citationLink && citationLink !== '#' && (
                              <p className="text-xs text-blue-600 mt-1">Click to view source</p>
                            )}
                          </div>
                          
                          {/* Execute Action Button */}
                          {currentStep === 'contain' && onExecuteAction && !rec.applied && (
                            <Button 
                              size="sm" 
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation()
                                onExecuteAction(rec.action)
                              }}
                              disabled={isExecuting}
                            >
                              {isExecuting ? 'Executing...' : 'Execute Action'}
                            </Button>
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}

          {currentStep === 'trigger' && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-900 text-sm">Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-800">
                  Review the incident indicators and confirm this is a legitimate security event.
                </p>
              </CardContent>
            </Card>
          )}

          {currentStep === 'classify' && incidentType && (
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-purple-900 text-sm">Classification Complete</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-800">
                  Incident automatically classified as <strong>{incidentType.replace('_', ' ')}</strong> based on threat patterns.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Legend */}
          <Card className="border-slate-200 bg-slate-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-900 text-sm">Risk Level Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                  <span>🚨</span>
                  <span>Critical</span>
                </div>
                <span className="text-xs text-slate-600">Immediate action required</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                  <span>⚠️</span>
                  <span>High</span>
                </div>
                <span className="text-xs text-slate-600">Urgent action needed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                  <span>⚡</span>
                  <span>Medium</span>
                </div>
                <span className="text-xs text-slate-600">Important action</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                  <span>ℹ️</span>
                  <span>Low</span>
                </div>
                <span className="text-xs text-slate-600">Recommended action</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}