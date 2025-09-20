import Link from 'next/link';
import { 
  Shield, 
  Bell, 
  AlertTriangle, 
  FileText, 
  Settings, 
  Home, 
  Search, 
  Globe, 
  Database, 
  Server, 
  User,
  HelpCircle,
  Target,
  AlertOctagon
} from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="h-screen w-16 bg-sidebar flex flex-col items-center py-4 border-r border-sidebar-border">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
          <Shield size={20} className="text-primary-foreground" />
        </div>
      </div>
      
      {/* Main Navigation */}
      <nav className="flex flex-col items-center gap-3 flex-1">
        <SidebarItem icon={<Home size={18} />} href="/" tooltip="Dashboard" />
        <SidebarItem icon={<Shield size={18} />} href="/security-signals" active tooltip="Security Signals" />
        <SidebarItem icon={<Bell size={18} />} href="/alerts" tooltip="Alerts" />
        <SidebarItem icon={<AlertTriangle size={18} />} href="/incidents" tooltip="Incidents" />
        <SidebarItem icon={<Target size={18} />} href="/hunting" tooltip="Threat Hunting" />
        <SidebarItem icon={<FileText size={18} />} href="/reports" tooltip="Reports" />
        <SidebarItem icon={<AlertOctagon size={18} />} href="/threats" tooltip="Threats" />
        <SidebarItem icon={<Globe size={18} />} href="/network" tooltip="Network" />
        <SidebarItem icon={<Database size={18} />} href="/data" tooltip="Data" />
        <SidebarItem icon={<Server size={18} />} href="/infrastructure" tooltip="Infrastructure" />
        <SidebarItem icon={<User size={18} />} href="/users" tooltip="Users" />
      </nav>
      
      {/* Bottom Items */}
      <div className="flex flex-col items-center gap-3">
        <SidebarItem icon={<HelpCircle size={18} />} href="/help" tooltip="Help" />
        <SidebarItem icon={<Settings size={18} />} href="/settings" tooltip="Settings" />
      </div>
    </div>
  );
}

type SidebarItemProps = {
  icon: React.ReactNode;
  href: string;
  active?: boolean;
  tooltip?: string;
};

function SidebarItem({ icon, href, active = false, tooltip }: SidebarItemProps) {
  return (
    <div className="relative group">
      <Link 
        href={href}
        className={`w-10 h-10 rounded-md flex items-center justify-center transition-all duration-200
          ${active 
            ? 'bg-primary text-primary-foreground shadow-lg' 
            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          }`}
      >
        {icon}
      </Link>
      
      {/* Tooltip */}
      {tooltip && (
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-card text-card-foreground text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
          {tooltip}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-card"></div>
        </div>
      )}
    </div>
  );
}