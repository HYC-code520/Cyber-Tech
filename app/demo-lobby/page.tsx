'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, ExternalLink, Copy, Check, Users, Zap, Eye, Lock } from 'lucide-react'
import Link from 'next/link'

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-100 rounded-full opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full opacity-30"></div>
      </div>

      {/* Sticky top navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="font-semibold text-gray-900">Security Demo</span>
          </div>
          <Link href="/login">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-2 shadow-md hover:shadow-lg transition-all">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Portal
            </Button>
          </Link>
        </div>
      </div>

      {/* Add top padding to main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-20">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-6 shadow-lg">
              <Shield className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Interactive Security Demo
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              Experience Real-Time Cybersecurity Protection in Action
            </p>
            
            {/* Primary CTA Button */}
            <div className="mb-8">
              <Link href="/login">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-xl px-8 py-4 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 rounded-lg">
                  <ExternalLink className="h-6 w-6 mr-3" />
                  Start Demo Now
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Badge className="bg-green-100 text-green-800 border-green-300 px-4 py-2 text-base font-medium shadow-sm">
                <Users className="h-4 w-4 mr-2" />
                {participants} {participants === 1 ? 'participant' : 'participants'} active
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-300 px-4 py-2 text-base font-medium shadow-sm">
                <Zap className="h-4 w-4 mr-2" />
                Live Demo
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* QR Code Section */}
            <Card className="shadow-2xl bg-white/80 backdrop-blur-sm border-0">
              <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                <CardTitle className="text-3xl text-gray-900 flex items-center justify-center gap-3">
                  <Eye className="h-8 w-8 text-blue-600" />
                  Scan to Join
                </CardTitle>
                <p className="text-gray-600 text-lg">
                  Use your phone camera or QR scanner
                </p>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-6 p-8">
                <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-inner">
                  <div className="w-64 h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center mx-auto border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <div className="text-5xl mb-3">📱</div>
                      <p className="text-lg font-semibold text-gray-700">QR Code</p>
                      <p className="text-sm text-gray-500 mt-1">Coming Soon</p>
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <p className="text-base font-semibold text-gray-800 mb-3">Direct URL:</p>
                  <div className="flex items-center space-x-3">
                    <code className="flex-1 text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-300 break-all font-mono">
                      {loginUrl}
                    </code>
                    <Button 
                      size="lg" 
                      variant="outline"
                      onClick={copyToClipboard}
                      className="flex-shrink-0 border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition-all"
                    >
                      {copied ? (
                        <>
                          <Check className="h-5 w-5 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-5 w-5 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions Section */}
            <Card className="shadow-2xl bg-white/80 backdrop-blur-sm border-0">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-t-lg">
                <CardTitle className="text-3xl text-gray-900 flex items-center gap-3">
                  <Lock className="h-8 w-8 text-cyan-600" />
                  How It Works
                </CardTitle>
                <p className="text-gray-600 text-lg">
                  Participate in a live cybersecurity demonstration
                </p>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                      1
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2">Access the Login Portal</h3>
                      <p className="text-gray-600">
                        Scan the QR code or visit the URL to access TechCorp's employee login system
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                      2
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2">Attempt to Login</h3>
                      <p className="text-gray-600">
                        Try logging in with any email address and password - don't worry, it's completely safe!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                      3
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2">Watch Security Response</h3>
                      <p className="text-gray-600">
                        Observe how the security system detects patterns and automatically protects the organization
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                      4
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2">Experience Real Protection</h3>
                      <p className="text-gray-600">
                        See how modern AI-powered security systems defend against cyberattacks in real-time
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                    <h4 className="font-bold text-blue-900 mb-3 text-lg">What You'll Learn:</h4>
                    <ul className="text-blue-800 space-y-2">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        How security systems detect attack patterns
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        Automated incident response procedures
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        MITRE ATT&CK framework in action
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        Real-time threat intelligence
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4">
                  <Link href="/login" className="block">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-lg py-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                      <ExternalLink className="h-5 w-5 mr-3" />
                      Open Login Portal
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Floating Action Button for Mobile/Quick Access */}
          <div className="fixed bottom-6 right-6 z-50 lg:hidden">
            <Link href="/login">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-4 shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 rounded-full">
                <ExternalLink className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <p className="text-lg text-gray-600 mb-3 font-medium">
              This is a controlled security demonstration environment
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                No real systems are affected
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                All data is simulated
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                Completely safe to use
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}