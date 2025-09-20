'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertTriangle, Search, Filter, ArrowLeft, Shield } from 'lucide-react'
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
        }
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching incidents:', error)
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
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'triggered': return 'bg-red-100 text-red-800'
      case 'confirmed': return 'bg-orange-100 text-orange-800'
      case 'classified': return 'bg-blue-100 text-blue-800'
      case 'contained': return 'bg-purple-100 text-purple-800'
      case 'recovered': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-slate-100 text-slate-800'
      default: return 'bg-slate-100 text-slate-800'
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
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Identity Sentinel</h1>
              <p className="text-sm text-slate-500">Account Compromise Decision Coach</p>
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
              href="/incidents"
              className="flex items-center space-x-2 text-slate-900 font-medium"
            >
              All Incidents
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
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">All Incidents</h1>
                <p className="text-slate-600 mt-1">
                  {filteredIncidents.length} of {incidents.length} incidents
                  {searchTerm || severityFilter !== 'all' || statusFilter !== 'all' ? ' (filtered)' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(severityStats).map(([severity, count]) => (
              <Card key={severity}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium capitalize">{severity}</p>
                      <p className="text-2xl font-bold">{count}</p>
                    </div>
                    <AlertTriangle className={`h-5 w-5 ${
                      severity === 'critical' ? 'text-red-600' :
                      severity === 'high' ? 'text-orange-600' :
                      severity === 'medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search incidents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
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
          <Card>
            <CardHeader>
              <CardTitle>Incidents {startIndex + 1}-{Math.min(endIndex, filteredIncidents.length)} of {filteredIncidents.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500">Loading incidents...</p>
                  </div>
                ) : currentIncidents.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500">No incidents found matching your criteria.</p>
                  </div>
                ) : (
                  currentIncidents.map((incident) => (
                    <div
                      key={incident.id}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-slate-900">{incident.type}</h3>
                            <p className="text-sm text-slate-500 mt-1">ID: {incident.id}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400">
                              <span>Created: {incident.createdAt}</span>
                              <span>Updated: {incident.updatedAt}</span>
                              <span>By: {incident.createdBy}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 ml-4">
                            <Badge className={getSeverityColor(incident.severity)}>
                              {incident.severity}
                            </Badge>
                            <Badge className={getStatusColor(incident.status)}>
                              {incident.status}
                            </Badge>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/incident/${incident.id}`}>
                                View
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
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-slate-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredIncidents.length)} of {filteredIncidents.length} results
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
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
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                      {totalPages > 5 && currentPage <= totalPages - 3 && (
                        <>
                          <span className="px-2">...</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
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