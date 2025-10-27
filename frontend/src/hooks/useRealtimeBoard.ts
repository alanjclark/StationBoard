'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { BoardUpdate, TrainService } from '@/types/darwin';

interface UseRealtimeBoardReturn {
  services: TrainService[];
  loading: boolean;
  error: string | null;
  connected: boolean;
  lastUpdate: string | null;
}

export function useRealtimeBoard(
  crs: string | null,
  type: 'departure' | 'arrival'
): UseRealtimeBoardReturn {
  const [services, setServices] = useState<TrainService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!crs) {
      setLoading(false);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const socket = io(apiUrl);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('WebSocket connected');
      setConnected(true);
      setError(null);
      
      // Subscribe to station updates
      socket.emit('subscribe', { crs, type });
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    });

    socket.on('connection:status', (status: { connected: boolean }) => {
      setConnected(status.connected);
    });

    socket.on('board:update', (update: BoardUpdate) => {
      console.log('Board update received:', update);
      setServices(update.services);
      setLastUpdate(update.lastUpdate);
      setLoading(false);
      setError(null);
    });

    socket.on('board:error', (errorData: { error: string }) => {
      console.error('Board error:', errorData.error);
      setError(errorData.error);
      setLoading(false);
    });

    // Cleanup on unmount or when crs/type changes
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('unsubscribe', { crs, type });
        socketRef.current.disconnect();
      }
    };
  }, [crs, type]);

  return {
    services,
    loading,
    error,
    connected,
    lastUpdate,
  };
}

