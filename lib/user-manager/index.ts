export interface UserAccount {
  email: string
  status: 'active' | 'locked' | 'suspended'
  lockedAt?: Date
  lockReason?: string
  unlockAt?: Date
  lastLoginAttempt?: Date
  failedAttempts?: number
}

class UserAccountManager {
  private accounts: Map<string, UserAccount> = new Map()
  private readonly DEFAULT_LOCK_DURATION_HOURS = 24

  getAccountStatus(email: string): UserAccount {
    const existing = this.accounts.get(email)
    if (existing) {
      // Check if lock has expired
      if (existing.status === 'locked' && existing.unlockAt && new Date() >= existing.unlockAt) {
        this.unlockAccount(email)
        return this.accounts.get(email)!
      }
      return existing
    }

    // Create new account record
    const newAccount: UserAccount = {
      email,
      status: 'active',
      failedAttempts: 0
    }
    
    this.accounts.set(email, newAccount)
    return newAccount
  }

  lockAccount(email: string, reason: string): UserAccount {
    const now = new Date()
    const unlockTime = new Date(now.getTime() + (this.DEFAULT_LOCK_DURATION_HOURS * 60 * 60 * 1000))

    const account: UserAccount = {
      email,
      status: 'locked',
      lockedAt: now,
      lockReason: reason,
      unlockAt: unlockTime,
      lastLoginAttempt: now
    }
    
    this.accounts.set(email, account)
    console.log(`Account locked: ${email} - Reason: ${reason}`)
    return account
  }

  unlockAccount(email: string): UserAccount {
    const account = this.getAccountStatus(email)
    account.status = 'active'
    account.lockedAt = undefined
    account.lockReason = undefined
    account.unlockAt = undefined
    account.failedAttempts = 0
    
    this.accounts.set(email, account)
    console.log(`Account unlocked: ${email}`)
    return account
  }

  recordFailedAttempt(email: string): UserAccount {
    const account = this.getAccountStatus(email)
    account.lastLoginAttempt = new Date()
    account.failedAttempts = (account.failedAttempts || 0) + 1
    
    this.accounts.set(email, account)
    return account
  }

  isAccountLocked(email: string): boolean {
    const account = this.getAccountStatus(email)
    return account.status === 'locked'
  }

  getLockedAccounts(): UserAccount[] {
    return Array.from(this.accounts.values()).filter(account => account.status === 'locked')
  }

  getRecentActivity(minutes: number = 10): UserAccount[] {
    const cutoff = new Date(Date.now() - (minutes * 60 * 1000))
    
    return Array.from(this.accounts.values()).filter(account => 
      account.lastLoginAttempt && account.lastLoginAttempt >= cutoff
    ).sort((a, b) => {
      const timeA = a.lastLoginAttempt?.getTime() || 0
      const timeB = b.lastLoginAttempt?.getTime() || 0
      return timeB - timeA
    })
  }

  resetAllAccounts(): void {
    console.log('Resetting all user accounts for demo')
    this.accounts.clear()
  }

  resetAccount(email: string): UserAccount {
    this.accounts.delete(email)
    return this.getAccountStatus(email) // This will create a fresh account
  }

  getAccountStatistics() {
    const accounts = Array.from(this.accounts.values())
    const now = new Date()
    const recentThreshold = new Date(now.getTime() - (5 * 60 * 1000)) // 5 minutes

    return {
      totalAccounts: accounts.length,
      activeAccounts: accounts.filter(a => a.status === 'active').length,
      lockedAccounts: accounts.filter(a => a.status === 'locked').length,
      suspendedAccounts: accounts.filter(a => a.status === 'suspended').length,
      recentActivity: accounts.filter(a => 
        a.lastLoginAttempt && a.lastLoginAttempt >= recentThreshold
      ).length,
      lastUpdated: now
    }
  }

  // Get all accounts (for demo purposes)
  getAllAccounts(): UserAccount[] {
    return Array.from(this.accounts.values())
  }

  // Bulk operations for demo management
  createDemoAccounts(emails: string[]): void {
    emails.forEach(email => {
      this.accounts.set(email, {
        email,
        status: 'active',
        failedAttempts: 0
      })
    })
    console.log(`Created ${emails.length} demo accounts`)
  }
}

// Singleton instance for the application
export const userManager = new UserAccountManager()