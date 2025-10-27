/**
 * Test raw TCP STOMP connection to Darwin
 */

const Stomp = require('stompjs');
const net = require('net');

const config = {
  host: 'darwin-dist-44ae45.nationalrail.co.uk',
  port: 61613,
  username: 'DARWIN6fc4c393-948c-4e00-86e9-0b6d6fdb6db4',
  password: '9b7c0f43-6d1b-48c3-a29b-cad0189e9814',
};

console.log('🔌 Testing Raw TCP STOMP connection to Darwin\n');
console.log(`Connecting to: ${config.host}:${config.port}`);

const tcpSocket = new net.Socket();
let connectionEstablished = false;

tcpSocket.on('connect', () => {
  console.log('✓ TCP socket connected');
  connectionEstablished = true;
});

tcpSocket.on('error', (error) => {
  console.error('❌ TCP socket error:', error.message);
});

tcpSocket.on('close', () => {
  console.log('TCP socket closed');
});

// Connect to Darwin
tcpSocket.connect(config.port, config.host, () => {
  console.log('✓ TCP connection established to Darwin server');
  
  // Create STOMP client over the TCP socket
  const stompClient = Stomp.over(tcpSocket);
  stompClient.debug = (str) => {
    if (str.includes('CONNECT') || str.includes('CONNECTED') || str.includes('ERROR')) {
      console.log('STOMP:', str);
    }
  };
  
  // Connect to STOMP broker
  const connectHeaders = {
    login: config.username,
    passcode: config.password,
    'accept-version': '1.0,1.1,1.2',
  };
  
  console.log('\nAttempting STOMP authentication...');
  
  // Wait a moment before sending STOMP connect
  setTimeout(() => {
    console.log('Sending STOMP CONNECT...');
    
    stompClient.connect(
      connectHeaders,
      (frame) => {
        console.log('\n✅ SUCCESS! Connected to Darwin Push Port!');
        console.log(`Connected frame: ${JSON.stringify(frame.headers, null, 2)}`);
        
        // Subscribe to the queue
        const queueName = config.username; // User-specific queue
        const destination = `/queue/${queueName}`;
        
        console.log(`\nSubscribing to: ${destination}`);
        
        stompClient.subscribe(destination, (message) => {
          console.log('\n📨 MESSAGE RECEIVED!');
          console.log('Headers:', JSON.stringify(message.headers, null, 2));
          console.log('Body length:', message.body?.length || 0);
          console.log('\n✅ DATA IS FLOWING! Connection successful!');
          
          // Clean up and exit
          stompClient.disconnect(() => {
            tcpSocket.destroy();
            process.exit(0);
          });
        });
        
        console.log('✓ Subscribed to queue, waiting for messages...\n');
      },
      (error) => {
        console.error('\n❌ STOMP authentication failed');
        console.error('Error:', error);
        if (error.headers) {
          console.error('Error headers:', JSON.stringify(error.headers, null, 2));
        }
        if (error.message) {
          console.error('Error message:', error.message);
        }
        tcpSocket.destroy();
        process.exit(1);
      }
    );
  }, 500);
});

// Timeout after 30 seconds
setTimeout(() => {
  if (!connectionEstablished) {
    console.error('\n❌ Connection timeout - no TCP connection established');
    tcpSocket.destroy();
    process.exit(1);
  }
}, 30000);

