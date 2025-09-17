'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { StepIndicator } from '@/components/wizard/StepIndicator'
import { AIEnhancedRecommendationPane } from '@/components/recommendations/AIEnhancedRecommendationPane'
import { ChevronLeft, ChevronRight, User, UserCheck, AlertTriangle, Shield, RefreshCw, Home, FileText, Play } from 'lucide-react'
import Link from 'next/link'

interface Incident {
  id: string
  type?: string
  severity: string
  status: string
  currentStep: string
  createdAt: string
  indicators: Array<{
    id: string
    type: string
    value: string
    confidence: number
  }>
  recommendations: Array<{
    id: string
    action: string
    reason: string
    citation: string
    priority: number
    applied: boolean
    category: 'immediate' | 'follow_up' | 'optional'
  }>
  actions: Array<{
    id: string
    type: string
    status: string
    result?: string
    executedAt?: string
  }>
}

export default function IncidentPage() {
  const params = useParams()
  const incidentId = params.id as string
  
  const [incident, setIncident] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)
  const [executingAction, setExecutingAction] = useState(false)
  const [viewMode, setViewMode] = useState<'analyst' | 'manager'>('analyst')

  const steps = ['trigger', 'confirm', 'classify', 'contain', 'recover']
  const currentStepIndex = incident ? steps.indexOf(incident.currentStep) : 0

  useEffect(() => {
    fetchIncident()
  }, [incidentId])

  const fetchIncident = async () => {
    try {
      const response = await fetch(`/api/incidents/${incidentId}`)
      if (response.ok) {
        const data = await response.json()
        setIncident(data)
      }
    } catch (error) {
      console.error('Error fetching incident:', error)
    } finally {
      setLoading(false)
    }
  }

  const executeAction = async (actionType: string) => {
    if (!incident) return
    
    setExecutingAction(true)
    try {
      const response = await fetch(`/api/incidents/${incident.id}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType })
      })

      if (response.ok) {
        await fetchIncident()
      }
    } catch (error) {
      console.error('Error executing action:', error)
    } finally {
      setExecutingAction(false)
    }
  }

  const transitionToNextStep = async () => {
    if (!incident) return

    const nextStep = steps[currentStepIndex + 1]
    if (!nextStep) return

    try {
      const response = await fetch(`/api/incidents/${incident.id}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toStep: nextStep })
      })

      if (response.ok) {
        await fetchIncident()
      }
    } catch (error) {
      console.error('Error transitioning step:', error)
    }
  }

  const transitionToPreviousStep = async () => {
    if (!incident || currentStepIndex <= 0) return

    const previousStep = steps[currentStepIndex - 1]
    
    try {
      const response = await fetch(`/api/incidents/${incident.id}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toStep: previousStep })
      })

      if (response.ok) {
        await fetchIncident()
      }
    } catch (error) {
      console.error('Error transitioning step:', error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  const renderStepContent = () => {
    if (!incident) return null

    switch (incident.currentStep) {
      case 'trigger':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span>Incident Triggered</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-600">
                  A potential account compromise has been detected. Review the indicators below to confirm this is a legitimate security incident.
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-900">Detection Indicators</h4>
                  {incident.indicators.map((indicator) => (
                    <div key={indicator.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium capitalize text-slate-900">
                          {indicator.type.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-slate-600">
                          Value: {JSON.parse(indicator.value)}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-800">
                        {Math.round(indicator.confidence * 100)}% confidence
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 'confirm':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-blue-600" />
                <span>Confirm Incident</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Based on the indicators, this appears to be a legitimate security incident requiring immediate attention.
                </AlertDescription>
              </Alert>
              
              <div className="mt-4">
                <p className="text-slate-600">
                  The system has analyzed the detection indicators and recommends proceeding with the incident response process.
                </p>
              </div>
            </CardContent>
          </Card>
        )

      case 'classify':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <span>Incident Classification</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incident.type ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">Classified</Badge>
                      <h3 className="font-medium text-green-900 capitalize">
                        {incident.type.replace('_', ' ')}
                      </h3>
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      Incident automatically classified based on threat intelligence patterns and attack indicators.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800">
                      Classification in progress... Analyzing threat patterns.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )

      case 'contain':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-red-600" />
                <span>Containment Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-600">
                  Execute immediate containment actions to prevent further damage. Click actions in the recommendations panel to execute them.
                </p>
                
                {incident.actions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-slate-900">Executed Actions</h4>
                    {incident.actions.map((action) => (
                      <div key={action.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="capitalize">{action.type.replace('_', ' ')}</span>
                        <Badge variant={action.status === 'completed' ? 'default' : 'secondary'}>
                          {action.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )

      case 'recover':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5 text-green-600" />
                <span>Recovery Phase</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-600">
                  Incident has been contained. Begin recovery procedures to restore normal operations.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-900">Threat Neutralized</h4>
                    <p className="text-sm text-green-700">Containment actions successfully executed</p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900">Ready for Recovery</h4>
                    <p className="text-sm text-blue-700">Systems prepared for restoration</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Navigation */}
        <nav className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Identity Sentinel</h1>
                <p className="text-sm text-slate-500">Account Compromise Decision Coach</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link href="/reports" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors">
                <FileText className="h-4 w-4" />
                <span>Reports</span>
              </Link>
              <Link href="/simulate" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors">
                <Play className="h-4 w-4" />
                <span>Simulate</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="flex h-screen">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-slate-400" />
              <p className="text-slate-600">Loading incident...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!incident) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Navigation */}
        <nav className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Identity Sentinel</h1>
                <p className="text-sm text-slate-500">Account Compromise Decision Coach</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link href="/reports" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors">
                <FileText className="h-4 w-4" />
                <span>Reports</span>
              </Link>
              <Link href="/simulate" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors">
                <Play className="h-4 w-4" />
                <span>Simulate</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="flex h-screen">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-500" />
              <p className="text-slate-600">Incident not found</p>
              <Button asChild className="mt-4">
                <Link href="/">Return to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Identity Sentinel</h1>
              <p className="text-sm text-slate-500">Account Compromise Decision Coach</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link href="/reports" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors">
              <FileText className="h-4 w-4" />
              <span>Reports</span>
            </Link>
            <Link href="/simulate" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors">
              <Play className="h-4 w-4" />
              <span>Simulate</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex h-screen">
        {/* Main Content - 2/3 width */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Header */}
          <div className="border-b border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Incident Response Wizard
                </h1>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-slate-600">ID: {incident.id.slice(-8)}</span>
                  <Badge className={getSeverityColor(incident.severity)}>
                    {incident.severity}
                  </Badge>
                  {incident.type && (
                    <Badge variant="outline" className="capitalize">
                      {incident.type.replace('_', ' ')}
                    </Badge>
                  )}
                </div>
              </div>
              
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'analyst' | 'manager')}>
                <TabsList>
                  <TabsTrigger value="analyst" className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>Analyst</span>
                  </TabsTrigger>
                  <TabsTrigger value="manager" className="flex items-center space-x-1">
                    <UserCheck className="h-4 w-4" />
                    <span>Manager</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <StepIndicator 
              steps={steps}
              currentStep={currentStepIndex}
            />
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <Tabs value={viewMode}>
              <TabsContent value="analyst" className="space-y-4">
                {renderStepContent()}
              </TabsContent>
              
              <TabsContent value="manager" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Executive Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Incident Overview</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Type:</span>
                            <span className="capitalize">{incident.type?.replace('_', ' ') || 'Classifying...'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Severity:</span>
                            <Badge className={getSeverityColor(incident.severity)} variant="outline">
                              {incident.severity}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Status:</span>
                            <span className="capitalize">{incident.status}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Response Progress</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Actions Taken:</span>
                            <span>{incident.actions.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Step:</span>
                            <span className="capitalize">{incident.currentStep}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Progress:</span>
                            <span>{Math.round((currentStepIndex / (steps.length - 1)) * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Navigation */}
          <div className="border-t border-slate-200 p-6">
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={transitionToPreviousStep}
                disabled={currentStepIndex <= 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button 
                onClick={transitionToNextStep}
                disabled={currentStepIndex >= steps.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Recommendations Pane - 1/3 width */}
        <AIEnhancedRecommendationPane
          recommendations={incident.recommendations}
          currentStep={incident.currentStep}
          incidentType={incident.type}
          incidentSeverity={incident.severity}
          onExecuteAction={executeAction}
          isExecuting={executingAction}
        />
      </div>
    </div>
  )
}