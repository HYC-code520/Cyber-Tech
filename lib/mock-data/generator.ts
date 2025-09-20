interface GeneratorOptions {
  count: number
  timeRange?: number // days back from now
  severityDistribution?: {
    low: number // percentage
    medium: number
    high: number
    critical: number
  }
}

const attackTypes = [
  'password_spray',
  'mfa_fatigue',
  'suspicious_travel',
  'false_positive_travel',
  'credential_stuffing',
  'geo_based_anomaly',
  'device_anomaly',
  'unusual_time_login',
  'account_takeover',
  'privilege_escalation',
  'data_exfiltration',
  'session_hijacking',
  'api_abuse',
  'insider_threat',
  'supply_chain_attack'
]

const countries = [
  { name: 'United States', code: 'US', risk: 'low' },
  { name: 'Canada', code: 'CA', risk: 'low' },
  { name: 'United Kingdom', code: 'GB', risk: 'low' },
  { name: 'Germany', code: 'DE', risk: 'low' },
  { name: 'France', code: 'FR', risk: 'low' },
  { name: 'Japan', code: 'JP', risk: 'low' },
  { name: 'Australia', code: 'AU', risk: 'low' },
  { name: 'China', code: 'CN', risk: 'high' },
  { name: 'Russia', code: 'RU', risk: 'high' },
  { name: 'Iran', code: 'IR', risk: 'high' },
  { name: 'North Korea', code: 'KP', risk: 'sanctioned' },
  { name: 'Brazil', code: 'BR', risk: 'medium' },
  { name: 'India', code: 'IN', risk: 'medium' },
  { name: 'Nigeria', code: 'NG', risk: 'medium' },
  { name: 'Romania', code: 'RO', risk: 'medium' },
  { name: 'Ukraine', code: 'UA', risk: 'medium' },
  { name: 'Netherlands', code: 'NL', risk: 'low' },
  { name: 'Singapore', code: 'SG', risk: 'low' },
  { name: 'South Korea', code: 'KR', risk: 'low' },
  { name: 'Mexico', code: 'MX', risk: 'medium' }
]

const usernames = [
  'john.doe', 'jane.smith', 'mike.johnson', 'sarah.williams', 'robert.jones',
  'emily.brown', 'david.davis', 'lisa.miller', 'james.wilson', 'mary.moore',
  'michael.taylor', 'patricia.anderson', 'richard.thomas', 'linda.jackson',
  'william.white', 'barbara.harris', 'joseph.martin', 'susan.thompson',
  'thomas.garcia', 'jessica.martinez', 'charles.robinson', 'karen.clark',
  'christopher.rodriguez', 'nancy.lewis', 'daniel.lee', 'betty.walker',
  'matthew.hall', 'helen.allen', 'anthony.young', 'donna.hernandez',
  'mark.king', 'sandra.wright', 'paul.lopez', 'carol.hill', 'steven.scott',
  'ashley.green', 'andrew.adams', 'michelle.baker', 'joshua.gonzalez',
  'kenneth.nelson', 'kevin.carter', 'brian.mitchell', 'george.perez',
  'edward.roberts', 'ronald.turner', 'timothy.phillips', 'jason.campbell',
  'jeffrey.parker', 'ryan.evans', 'jacob.edwards', 'gary.collins'
]

const departments = [
  'IT', 'Finance', 'HR', 'Sales', 'Marketing', 'Engineering',
  'Operations', 'Legal', 'Customer Service', 'R&D', 'Executive',
  'Security', 'Product', 'Supply Chain', 'Manufacturing'
]

const devices = [
  { type: 'Windows PC', trust: 80 },
  { type: 'MacBook Pro', trust: 85 },
  { type: 'iPhone', trust: 75 },
  { type: 'Android', trust: 60 },
  { type: 'iPad', trust: 70 },
  { type: 'Linux Workstation', trust: 65 },
  { type: 'Unknown Device', trust: 20 },
  { type: 'Jailbroken iPhone', trust: 10 },
  { type: 'Rooted Android', trust: 15 },
  { type: 'Public Terminal', trust: 5 }
]

const generateIP = () => {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
}

const generateTimestamp = (hoursAgo: number) => {
  const now = new Date()
  now.setHours(now.getHours() - hoursAgo)
  return now.toISOString()
}

