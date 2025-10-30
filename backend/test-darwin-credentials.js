/**
 * Test Darwin Push Port credentials and connection
 * Based on test-stompit-connect.js pattern
 * 
 * This script verifies:
 * 1. STOMP connection to Darwin Push Port
 * 2. Gzip decompression of messages
 * 3. XML message structure parsing
 * 4. Message types identification
 * 
 * Usage: node test-darwin-credentials.js
 */

const stompit = require('stompit');
const zlib = require('zlib');
const xml2js = require('xml2js');
const dotenv = require('dotenv');

// Load environment variables from project root
dotenv.config({ path: '../.env' });

const connectOptions = {
  host: process.env.DARWIN_MESSAGING_HOST || 'darwin-dist-44ae45.nationalrail.co.uk',
  port: parseInt(process.env.DARWIN_STOMP_PORT || '61613', 10),
  connectHeaders: {
    login: process.env.DARWIN_PUSH_PORT_USERNAME,
    passcode: process.env.DARWIN_PUSH_PORT_PASSWORD,
    host: '/',
    'accept-version': '1.0,1.1,1.2',
    'heart-beat': '5000,5000',
  },
};

console.log('🔌 Testing Darwin Push Port Connection\n');
console.log('Configuration:');
console.log(`  Host: ${connectOptions.host}`);
console.log(`  Port: ${connectOptions.port}`);
console.log(`  Username: ${connectOptions.connectHeaders.login}\n`);

let messageCount = 0;
let messageTypes = new Set();

stompit.connect(connectOptions, (error, client) => {
  if (error) {
    console.error('❌ Connection error:', error.message);
    console.error('Error details:', error);
    console.log('\n💡 Check:');
    console.log('  - Are credentials correct in .env?');
    console.log('  - Is network/firewall blocking connection?');
    console.log('  - Has Darwin account been activated?');
    process.exit(1);
    return;
  }

  console.log('✅ Connected to Darwin Push Port!\n');

  const topicName = process.env.DARWIN_TOPIC_LIVE || 'darwin.pushport-v16';
  const subscribeHeaders = {
    destination: `/topic/${topicName}`,
    ack: 'client-individual',
  };

  console.log(`Subscribing to: ${subscribeHeaders.destination}\n`);
  console.log('⏳ Waiting for messages (they are gzip compressed)...\n');

  client.subscribe(subscribeHeaders, (error, message) => {
    if (error) {
      console.error('❌ Subscribe error:', error.message);
      return;
    }

    console.log('✓ Subscribed successfully\n');

    // Read the message body
    const chunks = [];
    
    message.on('readable', () => {
      let chunk;
      while ((chunk = message.read()) !== null) {
        chunks.push(chunk);
      }
    });

    message.on('end', () => {
      const buffer = Buffer.concat(chunks);
      
      // Decompress gzip message
      zlib.gunzip(buffer, (err, decompressed) => {
        if (err) {
          console.error('❌ Decompression error:', err.message);
          console.log('Trying to read as plain text...');
          console.log('Raw data:', buffer.toString('utf8').substring(0, 200));
          client.ack(message);
          return;
        }

        messageCount++;
        const body = decompressed.toString('utf8');
        
        console.log(`\n📨 MESSAGE #${messageCount} RECEIVED`);
        console.log('Decompressed length:', body.length, 'characters');
        console.log('Headers:', JSON.stringify(message.headers, null, 2));
        
        // Parse XML to understand structure
        xml2js.parseString(body, { explicitArray: false }, (parseError, result) => {
          if (parseError) {
            console.error('❌ XML Parse error:', parseError.message);
            console.log('First 500 chars:', body.substring(0, 500));
          } else {
            console.log('\n📊 XML Structure Analysis:');
            if (result.Pport) {
              console.log('  Root element: Pport');
              console.log('  Attributes:', JSON.stringify(result.Pport.$, null, 2));
              
              // Identify message types
              if (result.Pport.uR) {
                const uR = Array.isArray(result.Pport.uR) ? result.Pport.uR : [result.Pport.uR];
                console.log(`  Update Records (uR): ${uR.length}`);
                
                uR.forEach((ur, index) => {
                  console.log(`\n  Update Record ${index + 1}:`);
                  Object.keys(ur).forEach(key => {
                    if (key !== '$') {
                      messageTypes.add(key);
                      console.log(`    - ${key}: present`);
                    }
                  });
                });
              }
              
              if (result.Pport.sR) {
                console.log('  Snapshot Records (sR): present (delayed/recovery data)');
              }
            }
          }
          
          console.log('\n📋 Message Types Detected:', Array.from(messageTypes).join(', '));
        });

        client.ack(message);

        // Collect 3 messages then exit
        if (messageCount >= 3) {
          console.log('\n✅ SUCCESS! Darwin credentials working correctly');
          console.log(`\nSummary:`);
          console.log(`  - Messages received: ${messageCount}`);
          console.log(`  - Message types found: ${Array.from(messageTypes).join(', ')}`);
          console.log(`  - All messages gzip-compressed: Yes`);
          console.log(`  - XML structure: Pport > uR/sR > message types`);
          client.disconnect();
          process.exit(0);
        }
      });
    });

    message.on('error', (error) => {
      console.error('❌ Message error:', error.message);
    });
  });
});

// Timeout after 120 seconds
setTimeout(() => {
  console.log('\n⏱️  Timeout after 120 seconds');
  if (messageCount === 0) {
    console.log('\n❌ No messages received');
    console.log('\n💡 Possible reasons:');
    console.log('  - Credentials incorrect or account not activated');
    console.log('  - Network/firewall blocking connection');
    console.log('  - Darwin Push Port temporarily unavailable');
    console.log('  - No trains running (unlikely during normal hours)');
  } else {
    console.log(`\n✅ Received ${messageCount} message(s) successfully`);
  }
  process.exit(messageCount > 0 ? 0 : 1);
}, 120000);


