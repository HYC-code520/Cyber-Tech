import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, ExternalLink } from 'lucide-react';

type IncidentDetailsPanelProps = {
  incident: {
    id: string;
    title: string;
    timestamp: string;
    type: string;
    source: string;
    service: string;
    userName: string;
    host: string;
    outcome: string;
    tags: string[];
    firstSeen: string;
    lastSeen: string;
    triggeredOn: string;
    eventName: string;
    goal?: string;
    strategy?: string;
    triageSteps?: string[];
  };
  onClose: () => void;
};

export default function IncidentDetailsPanel({ incident, onClose }: IncidentDetailsPanelProps) {
  return (
    <div className="w-full max-w-lg bg-card border-l border-border h-screen overflow-y-auto">
      {/* Header */}
      <div className="bg-primary p-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs text-primary-foreground mb-2">
            <span className="bg-primary-foreground text-primary px-2 py-1 rounded text-xs font-medium">HIGH</span>
            <span>{incident.timestamp}</span>
            <span className="text-primary-foreground/80">({timeAgo(incident.timestamp)})</span>
          </div>
          <h2 className="text-base font-medium text-primary-foreground leading-5">{incident.title}</h2>
        </div>
        <button 
          onClick={onClose}
          className="text-primary-foreground/80 hover:text-primary-foreground transition-colors ml-2"
        >
          <X size={18} />
        </button>
      </div>
      
      {/* Attack Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Badge className="bg-red-500 text-white border-0">attack</Badge>
          <Badge className="bg-primary text-primary-foreground border-0">{incident.type}</Badge>
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>First seen: <span className="text-foreground">{incident.firstSeen}</span></span>
          </div>
          <div className="flex justify-between">
            <span>Last seen: <span className="text-foreground">{incident.lastSeen}</span></span>
          </div>
          <div>Triggered on: <span className="text-foreground">{incident.triggeredOn}</span></div>
        </div>
      </div>
      
      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 p-4 border-b border-border">
        <DetailItem label="TYPE" value="Log Detection" icon="🔍" />
        <DetailItem label="SOURCE" value={incident.source} />
        <DetailItem label="SERVICE" value={incident.service} />
        <DetailItem label="USER NAME" value={incident.userName} />
        <DetailItem label="HOST" value={incident.host} />
        <DetailItem label="EVENT OUTCOME" value={incident.outcome} />
      </div>
      
      {/* Tags */}
      <div className="p-4 border-b border-border">
        <h3 className="text-xs text-muted-foreground uppercase mb-3 font-semibold">ALL TAGS</h3>
        <div className="flex flex-wrap gap-1">
          {incident.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-accent text-accent-foreground border-border">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="message" className="w-full">
        <TabsList className="grid grid-cols-3 bg-muted m-4 mb-0">
          <TabsTrigger value="message" className="text-xs">Message</TabsTrigger>
          <TabsTrigger value="attributes" className="text-xs">Event Attributes</TabsTrigger>
          <TabsTrigger value="related" className="text-xs">Related Issues (0)</TabsTrigger>
        </TabsList>
        <TabsContent value="message" className="p-4 space-y-4">
          {incident.goal && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Goal:</h3>
              <p className="text-sm text-muted-foreground">{incident.goal}</p>
            </div>
          )}
          
          {incident.strategy && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Strategy:</h3>
              <p className="text-sm text-muted-foreground">{incident.strategy}</p>
            </div>
          )}
          
          {incident.triageSteps && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Triage & Response:</h3>
              <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-2">
                {incident.triageSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          )}
        </TabsContent>
        <TabsContent value="attributes" className="p-4">
          <p className="text-sm text-muted-foreground">Event attributes information would be displayed here.</p>
        </TabsContent>
        <TabsContent value="related" className="p-4">
          <p className="text-sm text-muted-foreground">No related issues found.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DetailItem({ label, value, icon }: { label: string; value: string; icon?: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-1 font-semibold">{label}</div>
      <div className="flex items-center gap-1 text-sm text-foreground">
        {icon && <span className="text-xs">{icon}</span>}
        <span className="break-all">{value}</span>
      </div>
    </div>
  );
}

function timeAgo(timestamp: string): string {
  // This is a simplified version - in a real app you'd use a proper date library
  return "a month ago";
}