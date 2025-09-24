'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { StepIndicator } from '@/components/wizard/StepIndicator'
import { AIEnhancedRecommendationPane } from '@/components/recommendations/AIEnhancedRecommendationPane'
import { ChevronLeft, ChevronRight, User, UserCheck, AlertTriangle, Shield, RefreshCw, Home, FileText, Play, MonitorSpeaker, QrCode, GripVertical, X, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/ui/navbar'

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
  const [transitionLoading, setTransitionLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'analyst' | 'manager'>('analyst')
  const [error, setError] = useState<string | null>(null)
  
  // Resizable panel state - Default to almost half screen width
  const [recommendationPaneWidth, setRecommendationPaneWidth] = useState(() => {
    // Default to 45% of viewport width, with fallbacks for different screen sizes
    if (typeof window !== 'undefined') {
      const viewportWidth = window.innerWidth
      if (viewportWidth >= 1920) return Math.floor(viewportWidth * 0.45) // 45% on large screens
      if (viewportWidth >= 1440) return Math.floor(viewportWidth * 0.42) // 42% on medium-large screens  
      if (viewportWidth >= 1024) return Math.floor(viewportWidth * 0.40) // 40% on medium screens
      return 400 // Fallback for smaller screens
    }
    return 600 // SSR fallback - reasonable default
  })
  const [isResizing, setIsResizing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const steps = ['trigger', 'confirm', 'classify', 'contain', 'recover']
  const currentStepIndex = incident ? steps.indexOf(incident.currentStep) : 0

  // Update default width when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (!isResizing) { // Only auto-adjust if user isn't actively resizing
        const viewportWidth = window.innerWidth
        let newWidth
        if (viewportWidth >= 1920) newWidth = Math.floor(viewportWidth * 0.45)
        else if (viewportWidth >= 1440) newWidth = Math.floor(viewportWidth * 0.42)
        else if (viewportWidth >= 1024) newWidth = Math.floor(viewportWidth * 0.40)
        else newWidth = 400
        
        setRecommendationPaneWidth(newWidth)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isResizing])

  useEffect(() => {
    fetchIncident()
  }, [incidentId])

  const fetchIncident = async () => {
    try {
      setError(null)
      const response = await fetch(`/api/incidents/${incidentId}`)
      if (response.ok) {
        const data = await response.json()
        setIncident(data)
        console.log('Fetched incident:', data) // Debug log
      } else {
        const errorData = await response.json()
        console.error('Failed to fetch incident:', response.status, errorData)
        setError(`Failed to fetch incident: ${errorData.error || response.status}`)
        setIncident(null)
      }
    } catch (error) {
      console.error('Error fetching incident:', error)
      setError('Network error while fetching incident')
      setIncident(null)
    } finally {
      setLoading(false)
    }
  }

  const executeAction = async (actionType: string) => {
    if (!incident) {
      console.error('❌ No incident available for action execution')
      setError('No incident data available')
      return
    }
    
    console.log(`🔥 Frontend: Executing action "${actionType}" for incident ${incident.id}`)
    
    setExecutingAction(true)
    setError(null)
    
    try {
      const requestBody = { actionType }
      console.log('📤 Frontend: Sending request:', requestBody)
      
      const response = await fetch(`/api/incidents/${incident.id}/actions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      console.log(`📥 Frontend: Response status: ${response.status} ${response.statusText}`)

      // Handle response
      let responseData
      try {
        const responseText = await response.text()
        console.log('📥 Frontend: Raw response:', responseText)
        
        if (responseText) {
          responseData = JSON.parse(responseText)
        } else {
          responseData = { error: 'Empty response from server' }
        }
      } catch (parseError) {
        console.error('💥 Frontend: Failed to parse response:', parseError)
        responseData = { error: 'Invalid response format from server' }
      }

      if (response.ok && responseData.success) {
        console.log('✅ Frontend: Action executed successfully:', responseData)
        
        // Clear any errors
        setError(null)
        
        // Refresh incident to show new action
        try {
          await fetchIncident()
          console.log('✅ Frontend: Incident data refreshed')
        } catch (refreshError) {
          console.error('⚠️ Frontend: Failed to refresh incident:', refreshError)
          // Don't show error for this, action still succeeded
        }
        
      } else {
        console.error('❌ Frontend: Action failed:', responseData)
        
        const errorMessage = responseData.error || 
                           responseData.details || 
                           `Action failed with status ${response.status}`
        
        setError(`Action failed: ${errorMessage}`)
      }
      
    } catch (networkError) {
      console.error('💥 Frontend: Network error:', networkError)
      setError(`Network error: ${networkError instanceof Error ? networkError.message : 'Connection failed'}`)
    } finally {
      setExecutingAction(false)
    }
  }

  const markAsFalsePositive = async () => {
    if (!incident) return

    console.log('Marking incident as false positive and closing...')

    setTransitionLoading(true)
    setError(null)

    try {
      // Transition directly to closed state
      const response = await fetch(`/api/incidents/${incident.id}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toStep: 'closed',
          userId: 'analyst',
          reason: 'Incident marked as false positive'
        })
      })

      let responseData
      try {
        responseData = await response.json()
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError)
        responseData = { error: 'Invalid server response' }
      }

      if (response.ok) {
        console.log('Incident successfully closed as false positive')
        // Redirect to dashboard or show success message
        window.location.href = '/'
      } else {
        console.error('Failed to close incident:', responseData)
        const errorMessage = responseData?.error || responseData?.details || 'Failed to close incident'
        setError(`Error: ${errorMessage}`)
      }
    } catch (error) {
      console.error('Error closing incident:', error)
      setError('Network error while closing incident')
    } finally {
      setTransitionLoading(false)
    }
  }

  const transitionToNextStep = async () => {
    if (!incident) return

    const nextStep = steps[currentStepIndex + 1]
    if (!nextStep) {
      console.log('Already at final step')
      return
    }

    console.log(`Transitioning from ${incident.currentStep} to ${nextStep}`) // Debug log
    
    setTransitionLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/incidents/${incident.id}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          toStep: nextStep,
          userId: 'analyst',
          reason: `Manual transition from ${incident.currentStep} to ${nextStep}`
        })
      })

      let responseData
      try {
        responseData = await response.json()
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError)
        responseData = { error: 'Invalid server response' }
      }
      console.log('Transition response:', response.status, responseData) // Debug log

      if (response.ok) {
        await fetchIncident()
        console.log('Transition successful')
      } else {
        console.error('Transition failed:', responseData)
        const errorMessage = responseData?.error || responseData?.details || 'Unknown error'
        setError(`Transition failed: ${errorMessage}`)
      }
    } catch (error) {
      console.error('Error transitioning step:', error)
      setError('Network error during transition')
    } finally {
      setTransitionLoading(false)
    }
  }

  const transitionToPreviousStep = async () => {
    if (!incident || currentStepIndex <= 0) {
      console.log('Cannot go back: at first step or no incident')
      return
    }

    const previousStep = steps[currentStepIndex - 1]
    
    console.log(`Transitioning back from ${incident.currentStep} to ${previousStep}`)
    
    setTransitionLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/incidents/${incident.id}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          toStep: previousStep,
          userId: 'analyst',
          reason: `Manual rollback from ${incident.currentStep} to ${previousStep}`
        })
      })

      let responseData
      try {
        responseData = await response.json()
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError)
        responseData = { error: 'Invalid server response' }
      }
      console.log('Previous transition response:', response.status, responseData)

      if (response.ok) {
        await fetchIncident()
        console.log('Previous transition successful')
        
        // Optional: Show success feedback
        setError(null)
      } else {
        console.error('Previous transition failed:', responseData)
        setError(`Cannot go back: ${responseData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error transitioning step:', error)
      setError('Network error during transition')
    } finally {
      setTransitionLoading(false)
    }
  }

  // Add new transition function for direct step navigation
  const transitionToStep = async (targetStepIndex: number) => {
    if (!incident) return
    
    const targetStep = steps[targetStepIndex]
    if (!targetStep) {
      console.log('Invalid step index:', targetStepIndex)
      return
    }

    // Don't transition if already at target step
    if (targetStepIndex === currentStepIndex) {
      console.log('Already at target step:', targetStep)
      return
    }

    // Only allow transitions to completed steps, current step, or next step
    if (targetStepIndex > currentStepIndex + 1) {
      setError('Cannot skip ahead more than one step. Complete the current step first.')
      return
    }

    const direction = targetStepIndex > currentStepIndex ? 'forward' : 'backward'
    console.log(`Direct transition ${direction} from ${incident.currentStep} to ${targetStep}`)
    
    setTransitionLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/incidents/${incident.id}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          toStep: targetStep,
          userId: 'analyst',
          reason: `Direct ${direction} transition from ${incident.currentStep} to ${targetStep}`
        })
      })

      let responseData
      try {
        responseData = await response.json()
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError)
        responseData = { error: 'Invalid server response' }
      }
      console.log('Direct transition response:', response.status, responseData)

      if (response.ok) {
        await fetchIncident()
        console.log('Direct transition successful')
        setError(null)
      } else {
        console.error('Direct transition failed:', responseData)
        const errorMessage = responseData?.error || responseData?.details || 'Unknown error'
        setError(`Transition failed: ${errorMessage}`)
      }
    } catch (error) {
      console.error('Error in direct transition:', error)
      setError('Network error during transition')
    } finally {
      setTransitionLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/30 text-red-200 border-red-400/50'
      case 'high': return 'bg-orange-500/30 text-orange-200 border-orange-400/50'
      case 'medium': return 'bg-yellow-500/30 text-yellow-200 border-yellow-400/50'
      case 'low': return 'bg-green-500/30 text-green-200 border-green-400/50'
      default: return 'bg-slate-500/30 text-slate-200 border-slate-400/50'
    }
  }

  const renderStepContent = () => {
    if (!incident) return null

    switch (incident.currentStep) {
      case 'trigger':
        return (
          <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <AlertTriangle className="h-5 w-5 text-orange-400" />
                <span>Incident Triggered</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Review the indicators to confirm this security incident
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  A potential account compromise has been detected. Review the indicators below to confirm this is a legitimate security incident.
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Detection Indicators</h4>
                  {incident.indicators.map((indicator) => (
                    <div key={indicator.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50 backdrop-blur-sm">
                      <div>
                        <p className="font-medium capitalize text-foreground">
                          {indicator.type.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Value: {JSON.parse(indicator.value)}
                        </p>
                      </div>
                      <Badge className="bg-primary/30 text-primary-foreground border border-primary/40">
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
          <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <UserCheck className="h-5 w-5 text-primary" />
                <span>Confirm Incident</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Verification of security incident status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="border-primary/40 bg-primary/20 backdrop-blur-sm">
                <AlertTriangle className="h-4 w-4 text-primary" />
                <AlertDescription className="text-foreground">
                  Based on the indicators, this appears to be a legitimate security incident requiring immediate attention.
                </AlertDescription>
              </Alert>
              
              <div className="mt-4">
                <p className="text-muted-foreground">
                  The system has analyzed the detection indicators and recommends proceeding with the incident response process.
                </p>
              </div>

              {/* False Positive Option */}
              <div className="mt-6 p-4 border border-yellow-400/30 bg-yellow-400/10 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">Not a real threat?</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      If after review you determine this is a false positive or normal behavior, you can close this incident.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => markAsFalsePositive()}
                      className="border-yellow-400/50 hover:bg-yellow-400/20 text-yellow-200"
                      disabled={transitionLoading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Mark as False Positive & Close
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 'classify':
        return (
          <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <Shield className="h-5 w-5 text-primary" />
                <span>Incident Classification</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Categorization of the security incident type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incident.type ? (
                  <div className="p-4 bg-primary/20 border border-primary/40 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-primary/30 text-primary-foreground border border-primary/40">Classified</Badge>
                      <h3 className="font-medium text-foreground capitalize">
                        {incident.type.replace('_', ' ')}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Incident automatically classified based on threat intelligence patterns and attack indicators.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-muted/30 border border-border/50 rounded-lg backdrop-blur-sm">
                    <p className="text-muted-foreground">
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
          <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <Shield className="h-5 w-5 text-red-400" />
                <span>Containment Actions</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Execute actions to limit the incident impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Execute immediate containment actions to prevent further damage. Click actions in the recommendations panel to execute them.
                </p>
                
                {incident.actions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Executed Actions</h4>
                    {incident.actions.map((action) => (
                      <div key={action.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50 backdrop-blur-sm">
                        <span className="capitalize text-foreground">{action.type.replace('_', ' ')}</span>
                        <Badge variant={action.status === 'completed' ? 'default' : 'secondary'} 
                               className={action.status === 'completed' ? 'bg-green-500/30 text-green-200' : 'bg-yellow-500/30 text-yellow-200'}>
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
          <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <RefreshCw className="h-5 w-5 text-primary" />
                <span>Recovery Phase</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Restore normal operations after containment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
              <p className="text-muted-foreground">
                  Incident has been contained. Begin recovery procedures to restore normal operations.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-green-500/20 border border-green-400/40 rounded-lg backdrop-blur-sm">
                    <h4 className="font-medium text-green-200">Threat Neutralized</h4>
                    <p className="text-sm text-green-300">Containment actions successfully executed</p>
                  </div>
                  
                  <div className="p-3 bg-blue-500/20 border border-blue-400/40 rounded-lg backdrop-blur-sm">
                    <h4 className="font-medium text-blue-200">Ready for Recovery</h4>
                    <p className="text-sm text-blue-300">Systems prepared for restoration</p>
                  </div>
                </div>

                {/* Completion Notice */}
                <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg backdrop-blur-sm">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-primary mb-1">Ready to Complete</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        All incident response steps have been completed. Click "Complete Incident" below to:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Generate incident documentation</li>
                        <li>• Archive all evidence and logs</li>
                        <li>• Close the incident ticket</li>
                        <li>• Update security metrics</li>
                      </ul>
                    </div>
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

  // Resizing handlers
  const startResize = (e: React.MouseEvent) => {
    setIsResizing(true)
    e.preventDefault()
  }

  const handleResize = (e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return
    
    const containerRect = containerRef.current.getBoundingClientRect()
    const newWidth = containerRect.right - e.clientX
    
    // Set min and max width constraints
    const minWidth = 300 // Minimum 300px
    const maxWidth = containerRect.width * 0.7 // Maximum 70% of container
    
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
    setRecommendationPaneWidth(clampedWidth)
  }

  const stopResize = () => {
    setIsResizing(false)
  }

  // Add mouse event listeners for resizing
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize)
      document.addEventListener('mouseup', stopResize)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    } else {
      document.removeEventListener('mousemove', handleResize)
      document.removeEventListener('mouseup', stopResize)
      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }

    return () => {
      document.removeEventListener('mousemove', handleResize)
      document.removeEventListener('mouseup', stopResize)
      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }
  }, [isResizing])

  const completeIncident = async () => {
    if (!incident) return

    console.log('Completing incident and closing...')

    setTransitionLoading(true)
    setError(null)

    try {
      // Transition to closed state
      const response = await fetch(`/api/incidents/${incident.id}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toStep: 'closed',
          userId: 'analyst',
          reason: 'Incident response completed successfully'
        })
      })

      let responseData
      try {
        responseData = await response.json()
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError)
        responseData = { error: 'Invalid server response' }
      }

      if (response.ok) {
        console.log('Incident successfully completed and closed')
        // Redirect to dashboard with success message
        window.location.href = '/?completed=true'
      } else {
        console.error('Failed to complete incident:', responseData)
        const errorMessage = responseData?.error || responseData?.details || 'Failed to complete incident'
        setError(`Error: ${errorMessage}`)
      }
    } catch (error) {
      console.error('Error completing incident:', error)
      setError('Network error while completing incident')
    } finally {
      setTransitionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex h-screen">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading incident...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!incident) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex h-screen">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-400" />
              <p className="text-muted-foreground">Incident not found</p>
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
              <Button asChild className="mt-4 bg-primary hover:bg-primary/90">
                <Link href="/">Return to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div 
        ref={containerRef}
        className="flex h-[calc(100vh-4rem)] relative"
      >
        {/* Main Content - Dynamic width */}
        <div 
          className="flex flex-col bg-card/60 backdrop-blur-sm relative"
          style={{ width: `calc(100% - ${recommendationPaneWidth}px)` }}
        >
          {/* Header */}
          <div className="border-b border-border/50 p-6 flex-shrink-0">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Incident Response Wizard
                </h1>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-muted-foreground">ID: {incident.id.slice(-8)}</span>
                  <Badge className={getSeverityColor(incident.severity)}>
                    {incident.severity}
                  </Badge>
                  {incident.type && (
                    <Badge variant="outline" className="capitalize border-border/50 text-muted-foreground">
                      {incident.type.replace('_', ' ')}
                    </Badge>
                  )}
                </div>
                {/* Debug info */}
                <div className="text-xs text-muted-foreground mt-1">
                  Current: {incident.currentStep} (step {currentStepIndex + 1}/{steps.length})
                </div>
              </div>
              
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'analyst' | 'manager')}>
                <TabsList className="bg-muted/50 border-border/50">
                  <TabsTrigger value="analyst" className="flex items-center space-x-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                    <User className="h-4 w-4" />
                    <span>Analyst</span>
                  </TabsTrigger>
                  <TabsTrigger value="manager" className="flex items-center space-x-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                    <UserCheck className="h-4 w-4" />
                    <span>Manager</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <StepIndicator 
              steps={steps}
              currentStep={currentStepIndex}
              onStepClick={transitionToStep}
              isTransitioning={transitionLoading}
            />

            {/* Error display */}
            {error && (
              <Alert className="mt-4 border-red-400/40 bg-red-500/20">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto pb-24">
            <Tabs value={viewMode}>
              <TabsContent value="analyst" className="space-y-4">
                {renderStepContent()}
              </TabsContent>
              
              <TabsContent value="manager" className="space-y-4">
                <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-foreground">Executive Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Incident Overview</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="capitalize text-foreground">{incident.type?.replace('_', ' ') || 'Classifying...'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Severity:</span>
                            <Badge className={getSeverityColor(incident.severity)}>
                              {incident.severity}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <span className="capitalize text-foreground">{incident.status}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Response Progress</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Actions Taken:</span>
                            <span className="text-foreground">{incident.actions.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Step:</span>
                            <span className="capitalize text-foreground">{incident.currentStep}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Progress:</span>
                            <span className="text-foreground">{Math.round((currentStepIndex / (steps.length - 1)) * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sticky Navigation - Always visible at bottom */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-border/50 bg-card/90 backdrop-blur-md p-6 flex justify-between items-center shadow-lg">
            <Button 
              variant="outline" 
              onClick={transitionToPreviousStep}
              disabled={currentStepIndex <= 0 || transitionLoading}
              className="border-primary/40 hover:bg-primary/20 text-foreground disabled:opacity-50"
              title={currentStepIndex <= 0 ? "Already at first step" : "Go to previous step"}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {transitionLoading ? 'Loading...' : 'Previous'}
            </Button>
            
            {/* Progress indicator in center */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Step {currentStepIndex + 1} of {steps.length}</span>
              <div className="w-24 h-2 bg-muted/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out" 
                  style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Conditional rendering for the right button */}
            {currentStepIndex >= steps.length - 1 ? (
              <Button 
                onClick={completeIncident}
                disabled={transitionLoading}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white"
                title="Complete incident and close"
              >
                {transitionLoading ? 'Completing...' : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Incident
                  </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={transitionToNextStep}
                disabled={transitionLoading}
                className="bg-primary hover:bg-primary/90 disabled:opacity-50"
                title="Go to next step"
              >
                {transitionLoading ? 'Loading...' : 'Next'}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Resize Handle */}
        <div
          className={`w-1 bg-border/50 hover:bg-primary/50 cursor-col-resize flex items-center justify-center relative group ${
            isResizing ? 'bg-primary/70' : ''
          }`}
          onMouseDown={startResize}
        >
          {/* Visual indicator */}
          <div className="absolute inset-y-0 -inset-x-1 flex items-center justify-center">
            <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          
          {/* Width indicator tooltip */}
          {isResizing && (
            <div className="absolute top-1/2 -translate-y-1/2 -left-16 bg-card border border-border rounded px-2 py-1 text-xs text-foreground shadow-lg">
              {Math.round(recommendationPaneWidth)}px
            </div>
          )}
        </div>

        {/* Recommendations Pane - Resizable width */}
        <div 
          className="flex-shrink-0 bg-background border-l border-border/50"
          style={{ width: `${recommendationPaneWidth}px` }}
        >
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
    </div>
  )
}