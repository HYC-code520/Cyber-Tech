'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import SecurityHeader from '@/components/layout/SecurityHeader';
import SecurityCard from '@/components/security/SecurityCard';
import IncidentDetailsPanel from '@/components/security/IncidentDetailsPanel';
import TimelineChart from '@/components/security/TimelineChart';
import { Search, Filter, ChevronDown, Settings, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Mock data for the timeline chart
const timelineData = [
  { time: '15:00', value: 2 },
  { time: '16:00', value: 1 },
  { time: '17:00', value: 5 },
  { time: '18:00', value: 12 },
  { time: '19:00', value: 8 },
  { time: '20:00', value: 3 },
  { time: '21:00', value: 1 },
  { time: '22:00', value: 0 },
];

// Mock security incidents
const securityIncidents = [
  {
    id: '1',
    title: 'VPC default security groups not restricting all traffic',
    severity: 'medium',
    source: 'ec2',
    sourceType: 'compliance',
    tags: ['cis-aws', '4.3']
  },
  {
    id: '2',
    title: 'Credential Stuffing Attack',
    severity: 'critical',
    source: 'undefined',
    sourceType: 'attack',
    tags: ['TA0006-credential-access', 'T1110-brute-force']
  },
  {
    id: '3',
    title: 'Unrestricted network ACL inbound traffic',
    severity: 'medium',
    source: 'vpc',
    sourceType: 'compliance',
    tags: ['pci-aws']
  },
  {
    id: '4',
    title: 'Unrestricted network ACL outbound traffic',
    severity: 'medium',
    source: 'vpc',
    sourceType: 'compliance',
    tags: ['pci-aws']
  },
  {
    id: '5',
    title: 'RDS instance with default port',
    severity: 'low',
    source: 'rds',
    sourceType: 'compliance',
    tags: ['pci-aws']
  },
  {
    id: '6',
    title: 'Account Take Over (ATO)',
    severity: 'critical',
    source: 'undefined',
    sourceType: 'attack',
    tags: ['TA0006-credential-access', 'T1110-brute-force']
  },
  {
    id: '7',
    title: 'RDS database instances are not encrypted',
    severity: 'high',
    source: 'rds',
    sourceType: 'compliance',
    tags: ['pci-aws']
  },
  {
    id: '8',
    title: 'Lacework Detected Malicious File',
    severity: 'critical',
    source: 'lacework',
    sourceType: 'detection',
    tags: ['malware', 'file-access']
  }
];

// Mock incident details
const mockIncidentDetails = {
  id: '6',
  title: 'Account Take Over (ATO) - Potential successful brute-force',
  timestamp: 'Jan 13, 2021 at 10:15:17.844',
  type: 'T1110-brute-force',
  source: 'ruby',
  service: 'web-store-admin-portal',
  userName: 'admin',
  host: '1:0cf8a64af6298629',
  outcome: 'failure (+1 more)',
  tags: ['availability-zone:us-east-1c', 'aws_account:172597598159', 'cloud_provider:aws', 'created_by:judy.mack'],
  firstSeen: 'Jan 13, 2021 at 10:11:27',
  lastSeen: 'Jan 13, 2021 at 11:11:27',
  triggeredOn: '16 logs',
  eventName: 'authentication',
  goal: 'Detect Account Take Over (ATO) through brute force attempts',
  strategy: 'Detect a high amount of failed logins and at least one successful login for a given user.',
  triageSteps: [
    'Inspect the logs to see if this was a valid login attempt',
    'See if 2FA was authenticated',
    'If the user was compromised, rotate user credentials.'
  ]
};

export default function SecuritySignalsPage() {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [showLeftPanel, setShowLeftPanel] = useState(true);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <SecurityHeader activeTab="security-signals" />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar Panel */}
          {showLeftPanel && (
            <div className="w-80 bg-card border-r border-border overflow-y-auto">
              {/* Search */}
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search facets..." 
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filters Section */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Showing 53 of 53</span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-primary text-sm h-6 px-2">
                      + Add
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground h-6 px-2">
                      <Settings size={14} />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <FilterSection title="CORE" />
                  <FilterSection title="Source" />
                  <FilterSection title="Status" expanded>
                    <div className="space-y-2 pl-6">
                      <FilterCheckbox label="Critical" count={4} checked severity="critical" />
                      <FilterCheckbox label="High" count={7} checked severity="high" />
                      <FilterCheckbox label="Medium" count={680} checked severity="medium" />
                      <FilterCheckbox label="Low" count={36} checked severity="low" />
                      <FilterCheckbox label="Info" count={121} checked severity="info" />
                    </div>
                  </FilterSection>
                  <FilterSection title="Security" />
                  <FilterSection title="Scope" />
                  <FilterSection title="HOST" />
                  <FilterSection title="Host" />
                  <FilterSection title="Client IP" />
                  <FilterSection title="Destination IP" />
                  <FilterSection title="Instance Id" />
                </div>
              </div>
            </div>
          )}
          
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Top Controls */}
            <div className="p-4 border-b border-border bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowLeftPanel(!showLeftPanel)}
                    className="text-muted-foreground"
                  >
                    <Filter size={16} className="mr-2" />
                    {showLeftPanel ? 'Hide Controls' : 'View Issues'}
                  </Button>
                  
                  <div className="text-sm text-muted-foreground">
                    47 results found
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-primary border-primary/30">
                    <TrendingUp size={16} className="mr-2" />
                    View in Log Explorer
                  </Button>
                  <Button variant="outline" size="sm">
                    Rule
                  </Button>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="p-4 border-b border-border bg-card">
              <div className="h-32">
                <TimelineChart data={timelineData} height={120} />
              </div>
            </div>
            
            {/* Security Incidents List */}
            <div className="p-4">
              <div className="space-y-1">
                {securityIncidents.map((incident) => (
                  <div key={incident.id} onClick={() => setSelectedIncident(incident.id)}>
                    <SecurityCard 
                      title={incident.title}
                      severity={incident.severity as any}
                      source={incident.source}
                      sourceType={incident.sourceType}
                      tags={incident.tags}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Panel */}
          {selectedIncident && (
            <IncidentDetailsPanel 
              incident={mockIncidentDetails}
              onClose={() => setSelectedIncident(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

type FilterSectionProps = {
  title: string;
  expanded?: boolean;
  children?: React.ReactNode;
};

function FilterSection({ title, expanded = false, children }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(expanded);
  
  return (
    <div>
      <button 
        className="flex items-center w-full text-left py-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ChevronDown 
          size={16} 
          className={`mr-2 transition-transform text-muted-foreground ${isOpen ? 'transform rotate-0' : 'transform -rotate-90'}`} 
        />
        <span className="text-sm font-medium">{title}</span>
      </button>
      {isOpen && children}
    </div>
  );
}

type FilterCheckboxProps = {
  label: string;
  count: number;
  checked?: boolean;
  severity?: string;
};

function FilterCheckbox({ label, count, checked = false, severity }: FilterCheckboxProps) {
  const getSeverityColor = (sev?: string) => {
    if (!sev) return '';
    switch (sev) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-red-400';
      case 'medium': return 'text-primary';
      case 'low': return 'text-primary';
      case 'info': return 'text-primary';
      default: return '';
    }
  };

  return (
    <label className="flex items-center gap-2 cursor-pointer py-1">
      <input 
        type="checkbox" 
        className="rounded border-border text-primary focus:ring-primary focus:ring-offset-0 bg-background"
        defaultChecked={checked}
      />
      <span className={`text-sm flex items-center gap-1 ${getSeverityColor(severity)}`}>
        {severity && <span className="w-2 h-2 rounded-full bg-current"></span>}
        {label}
      </span>
      <span className="text-xs text-muted-foreground ml-auto">{count}</span>
    </label>
  );
}