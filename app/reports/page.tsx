'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  FileText, 
  Download, 
  Calendar, 
  Clock, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  MapPin, 
  Eye, 
  Target, 
  TrendingUp,
  BarChart3,
  FileBarChart,
  AlertCircle,
  Users,
  Globe,
  Zap,
  Search,
  Filter,
  ExternalLink,
  Copy,
  Printer
} from 'lucide-react'
import { Navbar } from '@/components/ui/navbar'
import Link from 'next/link'

interface DetailedIncident {
  id: string
  type?: string
  severity: string
  status: string
  currentStep: string
  createdBy: string
  createdAt: string
  updatedAt: string
  indicators: Array<{
    id: string
    type: string
    value: string
    confidence: number
    ipAddress?: string
    country?: string
    city?: string
    latitude?: number
    longitude?: number
    isp?: string
    threatScore?: number
    createdAt: string
  }>
  recommendations: Array<{
    id: string
    action: string
    reason: string
    citation: string
    priority: number
    applied: boolean
    category: string
    createdAt: string
  }>
  actions: Array<{
    id: string
    type: string
    status: string
    result?: string
    executedAt?: string
    createdAt: string
  }>
  transitions: Array<{
    id: string
    fromStep: string
    toStep: string
    notes?: string
    timestamp: string
  }>
}

interface IncidentReport {
  incident: DetailedIncident
  analysis: {
    timeToDetection: string
    timeToContainment: string
    timeToResolution: string
    effectivenessScore: number
    threatLevel: string
    impactAssessment: string
  }
  threatIntelligence: {
    sourceCountries: string[]
    attackVectors: string[]
    threatActorProfile: string
    iocSummary: string[]
  }
  recommendations: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  }
}

