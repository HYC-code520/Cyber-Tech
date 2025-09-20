'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shield, Home, FileText, Play, Palette, Layout, Type, Component, Grid } from 'lucide-react'
import Link from 'next/link'

export default function DesignSystem() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-semibold text-foreground">Identity Sentinel</h1>
              <p className="text-sm text-muted-foreground">Design System</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-muted/50"
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/reports" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-muted/50"
            >
              <FileText className="h-4 w-4" />
              <span>Reports</span>
            </Link>
            <Link 
              href="/simulate" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-muted/50"
            >
              <Play className="h-4 w-4" />
              <span>Simulate</span>
            </Link>
            <Link 
              href="/design-system" 
              className="flex items-center space-x-2 text-foreground font-medium px-4 py-2 rounded-lg bg-primary/20 border border-primary/30"
            >
              <Palette className="h-4 w-4" />
              <span>Design System</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Design System</h1>
            <p className="text-muted-foreground mt-1">Reference guide for Identity Sentinel UI components and styles</p>
          </div>

          <Tabs defaultValue="colors">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="colors" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span>Colors</span>
              </TabsTrigger>
              <TabsTrigger value="typography" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                <span>Typography</span>
              </TabsTrigger>
              <TabsTrigger value="components" className="flex items-center gap-2">
                <Component className="h-4 w-4" />
                <span>Components</span>
              </TabsTrigger>
              <TabsTrigger value="layouts" className="flex items-center gap-2">
                <Grid className="h-4 w-4" />
                <span>Layouts</span>
              </TabsTrigger>
            </TabsList>

            {/* Colors Tab Content */}
            <TabsContent value="colors" className="space-y-8">
              {/* Theme Colors */}
              <Card>
                <CardHeader>
                  <CardTitle>Theme Colors</CardTitle>
                  <CardDescription>Primary theme colors used throughout the application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Primary */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="h-24 bg-primary flex items-end p-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1 text-primary-foreground text-sm font-medium">
                          Primary
                        </div>
                      </div>
                      <div className="p-3 space-y-1.5">
                        <div className="text-sm font-medium">Primary</div>
                        <div className="text-xs text-muted-foreground">bg-primary / text-primary-foreground</div>
                      </div>
                    </div>
                    
                    {/* Secondary */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="h-24 bg-secondary flex items-end p-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1 text-secondary-foreground text-sm font-medium">
                          Secondary
                        </div>
                      </div>
                      <div className="p-3 space-y-1.5">
                        <div className="text-sm font-medium">Secondary</div>
                        <div className="text-xs text-muted-foreground">bg-secondary / text-secondary-foreground</div>
                      </div>
                    </div>
                    
                    {/* Accent */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="h-24 bg-accent flex items-end p-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1 text-accent-foreground text-sm font-medium">
                          Accent
                        </div>
                      </div>
                      <div className="p-3 space-y-1.5">
                        <div className="text-sm font-medium">Accent</div>
                        <div className="text-xs text-muted-foreground">bg-accent / text-accent-foreground</div>
                      </div>
                    </div>
                    
                    {/* Muted */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="h-24 bg-muted flex items-end p-3">
                        <div className="bg-black/10 backdrop-blur-sm rounded px-2 py-1 text-muted-foreground text-sm font-medium">
                          Muted
                        </div>
                      </div>
                      <div className="p-3 space-y-1.5">
                        <div className="text-sm font-medium">Muted</div>
                        <div className="text-xs text-muted-foreground">bg-muted / text-muted-foreground</div>
                      </div>
                    </div>
                    
                    {/* Background */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="h-24 bg-background flex items-end p-3">
                        <div className="bg-black/10 backdrop-blur-sm rounded px-2 py-1 text-foreground text-sm font-medium">
                          Background
                        </div>
                      </div>
                      <div className="p-3 space-y-1.5">
                        <div className="text-sm font-medium">Background</div>
                        <div className="text-xs text-muted-foreground">bg-background / text-foreground</div>
                      </div>
                    </div>
                    
                    {/* Card */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="h-24 bg-card flex items-end p-3">
                        <div className="bg-black/10 backdrop-blur-sm rounded px-2 py-1 text-card-foreground text-sm font-medium">
                          Card
                        </div>
                      </div>
                      <div className="p-3 space-y-1.5">
                        <div className="text-sm font-medium">Card</div>
                        <div className="text-xs text-muted-foreground">bg-card / text-card-foreground</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Status Colors */}
              <Card>
                <CardHeader>
                  <CardTitle>Status Colors</CardTitle>
                  <CardDescription>Colors used to represent different statuses and severities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Critical */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="h-16 bg-red-500/30 flex items-end p-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1 text-red-200 text-sm font-medium">
                          Critical
                        </div>
                      </div>
                      <div className="p-3 space-y-1.5">
                        <div className="text-sm font-medium">Critical</div>
                        <div className="text-xs text-muted-foreground">bg-red-500/30 / text-red-200</div>
                      </div>
                    </div>
                    
                    {/* High */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="h-16 bg-orange-500/30 flex items-end p-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1 text-orange-200 text-sm font-medium">
                          High
                        </div>
                      </div>
                      <div className="p-3 space-y-1.5">
                        <div className="text-sm font-medium">High</div>
                        <div className="text-xs text-muted-foreground">bg-orange-500/30 / text-orange-200</div>
                      </div>
                    </div>
                    
                    {/* Medium */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="h-16 bg-yellow-500/30 flex items-end p-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1 text-yellow-200 text-sm font-medium">
                          Medium
                        </div>
                      </div>
                      <div className="p-3 space-y-1.5">
                        <div className="text-sm font-medium">Medium</div>
                        <div className="text-xs text-muted-foreground">bg-yellow-500/30 / text-yellow-200</div>
                      </div>
                    </div>
                    
                    {/* Low */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="h-16 bg-green-500/30 flex items-end p-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1 text-green-200 text-sm font-medium">
                          Low
                        </div>
                      </div>
                      <div className="p-3 space-y-1.5">
                        <div className="text-sm font-medium">Low</div>
                        <div className="text-xs text-muted-foreground">bg-green-500/30 / text-green-200</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Chart Colors */}
              <Card>
                <CardHeader>
                  <CardTitle>Chart Colors</CardTitle>
                  <CardDescription>Colors used in charts and data visualizations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="h-16" style={{ backgroundColor: 'var(--chart-1)' }}></div>
                      <div className="p-3 space-y-1.5">
                        <div className="text-sm font-medium">Chart 1</div>
                        <div className="text-xs text-muted-foreground">--chart-1</div>
                      </div>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="h-16" style={{ backgroundColor: 'var(--chart-2)' }}></div>
                      <div className="p-3 space-y-1.5">
                        <div className="text-sm font-medium">Chart 2</div>
                        <div className="text-xs text-muted-foreground">--chart-2</div>
                      </div>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="h-16" style={{ backgroundColor: 'var(--chart-3)' }}></div>
                      <div className="p-3 space-y-1.5">
                        <div className="text-sm font-medium">Chart 3</div>
                        <div className="text-xs text-muted-foreground">--chart-3</div>
                      </div>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="h-16" style={{ backgroundColor: 'var(--chart-4)' }}></div>
                      <div className="p-3 space-y-1.5">
                        <div className="text-sm font-medium">Chart 4</div>
                        <div className="text-xs text-muted-foreground">--chart-4</div>
                      </div>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="h-16" style={{ backgroundColor: 'var(--chart-5)' }}></div>
                      <div className="p-3 space-y-1.5">
                        <div className="text-sm font-medium">Chart 5</div>
                        <div className="text-xs text-muted-foreground">--chart-5</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Typography Tab Content */}
            <TabsContent value="typography" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Typography</CardTitle>
                  <CardDescription>Text styles and hierarchies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Headings */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Headings</h3>
                    <div className="space-y-3">
                      <div className="pb-2 border-b">
                        <h1 className="text-4xl font-bold">Heading 1</h1>
                        <p className="text-xs text-muted-foreground mt-1">text-4xl font-bold</p>
                      </div>
                      <div className="pb-2 border-b">
                        <h2 className="text-3xl font-bold">Heading 2</h2>
                        <p className="text-xs text-muted-foreground mt-1">text-3xl font-bold</p>
                      </div>
                      <div className="pb-2 border-b">
                        <h3 className="text-2xl font-bold">Heading 3</h3>
                        <p className="text-xs text-muted-foreground mt-1">text-2xl font-bold</p>
                      </div>
                      <div className="pb-2 border-b">
                        <h4 className="text-xl font-semibold">Heading 4</h4>
                        <p className="text-xs text-muted-foreground mt-1">text-xl font-semibold</p>
                      </div>
                      <div className="pb-2 border-b">
                        <h5 className="text-lg font-semibold">Heading 5</h5>
                        <p className="text-xs text-muted-foreground mt-1">text-lg font-semibold</p>
                      </div>
                      <div className="pb-2 border-b">
                        <h6 className="text-base font-semibold">Heading 6</h6>
                        <p className="text-xs text-muted-foreground mt-1">text-base font-semibold</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Body Text */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Body Text</h3>
                    <div className="space-y-3">
                      <div className="pb-2 border-b">
                        <p className="text-base">Default body text. This is the standard paragraph text used throughout the application.</p>
                        <p className="text-xs text-muted-foreground mt-1">text-base</p>
                      </div>
                      <div className="pb-2 border-b">
                        <p className="text-sm">Small text is used for less important information or in space-constrained areas.</p>
                        <p className="text-xs text-muted-foreground mt-1">text-sm</p>
                      </div>
                      <div className="pb-2 border-b">
                        <p className="text-xs">Extra small text is used for captions, footnotes, and other auxiliary information.</p>
                        <p className="text-xs text-muted-foreground mt-1">text-xs</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Text Styles */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Text Styles</h3>
                    <div className="space-y-3">
                      <div className="pb-2 border-b">
                        <p className="font-bold">Bold text for emphasis</p>
                        <p className="text-xs text-muted-foreground mt-1">font-bold</p>
                      </div>
                      <div className="pb-2 border-b">
                        <p className="font-semibold">Semi-bold text for moderate emphasis</p>
                        <p className="text-xs text-muted-foreground mt-1">font-semibold</p>
                      </div>
                      <div className="pb-2 border-b">
                        <p className="font-medium">Medium text for slight emphasis</p>
                        <p className="text-xs text-muted-foreground mt-1">font-medium</p>
                      </div>
                      <div className="pb-2 border-b">
                        <p className="italic">Italic text for emphasis or quotes</p>
                        <p className="text-xs text-muted-foreground mt-1">italic</p>
                      </div>
                      <div className="pb-2 border-b">
                        <p className="underline">Underlined text for links or emphasis</p>
                        <p className="text-xs text-muted-foreground mt-1">underline</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Text Colors */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Text Colors</h3>
                    <div className="space-y-3">
                      <div className="pb-2 border-b">
                        <p className="text-foreground">Default text color</p>
                        <p className="text-xs text-muted-foreground mt-1">text-foreground</p>
                      </div>
                      <div className="pb-2 border-b">
                        <p className="text-muted-foreground">Muted text color for secondary information</p>
                        <p className="text-xs text-muted-foreground mt-1">text-muted-foreground</p>
                      </div>
                      <div className="pb-2 border-b">
                        <p className="text-primary">Primary text color for emphasis</p>
                        <p className="text-xs text-muted-foreground mt-1">text-primary</p>
                      </div>
                      <div className="pb-2 border-b">
                        <p className="text-secondary">Secondary text color</p>
                        <p className="text-xs text-muted-foreground mt-1">text-secondary</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Components Tab Content */}
            <TabsContent value="components" className="space-y-8">
              {/* Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle>Buttons</CardTitle>
                  <CardDescription>Button components with different variants and states</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Button Variants</h3>
                      <div className="flex flex-wrap gap-4">
                        <Button variant="default">Default</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="link">Link</Button>
                        <Button variant="destructive">Destructive</Button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-3">Button Sizes</h3>
                      <div className="flex flex-wrap items-center gap-4">
                        <Button size="sm">Small</Button>
                        <Button size="default">Default</Button>
                        <Button size="lg">Large</Button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-3">Button States</h3>
                      <div className="flex flex-wrap gap-4">
                        <Button>Default</Button>
                        <Button disabled>Disabled</Button>
                        <Button className="animate-pulse">Loading...</Button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-3">Button with Icons</h3>
                      <div className="flex flex-wrap gap-4">
                        <Button>
                          <Shield className="mr-2 h-4 w-4" />
                          Protect
                        </Button>
                        <Button variant="outline">
                          <Play className="mr-2 h-4 w-4" />
                          Simulate
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Cards */}
              <Card>
                <CardHeader>
                  <CardTitle>Cards</CardTitle>
                  <CardDescription>Card components for displaying content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Card Example</CardTitle>
                        <CardDescription>This is a basic card with header and content</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Cards are used to group related content and actions. They can contain various elements like text, buttons, and other components.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="security-card">
                      <CardHeader>
                        <CardTitle>Security Card</CardTitle>
                        <CardDescription>Using the security-card class</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Security cards have a slightly transparent background with backdrop blur for a modern look.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
              
              {/* Badges */}
              <Card>
                <CardHeader>
                  <CardTitle>Badges</CardTitle>
                  <CardDescription>Badge components for status indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Badge Variants</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="outline">Outline</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-3">Status Badges</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-red-500/30 text-red-200 border-red-400/50">Critical</Badge>
                        <Badge className="bg-orange-500/30 text-orange-200 border-orange-400/50">High</Badge>
                        <Badge className="bg-yellow-500/30 text-yellow-200 border-yellow-400/50">Medium</Badge>
                        <Badge className="bg-green-500/30 text-green-200 border-green-400/50">Low</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Navigation Components */}
              <Card>
                <CardHeader>
                  <CardTitle>Navigation Components</CardTitle>
                  <CardDescription>Components used for navigation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium mb-3">Navigation Links</h3>
                    <div className="flex flex-wrap gap-4">
                      <Link 
                        href="#" 
                        className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-muted/50"
                      >
                        <Home className="h-4 w-4" />
                        <span>Regular Link</span>
                      </Link>
                      <Link 
                        href="#" 
                        className="flex items-center space-x-2 text-foreground font-medium px-4 py-2 rounded-lg bg-primary/20 border border-primary/30"
                      >
                        <Shield className="h-4 w-4" />
                        <span>Active Link</span>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Layouts Tab Content */}
            <TabsContent value="layouts" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Layout Patterns</CardTitle>
                  <CardDescription>Common layout structures and patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Layout sections will be added here */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}