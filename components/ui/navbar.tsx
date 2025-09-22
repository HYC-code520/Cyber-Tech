'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Shield, Home, FileText, Play, QrCode, MonitorSpeaker, Eye, Activity, Palette, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        closeMobileMenu()
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu()
  }, [pathname])

  return (
    <nav className="bg-card/80 backdrop-blur-sm border-b border-border px-4 sm:px-6 py-4 relative">
      <div className="flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-primary flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">Identity Sentinel</h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate hidden sm:block">{subtitle}</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  active
                    ? 'text-foreground font-medium bg-primary/20 border border-primary/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                <span className="hidden xl:inline">{item.label}</span>
                <span className="xl:hidden text-xs">{item.label.split(' ')[0]}</span>
              </Link>
            )
          })}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={closeMobileMenu} />
          
          {/* Menu Panel */}
          <div
            ref={mobileMenuRef}
            className="fixed top-0 right-0 h-full w-80 max-w-sm bg-card/95 backdrop-blur-md border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out"
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeMobileMenu}
                className="p-2"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Menu Items */}
            <div className="p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors w-full ${
                      active
                        ? 'text-foreground font-medium bg-primary/20 border border-primary/30'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
                    <span className="text-base">{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Mobile Menu Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card/90">
              <p className="text-xs text-muted-foreground text-center">
                Identity Sentinel Security Platform
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
} 