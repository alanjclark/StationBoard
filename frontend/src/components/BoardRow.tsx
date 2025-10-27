'use client';

import type { TrainService } from '@/types/darwin';

interface BoardRowProps {
  service: TrainService;
}

export default function BoardRow({ service }: BoardRowProps) {
  // Scheduled time (std for departure, sta for arrival)
  const scheduledTime = service.std || service.sta || '--:--';
  
  // Expected time (etd for departure, eta for arrival, fall back to scheduled if not available)
  const estimatedTime = service.etd || service.eta;
  const hasEstimatedTime = estimatedTime && estimatedTime.trim() !== '';
  
  // Check if train is actually delayed - compare estimated with scheduled
  // Only mark as delayed if times are different
  const estimatedTimeTrimmed = estimatedTime?.trim() || '';
  const scheduledTimeTrimmed = scheduledTime?.trim() || '';
  const isDelayed = hasEstimatedTime && 
                    estimatedTimeTrimmed !== '' &&
                    estimatedTimeTrimmed !== scheduledTimeTrimmed &&
                    estimatedTime !== scheduledTime &&
                    !service.isCancelled;
  
  const expectedTime = hasEstimatedTime ? estimatedTime : scheduledTime;
  
  const destination = service.destination?.[0]?.location?.description || service.locationName || 'Unknown';
  const platform = service.platform || '--';
  
  // Format status based on train state
  let statusText = '';
  
  if (service.isCancelled) {
    statusText = 'CANCELLED';
  } else if (isDelayed) {
    statusText = 'DELAYED';
  } else {
    statusText = 'ON TIME';
  }
  
  return (
    <div className="grid grid-cols-[80px_100px_minmax(0,1fr)_80px_120px] gap-4 items-center bg-gray-950 border-b border-gray-800 py-2 px-4 font-mono">
      {/* Scheduled Time */}
      <div className="text-yellow-300 text-2xl tracking-wider">
        {scheduledTime}
      </div>
      
      {/* Expected Time (if delayed) or blank */}
      <div className="text-yellow-300 text-xl">
        {isDelayed && expectedTime !== scheduledTime ? expectedTime : ''}
      </div>
      
      {/* Destination */}
      <div className="text-yellow-300 text-xl uppercase truncate">
        {destination}
      </div>
      
      {/* Platform */}
      <div className="text-yellow-300 text-xl">
        {platform}
      </div>
      
      {/* Status */}
      <div className="text-yellow-300 text-lg uppercase">
        {statusText}
      </div>
    </div>
  );
}

