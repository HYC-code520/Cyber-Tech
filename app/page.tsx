'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Clock, CheckCircle, Play, Plus, Shield, MonitorSpeaker, QrCode } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const [recentIncidents, setRecentIncidents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/incidents')
      .then(res => res.json())
      .then(data => {
        // Format the data for display
        const formattedIncidents = data.slice(0, 3).map((incident: any) => ({
          id: incident.id,
          type: incident.type ? incident.type.replace('_', ' ').split(' ').map((word: string) => 
            word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Unknown Incident',
          severity: incident.severity,
          status: incident.status,
          createdAt: new Date(incident.createdAt).toLocaleString()
        }))
        setRecentIncidents(formattedIncidents)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching incidents:', error)
        setLoading(false)
      })
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'triggered': return 'bg-red-100 text-red-800'
      case 'confirmed': return 'bg-orange-100 text-orange-800'
      case 'classified': return 'bg-blue-100 text-blue-800'
      case 'contained': return 'bg-purple-100 text-purple-800'
      case 'recovered': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-slate-100 text-slate-800'
      default: return 'bg-slate-100 text-slate-800'
    }
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
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-slate-900 font-medium"
            >
              Dashboard
            </Link>
            <Link 
              href="/reports" 
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              Reports
            </Link>
            <Link 
              href="/simulate" 
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Play className="h-4 w-4" />
              <span>Simulate</span>
            </Link>
            <Link 
              href="/demo-lobby" 
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <QrCode className="h-4 w-4" />
              <span>Live Demo</span>
            </Link>
            <Link 
              href="/demo-control" 
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
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
              <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600 mt-1">Account compromise incident response center</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" asChild>
                <Link href="/simulate">
                  <Play className="h-4 w-4 mr-2" />
                  Scenario Demo
                </Link>
              </Button>
              <Button asChild>
                <Link href="/demo-lobby">
                  <QrCode className="h-4 w-4 mr-2" />
                  Interactive Demo
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/incident/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Incident
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-slate-600">2 high severity</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12m</div>
                <p className="text-xs text-slate-600">32% faster than last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-slate-600">2 false positives</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Incidents</CardTitle>
              <CardDescription>Latest account compromise investigations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-4">
                    <p className="text-slate-500">Loading incidents...</p>
                  </div>
                ) : recentIncidents.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-slate-500">No incidents yet.</p>
                    <p className="text-sm text-slate-400 mt-2">Click "Try Demo" to create sample incidents.</p>
                  </div>
                ) : (
                  recentIncidents.map((incident) => (
                  <div 
                    key={incident.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium text-slate-900">{incident.type}</h3>
                        <p className="text-sm text-slate-500">{incident.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/incident/${incident.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Getting Started</CardTitle>
              <CardDescription className="text-blue-700">
                New to Identity Sentinel? Try our guided demo scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button asChild>
                  <Link href="/simulate">
                    <Play className="h-4 w-4 mr-2" />
                    Try Demo Cases
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/docs">
                    View Documentation
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
