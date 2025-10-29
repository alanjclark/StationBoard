'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useRealtimeBoard } from '@/hooks/useRealtimeBoard';
import FlipBoard from '@/components/FlipBoard';
import StationSelector from '@/components/StationSelector';

export default function StationBoard() {
  const params = useParams();
  const router = useRouter();
  const crs = params.crs as string;
  const [page, setPage] = useState(0);
  
  const { services, loading, error, connected, lastUpdate } = useRealtimeBoard(crs, 'departure');

  // Get station name from first service or construct from CRS
  const stationName = services[0]?.locationName || `Station ${crs}`;
  
  // Paginate services - 15 per page
  const ROWS_PER_PAGE = 15;
  const totalPages = Math.ceil(services.length / ROWS_PER_PAGE);
  const startIndex = page * ROWS_PER_PAGE;
  const paginatedServices = services.slice(startIndex, startIndex + ROWS_PER_PAGE);
  
  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-flap-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 font-mono text-xl mb-4">ERROR</div>
          <div className="text-gray-400 font-mono">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-flap-black">
      {/* Toolbar */}
      <div className="bg-flap-dark p-4 flex justify-between items-center border-b border-flap-yellow">
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-flap-black text-flap-yellow hover:bg-flap-black/80 font-mono rounded transition-colors"
        >
          ← Home
        </button>

        <StationSelector currentCRS={crs} />

        <div className={`w-3 h-3 rounded-full ${
          connected ? 'bg-green-500' : 'bg-red-500'
        }`} title={connected ? 'Connected' : 'Disconnected'} />
      </div>

      {/* Board */}
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-flap-yellow font-mono text-2xl">Loading...</div>
        </div>
      ) : (
        <>
          <FlipBoard 
            services={paginatedServices} 
            type="departure"
            stationName={stationName}
            lastUpdate={lastUpdate || undefined}
          />
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="fixed bottom-4 right-4 flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={page === 0}
                className={`px-4 py-2 bg-flap-dark text-flap-yellow font-mono rounded border border-flap-yellow hover:bg-flap-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                  page === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-flap-black'
                }`}
              >
                ← Prev
              </button>
              <div className="px-4 py-2 bg-flap-dark text-flap-yellow font-mono rounded border border-flap-yellow">
                Page {page + 1} / {totalPages}
              </div>
              <button
                onClick={handleNextPage}
                disabled={page >= totalPages - 1}
                className={`px-4 py-2 bg-flap-dark text-flap-yellow font-mono rounded border border-flap-yellow hover:bg-flap-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                  page >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-flap-black'
                }`}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

