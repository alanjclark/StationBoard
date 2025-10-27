'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import type { Station } from '@/types/darwin';

interface StationSelectorProps {
  currentCRS?: string;
}

export default function StationSelector({ currentCRS }: StationSelectorProps) {
  const [stations, setStations] = useState<Station[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Station[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchStations() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/api/stations`);
        const data = await response.json();
        setStations(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stations:', error);
        setLoading(false);
      }
    }

    fetchStations();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const fuse = new Fuse(stations, {
      keys: ['name', 'description', 'crs'],
      threshold: 0.3,
    });

    const searchResults = fuse.search(searchTerm).map((result) => result.item);
    setResults(searchResults.slice(0, 10)); // Limit to 10 results
  }, [searchTerm, stations]);

  const handleSelect = (station: Station) => {
    router.push(`/station/${station.crs}`);
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search for a station..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
        className="w-full px-4 py-3 bg-flap-dark text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-flap-yellow font-mono"
        disabled={loading}
      />
      
      {showResults && results.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-flap-dark border border-gray-600 rounded-lg shadow-xl max-h-96 overflow-auto">
          {results.map((station) => (
            <button
              key={station.crs}
              onClick={() => handleSelect(station)}
              className="w-full px-4 py-3 text-left hover:bg-flap-black transition-colors border-b border-gray-700 last:border-b-0"
            >
              <div className="font-mono text-flap-yellow">{station.name}</div>
              <div className="text-sm text-gray-400">{station.crs}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

