import { Badge } from '@/components/ui/badge';

type SecurityCardProps = {
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  source?: string;
  sourceType?: string;
  tags?: string[];
};

export default function SecurityCard({ 
  title, 
  severity, 
  source, 
  sourceType,
  tags = [] 
}: SecurityCardProps) {
  return (
    <div className={`
      border-l-4 bg-card hover:bg-accent/50 cursor-pointer transition-all duration-200 
      border-r border-b border-t border-border rounded-r-md mb-1
      ${severity === 'critical' ? 'border-l-red-500' : ''}
      ${severity === 'high' ? 'border-l-red-400' : ''}
      ${severity === 'medium' ? 'border-l-primary' : ''}
      ${severity === 'low' ? 'border-l-primary' : ''}
      ${severity === 'info' ? 'border-l-primary' : ''}
    `}>
      <div className="p-3">
        <div className="flex items-start gap-3 mb-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5
            ${severity === 'critical' ? 'bg-red-500 text-white' : ''}
            ${severity === 'high' ? 'bg-red-400 text-white' : ''}
            ${severity === 'medium' ? 'bg-primary text-white' : ''}
            ${severity === 'low' ? 'bg-primary text-white' : ''}
            ${severity === 'info' ? 'bg-primary text-white' : ''}
          `}>
            {getSeverityIcon(severity)}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-foreground leading-5">{title}</h3>
          </div>
        </div>
        
        {(source || sourceType) && (
          <div className="flex items-center gap-2 ml-9 mb-2">
            {source && (
              <div className="bg-muted text-xs px-2 py-1 rounded text-muted-foreground border border-border">
                {source}
              </div>
            )}
            {sourceType && (
              <div className={`text-xs px-2 py-1 rounded font-medium
                ${sourceType === 'attack' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : ''}
                ${sourceType === 'compliance' ? 'bg-primary/20 text-primary-foreground border border-primary/30' : ''}
                ${sourceType === 'detection' ? 'bg-primary/20 text-primary-foreground border border-primary/30' : ''}
              `}>
                {sourceType}
              </div>
            )}
          </div>
        )}
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 ml-9">
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-accent text-accent-foreground border-border hover:bg-accent/80">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getSeverityIcon(severity: string): string {
  switch (severity) {
    case 'critical': return '!';
    case 'high': return '!';
    case 'medium': return '!';
    case 'low': return 'i';
    case 'info': return 'i';
    default: return 'i';
  }
}