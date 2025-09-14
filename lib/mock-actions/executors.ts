export interface ActionResult {
  success: boolean
  message: string
  details?: Record<string, any>
  timestamp: string
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockActions = {
  async reset_all_passwords(): Promise<ActionResult> {
    await sleep(2000)
    const affectedUsers = Math.floor(Math.random() * 50) + 10
    
    return {
      success: true,
      message: `Password reset initiated for ${affectedUsers} affected users`,
      details: {
        affected_users: affectedUsers,
        notification_sent: true,
        reset_method: 'email_link'
      },
      timestamp: new Date().toISOString()
    }
  },

  async revoke_all_sessions(): Promise<ActionResult> {
    await sleep(1500)
    const revokedSessions = Math.floor(Math.random() * 20) + 5
    
    return {
      success: true,
      message: `${revokedSessions} active sessions revoked across affected accounts`,
      details: {
        revoked_sessions: revokedSessions,
        force_reauth: true,
        scope: 'all_affected_users'
      },
      timestamp: new Date().toISOString()
    }
  },

  async revoke_user_tokens(userId?: string): Promise<ActionResult> {
    await sleep(800)
    const tokensRevoked = Math.floor(Math.random() * 5) + 1
    
    return {
      success: true,
      message: `All active tokens revoked for user ${userId || 'john.doe@company.com'}`,
      details: {
        user_id: userId || 'john.doe@company.com',
        tokens_revoked: tokensRevoked,
        api_tokens: true,
        refresh_tokens: true
      },
      timestamp: new Date().toISOString()
    }
  },

  async disable_user_account(userId?: string): Promise<ActionResult> {
    await sleep(1000)
    
    return {
      success: true,
      message: `User account ${userId || 'john.doe@company.com'} has been disabled`,
      details: {
        user_id: userId || 'john.doe@company.com',
        disabled_reason: 'Security incident - MFA fatigue attack',
        can_reenable: true,
        notification_sent: true
      },
      timestamp: new Date().toISOString()
    }
  },

  async block_source_ips(): Promise<ActionResult> {
    await sleep(1200)
    const blockedIPs = ['192.168.1.100', '10.0.0.50', '172.16.1.200']
    
    return {
      success: true,
      message: `${blockedIPs.length} malicious IP addresses blocked`,
      details: {
        blocked_ips: blockedIPs,
        firewall_updated: true,
        duration: '24_hours',
        auto_expire: true
      },
      timestamp: new Date().toISOString()
    }
  },

  async block_attack_infrastructure(): Promise<ActionResult> {
    await sleep(1800)
    const blockedNetworks = ['203.0.113.0/24', '198.51.100.0/24']
    
    return {
      success: true,
      message: `Attack infrastructure blocked at network level`,
      details: {
        blocked_networks: blockedNetworks,
        dns_sinkhole: true,
        threat_intelligence_updated: true
      },
      timestamp: new Date().toISOString()
    }
  },

  async reset_user_mfa(userId?: string): Promise<ActionResult> {
    await sleep(1000)
    
    return {
      success: true,
      message: `MFA configuration reset for ${userId || 'john.doe@company.com'}`,
      details: {
        user_id: userId || 'john.doe@company.com',
        old_devices_removed: 2,
        requires_new_setup: true,
        temp_backup_codes: true
      },
      timestamp: new Date().toISOString()
    }
  },

  async enforce_mfa(): Promise<ActionResult> {
    await sleep(2500)
    const affectedUsers = Math.floor(Math.random() * 200) + 50
    
    return {
      success: true,
      message: `MFA enforcement enabled for ${affectedUsers} users`,
      details: {
        affected_users: affectedUsers,
        grace_period: '48_hours',
        supported_methods: ['authenticator_app', 'sms', 'hardware_key']
      },
      timestamp: new Date().toISOString()
    }
  },

  async implement_account_lockout(): Promise<ActionResult> {
    await sleep(1500)
    
    return {
      success: true,
      message: 'Account lockout policies updated across all systems',
      details: {
        max_attempts: 5,
        lockout_duration: '15_minutes',
        scope: 'all_users',
        exceptions: ['admin_accounts']
      },
      timestamp: new Date().toISOString()
    }
  },

  async verify_with_user(userId?: string): Promise<ActionResult> {
    await sleep(500)
    
    return {
      success: true,
      message: `Verification request sent to ${userId || 'jane.smith@company.com'}`,
      details: {
        user_id: userId || 'jane.smith@company.com',
        verification_method: 'phone_call',
        response_required: true,
        timeout: '30_minutes'
      },
      timestamp: new Date().toISOString()
    }
  },

  async require_mfa_reauthentication(userId?: string): Promise<ActionResult> {
    await sleep(800)
    
    return {
      success: true,
      message: `MFA re-authentication required for ${userId || 'jane.smith@company.com'}`,
      details: {
        user_id: userId || 'jane.smith@company.com',
        session_terminated: true,
        requires_fresh_login: true
      },
      timestamp: new Date().toISOString()
    }
  },

  async mark_as_safe(): Promise<ActionResult> {
    await sleep(300)
    
    return {
      success: true,
      message: 'Incident marked as false positive - legitimate activity confirmed',
      details: {
        reason: 'VPN usage confirmed by user',
        risk_score: 'low',
        added_to_whitelist: true
      },
      timestamp: new Date().toISOString()
    }
  },

  async update_user_profile(userId?: string): Promise<ActionResult> {
    await sleep(600)
    
    return {
      success: true,
      message: `User profile updated for ${userId || 'jane.smith@company.com'}`,
      details: {
        user_id: userId || 'jane.smith@company.com',
        trusted_locations_updated: true,
        vpn_ips_whitelisted: ['203.0.113.10', '198.51.100.15']
      },
      timestamp: new Date().toISOString()
    }
  },

  async implement_captcha(): Promise<ActionResult> {
    await sleep(1000)
    
    return {
      success: true,
      message: 'CAPTCHA protection enabled on login forms',
      details: {
        protection_type: 'recaptcha_v3',
        threshold_score: 0.7,
        applies_to: 'all_login_pages'
      },
      timestamp: new Date().toISOString()
    }
  },

  async force_password_reset_all(): Promise<ActionResult> {
    await sleep(3000)
    const affectedUsers = Math.floor(Math.random() * 500) + 100
    
    return {
      success: true,
      message: `Organization-wide password reset initiated for ${affectedUsers} users`,
      details: {
        affected_users: affectedUsers,
        notification_method: 'email_and_sms',
        deadline: '72_hours',
        temporary_lockout: true
      },
      timestamp: new Date().toISOString()
    }
  }
}

export type ActionType = keyof typeof mockActions