'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Download, Calendar, Clock, CheckCircle2, Shield, Home, Play, QrCode, MonitorSpeaker, Palette } from 'lucide-react'
import Link from 'next/link'

interface Incident {
  id: string
  type?: string
  severity: string
  status: string
  createdAt: string
  updatedAt: string
  actions: Array<{
    id: string
    type: string
    status: string
    executedAt?: string
  }>
}

export default function ReportsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/incidents')
      .then(res => res.json())
      .then(data => {
        setIncidents(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching incidents:', error)
        setLoading(false)
      })
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive/20 text-destructive border-destructive/30'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed': return 'bg-green-100 text-green-800'
      case 'recovered': return 'bg-green-100 text-green-800'
      case 'contained': return 'bg-purple-100 text-purple-800'
      case 'classified': return 'bg-blue-100 text-blue-800'
      case 'confirmed': return 'bg-orange-100 text-orange-800'
      case 'triggered': return 'bg-destructive/20 text-destructive'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const generateReport = async (incidentId: string) => {
    const reportData = {
      incidentId,
      generatedAt: new Date().toISOString(),
      title: `Incident Report - ${incidentId.slice(-8)}`,
      summary: 'Account compromise incident successfully contained and resolved.',
      recommendations: 'Implement additional MFA requirements and user training.',
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `incident-report-${incidentId.slice(-8)}.json`
    a.click()
    URL.revokeObjectURL(url)
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
              className="flex items-center space-x-2 text-foreground font-medium px-4 py-2 rounded-lg bg-primary/20 border border-primary/30"
            >
              <FileText className="h-4 w-4" />
              <span>Reports</span>
            </Link>
            <Link 
              href="/simulate" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-muted/50"
            >
              <Play className="h-4 w-4" />
              <span>Simulate</span>
            </Link>
            <Link 
              href="/design-system" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-muted/50"
            >
              <Palette className="h-4 w-4" />
              <span>Design System</span>
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
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Incident Reports</h1>
              <p className="text-muted-foreground mt-1">Historical incident response activities and outcomes</p>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
                <FileText className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{incidents.length}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
                <Clock className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45m</div>
                <p className="text-xs text-muted-foreground">15m faster than target</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-muted-foreground">Incidents contained successfully</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Incident History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading incidents...</p>
                  </div>
                ) : incidents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No incidents to display</p>
                    <p className="text-sm text-muted-foreground">Try running a demo simulation to generate sample data</p>
                  </div>
                ) : (
                  incidents.map((incident) => (
                    <div 
                      key={incident.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg bg-card"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-foreground">
                            {incident.type ? (
                              <span className="capitalize">{incident.type.replace('_', ' ')}</span>
                            ) : (
                              `Incident ${incident.id.slice(-8)}`
                            )}
                          </h3>
                          <Badge className={getSeverityColor(incident.severity)}>
                            {incident.severity}
                          </Badge>
                          <Badge className={getStatusColor(incident.status)}>
                            {incident.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Created {formatDate(incident.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>{incident.actions.length} actions taken</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => generateReport(incident.id)}>
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}