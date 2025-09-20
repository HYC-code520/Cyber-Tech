'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, Clock, Target, AlertTriangle, Shield, Home, FileText, QrCode, MonitorSpeaker, Palette } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
      case 'critical': return 'bg-destructive/20 text-destructive border-destructive/30'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'password_spray': return <Target className="h-4 w-4 text-primary" />
      case 'mfa_fatigue': return <AlertTriangle className="h-4 w-4 text-destructive" />
      case 'credential_stuffing': return <Target className="h-4 w-4 text-destructive" />
      case 'suspicious_travel': return <Clock className="h-4 w-4 text-primary" />
      case 'false_positive_travel': return <Clock className="h-4 w-4 text-primary" />
      default: return <AlertTriangle className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-semibold text-foreground">Identity Sentinel</h1>
              <p className="text-sm text-muted-foreground">Account Compromise Decision Coach</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-muted/50"
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/reports" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-muted/50"
            >
              <FileText className="h-4 w-4" />
              <span>Reports</span>
            </Link>
            <Link 
              href="/simulate" 
              className="flex items-center space-x-2 text-primary font-medium px-4 py-2 rounded-lg bg-primary/10"
              aria-current="page"
            >
              <Play className="h-4 w-4" />
              <span>Simulate</span>
            </Link>
            <Link 
              href="/demo-lobby" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-muted/50"
            >
              <QrCode className="h-4 w-4" />
              <span>Live Demo</span>
            </Link>
            <Link 
              href="/demo-control" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-muted/50"
            >
              <MonitorSpeaker className="h-4 w-4" />
              <span>Demo Control</span>
            </Link>
            <Link 
              href="/design-system" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-muted/50"
            >
              <Palette className="h-4 w-4" />
              <span>Design System</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Demo Scenarios</h1>
            <p className="text-muted-foreground mt-1">
              Practice account compromise incident response with realistic scenarios
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-foreground">How Demo Mode Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-foreground">
                    <div className="flex items-start space-x-2">
                      <div className="bg-primary/20 rounded-full p-1">
                        <span className="block w-4 h-4 text-xs font-bold text-primary flex items-center justify-center">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Select Scenario</p>
                        <p className="text-muted-foreground">Choose from realistic attack patterns</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="bg-primary/20 rounded-full p-1">
                        <span className="block w-4 h-4 text-xs font-bold text-primary flex items-center justify-center">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Follow Guided Workflow</p>
                        <p className="text-muted-foreground">Step through the response process</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="bg-primary/20 rounded-full p-1">
                        <span className="block w-4 h-4 text-xs font-bold text-primary flex items-center justify-center">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Execute Actions</p>
                        <p className="text-muted-foreground">Simulate containment and recovery</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {demoCases.map((demoCase) => (
                  <Card key={demoCase.id} className="hover:shadow-md transition-shadow border-border">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(demoCase.type)}
                          <CardTitle className="text-lg text-foreground">{demoCase.name}</CardTitle>
                        </div>
                        <Badge variant="outline" className={getSeverityColor(demoCase.severity)}>
                          {demoCase.severity}
                        </Badge>
                      </div>
                      <CardDescription>{demoCase.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-2">Key Indicators</h4>
                          <div className="space-y-1">
                            {demoCase.indicators.slice(0, 3).map((indicator, index) => (
                              <div key={index} className="text-sm text-muted-foreground flex items-center justify-between">
                                <span className="capitalize">{indicator.type.replace('_', ' ')}</span>
                                <span className="text-xs bg-muted px-2 py-1 rounded">
                                  {typeof indicator.value === 'boolean' ? 
                                    (indicator.value ? 'Yes' : 'No') : 
                                    indicator.value
                                  }
                                </span>
                              </div>
                            ))}
                            {demoCase.indicators.length > 3 && (
                              <div className="text-xs text-muted-foreground">
                                +{demoCase.indicators.length - 3} more indicators
                              </div>
                            )}
                          </div>
                        </div>

                        <Button 
                          className="w-full" 
                          onClick={() => startSimulation(demoCase.id)}
                          disabled={startingCase === demoCase.id}
                          variant="default"
                        >
                          {startingCase === demoCase.id ? (
                            'Starting Simulation...'
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Start Simulation
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}