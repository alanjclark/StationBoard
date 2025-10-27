/**
 * Test script to verify Darwin Push Port connection
 * 
 * This script will:
 * 1. Attempt to connect to Darwin Push Port via STOMP
 * 2. Listen for incoming messages
 * 3. Parse and display received messages
 * 4. Display connection status
 * 
 * Usage: node test-darwin.js
 */

const WebSocket = require('ws');
const Stomp = require('stompjs');

// Darwin credentials from DARWIN_CONNECTION_STATUS.md
const DARWIN_CONFIG = {
  host: 'darwin-dist-44ae45.nationalrail.co.uk',
  stompPort: 61613,
  openwirePort: 61616,
  username: 'DARWIN6fc4c393-948c-4e00-86e9-0b6d6fdb6db4',
  password: '9b7c0f43-6d1b-48c3-a29b-cad0189e9814',
  queueName: 'DARWIN6fc4c393-948c-4e00-86e9-0b6d6fdb6db4',
};

let stompClient = null;
let messageCount = 0;
let connectionTimeout = null;

console.log('🚂 Darwin Push Port Connection Test');
console.log('===================================\n');
console.log('Configuration:');
console.log(`  Host: ${DARWIN_CONFIG.host}`);
console.log(`  STOMP Port: ${DARWIN_CONFIG.stompPort}`);
console.log(`  OpenWire Port: ${DARWIN_CONFIG.openwirePort}`);
console.log(`  Username: ${DARWIN_CONFIG.username}`);
console.log(`  Queue: /queue/${DARWIN_CONFIG.queueName}\n`);

function connect() {
  console.log('Attempting to connect...\n');
  
  // Set connection timeout
  connectionTimeout = setTimeout(() => {
    console.error('❌ Connection timeout after 30 seconds');
    process.exit(1);
  }, 30000);

  try {
    // Create WebSocket connection
    const ws = new WebSocket(`ws://${DARWIN_CONFIG.host}:${DARWIN_CONFIG.stompPort}/stomp`);
    
    ws.on('open', () => {
      console.log('✓ WebSocket connection established');
    });

    ws.on('error', (error) => {
      console.error('❌ WebSocket error:', error.message);
      console.log('\nTrying alternative connection methods...\n');
      
      // Try OpenWire port
      tryOpenWire();
    });

    // Wrap with STOMP client
    stompClient = Stomp.over(ws);
    stompClient.debug = (str) => {
      // Only log important messages
      if (str.includes('CONNECTED') || str.includes('ERROR') || str.includes('SUBSCRIBE')) {
        console.log('STOMP:', str);
      }
    };

    // Connect with credentials
    stompClient.connect(
      DARWIN_CONFIG.username,
      DARWIN_CONFIG.password,
      (frame) => {
        clearTimeout(connectionTimeout);
        console.log('✓ STOMP connection successful!');
        console.log('Connected frame:', frame);
        
        // Subscribe to the queue
        const subscription = stompClient.subscribe(`/queue/${DARWIN_CONFIG.queueName}`, (message) => {
          messageCount++;
          console.log(`\n📨 Message #${messageCount} received`);
          console.log('Headers:', JSON.stringify(message.headers, null, 2));
          console.log('Body length:', message.body.length, 'characters');
          
          // Show first 500 characters of body
          if (message.body.length > 0) {
            console.log('Body preview:', message.body.substring(0, 500));
          }
        });

        console.log('✓ Subscribed to Darwin queue');
        console.log('\n⏳ Listening for messages...');
        console.log('   (Press Ctrl+C to stop)\n');
      },
      (error) => {
        console.error('❌ STOMP connection failed:', error.message);
        if (error.headers) {
          console.error('Error headers:', error.headers);
        }
        process.exit(1);
      }
    );
  } catch (error) {
    console.error('❌ Failed to create connection:', error.message);
    tryOpenWire();
  }
}

function tryOpenWire() {
  console.log('\n🔄 Attempting OpenWire protocol on port 61616...\n');
  
  try {
    const ws = new WebSocket(`ws://${DARWIN_CONFIG.host}:${DARWIN_CONFIG.openwirePort}`);
    
    ws.on('open', () => {
      console.log('✓ OpenWire WebSocket connection established');
    });

    ws.on('error', (error) => {
      console.error('❌ OpenWire WebSocket error:', error.message);
      console.log('\n❌ All connection attempts failed');
      console.log('\nPossible issues:');
      console.log('  1. Network/firewall blocking connection');
      console.log('  2. IP not whitelisted by Network Rail');
      console.log('  3. Credentials may have expired');
      console.log('  4. Darwin server may be down');
      process.exit(1);
    });
    
    ws.on('message', (data) => {
      messageCount++;
      console.log(`\n📨 Message #${messageCount} received via OpenWire`);
      console.log('Data length:', data.length, 'bytes');
    });
    
  } catch (error) {
    console.error('❌ Failed to create OpenWire connection:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n⏹️  Shutting down...');
  if (stompClient && stompClient.connected) {
    stompClient.disconnect(() => {
      console.log('✓ Disconnected from Darwin');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

// Start connection
connect();


