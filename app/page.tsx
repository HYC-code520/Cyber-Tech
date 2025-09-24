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

    console.log(`🗺️ Fetching map incidents: /api/incidents/locations?${params.toString()}`)

    fetch(`/api/incidents/locations?${params}`)
      .then(res => {
        console.log(`🗺️ Response status: ${res.status}`)
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        }
        return res.json()
      })
      .then(data => {
        console.log('🗺️ Full API response:', data)
        
        if (data.success && Array.isArray(data.incidents)) {
          console.log(`🗺️ Setting ${data.incidents.length} incidents on map`)
          console.log('🗺️ Sample incidents:', data.incidents.slice(0, 3))
          setMapIncidents(data.incidents)
        } else {
          console.error('🗺️ API call failed or invalid response format:', data)
          setMapIncidents([])
        }
        setMapLoading(false)
      })
      .catch(error => {
        console.error('🗺️ Network error fetching map incidents:', error)
        setMapLoading(false)
        setMapIncidents([])
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

  const fetchRecentIncidents = () => {
    fetch('/api/incidents')
      .then(res => res.json())
      .then(data => {
        // Handle both array and error responses
        if (Array.isArray(data)) {
          console.log('📋 All incidents from API:', data.map(i => ({ id: i.id.slice(-8), status: i.status, type: i.type })))

          // Filter out closed and documented incidents - only show active ones
          const activeIncidents = data.filter((incident: Record<string, any>) => {
            const isActive = incident.status !== 'closed' && incident.status !== 'documented'
            console.log(`📋 Incident ${incident.id.slice(-8)}: status="${incident.status}" isActive=${isActive}`)
            return isActive
          })

          console.log('📋 Active incidents after filter:', activeIncidents.map(i => ({ id: i.id.slice(-8), status: i.status })))

          const formattedIncidents = activeIncidents.slice(0, 3).map((incident: Record<string, any>) => ({
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
  }

  useEffect(() => {
    // Initial fetch
    fetchRecentIncidents()

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchRecentIncidents()
    }, 30000)

    // Refresh when page gains focus (e.g., user returns from incident page)
    const handleFocus = () => {
      fetchRecentIncidents()
      fetchMapIncidents()
    }

    window.addEventListener('focus', handleFocus)

    // Clean up
    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  useEffect(() => {
    console.log(`🔄 Filters changed: timeRange=${timeRange}, severityFilter=${severityFilter}`)
    fetchMapIncidents()
  }, [timeRange, severityFilter])

  // Add an initial load effect
  useEffect(() => {
    console.log('🚀 Dashboard mounted, loading map incidents...')
    fetchMapIncidents()
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/30 text-red-200 border-red-400/50'
      case 'high': return 'bg-orange-500/30 text-orange-200 border-orange-400/50'
      case 'medium': return 'bg-yellow-500/30 text-yellow-200 border-yellow-400/50'
      case 'low': return 'bg-green-500/30 text-green-200 border-green-400/50'
      default: return 'bg-gray-500/30 text-gray-200 border-gray-400/50'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'triggered': return 'bg-red-500/30 text-red-200 border-red-400/50'
      case 'confirmed': return 'bg-orange-500/30 text-orange-200 border-orange-400/50'
      case 'classified': return 'bg-blue-500/30 text-blue-200 border-blue-400/50'
      case 'contained': return 'bg-purple-500/30 text-purple-200 border-purple-400/50'
      case 'recovered': return 'bg-cyan-500/30 text-cyan-200 border-cyan-400/50'
      case 'documented': return 'bg-green-500/30 text-green-200 border-green-400/50'
      case 'closed': return 'bg-gray-500/30 text-gray-200 border-gray-400/50'
      default: return 'bg-gray-500/30 text-gray-200 border-gray-400/50'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Security Dashboard</h1>
            <p className="text-muted-foreground">
              Real-time monitoring and incident response for Identity Sentinel
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Create Alert
            </Button>
            <Button variant="outline" size="sm" asChild className="border-primary/40 hover:bg-primary/20 text-foreground">
              <Link href="/demo-control">
                <QrCode className="h-4 w-4 mr-2" />
                Demo Control
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
          <Card className="border-red-400/50 bg-red-500/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-200 text-sm font-medium">Critical Incidents</p>
                  <p className="text-3xl font-bold text-red-400">
                    {Math.floor(mapIncidents.length * 0.15)}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400 opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-400/50 bg-orange-500/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-200 text-sm font-medium">Active Threats</p>
                  <p className="text-3xl font-bold text-orange-400">
                    {Math.floor(mapIncidents.length * 0.35)}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-orange-400 opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-400/50 bg-blue-500/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Investigations</p>
                  <p className="text-3xl font-bold text-blue-400">
                    {recentIncidents.length}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-blue-400 opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-400/50 bg-green-500/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm font-medium">Response Time</p>
                  <p className="text-3xl font-bold text-green-400">2.3m</p>
                </div>
                <Clock className="h-8 w-8 text-green-400 opacity-60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Incidents & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Incidents */}
          <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Active Incidents</CardTitle>
              <CardDescription className="text-muted-foreground">
                Open security incidents requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-muted/30 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted/20 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : recentIncidents.length > 0 ? (
                <div className="space-y-4">
                  {recentIncidents.map((incident) => (
                    <Link 
                      key={incident.id} 
                      href={`/incident/${incident.id}`}
                      className="block p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{incident.type}</h4>
                          <p className="text-sm text-muted-foreground">{incident.createdAt}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge className={getSeverityColor(incident.severity)}>
                            {incident.severity}
                          </Badge>
                          <Badge className={getStatusColor(incident.status)}>
                            {incident.status}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                  <Button variant="outline" asChild className="w-full border-primary/40 hover:bg-primary/20 text-foreground">
                    <Link href="/incidents">
                      View All Incidents
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No active incidents</p>
                  <Button size="sm" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/simulate">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Test Incident
                    </Link>
                  </Button>
                </div>
              )}
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
