'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, AlertTriangle, Lock, ExternalLink } from 'lucide-react'
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
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your corporate email"
          disabled={disabled}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your password"
          disabled={disabled}
          required
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700" 
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

  const getColor = () => {
    switch (alertLevel) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200'
      default: return 'text-slate-600 bg-slate-50 border-slate-200'
    }
  }

  return (
    <div className={`mt-4 p-3 rounded-lg border ${getColor()}`}>
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
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Lock className="h-5 w-5 text-red-600" />
          <h3 className="font-semibold text-red-900">Account Security Lock</h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-red-800">
          Your account has been temporarily locked due to multiple failed login attempts. 
          This is a security measure to protect your account from unauthorized access.
        </p>
        
        <div className="bg-white p-3 rounded border border-red-200">
          <h4 className="font-medium text-red-900 text-sm mb-2">Security Response Active:</h4>
          <ul className="text-xs text-red-700 space-y-1">
            <li>• Account access suspended</li>
            <li>• Security team notified</li>
            <li>• Incident report generated</li>
            <li>• Access will be restored after verification</li>
          </ul>
        </div>

        {incidentId && (
          <div className="pt-2">
            <Link href={`/incident/${incidentId}`} target="_blank">
              <Button size="sm" variant="outline" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Security Response Details
              </Button>
            </Link>
          </div>
        )}

        <p className="text-xs text-red-600">
          Contact IT Support: security@techcorp.com | Ext: 2911
        </p>
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

  // Check account status on load
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

    checkAccountStatus()
  }, [])

  const handleLoginAttempt = async (email: string, password: string) => {
    setErrorMessage('')
    localStorage.setItem('demo-email', email) // Remember email for demo

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
        // This shouldn't happen in demo mode
        alert('Login successful!')
        return
      }

      // Handle different response scenarios
      if (data.error === 'ACCOUNT_LOCKED') {
        setIsLocked(true)
        setAlertLevel('critical')
        setIncidentId(data.incidentId)
        return
      }

      // Update attempt count and alert level
      setAttempts(data.attempts || attempts + 1)
      
      if (data.attempts >= 5) {
        setAlertLevel('critical')
      } else if (data.attempts >= 3) {
        setAlertLevel('warning')
      }

      // Set error message
      setErrorMessage(data.message || 'Invalid email or password. Please try again.')

    } catch (error) {
      setErrorMessage('Connection error. Please try again.')
      console.error('Login error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            TechCorp
          </h1>
          <p className="text-slate-600">Employee Portal</p>
          <p className="text-sm text-slate-500 mt-1">Secure Access Gateway</p>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Sign In to Your Account
            </h2>
            <p className="text-sm text-slate-600">
              Enter your credentials to access company resources
            </p>
          </CardHeader>
          <CardContent>
            {isLocked ? (
              <SecurityLockoutAlert incidentId={incidentId} />
            ) : (
              <>
                <LoginForm onAttempt={handleLoginAttempt} disabled={isLocked} />
                
                {errorMessage && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{errorMessage}</p>
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
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            This is a security demonstration system
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Protected by TechCorp Security Operations
          </p>
        </div>
      </div>
    </div>
  )
}