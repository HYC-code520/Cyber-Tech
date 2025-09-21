'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Filter,
  Clock,
  AlertTriangle,
  RefreshCw,
  Download,
  Shield
} from 'lucide-react'

interface MapControlsProps {
  timeRange: string
  onTimeRangeChange: (range: string) => void
  severityFilter: string
  onSeverityFilterChange: (severity: string) => void
  onRefresh: () => void
  onExport: () => void
  isLoading?: boolean
  incidentCount: number
}

export default function MapControls({
  timeRange,
  onTimeRangeChange,
  severityFilter,
  onSeverityFilterChange,
  onRefresh,
  onExport,
  isLoading = false,
  incidentCount
}: MapControlsProps) {
  const timeRanges = [
    { value: '1', label: '1 Hour' },
    { value: '6', label: '6 Hours' },
    { value: '24', label: '24 Hours' },
    { value: '48', label: '48 Hours' },
    { value: '168', label: '7 Days' },
  ]

  const severityLevels = [
    { value: 'all', label: 'All Levels', color: 'bg-gray-500/20 text-gray-300' },
    { value: 'critical', label: 'Critical', color: 'bg-red-500/20 text-red-300' },
    { value: 'high', label: 'High', color: 'bg-orange-500/20 text-orange-300' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500/20 text-yellow-300' },
    { value: 'low', label: 'Low', color: 'bg-green-500/20 text-green-300' },
  ]

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-background/60 backdrop-blur-sm border border-border/50 rounded-lg">
        {/* Time Range Filter */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground mr-2">Time:</span>
          <div className="flex gap-1">
            {timeRanges.map(range => (
              <Button
                key={range.value}
                variant={timeRange === range.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onTimeRangeChange(range.value)}
                className={timeRange === range.value ?
                  'bg-primary text-primary-foreground' :
                  'border-border/50 hover:bg-muted/30'
                }
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground mr-2">Severity:</span>
          <div className="flex gap-1">
            {severityLevels.map(level => (
              <Button
                key={level.value}
                variant="outline"
                size="sm"
                onClick={() => onSeverityFilterChange(level.value)}
                className={`border-border/50 hover:bg-muted/30 ${
                  severityFilter === level.value ? level.color : ''
                }`}
              >
                {level.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="border-border/50 hover:bg-muted/30"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="ml-2">Refresh</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="border-border/50 hover:bg-muted/30"
          >
            <Download className="h-4 w-4" />
            <span className="ml-2">Export</span>
          </Button>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card/60 border-border/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total Incidents</p>
              <p className="text-2xl font-bold text-foreground">{incidentCount}</p>
            </div>
            <Shield className="h-8 w-8 text-primary opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-red-500/10 border-red-500/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-red-300">Critical</p>
              <p className="text-2xl font-bold text-red-400">
                {Math.floor(incidentCount * 0.15)}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400 opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-orange-500/10 border-orange-500/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-orange-300">High Risk</p>
              <p className="text-2xl font-bold text-orange-400">
                {Math.floor(incidentCount * 0.25)}
              </p>
            </div>
            <Filter className="h-8 w-8 text-orange-400 opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-blue-500/10 border-blue-500/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-300">Blocked</p>
              <p className="text-2xl font-bold text-blue-400">
                {Math.floor(incidentCount * 0.8)}
              </p>
            </div>
            <Shield className="h-8 w-8 text-blue-400 opacity-50" />
          </div>
        </Card>
      </div>
    </div>
  )
}