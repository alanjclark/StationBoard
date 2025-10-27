/**
 * Test Darwin connection using stompit library with TOPICS (not queues)
 * Based on credentials page: Live Feed Topic: darwin.pushport-v16
 */

const { Client } = require('stompit');
const net = require('net');

const config = {
  host: 'darwin-dist-44ae45.nationalrail.co.uk',
  port: 61613,
  username: 'DARWIN6fc4c393-948c-4e00-86e9-0b6d6fdb6db4',
  password: '9b7c0f43-6d1b-48c3-a29b-cad0189e9814',
  liveTopic: 'darwin.pushport-v16', // From credentials page
  statusTopic: 'darwin.status', // From credentials page
};

console.log('🔌 Testing Darwin with TOPICS (not queues)\n');
console.log(`Connecting to: ${config.host}:${config.port}`);
console.log(`Live Feed Topic: /topic/${config.liveTopic}\n`);

// Create TCP socket
const socket = net.createConnection(config.port, config.host);

let messageCount = 0;
let stompClient;

socket.on('connect', () => {
  console.log('✓ TCP socket connected to Darwin');
  
  // Create STOMP client from socket
  stompClient = new Client(socket);
  
  const connectOptions = {
    login: config.username,
    passcode: config.password,
    host: '/',
    'client-id': config.username,
  };
  
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

    // Subscribe to the TOPIC (not queue)
    const subscribeHeaders = {
      destination: `/topic/${config.liveTopic}`,
      ack: 'client-individual',
    };

    console.log('Subscribing to:', subscribeHeaders.destination);
    
    session.subscribe(subscribeHeaders, (error, message) => {
      if (error) {
        console.error('Subscribe error:', error.message);
        return;
      }

      console.log('✓ Subscribed to Darwin topic\n');
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
          console.log('First 500 chars:', body.substring(0, 500));
          
          if (messageCount >= 2) {
            console.log('\n✅ SUCCESS! Data is flowing from Darwin!');
            session.ack(message);
            stompClient.disconnect(() => {
              socket.end();
              process.exit(0);
            });
            return;
          }
        }

        // Acknowledge the message
        session.ack(message);
      });
    });
  });
});

// Timeout after 60 seconds
setTimeout(() => {
  if (messageCount === 0) {
    console.log('\n⏱️  Timeout - no messages received after 60 seconds');
    console.log('This might be normal if there are no active trains right now');
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


