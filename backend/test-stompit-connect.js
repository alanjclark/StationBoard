/**
 * Test Darwin connection using stompit.connect() helper
 */

const stompit = require('stompit');
const zlib = require('zlib');

const connectOptions = {
  host: 'darwin-dist-44ae45.nationalrail.co.uk',
  port: 61613,
  connectHeaders: {
    login: 'DARWIN6fc4c393-948c-4e00-86e9-0b6d6fdb6db4',
    passcode: '9b7c0f43-6d1b-48c3-a29b-cad0189e9814',
    host: '/',
    'accept-version': '1.0,1.1,1.2',
    'heart-beat': '5000,5000',
  },
};

console.log('🔌 Testing Darwin with stompit.connect()\n');
console.log(`Connecting to: ${connectOptions.host}:${connectOptions.port}\n`);

let messageCount = 0;

stompit.connect(connectOptions, (error, client) => {
  if (error) {
    console.error('❌ Connection error:', error.message);
    console.error('Error details:', error);
    process.exit(1);
    return;
  }

  console.log('✅ Connected to Darwin Push Port!\n');

  const subscribeHeaders = {
    destination: '/topic/darwin.pushport-v16',
    ack: 'client-individual',
  };

  console.log('Subscribing to:', subscribeHeaders.destination);

  client.subscribe(subscribeHeaders, (error, message) => {
    if (error) {
      console.error('❌ Subscribe error:', error.message);
      return;
    }

    console.log('✓ Subscribed successfully\n');
    console.log('⏳ Waiting for messages (they are gzip compressed)...\n');

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
        
        console.log(`\n📨 MESSAGE #${messageCount} RECEIVED AND DECOMPRESSED!`);
        console.log('Decompressed length:', body.length, 'characters');
        console.log('First 500 chars:', body.substring(0, 500));
        console.log('\n✅ SUCCESS! Darwin data is flowing!');

        client.ack(message);

        if (messageCount >= 2) {
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

// Timeout after 90 seconds
setTimeout(() => {
  console.log('\n⏱️  Timeout after 90 seconds');
  if (messageCount === 0) {
    console.log('No messages received - this might be normal if no trains are running');
  }
  process.exit(0);
}, 90000);


