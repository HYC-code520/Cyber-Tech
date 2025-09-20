import Link from 'next/link';

type SecurityHeaderProps = {
  activeTab: 'security-signals' | 'explore' | 'dashboards';
};

export default function SecurityHeader({ activeTab }: SecurityHeaderProps) {
  return (
    <div className="bg-card border-b border-gray-800 px-4">
      <div className="flex items-center h-14">
        <h1 className="text-lg font-medium text-white mr-8">Security Signals</h1>
        
        <div className="flex space-x-4">
          <HeaderTab 
            label="Security Signals" 
            href="/security-signals" 
            active={activeTab === 'security-signals'} 
          />
          <HeaderTab 
            label="Explore" 
            href="/explore" 
            active={activeTab === 'explore'} 
          />
          <HeaderTab 
            label="Dashboards" 
            href="/dashboards" 
            active={activeTab === 'dashboards'} 
          />
        </div>
      </div>
    </div>
  );
}

type HeaderTabProps = {
  label: string;
  href: string;
  active: boolean;
};

function HeaderTab({ label, href, active }: HeaderTabProps) {
  return (
    <Link 
      href={href}
      className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
        active 
          ? 'border-primary text-white' 
          : 'border-transparent text-gray-400 hover:text-white hover:border-gray-700'
      }`}
    >
      {label}
    </Link>
  );
}