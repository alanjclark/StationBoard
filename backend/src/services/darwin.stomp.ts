import { getDarwinStompConfig } from './darwin.service';

// Use require for stompit to avoid TypeScript import issues
const stompit = require('stompit');
import { 
  parseDarwinMessage, 
  getMessageType,
  getSequenceNumber 
} from './darwin.parser';
import type { DarwinPportMessage } from '../types/darwin';

let stompClient: any = null;
let isConnected = false;
const messageBuffer: DarwinPportMessage[] = [];
const messageCallbacks: Array<(message: DarwinPportMessage) => void> = [];
let lastSequenceNumber: number | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

/**
 * Connect to Darwin Push Port via Raw TCP STOMP using stompit
 * This is the proper library for raw TCP STOMP connections
 */
export function connectDarwinStomp(
  onMessage: (message: any) => void,
  onStatus: (status: string) => void
) {
  if (isConnected) {
    console.log('Darwin STOMP already connected');
    return;
  }

  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.warn('Max Darwin reconnection attempts reached. Stopping Darwin connection attempts.');
    return;
  }

  let config;
  try {
    config = getDarwinStompConfig();
  } catch (error: any) {
    console.log('Darwin STOMP not configured:', error.message);
    onStatus('error');
    return;
  }

  try {
    
    console.log(`Connecting to Darwin Push Port via Raw TCP STOMP (attempt ${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})...`);
    console.log(`  Host: ${config.host}:${config.stompPort}`);
    console.log(`  Username: ${config.username}`);

    const connectOptions = {
      host: config.host,
      port: config.stompPort,
      connectHeaders: {
        login: config.username,
        passcode: config.password,
        host: '/',
      },
    };

    // Use stompit.connect() helper for proper connection handling
    console.log('Calling stompit.connect with options:', JSON.stringify(connectOptions));
    console.log('stompit type:', typeof stompit);
    console.log('stompit keys:', Object.keys(stompit || {}));
    try {
      stompit.connect(connectOptions, (error: Error | undefined, client: any) => {
      if (error) {
        console.error('Failed to connect to Darwin:', error.message);
        reconnectAttempts++;
        isConnected = false;
        onStatus('error');
        
        // Attempt reconnection after delay with exponential backoff
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          const delayMs = 5000 * reconnectAttempts;
          console.log(`Retrying Darwin connection in ${delayMs}ms...`);
          setTimeout(() => {
            if (!isConnected) {
              connectDarwinStomp(onMessage, onStatus);
            }
          }, delayMs);
        }
        return;
      }

      console.log('✓ Connected to Darwin Push Port!');
      isConnected = true;
      reconnectAttempts = 0; // Reset counter on success
      onStatus('connected');

      // Store client for later use
      stompClient = client;

      // Subscribe to the queue
      const subscribeHeaders = {
        destination: config.topics.live,
        ack: 'client-individual',
      };

      client.subscribe(subscribeHeaders, (error: Error | undefined, message: any) => {
        if (error) {
          console.error('Subscribe error:', error.message);
          return;
        }

        console.log('✓ Subscribed to Darwin queue:', config.topics.live);

        // Read message as buffer for gzip decompression
        const chunks: Buffer[] = [];
        
        message.on('readable', () => {
          let chunk;
          while ((chunk = message.read()) !== null) {
            chunks.push(chunk);
          }
        });

        message.on('end', () => {
          const buffer = Buffer.concat(chunks);
          
          handleDarwinMessage(buffer, message.headers, (parsedMessage) => {
            // Call all registered callbacks
            messageCallbacks.forEach(callback => callback(parsedMessage));
            // Also call the original onMessage for backward compatibility
            onMessage(parsedMessage);
          });

          stompClient.ack(message);
        });
      });
      });
    } catch (connectError: any) {
      console.error('stompit.connect threw error:', connectError.message);
      throw connectError;
    }

  } catch (error: any) {
    console.error('Failed to initialize Darwin STOMP:', error.message);
    console.error('Stack:', error.stack);
    onStatus('error');
  }
}

/**
 * Disconnect from Darwin Push Port
 */
export function disconnectDarwinStomp() {
  if (stompClient && isConnected) {
    stompClient.disconnect(() => {
      console.log('Disconnected from Darwin Push Port');
      isConnected = false;
      stompClient = null;
    });
  }
}

/**
 * Parse Darwin XML message and extract train data
 * Now handles gzip decompression and proper XML parsing
 */
async function handleDarwinMessage(
  buffer: Buffer,
  headers: any,
  onMessage: (parsedMessage: DarwinPportMessage) => void
) {
  try {
    // Parse and decompress message
    const parsedMessage = await parseDarwinMessage(buffer);
    
    if (!parsedMessage) {
      console.warn('Failed to parse Darwin message');
      return;
    }

    // Log message type for debugging
    const messageType = getMessageType(headers);
    if (messageType) {
      console.log(`Darwin ${messageType} message received`);
    }

    // Check for sequence gaps (missing messages)
    const seq = getSequenceNumber(headers);
    if (seq !== null && lastSequenceNumber !== null) {
      const gap = seq - lastSequenceNumber;
      if (gap > 1) {
        console.warn(`Sequence gap detected: ${gap - 1} message(s) missed`);
      }
    }
    lastSequenceNumber = seq;

    // Buffer messages for processing
    messageBuffer.push(parsedMessage);
    
    // Keep buffer size reasonable (last 1000 messages)
    if (messageBuffer.length > 1000) {
      messageBuffer.shift();
    }
    
    // Call callback with parsed message
    onMessage(parsedMessage);
  } catch (error) {
    console.error('Error handling Darwin message:', error);
  }
}

/**
 * Register a callback to receive Darwin messages
 */
export function onDarwinMessage(callback: (message: DarwinPportMessage) => void) {
  messageCallbacks.push(callback);
}

/**
 * Unregister a callback
 */
export function offDarwinMessage(callback: (message: DarwinPportMessage) => void) {
  const index = messageCallbacks.indexOf(callback);
  if (index > -1) {
    messageCallbacks.splice(index, 1);
  }
}

/**
 * Get buffered messages for a specific station
 */
export function getBufferedMessagesForStation(
  stationCRS: string
): DarwinPportMessage[] {
  return messageBuffer.filter(msg => {
    // Check if message contains data for this station
    const updateRecords = msg.uR ? (Array.isArray(msg.uR) ? msg.uR : [msg.uR]) : [];
    const snapshotRecords = msg.sR ? (Array.isArray(msg.sR) ? msg.sR : [msg.sR]) : [];
    const allRecords = [...updateRecords, ...snapshotRecords];
    
    for (const record of allRecords) {
      if (!record.TS) continue;
      const trainStatuses = Array.isArray(record.TS) ? record.TS : [record.TS];
      
      for (const ts of trainStatuses) {
        const locations = ts.loc ? (Array.isArray(ts.loc) ? ts.loc : [ts.loc]) : [];
        for (const loc of locations) {
          if (loc.$?.crs === stationCRS) {
            return true;
          }
        }
      }
    }
    return false;
  });
}

/**
 * Check if STOMP client is connected
 */
export function isDarwinConnected(): boolean {
  return isConnected && stompClient !== null;
}
