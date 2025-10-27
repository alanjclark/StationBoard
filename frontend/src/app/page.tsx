'use client';

import { useRouter } from 'next/navigation';
import StationSelector from '@/components/StationSelector';

export default function Home() {
  return (
    <div className="min-h-screen bg-flap-black flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-mono text-flap-yellow-bright mb-4">
          STATIONBOARD
        </h1>
        <p className="text-xl text-gray-400 font-mono">
          Vintage Flap Display for UK Rail
        </p>
      </div>

      <StationSelector />

      <div className="mt-12 text-center text-gray-500 text-sm font-mono">
        <p>Select a station to view departures and arrivals</p>
        <p className="mt-2">Example: London Paddington (PAD)</p>
      </div>
    </div>
  );
}

