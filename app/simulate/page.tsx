'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, Clock, Target, AlertTriangle } from 'lucide-react'
import { Navbar } from '@/components/ui/navbar'
import { useRouter } from 'next/navigation'

interface DemoCase {
  id: string
  name: string
  description: string
  type: string
  severity: string
  indicators: Array<{
    type: string
    value: any
    confidence: number
    description: string
  }>
  timeline?: string[]
}

export default function SimulatePage() {
  const [demoCases, setDemoCases] = useState<DemoCase[]>([])
  const [loading, setLoading] = useState(true)
  const [startingCase, setStartingCase] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/simulate')
      .then(res => res.json())
      .then(data => {
        setDemoCases(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading demo cases:', error)
        setLoading(false)
      })
  }, [])

  const startSimulation = async (caseId: string) => {
    setStartingCase(caseId)
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ caseId })
      })

      const data = await response.json()
      
      if (data.incident) {
        router.push(`/incident/${data.incident.id}`)
      }
    } catch (error) {
      console.error('Error starting simulation:', error)
    } finally {
      setStartingCase(null)
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'password_spray': return <Target className="h-4 w-4 text-orange-400" />
      case 'mfa_fatigue': return <AlertTriangle className="h-4 w-4 text-red-400" />
      case 'credential_stuffing': return <Target className="h-4 w-4 text-red-400" />
      case 'suspicious_travel': return <Clock className="h-4 w-4 text-yellow-400" />
      case 'false_positive_travel': return <Clock className="h-4 w-4 text-green-400" />
      default: return <AlertTriangle className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar subtitle="Security Monitoring - Attack Simulation Center" />

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Attack Simulation Center</h1>
            <p className="text-muted-foreground mt-2">Launch realistic security scenarios for training and testing</p>
          </div>

          {/* Demo Cases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading attack scenarios...</p>
              </div>
            ) : demoCases.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No attack scenarios available</p>
              </div>
            ) : (
              demoCases.map((demoCase) => (
                <Card key={demoCase.id} className="bg-card/60 border-border/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-primary/10">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(demoCase.type)}
                        <CardTitle className="text-foreground text-lg">{demoCase.name}</CardTitle>
                      </div>
                      <Badge className={getSeverityColor(demoCase.severity)}>
                        {demoCase.severity}
                      </Badge>
                    </div>
                    <CardDescription className="text-muted-foreground">
                      {demoCase.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Indicators Preview */}
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">Key Indicators</h4>
                        <div className="space-y-1">
                          {demoCase.indicators.slice(0, 3).map((indicator, index) => (
                            <div key={index} className="text-xs text-muted-foreground">
                              • {indicator.description}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Timeline Preview */}
                      {demoCase.timeline && (
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-2">Attack Timeline</h4>
                          <div className="space-y-1">
                            {demoCase.timeline.slice(0, 2).map((event, index) => (
                              <div key={index} className="text-xs text-muted-foreground">
                                • {event}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <Button 
                        onClick={() => startSimulation(demoCase.id)}
                        disabled={startingCase === demoCase.id}
                        className="w-full bg-primary hover:bg-primary/90"
                      >
                        {startingCase === demoCase.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Launching...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Simulate Attack
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Info Panel */}
          <Card className="border-primary/40 bg-primary/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-primary">How Attack Simulation Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h4 className="font-medium text-foreground mb-2">1. Select Scenario</h4>
                  <p className="text-muted-foreground">Choose from realistic attack patterns based on real-world threats and MITRE ATT&CK techniques.</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">2. Launch Investigation</h4>
                  <p className="text-muted-foreground">The system creates a new incident with authentic indicators and starts the response wizard.</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">3. Practice Response</h4>
                  <p className="text-muted-foreground">Follow the guided workflow, execute containment actions, and learn best practices.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}