import { AttackPattern } from './types'

export const attackPatterns: AttackPattern[] = [
  {
    name: 'password_spray',
    displayName: 'Password Spray Attack',
    indicators: {
      failed_logins: (val: number) => val > 10,
      unique_users: (val: number) => val > 5,
      time_window: (val: number) => val < 1800, // 30 minutes
      same_password_pattern: (val: boolean) => val === true,
    },
    confidenceThreshold: 0.75,
    severity: 'high',
    mitreId: 'T1110.003'
  },
  {
    name: 'mfa_fatigue',
    displayName: 'MFA Fatigue Attack',
    indicators: {
      mfa_push_attempts: (val: number) => val > 5,
      single_user: (val: boolean) => val === true,
      time_window: (val: number) => val < 600, // 10 minutes
      accepted_after_fatigue: (val: boolean) => val === true,
    },
    confidenceThreshold: 0.80,
    severity: 'high',
    mitreId: 'T1621'
  },
  {
    name: 'suspicious_travel',
    displayName: 'Suspicious Travel Activity',
    indicators: {
      impossible_travel: (val: boolean) => val === true,
      distance_km: (val: number) => val > 500,
      time_between_logins: (val: number) => val < 3600, // 1 hour
      vpn_detected: (val: boolean) => val === false,
    },
    confidenceThreshold: 0.70,
    severity: 'medium',
    mitreId: 'T1078'
  },
  {
    name: 'false_positive_travel',
    displayName: 'False Positive - Legitimate Travel',
    indicators: {
      impossible_travel: (val: boolean) => val === true,
      vpn_detected: (val: boolean) => val === true,
      user_confirmed: (val: boolean) => val === true,
    },
    confidenceThreshold: 0.60,
    severity: 'low',
    mitreId: null
  },
  {
    name: 'credential_stuffing',
    displayName: 'Credential Stuffing Attack',
    indicators: {
      failed_logins: (val: number) => val > 20,
      unique_ips: (val: number) => val > 10,
      known_breach_passwords: (val: boolean) => val === true,
      distributed_attempts: (val: boolean) => val === true,
    },
    confidenceThreshold: 0.85,
    severity: 'critical',
    mitreId: 'T1110.004'
  }
]