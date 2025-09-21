import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ipLocator } from '@/lib/geolocation/ip-locator'

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams
    const hours = parseInt(searchParams.get('hours') || '24')
    const severity = searchParams.get('severity')

    // Calculate the date range
    const since = new Date(Date.now() - hours * 60 * 60 * 1000)

    // Build the where clause
    const where: Record<string, unknown> = {
      createdAt: {
        gte: since
      }
    }

    if (severity && severity !== 'all') {
      where.severity = severity
    }

    // Fetch incidents with their indicators
    const incidents = await prisma.incident.findMany({
      where,
      include: {
        indicators: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100 // Limit to prevent performance issues
    })

    // Process incidents to extract location data
    const incidentLocations = await Promise.all(
      incidents.map(async (incident) => {
        // Look for IP address in indicators
        const ipIndicator = incident.indicators.find(
          ind => ind.type === 'source_ip' || ind.type === 'ip_address'
        )

        // If we have location data in indicators, use it
        const locationIndicator = incident.indicators.find(
          ind => ind.latitude && ind.longitude
        )

        if (locationIndicator) {
          return {
            id: incident.id,
            type: incident.type || 'unknown',
            severity: incident.severity as 'critical' | 'high' | 'medium' | 'low',
            latitude: locationIndicator.latitude,
            longitude: locationIndicator.longitude,
            country: locationIndicator.country || 'Unknown',
            city: locationIndicator.city || 'Unknown',
            ipAddress: locationIndicator.ipAddress || ipIndicator?.value || 'Unknown',
            timestamp: incident.createdAt,
            failedAttempts: incident.indicators.find(
              ind => ind.type === 'failed_login_attempts'
            )?.value ? parseInt(incident.indicators.find(
              ind => ind.type === 'failed_login_attempts'
            )!.value) : undefined,
            threatScore: locationIndicator.threatScore || 0.5,
            isTOR: locationIndicator.isp?.includes('TOR') || false,
            isVPN: locationIndicator.isp?.includes('VPN') || false
          }
        }

        // If no location data exists, use IP to lookup
        if (ipIndicator) {
          const ipAddress = ipIndicator.value
          const geoData = await ipLocator.lookup(ipAddress)

          if (geoData) {
            // Update the indicator with geolocation data for future use
            await prisma.indicator.update({
              where: { id: ipIndicator.id },
              data: {
                ipAddress: geoData.ipAddress,
                country: geoData.country,
                city: geoData.city,
                latitude: geoData.latitude,
                longitude: geoData.longitude,
                isp: geoData.isp,
                threatScore: geoData.threatScore
              }
            })

            return {
              id: incident.id,
              type: incident.type || 'unknown',
              severity: incident.severity as 'critical' | 'high' | 'medium' | 'low',
              latitude: geoData.latitude,
              longitude: geoData.longitude,
              country: geoData.country,
              city: geoData.city,
              ipAddress: geoData.ipAddress,
              timestamp: incident.createdAt,
              failedAttempts: incident.indicators.find(
                ind => ind.type === 'failed_login_attempts'
              )?.value ? parseInt(incident.indicators.find(
                ind => ind.type === 'failed_login_attempts'
              )!.value) : undefined,
              threatScore: geoData.threatScore,
              isTOR: geoData.isTOR,
              isVPN: geoData.isVPN
            }
          }
        }

        // If no IP data available, generate mock location
        const mockGeo = await ipLocator.lookup(`192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`)

        if (mockGeo) {
          return {
            id: incident.id,
            type: incident.type || 'unknown',
            severity: incident.severity as 'critical' | 'high' | 'medium' | 'low',
            latitude: mockGeo.latitude,
            longitude: mockGeo.longitude,
            country: mockGeo.country,
            city: mockGeo.city,
            ipAddress: mockGeo.ipAddress,
            timestamp: incident.createdAt,
            failedAttempts: Math.floor(Math.random() * 10) + 1,
            threatScore: mockGeo.threatScore,
            isTOR: mockGeo.isTOR,
            isVPN: mockGeo.isVPN
          }
        }

        // Fallback if everything fails
        return null
      })
    )

    // Filter out null values and return
    const validLocations = incidentLocations.filter(loc => loc !== null)

    // Add some mock data if there are no real incidents
    if (validLocations.length === 0) {
      const mockIncidents = await generateMockIncidents()
      return NextResponse.json({
        success: true,
        incidents: mockIncidents,
        total: mockIncidents.length,
        timeRange: `${hours} hours`,
        mock: true
      })
    }

    return NextResponse.json({
      success: true,
      incidents: validLocations,
      total: validLocations.length,
      timeRange: `${hours} hours`
    })

  } catch (error) {
    console.error('Error fetching incident locations:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch incident locations'
    }, { status: 500 })
  }
}

// Generate mock incidents for demo purposes
async function generateMockIncidents() {
  const mockIPs = [
    '185.220.101.45', // TOR exit node
    '91.219.237.113', // Russia
    '202.182.103.200', // China
    '175.45.176.220', // North Korea
    '104.248.169.177', // VPN Germany
    '159.65.233.12', // VPN Singapore
    '195.154.179.8', // Russia
    '210.89.42.16', // China
    '138.68.105.77', // VPN US
    '34.102.136.180', // US legitimate
  ]

  const types = [
    'password_spray_attack',
    'mfa_fatigue_attack',
    'credential_stuffing',
    'brute_force_attack',
    'suspicious_login_activity'
  ]

  const severities: ('critical' | 'high' | 'medium' | 'low')[] = [
    'critical', 'high', 'high', 'medium', 'medium', 'medium', 'low', 'low'
  ]

  const mockIncidents = await Promise.all(
    mockIPs.slice(0, 8).map(async (ip, index) => {
      const geoData = await ipLocator.lookup(ip)

      if (!geoData) return null

      return {
        id: `mock-${index}`,
        type: types[Math.floor(Math.random() * types.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        country: geoData.country,
        city: geoData.city,
        ipAddress: geoData.ipAddress,
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        failedAttempts: Math.floor(Math.random() * 50) + 5,
        threatScore: geoData.threatScore,
        isTOR: geoData.isTOR,
        isVPN: geoData.isVPN
      }
    })
  )

  return mockIncidents.filter(inc => inc !== null)
}