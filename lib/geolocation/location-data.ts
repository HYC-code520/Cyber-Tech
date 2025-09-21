export interface LocationData {
  country: string
  countryCode: string
  city: string
  latitude: number
  longitude: number
  region?: string
  timezone?: string
}

export const mockLocationData: LocationData[] = [
  // North America
  { country: 'United States', countryCode: 'US', city: 'New York', latitude: 40.7128, longitude: -74.0060, region: 'North America' },
  { country: 'United States', countryCode: 'US', city: 'Los Angeles', latitude: 34.0522, longitude: -118.2437, region: 'North America' },
  { country: 'United States', countryCode: 'US', city: 'Chicago', latitude: 41.8781, longitude: -87.6298, region: 'North America' },
  { country: 'United States', countryCode: 'US', city: 'Houston', latitude: 29.7604, longitude: -95.3698, region: 'North America' },
  { country: 'United States', countryCode: 'US', city: 'Seattle', latitude: 47.6062, longitude: -122.3321, region: 'North America' },
  { country: 'United States', countryCode: 'US', city: 'San Francisco', latitude: 37.7749, longitude: -122.4194, region: 'North America' },
  { country: 'United States', countryCode: 'US', city: 'Mountain View', latitude: 37.3861, longitude: -122.0839, region: 'North America' },
  { country: 'United States', countryCode: 'US', city: 'Miami', latitude: 25.7617, longitude: -80.1918, region: 'North America' },
  { country: 'United States', countryCode: 'US', city: 'Boston', latitude: 42.3601, longitude: -71.0589, region: 'North America' },
  { country: 'United States', countryCode: 'US', city: 'Washington', latitude: 38.9072, longitude: -77.0369, region: 'North America' },
  { country: 'Canada', countryCode: 'CA', city: 'Toronto', latitude: 43.6532, longitude: -79.3832, region: 'North America' },
  { country: 'Canada', countryCode: 'CA', city: 'Vancouver', latitude: 49.2827, longitude: -123.1207, region: 'North America' },
  { country: 'Canada', countryCode: 'CA', city: 'Montreal', latitude: 45.5017, longitude: -73.5673, region: 'North America' },
  { country: 'Mexico', countryCode: 'MX', city: 'Mexico City', latitude: 19.4326, longitude: -99.1332, region: 'North America' },

  // Europe
  { country: 'United Kingdom', countryCode: 'GB', city: 'London', latitude: 51.5074, longitude: -0.1278, region: 'Europe' },
  { country: 'United Kingdom', countryCode: 'GB', city: 'Manchester', latitude: 53.4808, longitude: -2.2426, region: 'Europe' },
  { country: 'Germany', countryCode: 'DE', city: 'Berlin', latitude: 52.5200, longitude: 13.4050, region: 'Europe' },
  { country: 'Germany', countryCode: 'DE', city: 'Frankfurt', latitude: 50.1109, longitude: 8.6821, region: 'Europe' },
  { country: 'Germany', countryCode: 'DE', city: 'Munich', latitude: 48.1351, longitude: 11.5820, region: 'Europe' },
  { country: 'France', countryCode: 'FR', city: 'Paris', latitude: 48.8566, longitude: 2.3522, region: 'Europe' },
  { country: 'Netherlands', countryCode: 'NL', city: 'Amsterdam', latitude: 52.3676, longitude: 4.9041, region: 'Europe' },
  { country: 'Belgium', countryCode: 'BE', city: 'Brussels', latitude: 50.8503, longitude: 4.3517, region: 'Europe' },
  { country: 'Switzerland', countryCode: 'CH', city: 'Zurich', latitude: 47.3769, longitude: 8.5417, region: 'Europe' },
  { country: 'Italy', countryCode: 'IT', city: 'Rome', latitude: 41.9028, longitude: 12.4964, region: 'Europe' },
  { country: 'Spain', countryCode: 'ES', city: 'Madrid', latitude: 40.4168, longitude: -3.7038, region: 'Europe' },
  { country: 'Poland', countryCode: 'PL', city: 'Warsaw', latitude: 52.2297, longitude: 21.0122, region: 'Europe' },
  { country: 'Sweden', countryCode: 'SE', city: 'Stockholm', latitude: 59.3293, longitude: 18.0686, region: 'Europe' },
  { country: 'Norway', countryCode: 'NO', city: 'Oslo', latitude: 59.9139, longitude: 10.7522, region: 'Europe' },

  // Eastern Europe / Russia
  { country: 'Russia', countryCode: 'RU', city: 'Moscow', latitude: 55.7558, longitude: 37.6173, region: 'Eastern Europe' },
  { country: 'Russia', countryCode: 'RU', city: 'St Petersburg', latitude: 59.9311, longitude: 30.3609, region: 'Eastern Europe' },
  { country: 'Russia', countryCode: 'RU', city: 'Novosibirsk', latitude: 55.0084, longitude: 82.9357, region: 'Eastern Europe' },
  { country: 'Ukraine', countryCode: 'UA', city: 'Kyiv', latitude: 50.4501, longitude: 30.5234, region: 'Eastern Europe' },
  { country: 'Romania', countryCode: 'RO', city: 'Bucharest', latitude: 44.4268, longitude: 26.1025, region: 'Eastern Europe' },

  // Asia Pacific
  { country: 'China', countryCode: 'CN', city: 'Beijing', latitude: 39.9042, longitude: 116.4074, region: 'Asia' },
  { country: 'China', countryCode: 'CN', city: 'Shanghai', latitude: 31.2304, longitude: 121.4737, region: 'Asia' },
  { country: 'China', countryCode: 'CN', city: 'Shenzhen', latitude: 22.5431, longitude: 114.0579, region: 'Asia' },
  { country: 'China', countryCode: 'CN', city: 'Guangzhou', latitude: 23.1291, longitude: 113.2644, region: 'Asia' },
  { country: 'Japan', countryCode: 'JP', city: 'Tokyo', latitude: 35.6762, longitude: 139.6503, region: 'Asia' },
  { country: 'Japan', countryCode: 'JP', city: 'Osaka', latitude: 34.6937, longitude: 135.5023, region: 'Asia' },
  { country: 'South Korea', countryCode: 'KR', city: 'Seoul', latitude: 37.5665, longitude: 126.9780, region: 'Asia' },
  { country: 'North Korea', countryCode: 'KP', city: 'Pyongyang', latitude: 39.0392, longitude: 125.7625, region: 'Asia' },
  { country: 'India', countryCode: 'IN', city: 'Mumbai', latitude: 19.0760, longitude: 72.8777, region: 'Asia' },
  { country: 'India', countryCode: 'IN', city: 'Delhi', latitude: 28.7041, longitude: 77.1025, region: 'Asia' },
  { country: 'India', countryCode: 'IN', city: 'Bangalore', latitude: 12.9716, longitude: 77.5946, region: 'Asia' },
  { country: 'Singapore', countryCode: 'SG', city: 'Singapore', latitude: 1.3521, longitude: 103.8198, region: 'Asia' },
  { country: 'Hong Kong', countryCode: 'HK', city: 'Hong Kong', latitude: 22.3193, longitude: 114.1694, region: 'Asia' },
  { country: 'Taiwan', countryCode: 'TW', city: 'Taipei', latitude: 25.0330, longitude: 121.5654, region: 'Asia' },
  { country: 'Thailand', countryCode: 'TH', city: 'Bangkok', latitude: 13.7563, longitude: 100.5018, region: 'Asia' },
  { country: 'Vietnam', countryCode: 'VN', city: 'Ho Chi Minh City', latitude: 10.8231, longitude: 106.6297, region: 'Asia' },
  { country: 'Philippines', countryCode: 'PH', city: 'Manila', latitude: 14.5995, longitude: 120.9842, region: 'Asia' },
  { country: 'Indonesia', countryCode: 'ID', city: 'Jakarta', latitude: -6.2088, longitude: 106.8456, region: 'Asia' },
  { country: 'Malaysia', countryCode: 'MY', city: 'Kuala Lumpur', latitude: 3.1390, longitude: 101.6869, region: 'Asia' },

  // Middle East
  { country: 'Iran', countryCode: 'IR', city: 'Tehran', latitude: 35.6892, longitude: 51.3890, region: 'Middle East' },
  { country: 'Israel', countryCode: 'IL', city: 'Tel Aviv', latitude: 32.0853, longitude: 34.7818, region: 'Middle East' },
  { country: 'Turkey', countryCode: 'TR', city: 'Istanbul', latitude: 41.0082, longitude: 28.9784, region: 'Middle East' },
  { country: 'United Arab Emirates', countryCode: 'AE', city: 'Dubai', latitude: 25.2048, longitude: 55.2708, region: 'Middle East' },
  { country: 'Saudi Arabia', countryCode: 'SA', city: 'Riyadh', latitude: 24.7136, longitude: 46.6753, region: 'Middle East' },

  // Oceania
  { country: 'Australia', countryCode: 'AU', city: 'Sydney', latitude: -33.8688, longitude: 151.2093, region: 'Oceania' },
  { country: 'Australia', countryCode: 'AU', city: 'Melbourne', latitude: -37.8136, longitude: 144.9631, region: 'Oceania' },
  { country: 'New Zealand', countryCode: 'NZ', city: 'Auckland', latitude: -36.8485, longitude: 174.7633, region: 'Oceania' },

  // South America
  { country: 'Brazil', countryCode: 'BR', city: 'São Paulo', latitude: -23.5505, longitude: -46.6333, region: 'South America' },
  { country: 'Brazil', countryCode: 'BR', city: 'Rio de Janeiro', latitude: -22.9068, longitude: -43.1729, region: 'South America' },
  { country: 'Argentina', countryCode: 'AR', city: 'Buenos Aires', latitude: -34.6037, longitude: -58.3816, region: 'South America' },
  { country: 'Chile', countryCode: 'CL', city: 'Santiago', latitude: -33.4489, longitude: -70.6693, region: 'South America' },
  { country: 'Colombia', countryCode: 'CO', city: 'Bogotá', latitude: 4.7110, longitude: -74.0721, region: 'South America' },

  // Africa
  { country: 'South Africa', countryCode: 'ZA', city: 'Johannesburg', latitude: -26.2041, longitude: 28.0473, region: 'Africa' },
  { country: 'Egypt', countryCode: 'EG', city: 'Cairo', latitude: 30.0444, longitude: 31.2357, region: 'Africa' },
  { country: 'Nigeria', countryCode: 'NG', city: 'Lagos', latitude: 6.5244, longitude: 3.3792, region: 'Africa' },
  { country: 'Kenya', countryCode: 'KE', city: 'Nairobi', latitude: -1.2921, longitude: 36.8219, region: 'Africa' },
]

// Helper function to get random locations for demo purposes
export function getRandomLocation(): LocationData {
  return mockLocationData[Math.floor(Math.random() * mockLocationData.length)]
}

// Helper function to get location by country
export function getLocationsByCountry(country: string): LocationData[] {
  return mockLocationData.filter(loc => loc.country === country)
}

// Helper function to get location by region
export function getLocationsByRegion(region: string): LocationData[] {
  return mockLocationData.filter(loc => loc.region === region)
}