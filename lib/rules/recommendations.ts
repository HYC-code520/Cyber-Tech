import { Recommendation } from './types'
import { AlertCircle, Info, CheckCircle2 } from 'lucide-react'

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
  },
  geo_based_anomaly: {
    immediate: [
      {
        action: 'block_geo_location',
        reason: 'Block access from high-risk geographic location',
        citation: 'MITRE ATT&CK T1078.004 - Cloud Accounts',
        priority: 1,
        category: 'immediate'
      },
      {
        action: 'require_additional_verification',
        reason: 'Enforce step-up authentication for suspicious location',
        citation: 'NIST SP 800-63B - Authentication Assurance',
        priority: 2,
        category: 'immediate'
      },
      {
        action: 'check_vpn_legitimacy',
        reason: 'Verify if VPN/proxy usage is authorized',
        citation: 'Zero Trust Network Access',
        priority: 3,
        category: 'immediate'
      }
    ],
    follow_up: [
      {
        action: 'implement_geofencing',
        reason: 'Restrict access to approved geographic regions',
        citation: 'ISO 27001 Access Control',
        priority: 4,
        category: 'follow_up'
      },
      {
        action: 'review_travel_policy',
        reason: 'Update policies for international access',
        citation: 'CISA Telework Guidance',
        priority: 5,
        category: 'follow_up'
      }
    ],
    optional: [
      {
        action: 'deploy_sase_solution',
        reason: 'Implement Secure Access Service Edge',
        citation: 'Gartner SASE Framework',
        priority: 6,
        category: 'optional'
      }
    ]
  },
  device_anomaly: {
    immediate: [
      {
        action: 'block_untrusted_device',
        reason: 'Prevent access from unrecognized device',
        citation: 'MITRE ATT&CK T1078.001 - Default Accounts',
        priority: 1,
        category: 'immediate'
      },
      {
        action: 'enforce_device_registration',
        reason: 'Require device enrollment before access',
        citation: 'Microsoft Zero Trust Deployment',
        priority: 2,
        category: 'immediate'
      },
      {
        action: 'scan_for_malware',
        reason: 'Check device for compromise indicators',
        citation: 'NIST Mobile Device Security',
        priority: 3,
        category: 'immediate'
      }
    ],
    follow_up: [
      {
        action: 'implement_device_trust',
        reason: 'Deploy device trust scoring system',
        citation: 'CIS Mobile Device Controls',
        priority: 4,
        category: 'follow_up'
      },
      {
        action: 'enable_device_compliance',
        reason: 'Enforce compliance checks before access',
        citation: 'ISO 27001 Mobile Device Management',
        priority: 5,
        category: 'follow_up'
      }
    ],
    optional: [
      {
        action: 'deploy_uem_solution',
        reason: 'Implement Unified Endpoint Management',
        citation: 'Gartner UEM Magic Quadrant',
        priority: 6,
        category: 'optional'
      }
    ]
  },
  unusual_time_login: {
    immediate: [
      {
        action: 'alert_user_unusual_time',
        reason: 'Notify user of access outside normal hours',
        citation: 'MITRE ATT&CK T1078 - Valid Accounts',
        priority: 1,
        category: 'immediate'
      },
      {
        action: 'require_manager_approval',
        reason: 'Request authorization for after-hours access',
        citation: 'SOC 2 Access Controls',
        priority: 2,
        category: 'immediate'
      },
      {
        action: 'enable_session_recording',
        reason: 'Record activity during unusual hours',
        citation: 'PCI DSS Requirement 10',
        priority: 3,
        category: 'immediate'
      }
    ],
    follow_up: [
      {
        action: 'implement_time_based_access',
        reason: 'Configure access restrictions by time',
        citation: 'NIST SP 800-53 AC-2',
        priority: 4,
        category: 'follow_up'
      },
      {
        action: 'review_working_hours',
        reason: 'Update user profiles with accurate schedules',
        citation: 'ISO 27001 User Access Management',
        priority: 5,
        category: 'follow_up'
      }
    ],
    optional: [
      {
        action: 'deploy_behavior_analytics',
        reason: 'Implement UEBA for pattern detection',
        citation: 'Gartner UEBA Market Guide',
        priority: 6,
        category: 'optional'
      }
    ]
  },
  account_takeover: {
    immediate: [
      {
        action: 'lock_account_immediately',
        reason: 'Prevent further unauthorized access',
        citation: 'MITRE ATT&CK T1098 - Account Manipulation',
        priority: 1,
        category: 'immediate'
      },
      {
        action: 'revoke_all_oauth_tokens',
        reason: 'Terminate third-party application access',
        citation: 'OAuth 2.0 Security Best Practices',
        priority: 2,
        category: 'immediate'
      },
      {
        action: 'reset_all_credentials',
        reason: 'Force password and MFA reset',
        citation: 'CISA Account Security Guidance',
        priority: 3,
        category: 'immediate'
      }
    ],
    follow_up: [
      {
        action: 'audit_account_changes',
        reason: 'Review all recent account modifications',
        citation: 'NIST Incident Response Guide',
        priority: 4,
        category: 'follow_up'
      },
      {
        action: 'check_email_rules',
        reason: 'Remove malicious forwarding rules',
        citation: 'Microsoft Security Best Practices',
        priority: 5,
        category: 'follow_up'
      }
    ],
    optional: [
      {
        action: 'implement_privileged_access_management',
        reason: 'Deploy PAM solution for sensitive accounts',
        citation: 'Gartner PAM Market Guide',
        priority: 6,
        category: 'optional'
      }
    ]
  },
  privilege_escalation: {
    immediate: [
      {
        action: 'revoke_elevated_privileges',
        reason: 'Remove unauthorized administrative access',
        citation: 'MITRE ATT&CK T1078.003 - Local Accounts',
        priority: 1,
        category: 'immediate'
      },
      {
        action: 'isolate_affected_systems',
        reason: 'Prevent lateral movement',
        citation: 'NIST SP 800-61r2 Containment',
        priority: 2,
        category: 'immediate'
      },
      {
        action: 'audit_privilege_changes',
        reason: 'Review all recent permission modifications',
        citation: 'CIS Control 6 - Access Control',
        priority: 3,
        category: 'immediate'
      }
    ],
    follow_up: [
      {
        action: 'implement_just_in_time_access',
        reason: 'Deploy JIT privilege elevation',
        citation: 'Microsoft Privileged Identity Management',
        priority: 4,
        category: 'follow_up'
      },
      {
        action: 'review_service_accounts',
        reason: 'Audit and secure service account usage',
        citation: 'SANS Service Account Security',
        priority: 5,
        category: 'follow_up'
      }
    ],
    optional: [
      {
        action: 'deploy_pim_solution',
        reason: 'Implement Privileged Identity Management',
        citation: 'Azure AD PIM Best Practices',
        priority: 6,
        category: 'optional'
      }
    ]
  },
  data_exfiltration: {
    immediate: [
      {
        action: 'block_data_transfer',
        reason: 'Stop ongoing data exfiltration',
        citation: 'MITRE ATT&CK T1567 - Exfiltration Over Web Service',
        priority: 1,
        category: 'immediate'
      },
      {
        action: 'revoke_file_sharing',
        reason: 'Disable external sharing capabilities',
        citation: 'Data Loss Prevention Best Practices',
        priority: 2,
        category: 'immediate'
      },
      {
        action: 'quarantine_user_account',
        reason: 'Prevent further data access',
        citation: 'GDPR Article 33 - Breach Notification',
        priority: 3,
        category: 'immediate'
      }
    ],
    follow_up: [
      {
        action: 'audit_data_access_logs',
        reason: 'Identify scope of data exposure',
        citation: 'HIPAA Breach Assessment',
        priority: 4,
        category: 'follow_up'
      },
      {
        action: 'implement_dlp_policies',
        reason: 'Deploy data loss prevention controls',
        citation: 'NIST SP 800-171 Data Protection',
        priority: 5,
        category: 'follow_up'
      }
    ],
    optional: [
      {
        action: 'deploy_casb_solution',
        reason: 'Implement Cloud Access Security Broker',
        citation: 'Gartner CASB Market Guide',
        priority: 6,
        category: 'optional'
      }
    ]
  },
  session_hijacking: {
    immediate: [
      {
        action: 'terminate_all_sessions',
        reason: 'End potentially compromised sessions',
        citation: 'MITRE ATT&CK T1539 - Steal Web Session Cookie',
        priority: 1,
        category: 'immediate'
      },
      {
        action: 'force_reauthentication',
        reason: 'Require fresh authentication',
        citation: 'OWASP Session Management Cheat Sheet',
        priority: 2,
        category: 'immediate'
      },
      {
        action: 'rotate_session_tokens',
        reason: 'Invalidate existing session identifiers',
        citation: 'NIST SP 800-63B Session Management',
        priority: 3,
        category: 'immediate'
      }
    ],
    follow_up: [
      {
        action: 'implement_session_binding',
        reason: 'Bind sessions to device/location',
        citation: 'OWASP Top 10 - Broken Authentication',
        priority: 4,
        category: 'follow_up'
      },
      {
        action: 'enable_continuous_authentication',
        reason: 'Deploy behavioral biometrics',
        citation: 'FIDO Alliance Continuous Authentication',
        priority: 5,
        category: 'follow_up'
      }
    ],
    optional: [
      {
        action: 'deploy_zero_trust_proxy',
        reason: 'Implement context-aware proxy',
        citation: 'BeyondCorp Enterprise Security',
        priority: 6,
        category: 'optional'
      }
    ]
  },
  api_abuse: {
    immediate: [
      {
        action: 'enable_rate_limiting',
        reason: 'Throttle excessive API requests',
        citation: 'MITRE ATT&CK T1106 - Native API',
        priority: 1,
        category: 'immediate'
      },
      {
        action: 'revoke_api_keys',
        reason: 'Invalidate potentially compromised keys',
        citation: 'OWASP API Security Top 10',
        priority: 2,
        category: 'immediate'
      },
      {
        action: 'block_abusive_clients',
        reason: 'Deny access from malicious sources',
        citation: 'REST API Security Guidelines',
        priority: 3,
        category: 'immediate'
      }
    ],
    follow_up: [
      {
        action: 'implement_api_gateway',
        reason: 'Deploy centralized API management',
        citation: 'API Gateway Security Patterns',
        priority: 4,
        category: 'follow_up'
      },
      {
        action: 'enable_api_monitoring',
        reason: 'Track API usage patterns',
        citation: 'NIST API Security Guidelines',
        priority: 5,
        category: 'follow_up'
      }
    ],
    optional: [
      {
        action: 'deploy_api_security_platform',
        reason: 'Implement comprehensive API protection',
        citation: 'Gartner API Security Tools',
        priority: 6,
        category: 'optional'
      }
    ]
  },
  insider_threat: {
    immediate: [
      {
        action: 'monitor_user_activity',
        reason: 'Track actions of suspected insider',
        citation: 'MITRE ATT&CK - Insider Threat Framework',
        priority: 1,
        category: 'immediate'
      },
      {
        action: 'restrict_sensitive_access',
        reason: 'Limit access to critical data',
        citation: 'CERT Insider Threat Guide',
        priority: 2,
        category: 'immediate'
      },
      {
        action: 'preserve_forensic_evidence',
        reason: 'Maintain audit trail for investigation',
        citation: 'Digital Forensics Best Practices',
        priority: 3,
        category: 'immediate'
      }
    ],
    follow_up: [
      {
        action: 'conduct_user_interview',
        reason: 'Investigate suspicious behavior',
        citation: 'HR Security Investigation Guide',
        priority: 4,
        category: 'follow_up'
      },
      {
        action: 'review_access_necessity',
        reason: 'Apply principle of least privilege',
        citation: 'Zero Trust Architecture',
        priority: 5,
        category: 'follow_up'
      }
    ],
    optional: [
      {
        action: 'implement_ueba_monitoring',
        reason: 'Deploy User and Entity Behavior Analytics',
        citation: 'Gartner UEBA Solutions',
        priority: 6,
        category: 'optional'
      }
    ]
  },
  supply_chain_attack: {
    immediate: [
      {
        action: 'isolate_vendor_access',
        reason: 'Quarantine third-party connections',
        citation: 'MITRE ATT&CK T1195 - Supply Chain Compromise',
        priority: 1,
        category: 'immediate'
      },
      {
        action: 'revoke_vendor_credentials',
        reason: 'Terminate compromised vendor accounts',
        citation: 'CISA Supply Chain Security',
        priority: 2,
        category: 'immediate'
      },
      {
        action: 'audit_vendor_permissions',
        reason: 'Review all third-party access rights',
        citation: 'NIST Supply Chain Risk Management',
        priority: 3,
        category: 'immediate'
      }
    ],
    follow_up: [
      {
        action: 'assess_vendor_security',
        reason: 'Evaluate third-party security posture',
        citation: 'ISO 27001 Supplier Relationships',
        priority: 4,
        category: 'follow_up'
      },
      {
        action: 'implement_vendor_segmentation',
        reason: 'Isolate vendor access with zero trust',
        citation: 'Supply Chain Security Best Practices',
        priority: 5,
        category: 'follow_up'
      }
    ],
    optional: [
      {
        action: 'deploy_vendor_risk_management',
        reason: 'Implement continuous vendor monitoring',
        citation: 'Third-Party Risk Management Framework',
        priority: 6,
        category: 'optional'
      }
    ]
  }
}

