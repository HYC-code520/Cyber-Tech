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
  },
  {
    name: 'geo_based_anomaly',
    displayName: 'Geographic Login Anomaly',
    indicators: {
      login_from_sanctioned_country: (val: boolean) => val === true,
      high_risk_country: (val: boolean) => val === true,
      distance_from_usual_location: (val: number) => val > 5000,
      vpn_or_proxy_detected: (val: boolean) => val === true,
    },
    confidenceThreshold: 0.75,
    severity: 'high',
    mitreId: 'T1078.004'
  },
  {
    name: 'device_anomaly',
    displayName: 'Unrecognized Device Login',
    indicators: {
      new_device: (val: boolean) => val === true,
      device_trust_score: (val: number) => val < 30,
      multiple_devices_same_time: (val: boolean) => val === true,
      jailbroken_device: (val: boolean) => val === true,
    },
    confidenceThreshold: 0.70,
    severity: 'medium',
    mitreId: 'T1078.001'
  },
  {
    name: 'unusual_time_login',
    displayName: 'Unusual Time Access Pattern',
    indicators: {
      outside_business_hours: (val: boolean) => val === true,
      login_time_deviation: (val: number) => val > 4, // hours from normal
      weekend_access: (val: boolean) => val === true,
      holiday_access: (val: boolean) => val === true,
    },
    confidenceThreshold: 0.65,
    severity: 'medium',
    mitreId: 'T1078'
  },
  {
    name: 'account_takeover',
    displayName: 'Account Takeover Attempt',
    indicators: {
      password_recently_changed: (val: boolean) => val === true,
      email_forwarding_added: (val: boolean) => val === true,
      mfa_method_changed: (val: boolean) => val === true,
      suspicious_oauth_grant: (val: boolean) => val === true,
    },
    confidenceThreshold: 0.80,
    severity: 'critical',
    mitreId: 'T1098'
  },
  {
    name: 'privilege_escalation',
    displayName: 'Privilege Escalation Attempt',
    indicators: {
      admin_access_attempt: (val: boolean) => val === true,
      role_modification_attempt: (val: boolean) => val === true,
      unauthorized_group_join: (val: boolean) => val === true,
      service_account_usage: (val: boolean) => val === true,
    },
    confidenceThreshold: 0.75,
    severity: 'high',
    mitreId: 'T1078.003'
  },
  {
    name: 'data_exfiltration',
    displayName: 'Data Exfiltration Pattern',
    indicators: {
      large_download_volume: (val: number) => val > 1000, // MB
      unusual_file_access_pattern: (val: boolean) => val === true,
      external_share_created: (val: boolean) => val === true,
      cloud_sync_spike: (val: boolean) => val === true,
    },
    confidenceThreshold: 0.70,
    severity: 'critical',
    mitreId: 'T1567'
  },
  {
    name: 'session_hijacking',
    displayName: 'Session Hijacking Detected',
    indicators: {
      concurrent_sessions: (val: number) => val > 2,
      session_location_change: (val: boolean) => val === true,
      cookie_theft_indicator: (val: boolean) => val === true,
      user_agent_mismatch: (val: boolean) => val === true,
    },
    confidenceThreshold: 0.75,
    severity: 'high',
    mitreId: 'T1539'
  },
  {
    name: 'api_abuse',
    displayName: 'API Abuse Detected',
    indicators: {
      api_calls_per_minute: (val: number) => val > 100,
      rate_limit_violations: (val: number) => val > 5,
      unauthorized_api_access: (val: boolean) => val === true,
      api_key_compromise: (val: boolean) => val === true,
    },
    confidenceThreshold: 0.70,
    severity: 'high',
    mitreId: 'T1106'
  },
  {
    name: 'insider_threat',
    displayName: 'Insider Threat Indicators',
    indicators: {
      after_hours_access: (val: boolean) => val === true,
      sensitive_data_access: (val: boolean) => val === true,
      unusual_privilege_use: (val: boolean) => val === true,
      resignation_announced: (val: boolean) => val === true,
    },
    confidenceThreshold: 0.60,
    severity: 'high',
    mitreId: 'T1078.003'
  },
  {
    name: 'supply_chain_attack',
    displayName: 'Supply Chain Compromise',
    indicators: {
      third_party_service_anomaly: (val: boolean) => val === true,
      vendor_account_compromise: (val: boolean) => val === true,
      integration_abuse: (val: boolean) => val === true,
      oauth_token_abuse: (val: boolean) => val === true,
    },
    confidenceThreshold: 0.75,
    severity: 'critical',
    mitreId: 'T1195'
  }
]