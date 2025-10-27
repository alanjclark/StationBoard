/**
 * Test Darwin connection using stompit library
 */

const { Client } = require('stompit');
const net = require('net');
require('dotenv').config();

const config = {
  host: 'darwin-dist-44ae45.nationalrail.co.uk',
  port: 61613,
  username: 'DARWIN6fc4c393-948c-4e00-86e9-0b6d6fdb6db4',
  password: '9b7c0f43-6d1b-48c3-a29b-cad0189e9814',
};

console.log('🔌 Testing stompit library with Darwin\n');
console.log(`Connecting to: ${config.host}:${config.port}`);

const connectOptions = {
  host: config.host,
  port: config.port,
  connectHeaders: {
    login: config.username,
    passcode: config.password,
    host: '/',
  },
};

// Create TCP socket
const socket = net.createConnection(config.port, config.host);

let messageCount = 0;
let stompClient;

socket.on('connect', () => {
  console.log('✓ TCP socket connected to Darwin');
  
  // Create STOMP client from socket
  stompClient = new Client(socket);
  
  // Connect to STOMP broker
  stompClient.connect(connectOptions, (error, session) => {
    if (error) {
      console.error('\n❌ Failed to connect to Darwin');
      console.error('Error:', error.message);
      socket.end();
      process.exit(1);
      return;
    }

    console.log('✅ SUCCESS! Connected to Darwin Push Port!\n');

    // Subscribe to the queue
    const subscribeHeaders = {
      destination: `/queue/${config.username}`,
      ack: 'client',
    };

    console.log('Subscribing to:', subscribeHeaders.destination);
    
    session.subscribe(subscribeHeaders, (error, message) => {
      if (error) {
        console.error('Subscribe error:', error.message);
        return;
      }

      console.log('✓ Subscribed to Darwin queue\n');
      console.log('⏳ Waiting for messages...\n');

      message.readString('utf8', (error, body) => {
        if (error) {
          console.error('Error reading message:', error.message);
          return;
        }

        if (body) {
          messageCount++;
          console.log(`\n📨 MESSAGE #${messageCount} RECEIVED!`);
          console.log('Body length:', body.length, 'characters');
          console.log('First 300 chars:', body.substring(0, 300));
          
          if (messageCount >= 2) {
            console.log('\n✅ SUCCESS! Data is flowing from Darwin!');
            session.ack(message);
            client.disconnect(() => {
              socket.end();
              process.exit(0);
            });
          }
        }

        // Acknowledge the message
        if (messageCount < 2) {
          session.ack(message);
        }
      });
    });
  });
});

// Timeout after 60 seconds
setTimeout(() => {
  if (messageCount === 0) {
    console.log('\n⏱️  Timeout - no messages received after 60 seconds');
    console.log('This might be normal if there are no active trains for your queue');
  }
  if (stompClient) {
    stompClient.disconnect(() => {
      socket.end();
      process.exit(0);
    });
  } else {
    socket.end();
    process.exit(0);
  }
}, 60000);

socket.on('error', (error) => {
  console.error('❌ Socket error:', error.message);
  process.exit(1);
});
