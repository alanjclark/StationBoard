'use client';

import BoardRow from '@/components/BoardRow';
import type { TrainService } from '@/types/darwin';

interface FlipBoardProps {
  services: TrainService[];
  type: 'departure' | 'arrival';
  stationName: string;
  lastUpdate?: string;
}

export default function FlipBoard({ 
  services, 
  type, 
  stationName,
  lastUpdate 
}: FlipBoardProps) {
  return (
    <div className="bg-gray-950 min-h-screen p-8">
      {/* Board Panel */}
      <div className="max-w-7xl mx-auto bg-black border-4 border-gray-800 p-6">
        {/* Board Title */}
        <div className="text-white text-center mb-6 uppercase tracking-widest font-bold text-2xl">
          Train Information
        </div>
        
        {/* Header Row */}
        <div className="grid grid-cols-[80px_100px_minmax(0,1fr)_80px_120px] gap-4 items-center mb-2 pb-2 border-b-2 border-gray-700 font-mono">
          <div className="text-white text-sm uppercase tracking-wide">Time</div>
          <div className="text-white text-sm uppercase tracking-wide">Expected</div>
          <div className="text-white text-sm uppercase tracking-wide">Destination</div>
          <div className="text-white text-sm uppercase tracking-wide">PLT</div>
          <div className="text-white text-sm uppercase tracking-wide">Status</div>
        </div>
        
        {/* Service Rows */}
        {services.length === 0 ? (
          <div className="py-8 text-center text-gray-500 font-mono">
            <div className="text-yellow-300 text-xl">NO SERVICES AVAILABLE</div>
          </div>
        ) : (
          <div>
            {services.map((service, index) => (
              <BoardRow key={service.serviceID || index} service={service} />
            ))}
          </div>
        )}
      </div>
      
      {/* Last Update Footer */}
      {lastUpdate && (
        <div className="mt-6 text-center text-gray-500 text-sm font-mono">
          Last update: {new Date(lastUpdate).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}

