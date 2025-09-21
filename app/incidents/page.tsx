'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertTriangle, Search, Filter, ArrowLeft, Activity, Clock, Eye } from 'lucide-react'
import { Navbar } from '@/components/ui/navbar'
import Link from 'next/link'

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<any[]>([])
  const [filteredIncidents, setFilteredIncidents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  useEffect(() => {
    fetch('/api/incidents')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const formattedIncidents = data.map((incident: any) => ({
            id: incident.id,
            type: incident.type ? incident.type.replace(/_/g, ' ').split(' ').map((word: string) =>
              word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Unknown Incident',
            severity: incident.severity,
            status: incident.status,
            createdAt: new Date(incident.createdAt).toLocaleString(),
            updatedAt: new Date(incident.updatedAt).toLocaleString(),
            createdBy: incident.createdBy
          }))
          setIncidents(formattedIncidents)
          setFilteredIncidents(formattedIncidents)
        } else {
          console.error('API Error:', data.error || 'Unknown error')
          setIncidents([])
          setFilteredIncidents([])
        }
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching incidents:', error)
        setIncidents([])
        setFilteredIncidents([])
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let filtered = incidents.filter(incident => {
      const matchesSearch = incident.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           incident.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSeverity = severityFilter === 'all' || incident.severity === severityFilter
      const matchesStatus = statusFilter === 'all' || incident.status === statusFilter

      return matchesSearch && matchesSeverity && matchesStatus
    })

    setFilteredIncidents(filtered)
    setCurrentPage(1)
  }, [incidents, searchTerm, severityFilter, statusFilter])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/30 text-red-200 border-red-400/50'
      case 'high': return 'bg-orange-500/30 text-orange-200 border-orange-400/50'
      case 'medium': return 'bg-yellow-500/30 text-yellow-200 border-yellow-400/50'
      case 'low': return 'bg-green-500/30 text-green-200 border-green-400/50'
      default: return 'bg-slate-500/30 text-slate-200 border-slate-400/50'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'triggered': return 'bg-red-500/30 text-red-200'
      case 'confirmed': return 'bg-orange-500/30 text-orange-200'
      case 'classified': return 'bg-blue-500/30 text-blue-200'
      case 'contained': return 'bg-purple-500/30 text-purple-200'
      case 'recovered': return 'bg-green-500/30 text-green-200'
      case 'closed': return 'bg-slate-500/30 text-slate-200'
      default: return 'bg-slate-500/30 text-slate-200'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-400" />
      case 'high': return <AlertTriangle className="h-5 w-5 text-orange-400" />
      case 'medium': return <AlertTriangle className="h-5 w-5 text-yellow-400" />
      case 'low': return <AlertTriangle className="h-5 w-5 text-green-400" />
      default: return <AlertTriangle className="h-5 w-5 text-slate-400" />
    }
  }

  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentIncidents = filteredIncidents.slice(startIndex, endIndex)

  const severityStats = incidents.reduce((acc, incident) => {
    acc[incident.severity] = (acc[incident.severity] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="min-h-screen bg-background">
      <Navbar subtitle="Security Monitoring - Incident Management" />

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild className="border-primary/40 hover:bg-primary/20 text-foreground">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Security Incident Database</h1>
                <p className="text-muted-foreground mt-1">
                  {filteredIncidents.length} of {incidents.length} incidents
                  {searchTerm || severityFilter !== 'all' || statusFilter !== 'all' ? ' (filtered)' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(severityStats).map(([severity, count]) => (
              <Card key={severity} className="bg-card/60 border-border/50 backdrop-blur-sm metric-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground capitalize">{severity}</p>
                      <p className="text-3xl font-bold text-foreground">{count}</p>
                    </div>
                    {getSeverityIcon(severity)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Incidents</p>
                    <p className="text-2xl font-bold text-foreground">{incidents.length}</p>
                  </div>
                  <Activity className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Investigations</p>
                    <p className="text-2xl font-bold text-orange-400">
                      {incidents.filter(i => !['closed', 'recovered'].includes(i.status)).length}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Resolved Cases</p>
                    <p className="text-2xl font-bold text-green-400">
                      {incidents.filter(i => ['closed', 'recovered'].includes(i.status)).length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Filter className="h-5 w-5 mr-2 text-primary" />
                Advanced Filtering
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Search and filter incidents by type, severity, and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search incidents by type or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-[180px] bg-muted/50 border-border/50 text-foreground">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] bg-muted/50 border-border/50 text-foreground">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="triggered">Triggered</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="classified">Classified</SelectItem>
                    <SelectItem value="contained">Contained</SelectItem>
                    <SelectItem value="recovered">Recovered</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Incidents List */}
          <Card className="bg-card/60 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground">
                Incident Records {startIndex + 1}-{Math.min(endIndex, filteredIncidents.length)} of {filteredIncidents.length}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Complete investigation history and case details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading incident database...</p>
                  </div>
                ) : currentIncidents.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No incidents found matching your criteria.</p>
                    <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search terms.</p>
                  </div>
                ) : (
                  currentIncidents.map((incident) => (
                    <div
                      key={incident.id}
                      className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-all duration-200 backdrop-blur-sm group"
                    >
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-2 h-8 bg-primary rounded-full pulse-glow"></div>
                              <div>
                                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                                  {incident.type}
                                </h3>
                                <p className="text-sm text-muted-foreground">ID: {incident.id.slice(-8)}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground ml-5">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>Created: {incident.createdAt}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Activity className="h-3 w-3" />
                                <span>Updated: {incident.updatedAt}</span>
                              </div>
                              <span>Analyst: {incident.createdBy}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 ml-4">
                            <Badge className={getSeverityColor(incident.severity)}>
                              {incident.severity}
                            </Badge>
                            <Badge className={getStatusColor(incident.status)}>
                              {incident.status}
                            </Badge>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              asChild 
                              className="border-primary/40 hover:bg-primary/20 text-foreground group-hover:border-primary/60"
                            >
                              <Link href={`/incident/${incident.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                Investigate
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredIncidents.length)} of {filteredIncidents.length} results
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="border-primary/40 hover:bg-primary/20 text-foreground"
                    >
                      Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i
                        if (pageNum > totalPages) return null
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className={pageNum === currentPage 
                              ? "bg-primary hover:bg-primary/90" 
                              : "border-primary/40 hover:bg-primary/20 text-foreground"
                            }
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                      {totalPages > 5 && currentPage <= totalPages - 3 && (
                        <>
                          <span className="px-2 text-muted-foreground">...</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
                            className="border-primary/40 hover:bg-primary/20 text-foreground"
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="border-primary/40 hover:bg-primary/20 text-foreground"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}