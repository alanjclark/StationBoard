/**
 * Quick test to verify if backend can connect to Darwin
 */

const { connectDarwinStomp, isDarwinConnected } = require('./src/services/darwin.stomp');

let messageCount = 0;

console.log('Testing Darwin connection...\n');

// Test connection
connectDarwinStomp(
  (message) => {
    messageCount++;
    console.log(`✅ Message received! (${messageCount})`);
    if (messageCount >= 3) {
      console.log('\n✅ Connection test successful!');
      process.exit(0);
    }
  },
  (status) => {
    console.log(`Connection status: ${status}`);
  }
);

// Wait 30 seconds to see if we get messages
setTimeout(() => {
  console.log('\n⏱️  Timeout waiting for messages');
  console.log(`Connection status: ${isDarwinConnected() ? 'Connected' : 'Not connected'}`);
  process.exit(isDarwinConnected() ? 0 : 1);
}, 30000);


