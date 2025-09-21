import { mockLocationData, LocationData } from './location-data'

export interface GeoLocation {
  ipAddress: string
  country: string
  countryCode: string
  city: string
  latitude: number
  longitude: number
  isp: string
  threatScore: number
  isVPN: boolean
  isTOR: boolean
  isProxy: boolean
}

export class IPLocator {
  private static instance: IPLocator
  private ipDatabase: Map<string, GeoLocation> = new Map()

  private constructor() {
    this.initializeMockData()
  }

  static getInstance(): IPLocator {
    if (!IPLocator.instance) {
      IPLocator.instance = new IPLocator()
    }
    return IPLocator.instance
  }

  private initializeMockData() {
    // Initialize with predefined mock IPs for demo purposes
    const mockIPs = this.generateMockIPs()
    mockIPs.forEach(ip => {
      this.ipDatabase.set(ip.ipAddress, ip)
    })
  }

  private generateMockIPs(): GeoLocation[] {
    const locations: GeoLocation[] = []

    // Attack source IPs from various threat actors
    const attackSources = [
      // Eastern Europe / Russia
      { base: '185.220.101', country: 'Netherlands', city: 'Amsterdam', isTOR: true },
      { base: '91.219.237', country: 'Russia', city: 'Moscow', threat: 0.9 },
      { base: '195.154.179', country: 'Russia', city: 'St Petersburg', threat: 0.85 },

      // Asia Pacific threats
      { base: '202.182.103', country: 'China', city: 'Beijing', threat: 0.8 },
      { base: '210.89.42', country: 'China', city: 'Shanghai', threat: 0.75 },
      { base: '175.45.176', country: 'North Korea', city: 'Pyongyang', threat: 0.95 },

      // VPN Exit Nodes
      { base: '104.248.169', country: 'Germany', city: 'Frankfurt', isVPN: true },
      { base: '159.65.233', country: 'Singapore', city: 'Singapore', isVPN: true },
      { base: '138.68.105', country: 'United States', city: 'New York', isVPN: true },

      // Legitimate business IPs
      { base: '34.102.136', country: 'United States', city: 'Mountain View', threat: 0.1 },
      { base: '52.84.228', country: 'United States', city: 'Seattle', threat: 0.05 },
      { base: '35.190.247', country: 'United Kingdom', city: 'London', threat: 0.15 },
    ]

    attackSources.forEach(source => {
      for (let i = 1; i <= 10; i++) {
        const location = this.getLocationByCountryCity(source.country, source.city)
        if (location) {
          locations.push({
            ipAddress: `${source.base}.${i}`,
            country: location.country,
            countryCode: location.countryCode,
            city: location.city,
            latitude: location.latitude + (Math.random() - 0.5) * 0.5,
            longitude: location.longitude + (Math.random() - 0.5) * 0.5,
            isp: this.generateISP(source.country, source.isTOR, source.isVPN),
            threatScore: source.threat || (source.isTOR ? 0.7 : source.isVPN ? 0.4 : 0.2),
            isVPN: source.isVPN || false,
            isTOR: source.isTOR || false,
            isProxy: source.isVPN || source.isTOR || false
          })
        }
      }
    })

    return locations
  }

  private getLocationByCountryCity(country: string, city: string): LocationData | undefined {
    return mockLocationData.find(loc =>
      loc.country === country && loc.city === city
    )
  }

  private generateISP(country: string, isTOR?: boolean, isVPN?: boolean): string {
    if (isTOR) return 'TOR Exit Node'
    if (isVPN) {
      const vpnProviders = ['NordVPN', 'ExpressVPN', 'Surfshark', 'ProtonVPN', 'CyberGhost']
      return vpnProviders[Math.floor(Math.random() * vpnProviders.length)]
    }

    const isps: { [key: string]: string[] } = {
      'Russia': ['Rostelecom', 'MTS', 'Beeline', 'MegaFon'],
      'China': ['China Telecom', 'China Unicom', 'China Mobile'],
      'North Korea': ['Star Joint Venture', 'Koryolink'],
      'United States': ['Comcast', 'AT&T', 'Verizon', 'Spectrum'],
      'Germany': ['Deutsche Telekom', 'Vodafone', '1&1'],
      'Netherlands': ['KPN', 'Ziggo', 'T-Mobile NL'],
      'United Kingdom': ['BT', 'Virgin Media', 'Sky Broadband']
    }

    const countryISPs = isps[country] || ['Unknown ISP']
    return countryISPs[Math.floor(Math.random() * countryISPs.length)]
  }

  async lookup(ipAddress: string): Promise<GeoLocation | null> {
    // Check if we have this IP in our mock database
    let location = this.ipDatabase.get(ipAddress)

    if (!location) {
      // Generate a random location for unknown IPs
      location = this.generateRandomLocation(ipAddress)
      this.ipDatabase.set(ipAddress, location)
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50))

    return location
  }

  private generateRandomLocation(ipAddress: string): GeoLocation {
    const randomLocation = mockLocationData[Math.floor(Math.random() * mockLocationData.length)]

    // Determine threat level based on IP pattern
    let threatScore = 0.3
    const firstOctet = parseInt(ipAddress.split('.')[0])

    if (firstOctet >= 180 && firstOctet <= 220) {
      threatScore = 0.6 + Math.random() * 0.3
    } else if (firstOctet >= 90 && firstOctet <= 95) {
      threatScore = 0.7 + Math.random() * 0.2
    }

    return {
      ipAddress,
      country: randomLocation.country,
      countryCode: randomLocation.countryCode,
      city: randomLocation.city,
      latitude: randomLocation.latitude + (Math.random() - 0.5) * 0.5,
      longitude: randomLocation.longitude + (Math.random() - 0.5) * 0.5,
      isp: this.generateISP(randomLocation.country),
      threatScore,
      isVPN: Math.random() > 0.8,
      isTOR: Math.random() > 0.9,
      isProxy: Math.random() > 0.7
    }
  }

  async lookupBatch(ipAddresses: string[]): Promise<Map<string, GeoLocation>> {
    const results = new Map<string, GeoLocation>()

    await Promise.all(
      ipAddresses.map(async ip => {
        const location = await this.lookup(ip)
        if (location) {
          results.set(ip, location)
        }
      })
    )

    return results
  }

  getThreatScore(location: GeoLocation): number {
    let score = location.threatScore

    // Increase threat score for anonymizing services
    if (location.isTOR) score = Math.min(score + 0.3, 1.0)
    if (location.isVPN) score = Math.min(score + 0.1, 1.0)
    if (location.isProxy) score = Math.min(score + 0.1, 1.0)

    return score
  }
}

export const ipLocator = IPLocator.getInstance()