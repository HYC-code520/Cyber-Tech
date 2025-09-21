'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  RotateCcw, 
  Users, 
  ExternalLink, 
  QrCode, 
  Activity, 
  Shield, 
  AlertTriangle,
  Clock,
  Monitor
} from 'lucide-react'
import { Navbar } from '@/components/ui/navbar'
import Link from 'next/link'

interface ActivityItem {
  timestamp: Date
  type: 'login_attempt' | 'account_locked' | 'incident_created'
  email: string
  details?: string
}

interface DemoStatistics {
  totalAttempts: number
  uniqueUsers: number
  uniqueIPs: number
  patterns: { [key: string]: number }
  lockedAccounts: number
  activeIncidents: number
}

export default function DemoControlPage() {
  const [participants, setParticipants] = useState(0)
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [statistics, setStatistics] = useState<DemoStatistics>({
    totalAttempts: 0,
    uniqueUsers: 0,
    uniqueIPs: 0,
    patterns: {},
    lockedAccounts: 0,
    activeIncidents: 0
  })
  const [isResetting, setIsResetting] = useState(false)

  useEffect(() => {
    loadDemoStatistics()
    const interval = setInterval(loadDemoStatistics, 2000)
    return () => clearInterval(interval)
  }, [])

  const loadDemoStatistics = async () => {
    try {
      const response = await fetch('/api/demo/statistics')
      if (response.ok) {
        const data = await response.json()
        setStatistics(data.statistics)
        setRecentActivity(data.recentActivity.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })))
        setParticipants(data.statistics.uniqueUsers)
      }
    } catch (error) {
      console.error('Failed to load demo statistics:', error)
    }
  }

  const resetDemo = async () => {
    setIsResetting(true)
    try {
      const response = await fetch('/api/demo/reset', { method: 'POST' })
      if (response.ok) {
        setRecentActivity([])
        setParticipants(0)
        setStatistics({
          totalAttempts: 0,
          uniqueUsers: 0,
          uniqueIPs: 0,
          patterns: {},
          lockedAccounts: 0,
          activeIncidents: 0
        })
        alert('Demo environment has been reset successfully!')
      } else {
        alert('Failed to reset demo environment')
      }
    } catch (error) {
      console.error('Reset failed:', error)
      alert('Failed to reset demo environment')
    } finally {
      setIsResetting(false)
    }
  }

  const simulateAttack = async () => {
    try {
      const response = await fetch('/api/demo/simulate-attack', { method: 'POST' })
      if (response.ok) {
        loadDemoStatistics()
      }
    } catch (error) {
      console.error('Failed to simulate attack:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar subtitle="Security Monitoring - Demo Control Center" />

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Demo Control Center</h1>
              <p className="text-muted-foreground mt-1">Monitor and control live demonstration environment</p>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={simulateAttack}
                className="bg-primary hover:bg-primary/90"
              >
                <Activity className="h-4 w-4 mr-2" />
                Simulate Attack
              </Button>
              <Button 
                onClick={resetDemo}
                disabled={isResetting}
                variant="outline"
                className="border-red-400/40 hover:bg-red-500/20 text-foreground"
              >
                {isResetting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Resetting...
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Demo
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Participants</p>
                    <p className="text-3xl font-bold text-cyan-400">{participants}</p>
                  </div>
                  <Users className="h-8 w-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Login Attempts</p>
                    <p className="text-3xl font-bold text-orange-400">{statistics.totalAttempts}</p>
                  </div>
                  <Activity className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Locked Accounts</p>
                    <p className="text-3xl font-bold text-red-400">{statistics.lockedAccounts}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Incidents</p>
                    <p className="text-3xl font-bold text-primary">{statistics.activeIncidents}</p>
                  </div>
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Monitor className="h-5 w-5" />
                  <span>Live Activity Feed</span>
                  <Badge className="bg-green-500/30 text-green-200 ml-auto">Live</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {recentActivity.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No recent activity</p>
                  ) : (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 pulse-glow"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">
                              {activity.type.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {activity.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.email}</p>
                          {activity.details && (
                            <p className="text-xs text-muted-foreground mt-1">{activity.details}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Attack Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(statistics.patterns).length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No patterns detected</p>
                  ) : (
                    Object.entries(statistics.patterns).map(([pattern, count]) => (
                      <div key={pattern} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                        <span className="capitalize text-foreground">{pattern.replace('_', ' ')}</span>
                        <Badge className="bg-primary/30 text-primary-foreground">
                          {count} attempts
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border-primary/40 bg-primary/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-primary">Demo Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Participant Access</h4>
                  <p className="text-sm text-muted-foreground mb-3">Share the demo lobby URL with participants</p>
                  <Button variant="outline" asChild className="border-primary/40 hover:bg-primary/20 text-foreground">
                    <Link href="/demo-lobby">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Demo Lobby
                    </Link>
                  </Button>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Attack Simulation</h4>
                  <p className="text-sm text-muted-foreground mb-3">Trigger realistic attack scenarios</p>
                  <Button onClick={simulateAttack} className="bg-primary hover:bg-primary/90">
                    <Activity className="h-4 w-4 mr-2" />
                    Launch Attack
                  </Button>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Environment Reset</h4>
                  <p className="text-sm text-muted-foreground mb-3">Clear all demo data and restart</p>
                  <Button 
                    onClick={resetDemo}
                    disabled={isResetting}
                    variant="outline"
                    className="border-red-400/40 hover:bg-red-500/20 text-foreground"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Demo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}