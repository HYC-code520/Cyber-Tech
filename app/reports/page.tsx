'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Download, Calendar, Clock } from 'lucide-react'
import { Navbar } from '@/components/ui/navbar'
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
        if (Array.isArray(data)) {
          setIncidents(data)
        } else {
          console.error('API Error:', data.error || 'Unknown error')
          setIncidents([])
        }
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching incidents:', error)
        setIncidents([])
        setLoading(false)
      })
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/30 text-red-200 border-red-400/50'
      case 'high': return 'bg-orange-500/30 text-orange-200 border-orange-400/50'
      case 'medium': return 'bg-yellow-500/30 text-yellow-200 border-yellow-400/50'
      case 'low': return 'bg-green-500/30 text-green-200 border-green-400/50'
      default: return 'bg-slate-500/30 text-slate-200 border-slate-400/50'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed': return 'bg-green-500/30 text-green-200'
      case 'recovered': return 'bg-green-500/30 text-green-200'
      case 'contained': return 'bg-purple-500/30 text-purple-200'
      case 'classified': return 'bg-blue-500/30 text-blue-200'
      case 'confirmed': return 'bg-orange-500/30 text-orange-200'
      case 'triggered': return 'bg-red-500/30 text-red-200'
      default: return 'bg-slate-500/30 text-slate-200'
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
      <Navbar />

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Security Reports & Analytics</h1>
              <p className="text-muted-foreground mt-1">Comprehensive incident reporting and analysis</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Download className="h-4 w-4 mr-2" />
              Export All Reports
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Incidents</p>
                    <p className="text-2xl font-bold text-foreground">{incidents.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Critical Incidents</p>
                    <p className="text-2xl font-bold text-red-400">
                      {incidents.filter(i => i.severity === 'critical').length}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Resolved</p>
                    <p className="text-2xl font-bold text-green-400">
                      {incidents.filter(i => ['closed', 'recovered'].includes(i.status)).length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                    <p className="text-2xl font-bold text-cyan-400">12m</p>
                  </div>
                  <Clock className="h-8 w-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Incidents List */}
          <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Incident Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading reports...</p>
                  </div>
                ) : incidents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No incidents to report.</p>
                    <p className="text-sm text-muted-foreground mt-2">Create incidents via simulation to generate reports.</p>
                  </div>
                ) : (
                  incidents.map((incident) => (
                    <div 
                      key={incident.id}
                      className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors backdrop-blur-sm"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-foreground">
                            {incident.type ? (
                              <span className="capitalize">
                                {incident.type.replace('_', ' ')}
                              </span>
                            ) : `Incident ${incident.id.slice(-8)}`}
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
                            <Clock className="h-4 w-4" />
                            <span>{incident.actions.length} actions taken</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => generateReport(incident.id)}
                          className="border-primary/40 hover:bg-primary/20 text-foreground"
                        >
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