export default function ReportsPage() {
  const [incidents, setIncidents] = useState<DetailedIncident[]>([])
  const [selectedIncident, setSelectedIncident] = useState<DetailedIncident | null>(null)
  const [incidentReport, setIncidentReport] = useState<IncidentReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatingReport, setGeneratingReport] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchIncidents()
  }, [])

  const fetchIncidents = async () => {
    try {
      const response = await fetch('/api/incidents')
      const data = await response.json()
      if (Array.isArray(data)) {
        setIncidents(data)
      } else {
        console.error('API Error:', data.error || 'Unknown error')
        setIncidents([])
      }
    } catch (error) {
      console.error('Error fetching incidents:', error)
      setIncidents([])
    } finally {
      setLoading(false)
    }
  }

  const generateDetailedReport = async (incident: DetailedIncident) => {
    setGeneratingReport(true)
    setSelectedIncident(incident)
    
    // Simulate analysis processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const analysis = analyzeIncident(incident)
    const threatIntel = generateThreatIntelligence(incident)
    const recommendations = generateRecommendations(incident)
    
    setIncidentReport({
      incident,
      analysis,
      threatIntelligence: threatIntel,
      recommendations
    })
    
    setGeneratingReport(false)
    setActiveTab('executive-summary')
  }

  const analyzeIncident = (incident: DetailedIncident) => {
    const createdTime = new Date(incident.createdAt)
    const updatedTime = new Date(incident.updatedAt)
    const timeDiff = updatedTime.getTime() - createdTime.getTime()
    
    const timeToDetection = "< 2 minutes" // Simulated
    const timeToContainment = incident.status === 'contained' || incident.status === 'recovered' || incident.status === 'closed' 
      ? formatDuration(timeDiff) : "In Progress"
    const timeToResolution = incident.status === 'closed' ? formatDuration(timeDiff) : "In Progress"
    
    const effectivenessScore = calculateEffectivenessScore(incident)
    const threatLevel = assessThreatLevel(incident)
    const impactAssessment = generateImpactAssessment(incident)
    
    return {
      timeToDetection,
      timeToContainment,
      timeToResolution,
      effectivenessScore,
      threatLevel,
      impactAssessment
    }
  }

  const generateThreatIntelligence = (incident: DetailedIncident) => {
    const sourceCountries = incident.indicators
      .filter(i => i.country)
      .map(i => i.country!)
      .filter((country, index, arr) => arr.indexOf(country) === index)
    
    const attackVectors = incident.indicators.map(i => i.type)
      .filter((type, index, arr) => arr.indexOf(type) === index)
    
    const threatActorProfile = generateThreatActorProfile(incident)
    const iocSummary = generateIOCs(incident)
    
    return {
      sourceCountries,
      attackVectors,
      threatActorProfile,
      iocSummary
    }
  }

  const generateRecommendations = (incident: DetailedIncident) => {
    const immediate = [
      "Implement enhanced monitoring for similar attack patterns",
      "Review and update incident response procedures",
      "Conduct immediate security awareness training"
    ]
    
    const shortTerm = [
      "Deploy additional security controls based on attack vectors identified",
      "Enhance threat hunting capabilities for this attack type",
      "Update security policies to address identified gaps"
    ]
    
    const longTerm = [
      "Implement advanced threat detection solutions",
      "Establish threat intelligence sharing partnerships",
      "Develop custom detection rules for this threat type"
    ]
    
    return { immediate, shortTerm, longTerm }
  }

  const calculateEffectivenessScore = (incident: DetailedIncident): number => {
    let score = 70 // Base score
    
    // Boost for successful containment
    if (['contained', 'recovered', 'closed'].includes(incident.status)) score += 20
    
    // Boost for quick response
    const responseTime = new Date(incident.updatedAt).getTime() - new Date(incident.createdAt).getTime()
    if (responseTime < 30 * 60 * 1000) score += 10 // Under 30 minutes
    
    // Penalties for high severity incidents
    if (incident.severity === 'critical') score -= 5
    
    return Math.min(100, Math.max(0, score))
  }

  const assessThreatLevel = (incident: DetailedIncident): string => {
    const avgThreatScore = incident.indicators
      .filter(i => i.threatScore)
      .reduce((sum, i) => sum + (i.threatScore || 0), 0) / 
      incident.indicators.filter(i => i.threatScore).length || 0
    
    if (avgThreatScore > 0.8) return 'CRITICAL'
    if (avgThreatScore > 0.6) return 'HIGH'
    if (avgThreatScore > 0.4) return 'MEDIUM'
    return 'LOW'
  }

  const generateImpactAssessment = (incident: DetailedIncident): string => {
    const severity = incident.severity.toUpperCase()
    const affectedSystems = incident.indicators.length
    
    return `${severity} severity incident affecting ${affectedSystems} indicator${affectedSystems > 1 ? 's' : ''}. ` +
           `Response effectiveness rated at ${calculateEffectivenessScore(incident)}%. ` +
           `${incident.status === 'closed' ? 'Successfully resolved with no residual impact.' : 'Response in progress.'}`
  }

  const generateThreatActorProfile = (incident: DetailedIncident): string => {
    if (!incident.type) return "Unknown threat actor - analysis pending"
    
    const profiles = {
      brute_force: "Likely automated attack or low-skilled threat actor using common credential stuffing techniques",
      password_spray: "Sophisticated attacker with knowledge of the organization, possibly insider threat or APT group",
      suspicious_login: "Potential account compromise or unauthorized access attempt, requires further investigation",
      malware_detection: "Advanced persistent threat (APT) or cybercriminal group deploying sophisticated malware",
      phishing_attack: "Social engineering focused threat actor, likely financially motivated cybercriminal group"
    }
    
    return profiles[incident.type as keyof typeof profiles] || "Analysis pending - threat actor profile under investigation"
  }

  const generateIOCs = (incident: DetailedIncident): string[] => {
    const iocs: string[] = []
    
    incident.indicators.forEach(indicator => {
      if (indicator.ipAddress) {
        iocs.push(`IP: ${indicator.ipAddress} (${indicator.country || 'Unknown'})`)
      }
      
      try {
        const value = JSON.parse(indicator.value)
        if (value.username) iocs.push(`Username: ${value.username}`)
        if (value.email) iocs.push(`Email: ${value.email}`)
        if (value.hash) iocs.push(`Hash: ${value.hash}`)
        if (value.domain) iocs.push(`Domain: ${value.domain}`)
        if (value.url) iocs.push(`URL: ${value.url}`)
      } catch {
        // If not JSON, treat as plain text
        iocs.push(`${indicator.type}: ${indicator.value}`)
      }
    })
    
    return iocs
  }

  const formatDuration = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}d ${hours % 24}h`
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    return `${minutes}m`
  }

  const exportDetailedReport = () => {
    if (!incidentReport) return
    
    const reportData = {
      ...incidentReport,
      generatedAt: new Date().toISOString(),
      generatedBy: "Security Analyst",
      classification: "INTERNAL USE ONLY",
      version: "1.0"
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `detailed-incident-report-${incidentReport.incident.id.slice(-8)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportPDFReport = async () => {
    // Simulate PDF generation
    alert('PDF export functionality would be implemented with a library like jsPDF or by sending to a backend service')
  }

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = !searchTerm || 
      incident.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (incident.type && incident.type.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesSeverity = severityFilter === 'all' || incident.severity === severityFilter
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter
    
    return matchesSearch && matchesSeverity && matchesStatus
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-400/50'
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-400/50'
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/50'
      case 'low': return 'bg-green-500/20 text-green-300 border-green-400/50'
      default: return 'bg-slate-500/20 text-slate-300 border-slate-400/50'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed': return 'bg-green-500/20 text-green-300'
      case 'recovered': return 'bg-green-500/20 text-green-300'
      case 'contained': return 'bg-purple-500/20 text-purple-300'
      case 'classified': return 'bg-blue-500/20 text-blue-300'
      case 'confirmed': return 'bg-orange-500/20 text-orange-300'
      case 'triggered': return 'bg-red-500/20 text-red-300'
      default: return 'bg-slate-500/20 text-slate-300'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  if (incidentReport) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="container mx-auto px-6 py-8">
          <div className="space-y-6">
            {/* Report Header */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIncidentReport(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ← Back to Reports
                  </Button>
                </div>
                <h1 className="text-3xl font-bold text-foreground">Security Incident Analysis Report</h1>
                <p className="text-muted-foreground mt-1">
                  Incident ID: {incidentReport.incident.id} • Generated: {formatDate(new Date().toISOString())}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={exportPDFReport}>
                  <Printer className="h-4 w-4 mr-2" />
                  PDF Report
                </Button>
                <Button onClick={exportDetailedReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>

            {/* Classification Banner */}
            <Alert className="border-yellow-400/50 bg-yellow-500/10">
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-yellow-300">
                <strong>INTERNAL USE ONLY</strong> - This report contains sensitive security information and should be handled according to company data classification policies.
              </AlertDescription>
            </Alert>

            {/* Report Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="executive-summary">Executive Summary</TabsTrigger>
                <TabsTrigger value="incident-details">Incident Details</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="threat-intel">Threat Intelligence</TabsTrigger>
                <TabsTrigger value="response-analysis">Response Analysis</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              {/* Executive Summary Tab */}
              <TabsContent value="executive-summary" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileBarChart className="h-5 w-5" />
                      <span>Executive Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card className="bg-card/50">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-foreground">
                              {incidentReport.analysis.effectivenessScore}%
                            </div>
                            <div className="text-sm text-muted-foreground">Response Effectiveness</div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-card/50">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-foreground">
                              {incidentReport.analysis.timeToContainment}
                            </div>
                            <div className="text-sm text-muted-foreground">Time to Containment</div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-card/50">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <Badge className={getSeverityColor(incidentReport.incident.severity)}>
                              {incidentReport.analysis.threatLevel}
                            </Badge>
                            <div className="text-sm text-muted-foreground mt-1">Threat Level</div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-card/50">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-foreground">
                              {incidentReport.incident.indicators.length}
                            </div>
                            <div className="text-sm text-muted-foreground">IOCs Identified</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Impact Assessment */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Impact Assessment</h3>
                      <Card className="bg-muted/20">
                        <CardContent className="p-4">
                          <p className="text-foreground leading-relaxed">
                            {incidentReport.analysis.impactAssessment}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Key Findings */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Key Findings</h3>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                          <span>Incident was successfully detected and contained within acceptable timeframes</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                          <span>Attack originated from {incidentReport.threatIntelligence.sourceCountries.length} distinct geographical location(s)</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Target className="h-5 w-5 text-blue-500 mt-0.5" />
                          <span>{incidentReport.incident.recommendations.filter(r => r.applied).length} of {incidentReport.incident.recommendations.length} security recommendations were successfully implemented</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Incident Details Tab */}
              <TabsContent value="incident-details" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Incident Classification</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Incident ID</label>
                          <div className="flex items-center space-x-2">
                            <code className="bg-muted/50 px-2 py-1 rounded text-sm">
                              {incidentReport.incident.id}
                            </code>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(incidentReport.incident.id)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Type</label>
                          <p className="capitalize text-foreground">
                            {incidentReport.incident.type?.replace('_', ' ') || 'Unclassified'}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Severity</label>
                          <Badge className={getSeverityColor(incidentReport.incident.severity)}>
                            {incidentReport.incident.severity}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Status</label>
                          <Badge className={getStatusColor(incidentReport.incident.status)}>
                            {incidentReport.incident.status}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Created By</label>
                          <p className="text-foreground">{incidentReport.incident.createdBy}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Current Step</label>
                          <p className="capitalize text-foreground">{incidentReport.incident.currentStep}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Indicators of Compromise */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5" />
                        <span>Indicators of Compromise</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <div className="space-y-3">
                          {incidentReport.incident.indicators.map((indicator) => (
                            <div key={indicator.id} className="border border-border/50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {indicator.type}
                                </Badge>
                                <div className="text-xs text-muted-foreground">
                                  Confidence: {Math.round(indicator.confidence * 100)}%
                                </div>
                              </div>
                              <p className="text-sm text-foreground break-all">
                                {indicator.value}
                              </p>
                              {indicator.ipAddress && (
                                <div className="mt-2 text-xs text-muted-foreground flex items-center space-x-2">
                                  <MapPin className="h-3 w-3" />
                                  <span>{indicator.ipAddress}</span>
                                  {indicator.country && <span>• {indicator.country}</span>}
                                  {indicator.city && <span>• {indicator.city}</span>}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>

                {/* Actions Taken */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>Response Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {incidentReport.incident.actions.length > 0 ? (
                        incidentReport.incident.actions.map((action) => (
                          <div key={action.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                            <div>
                              <p className="font-medium text-foreground capitalize">
                                {action.type.replace('_', ' ')}
                              </p>
                              {action.result && (
                                <p className="text-sm text-muted-foreground mt-1">{action.result}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(action.status)}>
                                {action.status}
                              </Badge>
                              {action.executedAt && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatDate(action.executedAt)}
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No response actions recorded</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>Incident Timeline</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Timeline events */}
                      <div className="relative">
                        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-border"></div>
                        
                        {/* Initial Detection */}
                        <div className="relative flex items-center space-x-4 pb-4">
                          <div className="w-8 h-8 bg-red-500/20 border-2 border-red-500 rounded-full flex items-center justify-center">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-foreground">Incident Triggered</h4>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(incidentReport.incident.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Initial detection and incident creation
                            </p>
                          </div>
                        </div>

                        {/* Transitions */}
                        {incidentReport.incident.transitions.map((transition, index) => (
                          <div key={transition.id} className="relative flex items-center space-x-4 pb-4">
                            <div className="w-8 h-8 bg-blue-500/20 border-2 border-blue-500 rounded-full flex items-center justify-center">
                              <Activity className="h-4 w-4 text-blue-500" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-foreground">
                                  {transition.fromStep} → {transition.toStep}
                                </h4>
                                <span className="text-sm text-muted-foreground">
                                  {formatDate(transition.timestamp)}
                                </span>
                              </div>
                              {transition.notes && (
                                <p className="text-sm text-muted-foreground">{transition.notes}</p>
                              )}
                            </div>
                          </div>
                        ))}

                        {/* Actions */}
                        {incidentReport.incident.actions.map((action) => (
                          <div key={action.id} className="relative flex items-center space-x-4 pb-4">
                            <div className="w-8 h-8 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-foreground capitalize">
                                  {action.type.replace('_', ' ')}
                                </h4>
                                <span className="text-sm text-muted-foreground">
                                  {formatDate(action.executedAt || action.createdAt)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getStatusColor(action.status)} size="sm">
                                  {action.status}
                                </Badge>
                                {action.result && (
                                  <span className="text-sm text-muted-foreground">{action.result}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Threat Intelligence Tab */}
              <TabsContent value="threat-intel" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Threat Actor Profile */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>Threat Actor Profile</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground leading-relaxed">
                        {incidentReport.threatIntelligence.threatActorProfile}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Geographic Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Globe className="h-5 w-5" />
                        <span>Geographic Analysis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Source Countries</label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {incidentReport.threatIntelligence.sourceCountries.length > 0 ? (
                              incidentReport.threatIntelligence.sourceCountries.map((country) => (
                                <Badge key={country} variant="outline">
                                  {country}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm">No geographic data available</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Attack Vectors</label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {incidentReport.threatIntelligence.attackVectors.map((vector) => (
                              <Badge key={vector} variant="outline">
                                {vector}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* IOC Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Search className="h-5 w-5" />
                      <span>Indicators of Compromise (IOCs)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {incidentReport.threatIntelligence.iocSummary.map((ioc, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                            <code className="text-sm text-foreground">{ioc}</code>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(ioc)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Response Analysis Tab */}
              <TabsContent value="response-analysis" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Response Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5" />
                        <span>Response Metrics</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Time to Detection</label>
                        <p className="text-2xl font-bold text-green-500">{incidentReport.analysis.timeToDetection}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Time to Containment</label>
                        <p className="text-2xl font-bold text-blue-500">{incidentReport.analysis.timeToContainment}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Time to Resolution</label>
                        <p className="text-2xl font-bold text-purple-500">{incidentReport.analysis.timeToResolution}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Effectiveness Score */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5" />
                        <span>Effectiveness Analysis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-foreground mb-2">
                          {incidentReport.analysis.effectivenessScore}%
                        </div>
                        <p className="text-muted-foreground">Overall Response Effectiveness</p>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full" 
                          style={{ width: `${incidentReport.analysis.effectivenessScore}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations Applied */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <CheckCircle2 className="h-5 w-5" />
                        <span>Recommendations</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-foreground mb-2">
                          {incidentReport.incident.recommendations.filter(r => r.applied).length}/{incidentReport.incident.recommendations.length}
                        </div>
                        <p className="text-muted-foreground">Applied</p>
                      </div>
                      <div className="space-y-2">
                        {incidentReport.incident.recommendations.slice(0, 3).map((rec) => (
                          <div key={rec.id} className="flex items-center space-x-2">
                            {rec.applied ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-500" />
                            )}
                            <span className="text-sm text-foreground capitalize">
                              {rec.action.replace('_', ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Recommendations Tab */}
              <TabsContent value="recommendations" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Immediate Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-red-500" />
                        <span>Immediate Actions</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {incidentReport.recommendations.immediate.map((rec, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs text-red-500 font-bold">{index + 1}</span>
                            </div>
                            <p className="text-sm text-foreground">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Short-term Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-yellow-500" />
                        <span>Short-term (1-4 weeks)</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {incidentReport.recommendations.shortTerm.map((rec, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs text-yellow-500 font-bold">{index + 1}</span>
                            </div>
                            <p className="text-sm text-foreground">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Long-term Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-blue-500" />
                        <span>Long-term (1-6 months)</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {incidentReport.recommendations.longTerm.map((rec, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs text-blue-500 font-bold">{index + 1}</span>
                            </div>
                            <p className="text-sm text-foreground">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Lessons Learned */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Lessons Learned</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-foreground mb-2">What Worked Well</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Rapid detection and initial response</li>
                          <li>• Effective coordination between security teams</li>
                          <li>• Successful containment of the threat</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Areas for Improvement</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Enhanced threat hunting capabilities needed</li>
                          <li>• Improve documentation of response procedures</li>
                          <li>• Additional training on emerging threat vectors</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Security Analysis & Reporting</h1>
              <p className="text-muted-foreground mt-1">Comprehensive incident analysis and threat intelligence</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Download className="h-4 w-4 mr-2" />
              Export All Reports
            </Button>
          </div>

          {/* Filters */}
          <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search incidents..."
                      className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <select
                  className="px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary"
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <select
                  className="px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="triggered">Triggered</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="classified">Classified</option>
                  <option value="contained">Contained</option>
                  <option value="recovered">Recovered</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Incidents</p>
                    <p className="text-2xl font-bold text-foreground">{filteredIncidents.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Critical Incidents</p>
                    <p className="text-2xl font-bold text-red-400">
                      {filteredIncidents.filter(i => i.severity === 'critical').length}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Resolved</p>
                    <p className="text-2xl font-bold text-green-400">
                      {filteredIncidents.filter(i => ['closed', 'recovered'].includes(i.status)).length}
                    </p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                    <p className="text-2xl font-bold text-cyan-400">12m</p>
                  </div>
                  <Clock className="h-8 w-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Incidents List */}
          <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center space-x-2">
                <FileBarChart className="h-5 w-5" />
                <span>Incident Analysis Reports</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading incidents...</p>
                  </div>
                ) : filteredIncidents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No incidents match your criteria.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {incidents.length === 0 ? "Create incidents via simulation to generate reports." : "Try adjusting your filters."}
                    </p>
                  </div>
                ) : (
                  filteredIncidents.map((incident) => (
                    <div 
                      key={incident.id}
                      className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors backdrop-blur-sm"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-foreground">
                            {incident.type ? (
                              <span className="capitalize">
                                {incident.type.replace('_', ' ')} Incident
                              </span>
                            ) : `Incident ${incident.id.slice(-8)}`}
                          </h3>
                          <Badge className={getSeverityColor(incident.severity)}>
                            {incident.severity}
                          </Badge>
                          <Badge className={getStatusColor(incident.status)}>
                            {incident.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Created {formatDate(incident.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Activity className="h-4 w-4" />
                            <span>{incident.actions.length} actions taken</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Target className="h-4 w-4" />
                            <span>{incident.indicators.length} IOCs</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Shield className="h-4 w-4" />
                            <span>{incident.recommendations.length} recommendations</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link href={`/incident/${incident.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Button 
                          variant="default"
                          size="sm" 
                          onClick={() => generateDetailedReport(incident)}
                          disabled={generatingReport}
                          className="bg-primary hover:bg-primary/90"
                        >
                          {generatingReport ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <FileBarChart className="h-4 w-4 mr-1" />
                              Detailed Report
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}