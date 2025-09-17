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
    // Load initial data and set up polling
    loadDemoStatistics()
    const interval = setInterval(loadDemoStatistics, 2000) // Update every 2 seconds

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
        // Reset UI state
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

  const simulateAttack = async (type: string) => {
    try {
      const response = await fetch('/api/demo/simulate-attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      })
      
      if (response.ok) {
        alert(`${type} attack simulation triggered!`)
        loadDemoStatistics() // Refresh data
      } else {
        alert('Failed to trigger attack simulation')
      }
    } catch (error) {
      console.error('Attack simulation failed:', error)
      alert('Failed to trigger attack simulation')
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login_attempt': return <Activity className="h-4 w-4 text-blue-600" />
      case 'account_locked': return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'incident_created': return <Shield className="h-4 w-4 text-red-600" />
      default: return <Monitor className="h-4 w-4 text-gray-600" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'login_attempt': return 'border-l-blue-500'
      case 'account_locked': return 'border-l-orange-500'
      case 'incident_created': return 'border-l-red-500'
      default: return 'border-l-gray-500'
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
              <p className="text-sm text-slate-500">Demo Control Center</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/reports" 
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              Reports
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Demo Control Center</h1>
              <p className="text-slate-600 mt-1">Manage interactive security demonstration</p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              {participants} Active Participants
            </Badge>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Login Attempts</CardTitle>
                <Activity className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.totalAttempts}</div>
                <p className="text-xs text-slate-600">Last 5 minutes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Locked Accounts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.lockedAccounts}</div>
                <p className="text-xs text-slate-600">Security responses active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
                <Shield className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.activeIncidents}</div>
                <p className="text-xs text-slate-600">Security investigations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique IPs</CardTitle>
                <Monitor className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.uniqueIPs}</div>
                <p className="text-xs text-slate-600">Attack sources detected</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Control Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Demo Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={resetDemo} 
                  variant="destructive" 
                  className="w-full"
                  disabled={isResetting}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {isResetting ? 'Resetting...' : 'Reset Demo Environment'}
                </Button>
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Attack Simulations</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      onClick={() => simulateAttack('password_spray')}
                      variant="outline"
                      size="sm"
                    >
                      Simulate Password Spray Attack
                    </Button>
                    <Button 
                      onClick={() => simulateAttack('brute_force')}
                      variant="outline"
                      size="sm"
                    >
                      Simulate Brute Force Attack
                    </Button>
                    <Button 
                      onClick={() => simulateAttack('credential_stuffing')}
                      variant="outline"
                      size="sm"
                    >
                      Simulate Credential Stuffing
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Quick Access</h3>
                  <div className="space-y-2">
                    <Link href="/login" target="_blank">
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Login Page
                      </Button>
                    </Link>
                    <Link href="/demo-lobby" target="_blank">
                      <Button variant="outline" size="sm" className="w-full">
                        <QrCode className="h-4 w-4 mr-2" />
                        Show QR Code Page
                      </Button>
                    </Link>
                    <Link href="/" target="_blank">
                      <Button variant="outline" size="sm" className="w-full">
                        <Shield className="h-4 w-4 mr-2" />
                        Identity Sentinel Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Monitor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Live Activity Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {recentActivity.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                      <p className="text-slate-500">No activity yet</p>
                      <p className="text-sm text-slate-400">Waiting for participants to interact with the login page</p>
                    </div>
                  ) : (
                    recentActivity.map((activity, index) => (
                      <div 
                        key={index}
                        className={`flex items-start space-x-3 p-3 border-l-4 bg-slate-50 rounded-r ${getActivityColor(activity.type)}`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-900 truncate">
                              {activity.email}
                            </p>
                            <span className="text-xs text-slate-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTimestamp(activity.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            {activity.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            {activity.details && `: ${activity.details}`}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attack Patterns */}
          {Object.keys(statistics.patterns).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Detected Attack Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(statistics.patterns).map(([pattern, count]) => (
                    <div key={pattern} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium capitalize">
                        {pattern.replace('_', ' ')}
                      </span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}