const generateIndicators = (type: string) => {
  const indicators = []

  switch(type) {
    case 'password_spray':
      indicators.push(
        {
          type: 'failed_logins',
          value: Math.floor(Math.random() * 50) + 20,
          confidence: 0.7 + Math.random() * 0.3,
          description: 'Multiple failed login attempts detected'
        },
        {
          type: 'unique_users',
          value: Math.floor(Math.random() * 20) + 5,
          confidence: 0.6 + Math.random() * 0.4,
          description: 'Multiple user accounts targeted'
        },
        {
          type: 'time_window',
          value: Math.floor(Math.random() * 1800) + 600,
          confidence: 0.7 + Math.random() * 0.3,
          description: 'Attack duration in seconds'
        },
        {
          type: 'same_password_pattern',
          value: true,
          confidence: 0.8 + Math.random() * 0.2,
          description: 'Common passwords detected'
        }
      )
      break

    case 'mfa_fatigue':
      indicators.push(
        {
          type: 'mfa_push_attempts',
          value: Math.floor(Math.random() * 30) + 10,
          confidence: 0.8 + Math.random() * 0.2,
          description: 'Rapid MFA push notifications'
        },
        {
          type: 'single_user',
          value: true,
          confidence: 0.95,
          description: 'Single user targeted'
        },
        {
          type: 'time_window',
          value: Math.floor(Math.random() * 600) + 300,
          confidence: 0.85 + Math.random() * 0.15,
          description: 'Attack duration'
        },
        {
          type: 'accepted_after_fatigue',
          value: Math.random() > 0.3,
          confidence: 0.7 + Math.random() * 0.3,
          description: 'User eventually accepted MFA'
        }
      )
      break

    case 'geo_based_anomaly':
      const country = countries[Math.floor(Math.random() * countries.length)]
      indicators.push(
        {
          type: 'login_from_sanctioned_country',
          value: country.risk === 'sanctioned',
          confidence: 0.9 + Math.random() * 0.1,
          description: `Login from ${country.name}`
        },
        {
          type: 'high_risk_country',
          value: country.risk === 'high',
          confidence: 0.85 + Math.random() * 0.15,
          description: 'High-risk geographic location'
        },
        {
          type: 'distance_from_usual_location',
          value: Math.floor(Math.random() * 10000) + 1000,
          confidence: 0.8 + Math.random() * 0.2,
          description: 'Distance in kilometers'
        },
        {
          type: 'vpn_or_proxy_detected',
          value: Math.random() > 0.4,
          confidence: 0.7 + Math.random() * 0.3,
          description: 'VPN/Proxy usage detected'
        }
      )
      break

    case 'device_anomaly':
      const device = devices[Math.floor(Math.random() * devices.length)]
      indicators.push(
        {
          type: 'new_device',
          value: true,
          confidence: 0.9 + Math.random() * 0.1,
          description: `New ${device.type} detected`
        },
        {
          type: 'device_trust_score',
          value: device.trust + Math.floor(Math.random() * 20) - 10,
          confidence: 0.75 + Math.random() * 0.25,
          description: 'Device trust score'
        },
        {
          type: 'multiple_devices_same_time',
          value: Math.random() > 0.7,
          confidence: 0.8 + Math.random() * 0.2,
          description: 'Multiple concurrent device sessions'
        },
        {
          type: 'jailbroken_device',
          value: device.trust < 20,
          confidence: 0.85 + Math.random() * 0.15,
          description: 'Device security compromised'
        }
      )
      break

    case 'unusual_time_login':
      const hour = Math.floor(Math.random() * 24)
      indicators.push(
        {
          type: 'outside_business_hours',
          value: hour < 6 || hour > 20,
          confidence: 0.7 + Math.random() * 0.3,
          description: `Login at ${hour}:00`
        },
        {
          type: 'login_time_deviation',
          value: Math.floor(Math.random() * 8) + 1,
          confidence: 0.65 + Math.random() * 0.35,
          description: 'Hours from normal pattern'
        },
        {
          type: 'weekend_access',
          value: Math.random() > 0.5,
          confidence: 0.8 + Math.random() * 0.2,
          description: 'Weekend access detected'
        },
        {
          type: 'holiday_access',
          value: Math.random() > 0.8,
          confidence: 0.75 + Math.random() * 0.25,
          description: 'Holiday period access'
        }
      )
      break

    case 'account_takeover':
      indicators.push(
        {
          type: 'password_recently_changed',
          value: true,
          confidence: 0.85 + Math.random() * 0.15,
          description: 'Password changed in last hour'
        },
        {
          type: 'email_forwarding_added',
          value: Math.random() > 0.3,
          confidence: 0.8 + Math.random() * 0.2,
          description: 'Email rules modified'
        },
        {
          type: 'mfa_method_changed',
          value: Math.random() > 0.4,
          confidence: 0.9 + Math.random() * 0.1,
          description: 'MFA settings altered'
        },
        {
          type: 'suspicious_oauth_grant',
          value: Math.random() > 0.5,
          confidence: 0.75 + Math.random() * 0.25,
          description: 'New OAuth application authorized'
        }
      )
      break

    case 'data_exfiltration':
      indicators.push(
        {
          type: 'large_download_volume',
          value: Math.floor(Math.random() * 5000) + 1000,
          confidence: 0.8 + Math.random() * 0.2,
          description: 'Data volume in MB'
        },
        {
          type: 'unusual_file_access_pattern',
          value: true,
          confidence: 0.75 + Math.random() * 0.25,
          description: 'Accessing sensitive files'
        },
        {
          type: 'external_share_created',
          value: Math.random() > 0.4,
          confidence: 0.85 + Math.random() * 0.15,
          description: 'External sharing enabled'
        },
        {
          type: 'cloud_sync_spike',
          value: Math.random() > 0.3,
          confidence: 0.7 + Math.random() * 0.3,
          description: 'Unusual cloud sync activity'
        }
      )
      break

    case 'api_abuse':
      indicators.push(
        {
          type: 'api_calls_per_minute',
          value: Math.floor(Math.random() * 500) + 100,
          confidence: 0.85 + Math.random() * 0.15,
          description: 'API request rate'
        },
        {
          type: 'rate_limit_violations',
          value: Math.floor(Math.random() * 20) + 1,
          confidence: 0.8 + Math.random() * 0.2,
          description: 'Rate limit breaches'
        },
        {
          type: 'unauthorized_api_access',
          value: Math.random() > 0.5,
          confidence: 0.75 + Math.random() * 0.25,
          description: 'Unauthorized endpoint access'
        },
        {
          type: 'api_key_compromise',
          value: Math.random() > 0.7,
          confidence: 0.7 + Math.random() * 0.3,
          description: 'API key potentially compromised'
        }
      )
      break

    default:
      // Generic indicators for other attack types
      indicators.push(
        {
          type: 'anomaly_score',
          value: Math.random() * 100,
          confidence: 0.6 + Math.random() * 0.4,
          description: 'General anomaly detection score'
        },
        {
          type: 'suspicious_activity',
          value: true,
          confidence: 0.7 + Math.random() * 0.3,
          description: 'Suspicious behavior detected'
        }
      )
  }

  return indicators
}