// Citation links for external references
export const citationLinks: Record<string, string> = {
  // MITRE ATT&CK Techniques
  'MITRE ATT&CK T1110.003 - Password Spraying': 'https://attack.mitre.org/techniques/T1110/003/',
  'MITRE ATT&CK T1621 - Multi-Factor Authentication Request Generation': 'https://attack.mitre.org/techniques/T1621/',
  'MITRE ATT&CK T1110.001 - Brute Force': 'https://attack.mitre.org/techniques/T1110/001/',
  'MITRE ATT&CK T1110.004 - Credential Stuffing': 'https://attack.mitre.org/techniques/T1110/004/',
  'MITRE ATT&CK T1539 - Steal Web Session Cookie': 'https://attack.mitre.org/techniques/T1539/',
  'MITRE ATT&CK T1078.004 - Cloud Accounts': 'https://attack.mitre.org/techniques/T1078/004/',
  'MITRE ATT&CK T1078 - Valid Accounts': 'https://attack.mitre.org/techniques/T1078/',
  'MITRE ATT&CK T1078.001 - Default Accounts': 'https://attack.mitre.org/techniques/T1078/001/',
  'MITRE ATT&CK T1078.003 - Local Accounts': 'https://attack.mitre.org/techniques/T1078/003/',
  'MITRE ATT&CK T1098 - Account Manipulation': 'https://attack.mitre.org/techniques/T1098/',
  'MITRE ATT&CK T1567 - Exfiltration Over Web Service': 'https://attack.mitre.org/techniques/T1567/',
  'MITRE ATT&CK T1106 - Native API': 'https://attack.mitre.org/techniques/T1106/',
  'MITRE ATT&CK - Credential Access': 'https://attack.mitre.org/tactics/TA0006/',
  'MITRE ATT&CK - T1110.003': 'https://attack.mitre.org/techniques/T1110/003/',
  'MITRE ATT&CK - T1110.001': 'https://attack.mitre.org/techniques/T1110/001/',
  'MITRE ATT&CK - T1110.004': 'https://attack.mitre.org/techniques/T1110/004/',
  'MITRE ATT&CK - Insider Threat Framework': 'https://attack.mitre.org/resources/enterprise-introduction/',

  // CISA Alerts and Guidelines
  'CISA Alert AA22-074A - Russian State-Sponsored Cyber Actors': 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-074a',
  'CISA Alert AA21-131A - APT29': 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-131a',
  'CISA Alert AA20-280A - Iranian APT': 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-280a',
  'CISA Alert AA20-283A': 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-283a',
  'CISA Multi-Factor Authentication Guidelines': 'https://www.cisa.gov/mfa',
  'CISA MFA Best Practices Guide': 'https://www.cisa.gov/mfa',
  'CISA Emergency Directive 22-02': 'https://www.cisa.gov/news-events/directives/emergency-directive-22-02',
  'CISA Account Security Guidance': 'https://www.cisa.gov/account-security',
  'CISA Telework Guidance': 'https://www.cisa.gov/telework',

  // NIST Standards and Guidelines
  'NIST SP 800-61r2 - Incident Handling Guide': 'https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final',
  'NIST SP 800-63B - Digital Identity Guidelines': 'https://pages.nist.gov/800-63-3/sp800-63b.html',
  'NIST SP 800-63B - Authentication Assurance': 'https://pages.nist.gov/800-63-3/sp800-63b.html',
  'NIST SP 800-63B Session Management': 'https://pages.nist.gov/800-63-3/sp800-63b.html',
  'NIST SP 800-63B Authentication Guidelines': 'https://pages.nist.gov/800-63-3/sp800-63b.html',
  'NIST Cybersecurity Framework': 'https://www.nist.gov/cyberframework',
  'NIST Cybersecurity Framework - Respond': 'https://www.nist.gov/cyberframework/respond',
  'NIST Cybersecurity Framework - Detect': 'https://www.nist.gov/cyberframework/detect',
  'NIST SP 800-61r2 - Initial Assessment': 'https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final',
  'NIST SP 800-61r2 - Incident Verification': 'https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final',
  'NIST SP 800-61r2 Containment': 'https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final',
  'NIST Incident Response Guide': 'https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final',
  'NIST Mobile Device Security': 'https://csrc.nist.gov/publications/detail/sp/800-124/rev-1/final',
  'NIST SP 800-171 Data Protection': 'https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final',
  'NIST SP 800-53 AC-2': 'https://csrc.nist.gov/Projects/risk-management/sp800-53-controls',
  'NIST API Security Guidelines': 'https://csrc.nist.gov/publications/detail/sp/800-204/final',

  // CIS Controls
  'CIS Control 4.1 - Account Lockout': 'https://www.cisecurity.org/controls/account-lockout',
  'CIS Control 6.1 - Multi-Factor Authentication': 'https://www.cisecurity.org/controls/multi-factor-authentication',
  'CIS Control 6.2 - Privileged Access Management': 'https://www.cisecurity.org/controls/privileged-access-management',
  'CIS Control 6 - Log Management': 'https://www.cisecurity.org/controls/continuous-vulnerability-management',
  'CIS Control 6 - Access Control': 'https://www.cisecurity.org/controls/access-control-management',
  'CIS Mobile Device Controls': 'https://www.cisecurity.org/controls/mobile-device-management',

  // OWASP Resources
  'OWASP Authentication Cheat Sheet': 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html',
  'OWASP Automated Threat Handbook': 'https://owasp.org/www-project-automated-threats-to-web-applications/',
  'OWASP Session Management Cheat Sheet': 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html',
  'OWASP Top 10 - Broken Authentication': 'https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/',
  'OWASP API Security Top 10': 'https://owasp.org/www-project-api-security/',

  // Microsoft Resources
  'Microsoft Security - MFA Fatigue Attacks': 'https://docs.microsoft.com/en-us/azure/active-directory/authentication/concept-authentication-authenticator-app',
  'Microsoft Authenticator Number Matching': 'https://docs.microsoft.com/en-us/azure/active-directory/authentication/how-to-mfa-number-match',
  'Microsoft Entra ID Best Practices': 'https://docs.microsoft.com/en-us/azure/active-directory/fundamentals/active-directory-deployment-checklist-p2',
  'Microsoft Zero Trust Deployment': 'https://docs.microsoft.com/en-us/security/zero-trust/',
  'Microsoft Security Best Practices': 'https://docs.microsoft.com/en-us/security/',
  'Microsoft Privileged Identity Management': 'https://docs.microsoft.com/en-us/azure/active-directory/privileged-identity-management/',
  'Azure AD PIM Best Practices': 'https://docs.microsoft.com/en-us/azure/active-directory/privileged-identity-management/',

  // SANS Resources
  'SANS Security Awareness': 'https://www.sans.org/security-awareness-training/',
  'SANS Incident Response Process': 'https://www.sans.org/white-papers/incident-response/',
  'SANS Service Account Security': 'https://www.sans.org/white-papers/',

  // Industry Standards
  'ISO 27001 - Information Security Management': 'https://www.iso.org/isoiec-27001-information-security.html',
  'ISO 27001 Access Control': 'https://www.iso.org/isoiec-27001-information-security.html',
  'ISO 27001 User Access Management': 'https://www.iso.org/isoiec-27001-information-security.html',
  'ISO 27001 Mobile Device Management': 'https://www.iso.org/isoiec-27001-information-security.html',
  'SOC 2 Type II Controls': 'https://www.aicpa.org/interestareas/frc/assuranceadvisoryservices/aicpasoc2report',
  'SOC 2 Access Controls': 'https://www.aicpa.org/interestareas/frc/assuranceadvisoryservices/aicpasoc2report',
  'GDPR Article 32 - Security of Processing': 'https://gdpr-info.eu/art-32-gdpr/',
  'GDPR Article 33 - Breach Notification': 'https://gdpr-info.eu/art-33-gdpr/',
  'HIPAA Security Rule': 'https://www.hhs.gov/hipaa/for-professionals/security/index.html',
  'HIPAA Breach Assessment': 'https://www.hhs.gov/hipaa/for-professionals/breach-notification/index.html',
  'PCI DSS Requirement 8 - Access Control': 'https://www.pcisecuritystandards.org/document_library/',
  'PCI DSS Requirement 10': 'https://www.pcisecuritystandards.org/document_library/',

  // Security Frameworks and Architecture
  'Zero Trust Architecture': 'https://www.nist.gov/publications/zero-trust-architecture',
  'Zero Trust Architecture NIST SP 800-207': 'https://www.nist.gov/publications/zero-trust-architecture',
  'Zero Trust Network Access': 'https://www.nist.gov/publications/zero-trust-architecture',
  'Defense in Depth Strategy': 'https://www.nist.gov/publications/guidelines-security-analysis-information-systems',
  'Cloud Security Alliance CCM': 'https://cloudsecurityalliance.org/artifacts/cloud-controls-matrix/',

  // Authentication and Identity
  'Have I Been Pwned Integration': 'https://haveibeenpwned.com/',
  'FIDO2 WebAuthn Standards': 'https://fidoalliance.org/fido2/',
  'FIDO Alliance Continuous Authentication': 'https://fidoalliance.org/',
  'OAuth 2.0 Security Best Practices': 'https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics',

  // Gartner and Industry Reports
  'Gartner SASE Framework': 'https://www.gartner.com/en/information-technology/glossary/secure-access-service-edge-sase',
  'Gartner UEM Magic Quadrant': 'https://www.gartner.com/en/documents/3956065',
  'Gartner UEBA Market Guide': 'https://www.gartner.com/en/documents/3866764',
  'Gartner PAM Market Guide': 'https://www.gartner.com/en/documents/3956086',
  'Gartner CASB Market Guide': 'https://www.gartner.com/en/documents/3956087',
  'Gartner API Security Tools': 'https://www.gartner.com/en/documents/4006901',

  // Additional Security Resources
  'Behavioral Analytics': 'https://www.gartner.com/en/information-technology/glossary/behavioral-analytics',
  'User Entity Behavior Analytics (UEBA)': 'https://www.gartner.com/en/information-technology/glossary/user-entity-behavior-analytics-ueba-',
  'Security Information and Event Management (SIEM)': 'https://www.gartner.com/en/information-technology/glossary/security-information-event-management-siem',
  'Endpoint Detection and Response (EDR)': 'https://www.gartner.com/en/information-technology/glossary/endpoint-detection-and-response-edr',
  'Network Detection and Response (NDR)': 'https://www.gartner.com/en/information-technology/glossary/network-detection-and-response-ndr',
  'Identity and Access Management (IAM)': 'https://www.gartner.com/en/information-technology/glossary/identity-and-access-management-iam',
  'Privileged Access Management (PAM)': 'https://www.gartner.com/en/information-technology/glossary/privileged-access-management-pam',
  'Incident Response Playbook': 'https://www.sans.org/white-papers/incident-response/',
  'Threat Intelligence Integration': 'https://www.mitre.org/publications/technical-papers/threat-intelligence-driven-incident-response',
  'Data Loss Prevention Best Practices': 'https://www.sans.org/white-papers/data-loss-prevention/',
  'Digital Forensics Best Practices': 'https://www.sans.org/white-papers/digital-forensics/',
  'SIEM Tuning Best Practices': 'https://www.sans.org/white-papers/siem/',
  'BeyondCorp Enterprise Security': 'https://cloud.google.com/beyondcorp-enterprise',
  'REST API Security Guidelines': 'https://owasp.org/www-project-api-security/',
  'API Gateway Security Patterns': 'https://owasp.org/www-project-api-security/',
  'CERT Insider Threat Guide': 'https://resources.sei.cmu.edu/library/asset-view.cfm?assetid=508010',

  // Internal and Generic References
  'Internal Security Policy - VPN Usage': '#',
  'Internal Escalation Procedures': '#',
  'Adaptive Authentication Guidelines': 'https://www.nist.gov/publications/zero-trust-architecture',
  'HR Security Investigation Guide': '#'
}

