import { Server, Socket } from 'socket.io';
import { getDepartures, getArrivals } from '../services/darwin.service';
import { 
  connectDarwinStomp, 
  isDarwinConnected,
  filterMessagesForStation 
} from '../services/darwin.stomp';
import type { BoardUpdate } from '../types/darwin';

interface SubscribedStation {
  crs: string;
  type: 'departure' | 'arrival';
  intervalId: NodeJS.Timeout;
}

const subscriptions = new Map<string, SubscribedStation>();
const darwinMessageBuffer: any[] = [];
let globalIO: Server | null = null;

// Store IO instance for Darwin updates
export function setGlobalIO(io: Server) {
  globalIO = io;
  
  // Initialize Darwin STOMP connection (optional - only if credentials are configured)
  try {
    if (!isDarwinConnected()) {
      console.log('Checking Darwin STOMP configuration...');
      connectDarwinStomp(
        (message) => {
          darwinMessageBuffer.push(message);
          console.log('Received Darwin message');
          broadcastDarwinUpdate(message);
        },
        (status) => {
          console.log(`Darwin connection status: ${status}`);
          if (globalIO) {
            globalIO.emit('darwin:status', { status, connected: isDarwinConnected() });
          }
        }
      );
    }
  } catch (error: any) {
    console.log('Darwin STOMP not available:', error.message);
    console.log('Using REST API for train data instead');
  }
}

/**
 * Broadcast Darwin updates to subscribed clients
 */
function broadcastDarwinUpdate(message: any) {
  if (!globalIO) return;
  
  // Broadcast to all subscribed clients
  for (const [key, subscription] of subscriptions.entries()) {
    // TODO: Parse message and filter for this station
    const update: BoardUpdate = {
      stationCRS: subscription.crs,
      services: [], // Will be populated from Darwin message
      lastUpdate: new Date().toISOString(),
      type: subscription.type,
    };
    globalIO.to(key.split(':')[0]).emit('board:update', update);
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

    // Create new subscription
    const subscription: SubscribedStation = {
      crs,
      type,
      intervalId: setInterval(async () => {
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

