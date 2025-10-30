import { Server, Socket } from 'socket.io';
import { getDepartures, getArrivals } from '../services/darwin.service';
import { 
  connectDarwinStomp, 
  isDarwinConnected,
  onDarwinMessage
} from '../services/darwin.stomp';
import {
  shouldProcessMessage,
  extractTrainServices
} from '../services/darwin.parser';
import type { BoardUpdate, DarwinPportMessage } from '../types/darwin';

interface SubscribedStation {
  crs: string;
  type: 'departure' | 'arrival';
  intervalId: NodeJS.Timeout;
}

const subscriptions = new Map<string, SubscribedStation>();
let globalIO: Server | null = null;

// Store IO instance for Darwin updates
export function setGlobalIO(io: Server) {
  globalIO = io;
  
  // Initialize Darwin STOMP connection (optional - only if credentials are configured)
  try {
    if (!isDarwinConnected()) {
      console.log('Checking Darwin STOMP configuration...');
      
      const statusCallback = (status: string) => {
        console.log(`Darwin connection status: ${status}`);
        if (status === 'connected') {
          console.log('✅ Using Darwin Push Port for real-time updates');
        }
        if (globalIO) {
          globalIO.emit('darwin:status', { status, connected: isDarwinConnected() });
        }
      };

      const messageCallback = (message: DarwinPportMessage) => {
        broadcastDarwinUpdate(message);
      };

      connectDarwinStomp(
        messageCallback,
        statusCallback
      );
      
      // Register callback for Darwin messages
      onDarwinMessage(messageCallback);
    } else {
      console.log('✅ Darwin STOMP already connected - using push updates');
    }
  } catch (error: any) {
    console.log('⚠️ Darwin STOMP not available:', error.message);
    console.log('   Using REST API polling for train data instead');
  }
}

/**
 * Broadcast Darwin updates to subscribed clients
 * Now properly parses and filters messages by station
 */
function broadcastDarwinUpdate(message: DarwinPportMessage) {
  if (!globalIO) return;
  
  // Broadcast to all subscribed clients
  for (const [key, subscription] of subscriptions.entries()) {
    const socketId = key.split(':')[0];
    
    // Check if message is relevant for this station
    if (!shouldProcessMessage(message, subscription.crs)) {
      continue;
    }
    
    // Extract train services from Darwin message
    const services = extractTrainServices(message, subscription.crs, subscription.type);
    
    if (services.length === 0) {
      continue;
    }
    
    const update: BoardUpdate = {
      stationCRS: subscription.crs,
      services,
      lastUpdate: new Date().toISOString(),
      type: subscription.type,
    };
    
    globalIO.to(socketId).emit('board:update', update);
  }
}

/**
 * WebSocket handler for real-time board updates
 */
export default function boardSocket(io: Server, socket: Socket) {
  console.log(`Client connected: ${socket.id}`);

  /**
   * Subscribe to station updates
   */
  socket.on('subscribe', async (data: { crs: string; type: 'departure' | 'arrival' }) => {
    const { crs, type } = data;
    const subscriptionKey = `${socket.id}:${crs}:${type}`;

    console.log(`Subscription request: ${crs} (${type}) from ${socket.id}`);

    // Cancel existing subscription if any
    const existing = subscriptions.get(`${socket.id}:${crs}:${type}`);
    if (existing) {
      clearInterval(existing.intervalId);
    }

    // Determine if using Darwin push or REST polling
    const useDarwinPush = isDarwinConnected();
    
    if (useDarwinPush) {
      console.log(`  Using Darwin push for ${crs}`);
    } else {
      console.log(`  Using REST polling for ${crs}`);
    }

    // Create subscription with appropriate update mechanism
    const subscription: SubscribedStation = {
      crs,
      type,
      // Only create polling interval if Darwin push is NOT available
      intervalId: useDarwinPush ? {} as NodeJS.Timeout : setInterval(async () => {
        try {
          const services = type === 'departure' 
            ? await getDepartures(crs)
            : await getArrivals(crs);

          const update: BoardUpdate = {
            stationCRS: crs,
            services,
            lastUpdate: new Date().toISOString(),
            type,
          };

          socket.emit('board:update', update);
        } catch (error) {
          console.error(`Error fetching ${type} for ${crs}:`, error);
          socket.emit('board:error', {
            crs,
            type,
            error: 'Failed to fetch board data',
          });
        }
      }, 30000), // Poll every 30 seconds
    };

    subscriptions.set(subscriptionKey, subscription);

    // Fetch initial data immediately
    try {
      const services = type === 'departure' 
        ? await getDepartures(crs)
        : await getArrivals(crs);

      const update: BoardUpdate = {
        stationCRS: crs,
        services,
        lastUpdate: new Date().toISOString(),
        type,
      };

      socket.emit('board:update', update);
    } catch (error) {
      console.error(`Error fetching initial ${type} for ${crs}:`, error);
      socket.emit('board:error', {
        crs,
        type,
        error: 'Failed to fetch initial board data',
      });
    }
  });

  /**
   * Unsubscribe from station updates
   */
  socket.on('unsubscribe', (data: { crs: string; type: 'departure' | 'arrival' }) => {
    const { crs, type } = data;
    const subscriptionKey = `${socket.id}:${crs}:${type}`;
    const subscription = subscriptions.get(subscriptionKey);

    if (subscription) {
      clearInterval(subscription.intervalId);
      subscriptions.delete(subscriptionKey);
      console.log(`Unsubscribed ${socket.id} from ${crs} (${type})`);
    }
  });

  /**
   * Handle disconnect
   */
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    
    // Clean up all subscriptions for this socket
    for (const [key, subscription] of subscriptions.entries()) {
      if (key.startsWith(`${socket.id}:`)) {
        clearInterval(subscription.intervalId);
        subscriptions.delete(key);
      }
    }
  });

  // Send connection status
  socket.emit('connection:status', { connected: true });
}

