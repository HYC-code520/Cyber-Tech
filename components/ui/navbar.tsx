'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Shield, Home, FileText, Play, QrCode, MonitorSpeaker, Eye, Activity, Palette } from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/incidents', label: 'All Incidents', icon: Eye },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/simulate', label: 'Simulate', icon: Play },
  { href: '/demo-lobby', label: 'Live Demo', icon: QrCode },
  { href: '/demo-control', label: 'Demo Control', icon: MonitorSpeaker },
  { href: '/design-system', label: 'Design System', icon: Palette },
]

interface NavbarProps {
  subtitle?: string
}

export function Navbar({ subtitle = "Security Monitoring - Account Compromise Investigation" }: NavbarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="bg-card/80 backdrop-blur-sm border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-semibold text-foreground">Identity Sentinel</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  active
                    ? 'text-foreground font-medium bg-primary/20 border border-primary/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
} 