'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Shield, AlertTriangle, Lock, ExternalLink, Users, Activity } from 'lucide-react'
import Link from 'next/link'

interface LoginFormProps {
  onAttempt: (email: string, password: string) => Promise<void>
  disabled?: boolean
}

function LoginForm({ onAttempt, disabled }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onAttempt(email, password)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your corporate email"
          disabled={disabled}
          required
          className="w-full bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900 placeholder:text-gray-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          disabled={disabled}
          required
          className="w-full bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900 placeholder:text-gray-500"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-lg py-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105" 
        disabled={disabled || isSubmitting}
      >
        {isSubmitting ? 'Signing In...' : 'Sign In to TechCorp'}
      </Button>
    </form>
  )
}

interface AttemptCounterProps {
  current: number
  maximum: number
  alertLevel: 'none' | 'warning' | 'critical'
}

function AttemptCounter({ current, maximum, alertLevel }: AttemptCounterProps) {
  if (current === 0) return null

  const getStyles = () => {
    switch (alertLevel) {
      case 'critical': return 'bg-red-50/80 backdrop-blur-sm border-red-200 text-red-800'
      case 'warning': return 'bg-orange-50/80 backdrop-blur-sm border-orange-200 text-orange-800'
      default: return 'bg-slate-50/80 backdrop-blur-sm border-slate-200 text-slate-800'
    }
  }

  return (
    <div className={`mt-4 p-4 rounded-xl border ${getStyles()} shadow-sm`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          Login Attempts: {current}/{maximum}
        </span>
        {alertLevel === 'warning' && (
          <AlertTriangle className="h-4 w-4" />
        )}
        {alertLevel === 'critical' && (
          <Lock className="h-4 w-4" />
        )}
      </div>
      {alertLevel === 'warning' && (
        <p className="text-xs mt-1">
          Multiple failed attempts detected. Security team has been notified.
        </p>
      )}
    </div>
  )
}

function SecurityLockoutAlert({ incidentId }: { incidentId?: string }) {
  return (
    <Card className="border-red-200 bg-red-50/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <h3 className="font-semibold text-red-900 text-lg">Account Security Lock</h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-red-800">
          Your account has been temporarily locked due to multiple failed login attempts. 
          This is a security measure to protect your account from unauthorized access.
        </p>
        
        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-red-200 shadow-sm">
          <h4 className="font-medium text-red-900 text-sm mb-3">Security Response Active:</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs text-red-700">Account access suspended</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs text-red-700">Security team notified</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs text-red-700">Incident report generated</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs text-red-700">Access will be restored</span>
            </div>
          </div>
        </div>

        {incidentId && (
          <div className="pt-2">
            <Link href={`/incident/${incidentId}`} target="_blank">
              <Button size="sm" variant="outline" className="w-full bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Security Response Details
              </Button>
            </Link>
          </div>
        )}

        <div className="bg-gradient-to-r from-red-50 to-red-100 p-3 rounded-xl border border-red-200">
          <p className="text-xs text-red-600 text-center font-medium">
            Contact IT Support: security@techcorp.com | Ext: 2911
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  const [attempts, setAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [alertLevel, setAlertLevel] = useState<'none' | 'warning' | 'critical'>('none')
  const [incidentId, setIncidentId] = useState<string>()
  const [errorMessage, setErrorMessage] = useState('')
  const [activeUsers, setActiveUsers] = useState(0)

  // Check account status and load stats on mount
  useEffect(() => {
    const checkAccountStatus = async () => {
      const email = localStorage.getItem('demo-email')
      if (email) {
        try {
          const response = await fetch(`/api/auth/status/${encodeURIComponent(email)}`)
          const data = await response.json()
          
          if (data.isLocked) {
            setIsLocked(true)
            setAlertLevel('critical')
          }
        } catch (error) {
          console.log('Account status check failed:', error)
        }
      }
    }

    const loadActiveUsers = async () => {
      try {
        const response = await fetch('/api/demo/statistics')
        if (response.ok) {
          const data = await response.json()
          setActiveUsers(data.statistics.uniqueUsers || 0)
        }
      } catch (error) {
        console.log('Failed to load user count:', error)
      }
    }

    checkAccountStatus()
    loadActiveUsers()
    
    // Poll for active users
    const interval = setInterval(loadActiveUsers, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleLoginAttempt = async (email: string, password: string) => {
    setErrorMessage('')
    localStorage.setItem('demo-email', email)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        alert('Login successful!')
        return
      }

      if (data.error === 'ACCOUNT_LOCKED') {
        setIsLocked(true)
        setAlertLevel('critical')
        setIncidentId(data.incidentId)
        return
      }

      setAttempts(data.attempts || attempts + 1)
      
      if (data.attempts >= 5) {
        setAlertLevel('critical')
      } else if (data.attempts >= 3) {
        setAlertLevel('warning')
      }

      setErrorMessage(data.message || 'Invalid email or password. Please try again.')

    } catch (error) {
      setErrorMessage('Connection error. Please try again.')
      console.error('Login error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-100 rounded-full opacity-50"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full opacity-40"></div>
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-full opacity-30"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-6 shadow-xl">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              TechCorp
            </h1>
            <p className="text-xl text-gray-600 mb-2">Employee Portal</p>
            <p className="text-sm text-gray-500 mb-4">Secure Access Gateway</p>
            
            {/* Status indicators */}
            <div className="flex items-center justify-center gap-4 mb-2">
              <Badge className="bg-green-100 text-green-800 border-green-300 px-3 py-1 text-sm font-medium shadow-sm">
                <Users className="h-3 w-3 mr-1" />
                {activeUsers} active {activeUsers === 1 ? 'user' : 'users'}
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-300 px-3 py-1 text-sm font-medium shadow-sm">
                <Activity className="h-3 w-3 mr-1" />
                Live Demo
              </Badge>
            </div>
          </div>

          {/* Main Card */}
          <Card className="shadow-2xl bg-white/80 backdrop-blur-sm border-0">
            <CardHeader className="text-center pb-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
              <h2 className="text-2xl font-semibold text-gray-900">
                Sign In to Your Account
              </h2>
              <p className="text-sm text-gray-600">
                Enter your credentials to access company resources
              </p>
            </CardHeader>
            <CardContent className="p-8">
              {isLocked ? (
                <SecurityLockoutAlert incidentId={incidentId} />
              ) : (
                <>
                  <LoginForm onAttempt={handleLoginAttempt} disabled={isLocked} />
                  
                  {errorMessage && (
                    <div className="mt-4 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl shadow-sm">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{errorMessage}</p>
                      </div>
                    </div>
                  )}

                  <AttemptCounter 
                    current={attempts} 
                    maximum={5} 
                    alertLevel={alertLevel} 
                  />
                </>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <p className="text-sm text-gray-600 mb-3 font-medium">
              This is a security demonstration system
            </p>
            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Protected Environment
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Simulated Data
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                Safe to Use
              </span>
            </div>
          </div>

          {/* Back to lobby link */}
          <div className="mt-6 text-center">
            <Link href="/demo-lobby" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
              ← Back to Demo Lobby
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}