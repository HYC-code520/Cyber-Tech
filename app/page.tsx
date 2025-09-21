'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Clock, Play, Plus, QrCode, Activity, TrendingUp, Eye, Globe } from 'lucide-react'
import { Navbar } from '@/components/ui/navbar'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Dynamically import the map components to avoid SSR issues
const IncidentMap = dynamic(
  () => import('@/components/security/incident-map/IncidentMap'),
  { ssr: false }
)

const MapControls = dynamic(
  () => import('@/components/security/incident-map/MapControls'),
  { ssr: false }
)

export default function Dashboard() {
  const [recentIncidents, setRecentIncidents] = useState<Array<Record<string, any>>>([])
  const [mapIncidents, setMapIncidents] = useState<Array<Record<string, any>>>([])
  const [loading, setLoading] = useState(true)
  const [mapLoading, setMapLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('24')
  const [severityFilter, setSeverityFilter] = useState('all')

  const fetchMapIncidents = () => {
    setMapLoading(true)
    const params = new URLSearchParams({
      hours: timeRange,
      severity: severityFilter
    })

    fetch(`/api/incidents/locations?${params}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.incidents) {
          setMapIncidents(data.incidents)
        }
        setMapLoading(false)
      })
      .catch(error => {
        console.error('Error fetching map incidents:', error)
        setMapLoading(false)
      })
  }

  const handleExportMap = () => {
    // Export map data as JSON
    const dataStr = JSON.stringify(mapIncidents, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `incident-map-${new Date().toISOString()}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  useEffect(() => {
    // Fetch recent incidents for the list
    fetch('/api/incidents')
      .then(res => res.json())
      .then(data => {
        // Handle both array and error responses
        if (Array.isArray(data)) {
          const formattedIncidents = data.slice(0, 3).map((incident: Record<string, any>) => ({
            id: incident.id,
            type: incident.type ? incident.type.replace('_', ' ').split(' ').map((word: string) => 
              word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Unknown Incident',
            severity: incident.severity,
            status: incident.status,
            createdAt: new Date(incident.createdAt).toLocaleString()
          }))
          setRecentIncidents(formattedIncidents)
        } else {
          console.error('API Error:', data.error || 'Unknown error')
          setRecentIncidents([])
        }
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching incidents:', error)
        setRecentIncidents([])
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchMapIncidents()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange, severityFilter])

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
      case 'triggered': return 'bg-red-500/30 text-red-200'
      case 'confirmed': return 'bg-orange-500/30 text-orange-200'
      case 'classified': return 'bg-blue-500/30 text-blue-200'
      case 'contained': return 'bg-purple-500/30 text-purple-200'
      case 'recovered': return 'bg-green-500/30 text-green-200'
      case 'closed': return 'bg-slate-500/30 text-slate-200'
      default: return 'bg-slate-500/30 text-slate-200'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Security Signals related to Account Compromise</h1>
              <p className="text-muted-foreground mt-1">Real-time incident monitoring and response coordination</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" asChild className="border-primary/40 hover:bg-primary/20 text-foreground">
                <Link href="/simulate">
                  <Play className="h-4 w-4 mr-2" />
                  Scenario Demo
                </Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/demo-lobby">
                  <QrCode className="h-4 w-4 mr-2" />
                  Interactive Demo
                </Link>
              </Button>
              <Button variant="outline" asChild className="border-primary/40 hover:bg-primary/20 text-foreground">
                <Link href="/incident/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Investigation
                </Link>
              </Button>
            </div>
          </div>

          {/* Global Threat Map */}
          <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <CardTitle className="text-foreground">Global Threat Map</CardTitle>
                </div>
                <Badge className="bg-primary/20 text-primary">
                  Live - Last 24 Hours
                </Badge>
              </div>
              <CardDescription className="text-muted-foreground">
                Real-time visualization of login incidents and attack patterns worldwide
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <MapControls
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
                severityFilter={severityFilter}
                onSeverityFilterChange={setSeverityFilter}
                onRefresh={fetchMapIncidents}
                onExport={handleExportMap}
                isLoading={mapLoading}
                incidentCount={mapIncidents.length}
              />
              <div className="mt-4">
                {mapLoading ? (
                  <div className="flex items-center justify-center h-[600px] bg-muted/10 rounded-lg">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading threat map...</p>
                    </div>
                  </div>
                ) : (
                  <IncidentMap incidents={mapIncidents} />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security Signals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card/60 border-border/50 backdrop-blur-sm metric-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Signals</CardTitle>
                <AlertTriangle className="h-5 w-5 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-orange-300">8</div>
                <p className="text-xs text-muted-foreground mt-1">Active security alerts</p>
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border/50 backdrop-blur-sm metric-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Unique IPs</CardTitle>
                <Activity className="h-5 w-5 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-red-300">11</div>
                <p className="text-xs text-muted-foreground mt-1">Suspicious sources</p>
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border/50 backdrop-blur-sm metric-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Logs</CardTitle>
                <Eye className="h-5 w-5 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-cyan-300">2M</div>
                <p className="text-xs text-muted-foreground mt-1">Events processed</p>
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border/50 backdrop-blur-sm metric-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Response</CardTitle>
                <Clock className="h-5 w-5 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-300">3K</div>
                <p className="text-xs text-muted-foreground mt-1">Milliseconds</p>
              </CardContent>
            </Card>
          </div>

          {/* Security Signals by Severity */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="bg-cyan-400/20 border-cyan-400/40 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-cyan-200">5</div>
                <p className="text-sm text-cyan-300 font-medium">INFOs</p>
              </CardContent>
            </Card>
            <Card className="bg-yellow-400/20 border-yellow-400/40 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-200">2</div>
                <p className="text-sm text-yellow-300 font-medium">LOWs</p>
              </CardContent>
            </Card>
            <Card className="bg-orange-400/20 border-orange-400/40 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-200">1</div>
                <p className="text-sm text-orange-300 font-medium">MEDIUMs</p>
              </CardContent>
            </Card>
            <Card className="bg-red-400/20 border-red-400/40 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-red-200">2</div>
                <p className="text-sm text-red-300 font-medium">HIGHs</p>
              </CardContent>
            </Card>
            <Card className="bg-red-500/30 border-red-500/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-red-100">3</div>
                <p className="text-sm text-red-200 font-medium">CRITICALs</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Incidents */}
          <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Security Incidents</CardTitle>
              <CardDescription className="text-muted-foreground">Latest account compromise investigations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading incidents...</p>
                  </div>
                ) : recentIncidents.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No incidents detected.</p>
                    <p className="text-sm text-muted-foreground mt-2">Click "Scenario Demo" to generate sample security incidents.</p>
                  </div>
                ) : (
                  recentIncidents.map((incident) => (
                  <div 
                    key={incident.id}
                    className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-8 bg-primary rounded-full pulse-glow"></div>
                      <div>
                        <h3 className="font-medium text-foreground">{incident.type}</h3>
                        <p className="text-sm text-muted-foreground">{incident.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                      <Button variant="outline" size="sm" asChild className="border-primary/40 hover:bg-primary/20 text-foreground">
                        <Link href={`/incident/${incident.id}`}>
                          Investigate
                        </Link>
                      </Button>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-primary/40 bg-primary/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-primary">Security Operations Center</CardTitle>
              <CardDescription className="text-muted-foreground">
                Launch security scenarios and investigate potential account compromises
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/simulate">
                    <Play className="h-4 w-4 mr-2" />
                    Launch Attack Scenarios
                  </Link>
                </Button>
                <Button variant="outline" asChild className="border-primary/40 hover:bg-primary/20 text-foreground">
                  <Link href="/reports">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Security Analytics
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
