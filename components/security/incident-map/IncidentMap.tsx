'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Shield, Activity, Globe } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Next.js
import L from 'leaflet'

// Type definitions
interface IncidentLocation {
  id: string
  type: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  latitude: number
  longitude: number
  country: string
  city: string
  ipAddress: string
  timestamp: Date
  failedAttempts?: number
  threatScore: number
  isTOR?: boolean
  isVPN?: boolean
}

interface MapProps {
  incidents: IncidentLocation[]
  center?: [number, number]
  zoom?: number
}

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
)

const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
)

export default function IncidentMap({
  incidents = [],
  center = [40.7128, -74.0060], // Center on Your Organization (New York)
  zoom = 2.5
}: MapProps) {
  const [selectedIncident, setSelectedIncident] = useState<IncidentLocation | null>(null)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    // Fix Leaflet icon issue in Next.js
    if (typeof window !== 'undefined') {
      delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl: '/leaflet/marker-icon.png',
        shadowUrl: '/leaflet/marker-shadow.png',
      })
      setMapReady(true)
    }
  }, [])

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return '#dc2626' // red-600
      case 'high': return '#ea580c' // orange-600
      case 'medium': return '#ca8a04' // yellow-600
      case 'low': return '#16a34a' // green-600
      default: return '#6b7280' // gray-500
    }
  }

  const getSeverityRadius = (severity: string): number => {
    switch (severity) {
      case 'critical': return 15000
      case 'high': return 12000
      case 'medium': return 9000
      case 'low': return 6000
      default: return 5000
    }
  }

  const getMarkerIcon = (severity: string, isSelected: boolean = false) => {
    if (typeof window === 'undefined') return undefined

    const color = getSeverityColor(severity)
    const size = isSelected ? 35 : 25

    return L.divIcon({
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          ${isSelected ? 'animation: pulse 2s infinite;' : ''}
        ">
          <div style="
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
          "></div>
        </div>
      `,
      className: 'custom-marker',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    })
  }

  // Target location (your organization)
  const targetLocation: [number, number] = [40.7128, -74.0060] // New York, NY

  // Map bounds to prevent infinite world wrapping
  const worldBounds = L.latLngBounds(
    L.latLng(-90, -180), // Southwest corner
    L.latLng(90, 180)    // Northeast corner
  )

  if (!mapReady) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted/10 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading security map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden border border-border/50">
      <style jsx global>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          70% {
            box-shadow: 0 0 0 20px rgba(239, 68, 68, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }

        .leaflet-container {
          background: #0f172a;
        }

        .attack-path {
          animation: dash 3s linear infinite;
        }

        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
      `}</style>

      <MapContainer
        center={center}
        zoom={zoom}
        minZoom={2.5}
        maxZoom={10}
        maxBounds={worldBounds}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
        className="h-full w-full"
        style={{ background: '#0f172a' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          noWrap={true}
          bounds={[[-90, -180], [90, 180]]}
        />

        {/* Target location marker */}
        <Marker
          position={targetLocation}
          icon={L.divIcon({
            html: `
              <div style="
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#3b82f6" stroke="white" stroke-width="2"/>
                  <path d="M20 10L23 17H17L20 10Z" fill="white"/>
                  <circle cx="20" cy="20" r="5" fill="white"/>
                </svg>
              </div>
            `,
            className: 'target-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          })}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-sm mb-1">Your Organization</h3>
              <p className="text-xs text-muted-foreground">New York, NY</p>
              <Badge className="mt-2 bg-blue-500/20 text-blue-300">Protected</Badge>
            </div>
          </Popup>
        </Marker>

        {/* Incident markers and attack paths */}
        {incidents.map((incident) => (
          <React.Fragment key={incident.id}>
            {/* Attack path line */}
            <Polyline
              positions={[
                [incident.latitude, incident.longitude],
                targetLocation
              ]}
              color={getSeverityColor(incident.severity)}
              weight={2}
              opacity={0.6}
              dashArray="10, 10"
              className="attack-path"
            />

            {/* Threat radius circle */}
            <Circle
              center={[incident.latitude, incident.longitude]}
              radius={getSeverityRadius(incident.severity)}
              fillColor={getSeverityColor(incident.severity)}
              fillOpacity={0.1}
              color={getSeverityColor(incident.severity)}
              weight={1}
              opacity={0.3}
            />

            {/* Incident marker */}
            <Marker
              position={[incident.latitude, incident.longitude]}
              icon={getMarkerIcon(
                incident.severity,
                selectedIncident?.id === incident.id
              )}
              eventHandlers={{
                click: () => setSelectedIncident(incident),
              }}
            >
              <Popup>
                <div className="p-3 min-w-[280px] max-w-[320px]">
                  {/* Header Section - More Compact */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        incident.severity === 'critical' ? 'bg-red-500' :
                        incident.severity === 'high' ? 'bg-orange-500' :
                        incident.severity === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      } animate-pulse`}></div>
                      <h3 className="font-semibold text-sm text-gray-900">Security Incident</h3>
                    </div>
                    <Badge
                      className={`
                        font-medium px-2 py-0.5 text-xs uppercase tracking-wide border
                        ${incident.severity === 'critical' ? 'bg-red-50 text-red-700 border-red-200' :
                          incident.severity === 'high' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          incident.severity === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          'bg-green-50 text-green-700 border-green-200'}
                      `}
                    >
                      {incident.severity}
                    </Badge>
                  </div>

                  {/* Main Content - Reduced Spacing */}
                  <div className="space-y-2">
                    {/* Location - Compact Layout */}
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                      <Globe className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs text-gray-900 truncate">{incident.city}, {incident.country}</div>
                      </div>
                    </div>

                    {/* IP Address & Flags - Single Line */}
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                      <Activity className="h-3.5 w-3.5 text-purple-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs text-gray-900 font-mono truncate">{incident.ipAddress}</div>
                      </div>
                      <div className="flex gap-1">
                        {incident.isTOR && (
                          <Badge className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 border border-purple-200">TOR</Badge>
                        )}
                        {incident.isVPN && (
                          <Badge className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 border border-blue-200">VPN</Badge>
                        )}
                      </div>
                    </div>

                    {/* Attack Type - Inline */}
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs text-gray-900 capitalize truncate">{incident.type.replace('_', ' ')}</div>
                      </div>
                      {incident.failedAttempts && (
                        <div className="text-xs text-gray-600 font-medium">
                          {incident.failedAttempts} attempts
                        </div>
                      )}
                    </div>

                    {/* Threat Score - Compact */}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">Threat Score</span>
                        <span className={`text-sm font-bold ${
                          incident.threatScore > 0.7 ? 'text-red-600' :
                          incident.threatScore > 0.4 ? 'text-orange-600' :
                          'text-yellow-600'
                        }`}>
                          {(incident.threatScore * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            incident.threatScore > 0.7 ? 'bg-red-500' :
                            incident.threatScore > 0.4 ? 'bg-orange-500' :
                            'bg-yellow-500'
                          }`}
                          style={{ width: `${incident.threatScore * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Timestamp - Minimal */}
                    <div className="pt-1 text-center">
                      <div className="text-xs text-gray-500">
                        {new Date(incident.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg p-3 z-[1000]">
        <h4 className="text-xs font-semibold mb-2 text-foreground">Threat Levels</h4>
        <div className="space-y-1">
          {['critical', 'high', 'medium', 'low'].map((severity) => (
            <div key={severity} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full border border-white"
                style={{ backgroundColor: getSeverityColor(severity) }}
              />
              <span className="text-xs capitalize text-muted-foreground">{severity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Overlay */}
      <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg p-3 z-[1000]">
        <div className="space-y-2">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{incidents.length}</div>
            <div className="text-xs text-muted-foreground">Active Threats</div>
          </div>
          <div className="text-center border-t border-border/50 pt-2">
            <div className="text-lg font-bold text-orange-400">
              {incidents.filter(i => i.severity === 'critical' || i.severity === 'high').length}
            </div>
            <div className="text-xs text-muted-foreground">High Priority</div>
          </div>
        </div>
      </div>
    </div>
  )
}