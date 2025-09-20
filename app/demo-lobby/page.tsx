'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, ExternalLink, Copy, Check } from 'lucide-react'
import Link from 'next/link'

// Using bright mode styling instead of design system
// QR code will be added later - for now showing direct URL

export default function DemoLobbyPage() {
  const [loginUrl, setLoginUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [participants, setParticipants] = useState(0)

  useEffect(() => {
    const url = `${window.location.origin}/login`
    setLoginUrl(url)

    // Poll for participant count
    const loadParticipants = async () => {
      try {
        const response = await fetch('/api/demo/statistics')
        if (response.ok) {
          const data = await response.json()
          setParticipants(data.statistics.uniqueUsers || 0)
        }
      } catch (error) {
        console.log('Failed to load participant count:', error)
      }
    }

    loadParticipants()
    const interval = setInterval(loadParticipants, 3000)
    return () => clearInterval(interval)
  }, [])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(loginUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Interactive Security Demo
          </h1>
          <p className="text-xl text-slate-600 mb-2">
            Experience Real-Time Cybersecurity Protection
          </p>
          <div className="flex items-center justify-center">
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1 hover:bg-blue-200">
              {participants} {participants === 1 ? 'participant' : 'participants'} active
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Section */}
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Scan to Join</CardTitle>
              <p className="text-slate-600">
                Use your phone camera or QR scanner
              </p>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="bg-white p-6 rounded-xl border-2 border-slate-200 shadow-inner">
                <div className="w-56 h-56 bg-slate-100 rounded-lg flex items-center justify-center mx-auto">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📱</div>
                    <p className="text-sm text-slate-600">QR Code</p>
                    <p className="text-xs text-slate-500 mt-1">Coming Soon</p>
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="text-sm font-medium text-slate-700 mb-2">Direct URL:</p>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 text-xs text-slate-600 bg-white p-2 rounded border border-slate-200 break-all">
                    {loginUrl}
                  </code>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={copyToClipboard}
                    className="flex-shrink-0 border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions Section */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">How It Works</CardTitle>
              <p className="text-slate-600">
                Participate in a live cybersecurity demonstration
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Access the Login Portal</h3>
                    <p className="text-sm text-slate-600">
                      Scan the QR code or visit the URL to access TechCorp's employee login system
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Attempt to Login</h3>
                    <p className="text-sm text-slate-600">
                      Try logging in with any email address and password - don't worry, it's completely safe!
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Watch Security Response</h3>
                    <p className="text-sm text-slate-600">
                      Observe how the security system detects patterns and automatically protects the organization
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Experience Real Protection</h3>
                    <p className="text-sm text-slate-600">
                      See how modern AI-powered security systems defend against cyberattacks in real-time
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">What You'll Learn:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• How security systems detect attack patterns</li>
                    <li>• Automated incident response procedures</li>
                    <li>• MITRE ATT&CK framework in action</li>
                    <li>• Real-time threat intelligence</li>
                  </ul>
                </div>
              </div>

              <div className="flex space-x-3">
                <Link href="/login" className="flex-1">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Login Portal
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 mb-2">
            This is a controlled security demonstration environment
          </p>
          <p className="text-xs text-slate-400">
            No real systems are affected • All data is simulated • Completely safe to use
          </p>
        </div>
      </div>
    </div>
  )
}