// Time estimates for different actions
export const timeEstimates: Record<string, string> = {
  'disable_user_account': '2-5 minutes',
  'revoke_user_tokens': '1-3 minutes',
  'reset_user_password': '5-10 minutes',
  'block_source_ips': '3-7 minutes',
  'implement_mfa': '15-30 minutes',
  'force_password_reset_all': '30-60 minutes',
  'investigate_further': '30-120 minutes',
  'reset_all_passwords': '60-120 minutes',
  'revoke_all_sessions': '5-15 minutes',
  'enforce_mfa': '30-60 minutes',
  'implement_account_lockout': '15-30 minutes',
  'user_awareness_training': '2-4 hours',
  'deploy_bot_protection': '1-2 hours',
  'check_breach_databases': '10-20 minutes',
  'implement_passwordless': '2-4 hours'
}

// Risk indicator function
export const getRiskIndicator = (priority: number) => {
  if (priority <= 1) return { icon: AlertCircle, color: 'text-red-600', label: 'Critical' }
  if (priority <= 3) return { icon: AlertCircle, color: 'text-orange-600', label: 'High' }
  if (priority <= 5) return { icon: Info, color: 'text-yellow-600', label: 'Medium' }
  return { icon: CheckCircle2, color: 'text-green-600', label: 'Low' }
}