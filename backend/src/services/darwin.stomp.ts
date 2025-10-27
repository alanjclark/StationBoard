import { Client, Frame } from 'stompit';
import xml2js from 'xml2js';
import { getDarwinStompConfig } from './darwin.service';

let client: Client | null = null;
let isConnected = false;
let messageBuffer: any[] = [];
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
        host: config.host,
      },
    };

    // Create TCP connection socket
    client = new Client(connectOptions);

    client.on('error', (error: Error) => {
      console.error('Darwin STOMP client error:', error.message);
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
    });

    client.on('connecting', () => {
      console.log('Connecting to Darwin Push Port...');
    });

    client.connect((error: Error | undefined, client: any) => {
      if (error) {
        console.error('Failed to connect to Darwin:', error.message);
        reconnectAttempts++;
        isConnected = false;
        onStatus('error');
        return;
      }

      console.log('✓ Connected to Darwin Push Port!');
      isConnected = true;
      reconnectAttempts = 0; // Reset counter on success
      onStatus('connected');

      // Subscribe to the queue
      const subscribeHeaders = {
        destination: config.topics.live,
        ack: 'client',
      };

      client.subscribe(subscribeHeaders, (error: Error | undefined, message: any) => {
        if (error) {
          console.error('Subscribe error:', error.message);
          return;
        }

        console.log('✓ Subscribed to Darwin queue:', config.topics.live);

        message.readString('utf8', (error: Error | undefined, body: string | undefined) => {
          if (error) {
            console.error('Error reading message:', error.message);
            return;
          }

          if (body) {
            console.log('Darwin message received!');
            handleDarwinMessage({ body }, onMessage);
          }

          client.ack(message);
        });
      });
    });

  } catch (error: any) {
    console.error('Failed to initialize Darwin STOMP:', error.message);
    onStatus('error');
  }
}

/**
 * Disconnect from Darwin Push Port
 */
export function disconnectDarwinStomp() {
  if (client && isConnected) {
    client.disconnect(() => {
      console.log('Disconnected from Darwin Push Port');
      isConnected = false;
      client = null;
    });
  }
}

/**
 * Parse Darwin XML message and extract train data
 */
async function handleDarwinMessage(
  message: any,
  onMessage: (data: any) => void
) {
  try {
    // Parse XML to JavaScript object
    const parser = new xml2js.Parser({ explicitArray: false });
    const json = await parser.parseStringPromise(message.body);

    // Extract train data from Darwin message format
    // Darwin messages have structure like: Pport { Darwin timestamp ... train data }
    if (json.Pport && json.Pport[0]) {
      const pportData = json.Pport[0];
      
      // Buffer messages for processing
      messageBuffer.push(pportData);
      
      // Process every message immediately
      onMessage(pportData);
    }
  } catch (error) {
    console.error('Error parsing Darwin message:', error);
  }
}

/**
 * Filter messages for a specific station
 */
export function filterMessagesForStation(
  messages: any[],
  stationCRS: string,
  type: 'departure' | 'arrival'
): any[] {
  return messages.filter((msg) => {
    // Parse Darwin train movement message
    // Darwin format: TS messages contain train schedule updates
    if (msg.TS) {
      const tsMessage = Array.isArray(msg.TS) ? msg.TS[0] : msg.TS;
      
      if (type === 'departure') {
        // Check if train departs from this station
        return tsMessage.loc && tsMessage.loc === stationCRS;
      } else {
        // Check if train arrives at this station
        return tsMessage.dest && tsMessage.dest.includes(stationCRS);
      }
    }
    
    return false;
  });
}

/**
 * Check if STOMP client is connected
 */
export function isDarwinConnected(): boolean {
  return isConnected && client !== null;
}
