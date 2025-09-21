'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  Activity, 
  Eye, 
  FileText, 
  Play,
  QrCode,
  MonitorSpeaker,
  Home,
  Palette
} from 'lucide-react'
import { Navbar } from '@/components/ui/navbar'

export default function DesignSystem() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar subtitle="Design System - Dark Purple Security Theme" />

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Identity Sentinel Design System
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive design system for our security incident response platform, 
              featuring a dark purple theme (#461A54) optimized for professional security operations.
            </p>
          </div>

          {/* Color Palette */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Color Palette
              </CardTitle>
              <CardDescription>
                Primary colors used throughout the Identity Sentinel platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="w-full h-16 bg-[#461A54] rounded-lg border"></div>
                  <div className="text-sm">
                    <p className="font-semibold">Primary Purple</p>
                    <p className="text-muted-foreground">#461A54</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-background border rounded-lg"></div>
                  <div className="text-sm">
                    <p className="font-semibold">Background</p>
                    <p className="text-muted-foreground">Dark Purple</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-card border rounded-lg"></div>
                  <div className="text-sm">
                    <p className="font-semibold">Card</p>
                    <p className="text-muted-foreground">Elevated Surface</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-muted border rounded-lg"></div>
                  <div className="text-sm">
                    <p className="font-semibold">Muted</p>
                    <p className="text-muted-foreground">Subtle Elements</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card>
            <CardHeader>
              <CardTitle>Typography Scale</CardTitle>
              <CardDescription>
                Consistent typography hierarchy for optimal readability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h1 className="text-4xl font-bold text-foreground">Heading 1 - Main Titles</h1>
              <h2 className="text-3xl font-semibold text-foreground">Heading 2 - Section Titles</h2>
              <h3 className="text-2xl font-semibold text-foreground">Heading 3 - Subsections</h3>
              <h4 className="text-xl font-medium text-foreground">Heading 4 - Card Titles</h4>
              <p className="text-base text-foreground">Body Text - Regular content and descriptions</p>
              <p className="text-sm text-muted-foreground">Small Text - Secondary information and metadata</p>
            </CardContent>
          </Card>

          {/* Components */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>Interactive elements with consistent styling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button className="w-full">Primary Button</Button>
                  <Button variant="secondary" className="w-full">Secondary Button</Button>
                  <Button variant="outline" className="w-full">Outline Button</Button>
                  <Button variant="ghost" className="w-full">Ghost Button</Button>
                </div>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Status Badges</CardTitle>
                <CardDescription>Color-coded status indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Critical</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge className="bg-green-600 hover:bg-green-700">Resolved</Badge>
                  <Badge className="bg-yellow-600 hover:bg-yellow-700">In Progress</Badge>
                  <Badge className="bg-blue-600 hover:bg-blue-700">Investigating</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Cards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Sample Card
                </CardTitle>
                <CardDescription>
                  Cards provide consistent content containers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This is an example of how cards should be used throughout the application.
                  They provide clear content boundaries and consistent spacing.
                </p>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Alerts & Notifications</CardTitle>
                <CardDescription>Important messages and feedback</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Default alert for general information
                  </AlertDescription>
                </Alert>
                <Alert className="border-red-200 bg-red-50 text-red-800">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    High priority security alert
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Icons */}
          <Card>
            <CardHeader>
              <CardTitle>Icon System</CardTitle>
              <CardDescription>
                Lucide icons used consistently throughout the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                <div className="flex flex-col items-center space-y-2">
                  <Shield className="h-6 w-6 text-foreground" />
                  <span className="text-xs text-muted-foreground">Shield</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <AlertTriangle className="h-6 w-6 text-foreground" />
                  <span className="text-xs text-muted-foreground">Alert</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <CheckCircle className="h-6 w-6 text-foreground" />
                  <span className="text-xs text-muted-foreground">Success</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Clock className="h-6 w-6 text-foreground" />
                  <span className="text-xs text-muted-foreground">Time</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Users className="h-6 w-6 text-foreground" />
                  <span className="text-xs text-muted-foreground">Users</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Activity className="h-6 w-6 text-foreground" />
                  <span className="text-xs text-muted-foreground">Activity</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Eye className="h-6 w-6 text-foreground" />
                  <span className="text-xs text-muted-foreground">Monitor</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <FileText className="h-6 w-6 text-foreground" />
                  <span className="text-xs text-muted-foreground">Reports</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Elements */}
          <Card>
            <CardHeader>
              <CardTitle>Form Elements</CardTitle>
              <CardDescription>Input components with consistent styling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <Input placeholder="Enter your email address" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Search</label>
                <Input placeholder="Search incidents..." />
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <Card>
            <CardHeader>
              <CardTitle>Navigation Patterns</CardTitle>
              <CardDescription>
                Consistent navigation across all pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-3">Current page navigation bar:</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center gap-2 text-foreground">
                    <Home className="h-4 w-4" />
                    Dashboard
                  </span>
                  <span className="flex items-center gap-2 text-foreground">
                    <Eye className="h-4 w-4" />
                    All Incidents
                  </span>
                  <span className="flex items-center gap-2 text-foreground">
                    <FileText className="h-4 w-4" />
                    Reports
                  </span>
                  <span className="flex items-center gap-2 text-[#461A54] font-semibold">
                    <Palette className="h-4 w-4" />
                    Design System
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Guidelines</CardTitle>
              <CardDescription>Best practices for implementing the design system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Color Usage</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Use primary purple (#461A54) for navigation and key interactive elements</li>
                  <li>• Maintain high contrast ratios for accessibility</li>
                  <li>• Use semantic colors (red, yellow, green) for status indicators</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Typography</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Use consistent heading hierarchy</li>
                  <li>• Limit line length for optimal readability</li>
                  <li>• Use muted text for secondary information</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Spacing</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Use consistent spacing units (4px, 8px, 16px, 24px, 32px)</li>
                  <li>• Maintain generous whitespace for better readability</li>
                  <li>• Group related elements with appropriate spacing</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}