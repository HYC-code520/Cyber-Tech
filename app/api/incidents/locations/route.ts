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

    // Always generate consistent mock incidents based on time range
    let allMockIncidents = await generateMockIncidents(hours)

    // Apply severity filter to mock incidents if specified
    if (severity && severity !== 'all') {
      allMockIncidents = allMockIncidents.filter(inc => inc.severity === severity)
    }

    // Combine real incidents with mock incidents
    // For "all" severity, show all available incidents. For specific severities, show filtered incidents
    const combinedIncidents = validLocations.length > 0
      ? [...validLocations, ...allMockIncidents]
      : allMockIncidents

    return NextResponse.json({
      success: true,
      incidents: combinedIncidents,
      total: combinedIncidents.length,
      timeRange: `${hours} hours`,
      mock: validLocations.length === 0
    })

  } catch (error) {
    console.error('Error fetching incident locations:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch incident locations'
    }, { status: 500 })
  }
}

// Generate mock incidents for demo purposes - consistent based on time
async function generateMockIncidents(hours: number = 24) {
  // Define incidents with specific timestamps
  const incidentDefinitions = [
    // Most recent incidents (last hour) - 6 incidents
    { ip: '185.220.101.45', hoursAgo: 0.2, severity: 'critical', type: 'password_spray_attack' },
    { ip: '91.219.237.113', hoursAgo: 0.3, severity: 'high', type: 'brute_force_attack' },
    { ip: '202.182.103.200', hoursAgo: 0.5, severity: 'high', type: 'credential_stuffing' },
    { ip: '175.45.176.220', hoursAgo: 0.6, severity: 'critical', type: 'suspicious_login_activity' },
    { ip: '89.185.45.234', hoursAgo: 0.8, severity: 'medium', type: 'mfa_fatigue_attack' },
    { ip: '162.243.175.89', hoursAgo: 0.9, severity: 'high', type: 'password_spray_attack' },

    // 1-6 hours ago - 8 more incidents
    { ip: '104.248.169.177', hoursAgo: 1.5, severity: 'medium', type: 'mfa_fatigue_attack' },
    { ip: '159.65.233.12', hoursAgo: 2.1, severity: 'high', type: 'suspicious_login_activity' },
    { ip: '195.154.179.8', hoursAgo: 2.8, severity: 'critical', type: 'password_spray_attack' },
    { ip: '210.89.42.16', hoursAgo: 3.2, severity: 'medium', type: 'credential_stuffing' },
    { ip: '46.101.127.145', hoursAgo: 3.7, severity: 'high', type: 'brute_force_attack' },
    { ip: '178.62.195.209', hoursAgo: 4.3, severity: 'low', type: 'suspicious_login_activity' },
    { ip: '167.99.234.110', hoursAgo: 4.9, severity: 'medium', type: 'mfa_fatigue_attack' },
    { ip: '134.209.82.15', hoursAgo: 5.6, severity: 'high', type: 'credential_stuffing' },

    // 6-24 hours ago - 10 more incidents
    { ip: '138.68.105.77', hoursAgo: 7.1, severity: 'high', type: 'brute_force_attack' },
    { ip: '34.102.136.180', hoursAgo: 8.5, severity: 'medium', type: 'suspicious_login_activity' },
    { ip: '45.142.120.88', hoursAgo: 10.2, severity: 'critical', type: 'password_spray_attack' },
    { ip: '103.214.110.77', hoursAgo: 12.1, severity: 'high', type: 'credential_stuffing' },
    { ip: '192.241.218.92', hoursAgo: 14.3, severity: 'medium', type: 'brute_force_attack' },
    { ip: '165.227.103.49', hoursAgo: 16.7, severity: 'low', type: 'suspicious_login_activity' },
    { ip: '157.230.218.102', hoursAgo: 18.2, severity: 'high', type: 'mfa_fatigue_attack' },
    { ip: '142.93.179.112', hoursAgo: 19.8, severity: 'critical', type: 'password_spray_attack' },
    { ip: '68.183.92.208', hoursAgo: 21.4, severity: 'medium', type: 'credential_stuffing' },
    { ip: '161.35.229.105', hoursAgo: 23.1, severity: 'high', type: 'brute_force_attack' },

    // Beyond 24 hours - 4 more incidents
    { ip: '41.210.145.200', hoursAgo: 26.5, severity: 'low', type: 'suspicious_login_activity' },
    { ip: '177.234.145.90', hoursAgo: 30.2, severity: 'medium', type: 'mfa_fatigue_attack' },
    { ip: '203.189.234.77', hoursAgo: 36.8, severity: 'high', type: 'password_spray_attack' },
    { ip: '117.213.89.243', hoursAgo: 42.3, severity: 'critical', type: 'credential_stuffing' },
  ]

  // Filter incidents based on the time range requested
  const relevantIncidents = incidentDefinitions.filter(def => def.hoursAgo <= hours)

  const mockIncidents = await Promise.all(
    relevantIncidents.map(async (def, index) => {
      const geoData = await ipLocator.lookup(def.ip)

      if (!geoData) return null

      return {
        id: `mock-${def.ip}-${def.hoursAgo}`,
        type: def.type,
        severity: def.severity as 'critical' | 'high' | 'medium' | 'low',
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        country: geoData.country,
        city: geoData.city,
        ipAddress: geoData.ipAddress,
        timestamp: new Date(Date.now() - def.hoursAgo * 60 * 60 * 1000),
        failedAttempts: Math.floor(Math.random() * 30) + 10,
        threatScore: geoData.threatScore,
        isTOR: geoData.isTOR,
        isVPN: geoData.isVPN
      }
    })
  )

  return mockIncidents.filter(inc => inc !== null)
}