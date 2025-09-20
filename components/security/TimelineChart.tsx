import React from 'react';

type TimelineChartProps = {
  data: {
    time: string;
    value: number;
  }[];
  height?: number;
};

export default function TimelineChart({ data, height = 100 }: TimelineChartProps) {
  // Find the maximum value for scaling
  const maxValue = Math.max(...data.map(item => item.value), 1);
  
  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <div className="flex items-end h-full gap-1 px-4">
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 80; // 80% of container height
          
          return (
            <div 
              key={index} 
              className="flex-1 flex flex-col items-center justify-end"
            >
              <div 
                className="w-full bg-blue-500/70 hover:bg-blue-600 dark:bg-indigo-500/70 dark:hover:bg-indigo-600 transition-colors rounded-t-sm"
                style={{ height: `${barHeight}%`, minHeight: item.value > 0 ? '4px' : '0px' }}
                title={`${item.time}: ${item.value} events`}
              />
              {index % 2 === 0 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 whitespace-nowrap">
                  {item.time}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}