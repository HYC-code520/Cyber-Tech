'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Shield, AlertTriangle, Lock, ExternalLink, Users, Activity, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

interface LoginFormProps {
  onAttempt: (email: string, password: string) => Promise<void>
  disabled?: boolean
  attempts: number
}

function LoginForm({ onAttempt, disabled, attempts }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={disabled}
            required
            className="w-full bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900 placeholder:text-gray-500 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button 
        type="submit"
        disabled={disabled || isSubmitting}
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-3 shadow-lg hover:shadow-xl transition-all"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Signing In...
          </>
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  )
}

interface AttemptCounterProps {
  current: number
  maximum: number
  alertLevel: 'normal' | 'warning' | 'critical'
}

function AttemptCounter({ current, maximum, alertLevel }: AttemptCounterProps) {
  const getStyles = () => {
    switch (alertLevel) {
      case 'critical': 
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning': 
        return 'bg-orange-50 border-orange-200 text-orange-800'
      default: 
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  const getIcon = () => {
    switch (alertLevel) {
      case 'critical':
        return <Lock className="h-4 w-4 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      default:
        return <Activity className="h-4 w-4 text-blue-600" />
    }
  }

  const getMessage = () => {
    if (current === 0) {
      return "Enter any email and password to begin the security demonstration"
    }
    
    if (alertLevel === 'critical') {
      return "Account will be locked after 5 failed attempts. Security team notified."
    }
    
    if (alertLevel === 'warning') {
      return "Multiple failed attempts detected. Monitoring for suspicious activity."
    }
    
    return "Demonstration mode - Failed attempts are tracked for security purposes"
  }

  return (
    <div className={`mt-6 p-4 rounded-xl border-2 ${getStyles()} shadow-sm transition-all duration-300`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="font-semibold text-sm">
            Login Attempts: {current}/{maximum}
          </span>
        </div>
        
        {/* Visual progress bar */}
        <div className="flex gap-1">
          {Array.from({ length: maximum }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full border-2 transition-colors ${
                i < current 
                  ? alertLevel === 'critical' 
                    ? 'bg-red-500 border-red-600' 
                    : alertLevel === 'warning'
                    ? 'bg-orange-500 border-orange-600'
                    : 'bg-blue-500 border-blue-600'
                  : 'bg-gray-200 border-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      
      <p className="text-xs leading-relaxed">
        {getMessage()}
      </p>
      
      {current > 0 && (
        <div className="mt-2 text-xs font-medium">
          {current < maximum ? (
            <span className="text-gray-600">
              {maximum - current} attempts remaining before account lockout
            </span>
          ) : (
            <span className="text-red-600 font-semibold">
              Maximum attempts reached - Account locked for security
            </span>
          )}
        </div>
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
          <div>
            <h3 className="text-lg font-semibold text-red-900">Account Locked</h3>
            <p className="text-sm text-red-700">Security incident has been triggered</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-white/50 p-4 rounded-lg border border-red-200">
            <p className="text-sm text-red-800 mb-2">
              <strong>Security Alert:</strong> Multiple failed login attempts detected from your account.
            </p>
            <p className="text-sm text-red-700">
              This account has been temporarily locked as a security precaution. 
              A security incident has been automatically created and the IT team has been notified.
            </p>
          </div>
          
          {incidentId && (
            <div className="flex items-center justify-between p-3 bg-red-100 rounded-lg border border-red-200">
              <div>
                <p className="text-xs font-medium text-red-900 mb-1">Incident ID</p>
                <p className="font-mono text-sm text-red-800">{incidentId}</p>
              </div>
              <Link 
                href={`/incident/${incidentId}`}
                className="flex items-center gap-1 text-xs font-medium text-red-700 hover:text-red-900 transition-colors"
              >
                View Details <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          )}

          <div className="text-center pt-2">
            <p className="text-xs text-red-600">
              In a real environment, contact your IT administrator for account recovery.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  const [attempts, setAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [alertLevel, setAlertLevel] = useState<'normal' | 'warning' | 'critical'>('normal')
  const [incidentId, setIncidentId] = useState<string>()
  const [errorMessage, setErrorMessage] = useState('')
  const [activeUsers, setActiveUsers] = useState(0)

  // Load persisted attempt count on mount
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

          // Load the current attempt count from localStorage
          const storedAttempts = localStorage.getItem(`attempts-${email}`)
          if (storedAttempts) {
            const count = parseInt(storedAttempts, 10)
            setAttempts(count)
            
            // Set alert level based on stored attempts
            if (count >= 5) {
              setAlertLevel('critical')
            } else if (count >= 3) {
              setAlertLevel('warning')
            }
          }
        } catch (error) {
          console.log('Could not check account status:', error)
        }
      }
    }

    checkAccountStatus()
  }, [])

  // Load active users count
  useEffect(() => {
    const loadActiveUsers = async () => {
      try {
        const response = await fetch('/api/demo/statistics')
        if (response.ok) {
          const data = await response.json()
          setActiveUsers(data.statistics.uniqueUsers || 0)
        }
      } catch (error) {
        console.log('Could not load active users:', error)
      }
    }

    loadActiveUsers()
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
        // Clear attempts on successful login
        localStorage.removeItem(`attempts-${email}`)
        setAttempts(0)
        setAlertLevel('normal')
        alert('Login successful!')
        return
      }

      if (data.error === 'ACCOUNT_LOCKED') {
        setIsLocked(true)
        setAlertLevel('critical')
        setIncidentId(data.incidentId)
        return
      }

      // Use the attempts count from the API response (this is the authoritative source)
      const currentAttempts = data.attempts || attempts + 1
      setAttempts(currentAttempts)
      
      // Persist attempt count to localStorage for this email
      localStorage.setItem(`attempts-${email}`, currentAttempts.toString())
      
      // Set alert level based on current attempts
      if (currentAttempts >= 5) {
        setAlertLevel('critical')
      } else if (currentAttempts >= 3) {
        setAlertLevel('warning')
      } else {
        setAlertLevel('normal')
      }

      setErrorMessage(data.message || 'Invalid email or password. Please try again.')

      console.log(`📊 Login attempt #${currentAttempts} for ${email}`)

    } catch (error) {
      console.error('Login error:', error)
      setErrorMessage('Unable to connect to authentication server. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-100 rounded-full opacity-50"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-4 shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">TechCorp Employee Portal</h1>
            <p className="text-gray-600">Secure access to company resources</p>
            
            <div className="flex items-center justify-center gap-3 mt-4">
              <Badge className="bg-green-100 text-green-800 border-green-300 px-3 py-1 text-sm">
                <Users className="h-3 w-3 mr-1" />
                {activeUsers} active
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-300 px-3 py-1 text-sm">
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
                  <LoginForm onAttempt={handleLoginAttempt} disabled={isLocked} attempts={attempts} />
                  
                  {errorMessage && (
                    <div className="mt-4 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl shadow-sm">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{errorMessage}</p>
                      </div>
                    </div>
                  )}

                  {/* Always show the attempt counter - this is the key fix */}
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