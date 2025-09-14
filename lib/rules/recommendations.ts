import { Recommendation } from './types'

export const recommendationMap: Record<string, { immediate: Recommendation[], follow_up: Recommendation[], optional: Recommendation[] }> = {
  password_spray: {
    immediate: [
      {
        action: 'reset_all_passwords',
        reason: 'Multiple accounts potentially compromised through password spray attack',
        citation: 'MITRE ATT&CK T1110.003 - Password Spraying',
        priority: 1,
        category: 'immediate'
      },
      {
        action: 'revoke_all_sessions',
        reason: 'Prevent active attacker sessions from maintaining access',
        citation: 'CISA Alert AA22-074A - Russian State-Sponsored Cyber Actors',
        priority: 2,
        category: 'immediate'
      },
      {
        action: 'block_source_ips',
        reason: 'Stop ongoing attack from identified source IPs',
        citation: 'NIST SP 800-61r2 - Incident Handling Guide',
        priority: 3,
        category: 'immediate'
      }
    ],
    follow_up: [
      {
        action: 'enforce_mfa',
        reason: 'Prevent future password-only attacks',
        citation: 'NIST SP 800-63B - Digital Identity Guidelines',
        priority: 4,
        category: 'follow_up'
      },
      {
        action: 'implement_account_lockout',
        reason: 'Automatically block accounts after failed attempts',
        citation: 'CIS Control 4.1 - Account Lockout',
        priority: 5,
        category: 'follow_up'
      }
    ],
    optional: [
      {
        action: 'user_awareness_training',
        reason: 'Educate users about password security',
        citation: 'SANS Security Awareness',
        priority: 6,
        category: 'optional'
      }
    ]
  },
  mfa_fatigue: {
    immediate: [
      {
        action: 'revoke_user_tokens',
        reason: 'Immediately terminate potentially compromised sessions',
        citation: 'MITRE ATT&CK T1621 - Multi-Factor Authentication Request Generation',
        priority: 1,
        category: 'immediate'
      },
      {
        action: 'disable_user_account',
        reason: 'Prevent further unauthorized access attempts',
        citation: 'Microsoft Security - MFA Fatigue Attacks',
        priority: 2,
        category: 'immediate'
      },
      {
        action: 'reset_user_mfa',
        reason: 'Re-establish secure MFA configuration',
        citation: 'CISA MFA Best Practices Guide',
        priority: 3,
        category: 'immediate'
      }
    ],
    follow_up: [
      {
        action: 'enable_number_matching',
        reason: 'Require number matching for push notifications',
        citation: 'Microsoft Authenticator Number Matching',
        priority: 4,
        category: 'follow_up'
      },
      {
        action: 'implement_mfa_rate_limiting',
        reason: 'Limit MFA request frequency per user',
        citation: 'OWASP Authentication Cheat Sheet',
        priority: 5,
        category: 'follow_up'
      }
    ],
    optional: [
      {
        action: 'review_mfa_policies',
        reason: 'Strengthen overall MFA implementation',
        citation: 'Zero Trust Architecture NIST SP 800-207',
        priority: 6,
        category: 'optional'
      }
    ]
  },
  suspicious_travel: {
    immediate: [
      {
        action: 'verify_with_user',
        reason: 'Confirm if travel is legitimate before taking action',
        citation: 'NIST SP 800-61r2 - Incident Verification',
        priority: 1,
        category: 'immediate'
      },
      {
        action: 'require_mfa_reauthentication',
        reason: 'Ensure current session is authorized',
        citation: 'ISO 27001 Access Control',
        priority: 2,
        category: 'immediate'
      }
    ],
    follow_up: [
      {
        action: 'monitor_account_activity',
        reason: 'Watch for additional suspicious behavior',
        citation: 'MITRE ATT&CK T1078 - Valid Accounts',
        priority: 3,
        category: 'follow_up'
      },
      {
        action: 'review_access_logs',
        reason: 'Check for other anomalous activities',
        citation: 'CIS Control 6 - Log Management',
        priority: 4,
        category: 'follow_up'
      }
    ],
    optional: [
      {
        action: 'implement_geofencing',
        reason: 'Restrict access based on geographic location',
        citation: 'Zero Trust Network Access',
        priority: 5,
        category: 'optional'
      }
    ]
  },
  false_positive_travel: {
    immediate: [
      {
        action: 'mark_as_safe',
        reason: 'VPN usage confirmed, legitimate business travel',
        citation: 'Internal Security Policy - VPN Usage',
        priority: 1,
        category: 'immediate'
      },
      {
        action: 'update_user_profile',
        reason: 'Add VPN IP to known safe locations',
        citation: 'Adaptive Authentication Guidelines',
        priority: 2,
        category: 'immediate'
      }
    ],
    follow_up: [
      {
        action: 'adjust_detection_rules',
        reason: 'Reduce false positives for VPN users',
        citation: 'SIEM Tuning Best Practices',
        priority: 3,
        category: 'follow_up'
      }
    ],
    optional: []
  },
  credential_stuffing: {
    immediate: [
      {
        action: 'force_password_reset_all',
        reason: 'Widespread credential compromise detected',
        citation: 'MITRE ATT&CK T1110.004 - Credential Stuffing',
        priority: 1,
        category: 'immediate'
      },
      {
        action: 'implement_captcha',
        reason: 'Block automated login attempts',
        citation: 'OWASP Automated Threat Handbook',
        priority: 2,
        category: 'immediate'
      },
      {
        action: 'block_attack_infrastructure',
        reason: 'Prevent continued automated attacks',
        citation: 'CISA Alert AA20-283A',
        priority: 3,
        category: 'immediate'
      }
    ],
    follow_up: [
      {
        action: 'deploy_bot_protection',
        reason: 'Long-term protection against automated attacks',
        citation: 'NIST Cybersecurity Framework',
        priority: 4,
        category: 'follow_up'
      },
      {
        action: 'check_breach_databases',
        reason: 'Identify source of compromised credentials',
        citation: 'Have I Been Pwned Integration',
        priority: 5,
        category: 'follow_up'
      }
    ],
    optional: [
      {
        action: 'implement_passwordless',
        reason: 'Eliminate password-based attacks entirely',
        citation: 'FIDO2 WebAuthn Standards',
        priority: 6,
        category: 'optional'
      }
    ]
  }
}