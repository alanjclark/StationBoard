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
  const expectedTime = hasEstimatedTime ? estimatedTime : scheduledTime;
  
  // Check if train is actually delayed
  // A train is delayed only if the estimated time is LATER than the scheduled time
  let isDelayed = false;
  if (!service.isCancelled && hasEstimatedTime && estimatedTime !== scheduledTime) {
    try {
      const parseTime = (timeStr: string): number => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };
      
      const scheduledMinutes = parseTime(scheduledTime);
      const estimatedMinutes = parseTime(estimatedTime);
      
      // Calculate time difference, handling next-day wrap-around
      const timeDiff = estimatedMinutes - scheduledMinutes;
      const delayMinutes = timeDiff < 0 ? timeDiff + 1440 : timeDiff;
      
      // Only mark as delayed if estimated time is later (more than 1 minute difference)
      isDelayed = delayMinutes > 1;
    } catch (e) {
      // If parsing fails, default to checking if times are different
      isDelayed = estimatedTime !== scheduledTime;
    }
  }
  
  const destination = service.destination?.[0]?.location?.description || service.locationName || 'Unknown';
  const platform = service.platform || '--';
  
  // Determine delay signals provided by Darwin that don't rely solely on time deltas
  const hasDelaySignal = Boolean(
    service.delayReason && service.delayReason.trim() !== ''
  ) || Boolean(
    service.overdueMessage && service.overdueMessage.trim() !== ''
  ) || (hasEstimatedTime && /delayed/i.test(estimatedTime));

  // Format status based on train state
  let statusText = '';

  if (service.isCancelled) {
    statusText = 'CANCELLED';
  } else if (hasDelaySignal || isDelayed) {
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
        {(hasDelaySignal || isDelayed) && expectedTime !== scheduledTime ? expectedTime : ''}
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