const generateTimeline = (type: string, timestamp: string) => {
  const baseTime = new Date(timestamp)
  const timeline = []

  const addMinutes = (minutes: number) => {
    const newTime = new Date(baseTime)
    newTime.setMinutes(newTime.getMinutes() + minutes)
    return newTime.toLocaleTimeString()
  }

  switch(type) {
    case 'password_spray':
      timeline.push(
        `${addMinutes(0)} - Initial failed login detected`,
        `${addMinutes(2)} - Pattern of failures identified`,
        `${addMinutes(5)} - Common passwords confirmed`,
        `${addMinutes(10)} - Attack intensity peaked`,
        `${addMinutes(15)} - Attack ceased`
      )
      break

    case 'mfa_fatigue':
      timeline.push(
        `${addMinutes(0)} - First MFA push`,
        `${addMinutes(1)} - Rapid pushes begin`,
        `${addMinutes(3)} - User reports issue`,
        `${addMinutes(5)} - Attack escalates`,
        `${addMinutes(7)} - MFA accepted or blocked`
      )
      break

    default:
      timeline.push(
        `${addMinutes(0)} - Anomaly detected`,
        `${addMinutes(5)} - Alert triggered`,
        `${addMinutes(10)} - Investigation started`
      )
  }

  return timeline
}

export const generateBulkIncidents = (options: GeneratorOptions) => {
  const {
    count,
    timeRange = 30,
    severityDistribution = {
      low: 60,
      medium: 25,
      high: 10,
      critical: 5
    }
  } = options

  const incidents = []
  const hoursInRange = timeRange * 24

  // Calculate severity counts
  const severityCounts = {
    low: Math.floor(count * severityDistribution.low / 100),
    medium: Math.floor(count * severityDistribution.medium / 100),
    high: Math.floor(count * severityDistribution.high / 100),
    critical: Math.floor(count * severityDistribution.critical / 100)
  }

  // Ensure we generate exactly the requested count
  const totalCalculated = Object.values(severityCounts).reduce((a, b) => a + b, 0)
  if (totalCalculated < count) {
    severityCounts.low += count - totalCalculated
  }

  // Generate incidents for each severity
  Object.entries(severityCounts).forEach(([severity, severityCount]) => {
    for (let i = 0; i < severityCount; i++) {
      const attackType = attackTypes[Math.floor(Math.random() * attackTypes.length)]
      const username = usernames[Math.floor(Math.random() * usernames.length)]
      const department = departments[Math.floor(Math.random() * departments.length)]
      const hoursAgo = Math.random() * hoursInRange
      const timestamp = generateTimestamp(hoursAgo)

      const incident = {
        id: `bulk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `${attackType.replace(/_/g, ' ').toUpperCase()} - ${username}@company.com`,
        description: `${severity.toUpperCase()} severity ${attackType.replace(/_/g, ' ')} detected for ${username} in ${department}`,
        type: attackType,
        severity,
        username: `${username}@company.com`,
        department,
        sourceIp: generateIP(),
        timestamp,
        indicators: generateIndicators(attackType),
        timeline: generateTimeline(attackType, timestamp),
        metadata: {
          userPrivilegeLevel: Math.random() > 0.8 ? 'admin' : 'user',
          assetCriticality: Math.floor(Math.random() * 10) + 1,
          previousIncidents: Math.floor(Math.random() * 5),
          complianceImpact: Math.random() > 0.7 ? ['GDPR', 'HIPAA', 'SOC2'][Math.floor(Math.random() * 3)] : null,
          businessUnit: department,
          riskScore: Math.floor(Math.random() * 100)
        }
      }

      incidents.push(incident)
    }
  })

  // Sort by timestamp (most recent first)
  incidents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return incidents
}

// Generate attack campaign (coordinated incidents)
export const generateAttackCampaign = (type: string, targetCount: number = 10) => {
  const campaignId = `campaign-${Date.now()}`
  const startTime = generateTimestamp(Math.random() * 24)
  const incidents = []

  for (let i = 0; i < targetCount; i++) {
    const username = usernames[Math.floor(Math.random() * usernames.length)]
    const incident = {
      id: `${campaignId}-${i}`,
      name: `${type.replace(/_/g, ' ').toUpperCase()} - Campaign Target ${i + 1}`,
      description: `Part of coordinated campaign ${campaignId}`,
      type,
      severity: 'critical',
      username: `${username}@company.com`,
      campaignId,
      sourceIp: generateIP(),
      timestamp: new Date(new Date(startTime).getTime() + i * 60000).toISOString(), // 1 minute apart
      indicators: generateIndicators(type),
      timeline: generateTimeline(type, startTime),
      metadata: {
        campaignTarget: i + 1,
        totalTargets: targetCount,
        attackVector: type,
        threatActor: 'APT-' + Math.floor(Math.random() * 40),
        ttps: ['T1110', 'T1078', 'T1539'][Math.floor(Math.random() * 3)]
      }
    }
    incidents.push(incident)
  }

  return incidents
}

// Generate specific overload scenarios
export const generateOverloadScenarios = () => {
  return {
    flashFlood: () => {
      // 200 incidents in 10 minutes
      return generateBulkIncidents({
        count: 200,
        timeRange: 0.007, // ~10 minutes
        severityDistribution: { low: 30, medium: 40, high: 25, critical: 5 }
      })
    },

    slowBurn: () => {
      // Steady 50/hour for 16 hours
      return generateBulkIncidents({
        count: 800,
        timeRange: 0.67, // 16 hours
        severityDistribution: { low: 70, medium: 20, high: 8, critical: 2 }
      })
    },

    waveAttack: () => {
      // Bursts every 2 hours
      const waves = []
      for (let i = 0; i < 8; i++) {
        const waveIncidents = generateBulkIncidents({
          count: 100,
          timeRange: 0.08, // 2 hours
          severityDistribution: { low: 50, medium: 30, high: 15, critical: 5 }
        })
        waves.push(...waveIncidents)
      }
      return waves
    },

    noiseCampaign: () => {
      // 500 false positives hiding 10 real threats
      const falsePositives = generateBulkIncidents({
        count: 500,
        timeRange: 1,
        severityDistribution: { low: 90, medium: 10, high: 0, critical: 0 }
      })

      const realThreats = generateAttackCampaign('account_takeover', 10)

      return [...falsePositives, ...realThreats].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    },

    multiVector: () => {
      // Simultaneous different attack types
      const vectors = ['password_spray', 'mfa_fatigue', 'data_exfiltration', 'privilege_escalation']
      const incidents = []

      vectors.forEach(vector => {
        incidents.push(...generateAttackCampaign(vector, 25))
      })

      return incidents.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    }
  }
}