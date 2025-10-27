/**
 * Comprehensive Darwin Push Port Diagnostic Test
 * 
 * This script tests various connection methods to find the root cause:
 * 1. Raw TCP STOMP connection
 * 2. WebSocket STOMP connection
 * 3. OpenWire connection
 * 4. Credential verification
 */

const WebSocket = require('ws');
const net = require('net');
const Stomp = require('stompjs');

const DARWIN_CONFIG = {
  host: 'darwin-dist-44ae45.nationalrail.co.uk',
  stompPort: 61613,
  openwirePort: 61616,
  username: 'DARWIN6fc4c393-948c-4e00-86e9-0b6d6fdb6db4',
  password: '9b7c0f43-6d1b-48c3-a29b-cad0189e9814',
  queueName: 'DARWIN6fc4c393-948c-4e00-86e9-0b6d6fdb6db4',
};

console.log('🔍 Darwin Push Port Diagnostic Test');
console.log('===================================\n');

let testsPassed = 0;
let testsFailed = 0;

function logResult(name, passed, details = '') {
  if (passed) {
    console.log(`✅ ${name}`);
    testsPassed++;
  } else {
    console.log(`❌ ${name}`);
    testsFailed++;
    if (details) {
      console.log(`   ${details}`);
    }
  }
}

async function test1_RawTCPConnection() {
  console.log('\n📡 Test 1: Raw TCP Connection\n');
  
  return new Promise((resolve) => {
    const client = net.createConnection(DARWIN_CONFIG.stompPort, DARWIN_CONFIG.host);
    
    client.on('connect', () => {
      logResult('Raw TCP connection established', true);
      client.end();
      resolve(true);
    });
    
    client.on('error', (error) => {
      logResult('Raw TCP connection failed', false, error.message);
      resolve(false);
    });
    
    client.on('timeout', () => {
      logResult('Raw TCP connection timed out', false);
      client.destroy();
      resolve(false);
    });
    
    client.setTimeout(10000);
  });
}

async function test2_WebSocketConnection() {
  console.log('\n📡 Test 2: WebSocket Connection\n');
  
  return new Promise((resolve) => {
    let connected = false;
    
    try {
      const ws = new WebSocket(`ws://${DARWIN_CONFIG.host}:${DARWIN_CONFIG.stompPort}/stomp`);
      
      ws.on('open', () => {
        logResult('WebSocket opened successfully', true);
        connected = true;
        ws.close();
        resolve(true);
      });
      
      ws.on('error', (error) => {
        if (!connected) {
          logResult('WebSocket connection failed', false, error.message);
          resolve(false);
        }
      });
      
      ws.on('close', () => {
        if (connected) {
          resolve(true);
        }
      });
      
      // Timeout after 10 seconds
      setTimeout(() => {
        if (!connected) {
          logResult('WebSocket connection timeout', false, 'No response after 10 seconds');
          ws.terminate();
          resolve(false);
        }
      }, 10000);
      
    } catch (error) {
      logResult('WebSocket connection failed', false, error.message);
      resolve(false);
    }
  });
}

async function test3_OpenWireConnection() {
  console.log('\n📡 Test 3: OpenWire Port Connection\n');
  
  return new Promise((resolve) => {
    let connected = false;
    
    try {
      const ws = new WebSocket(`ws://${DARWIN_CONFIG.host}:${DARWIN_CONFIG.openwirePort}`);
      
      ws.on('open', () => {
        logResult('OpenWire WebSocket opened', true);
        connected = true;
        ws.close();
        resolve(true);
      });
      
      ws.on('error', (error) => {
        if (!connected) {
          logResult('OpenWire WebSocket failed', false, error.message);
          resolve(false);
        }
      });
      
      ws.on('close', () => {
        if (connected) {
          resolve(true);
        }
      });
      
      setTimeout(() => {
        if (!connected) {
          logResult('OpenWire connection timeout', false, 'No response after 10 seconds');
          ws.terminate();
          resolve(false);
        }
      }, 10000);
      
    } catch (error) {
      logResult('OpenWire connection failed', false, error.message);
      resolve(false);
    }
  });
}

async function test4_DNSResolution() {
  console.log('\n📡 Test 4: DNS Resolution\n');
  
  return new Promise((resolve) => {
    const { lookup } = require('dns');
    
    lookup(DARWIN_CONFIG.host, (err, address, family) => {
      if (err) {
        logResult('DNS lookup failed', false, err.message);
        resolve(false);
      } else {
        logResult(`DNS resolved: ${DARWIN_CONFIG.host} → ${address}`, true);
        resolve(true);
      }
    });
  });
}

async function test5_STOMPAuthentication() {
  console.log('\n📡 Test 5: STOMP Authentication\n');
  
  return new Promise((resolve) => {
    try {
      const ws = new WebSocket(`ws://${DARWIN_CONFIG.host}:${DARWIN_CONFIG.stompPort}/stomp`);
      const stomp = Stomp.over(ws);
      stomp.debug = () => {}; // Suppress debug output
      
      let testComplete = false;
      
      const timeout = setTimeout(() => {
        if (!testComplete) {
          logResult('STOMP authentication timeout', false, 'No response after 15 seconds');
          testComplete = true;
          resolve(false);
        }
      }, 15000);
      
      stomp.connect(
        DARWIN_CONFIG.username,
        DARWIN_CONFIG.password,
        (frame) => {
          clearTimeout(timeout);
          if (!testComplete) {
            logResult('STOMP authentication successful', true, `Frame: ${frame.command}`);
            testComplete = true;
            stomp.disconnect(() => resolve(true));
          }
        },
        (error) => {
          clearTimeout(timeout);
          if (!testComplete) {
            logResult('STOMP authentication failed', false, error.message || 'Connection rejected');
            testComplete = true;
            resolve(false);
          }
        }
      );
      
      ws.on('error', (error) => {
        if (!testComplete) {
          clearTimeout(timeout);
          logResult('STOMP WebSocket error', false, error.message);
          testComplete = true;
          resolve(false);
        }
      });
      
    } catch (error) {
      logResult('STOMP connection setup failed', false, error.message);
      resolve(false);
    }
  });
}

async function test6_PortScan() {
  console.log('\n📡 Test 6: Port Availability Check\n');
  
  const ports = [
    { port: 61613, name: 'STOMP' },
    { port: 61616, name: 'OpenWire' },
    { port: 80, name: 'HTTP' },
    { port: 443, name: 'HTTPS' }
  ];
  
  const results = await Promise.all(
    ports.map(p => testPort(p.port, p.name))
  );
  
  return results.every(r => r);
}

function testPort(port, name) {
  return new Promise((resolve) => {
    const client = net.createConnection(port, DARWIN_CONFIG.host);
    
    client.on('connect', () => {
      logResult(`Port ${port} (${name}) is accessible`, true);
      client.end();
      resolve(true);
    });
    
    client.on('error', (error) => {
      if (port === 61613 || port === 61616) {
        // Expected to be open
        logResult(`Port ${port} (${name}) not accessible`, false, error.message);
      }
      resolve(false);
    });
    
    client.setTimeout(5000);
    client.on('timeout', () => {
      client.destroy();
      resolve(false);
    });
  });
}

// Run all tests
async function runDiagnostics() {
  const results = {
    dns: await test4_DNSResolution(),
    rawTCP: await test1_RawTCPConnection(),
    webSocket: await test2_WebSocketConnection(),
    openWire: await test3_OpenWireConnection(),
    ports: await test6_PortScan(),
    auth: await test5_STOMPAuthentication(),
  };
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 DIAGNOSTIC SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Tests Passed: ${testsPassed}`);
  console.log(`❌ Tests Failed: ${testsFailed}\n`);
  
  console.log('Detailed Results:');
  console.log(`  DNS Resolution:     ${results.dns ? '✅' : '❌'}`);
  console.log(`  Raw TCP Connection: ${results.rawTCP ? '✅' : '❌'}`);
  console.log(`  WebSocket:         ${results.webSocket ? '✅' : '❌'}`);
  console.log(`  OpenWire:          ${results.openWire ? '✅' : '❌'}`);
  console.log(`  Port Access:       ${results.ports ? '✅' : '❌'}`);
  console.log(`  Authentication:   ${results.auth ? '✅' : '❌'}\n`);
  
  // Root cause analysis
  console.log('🔍 ROOT CAUSE ANALYSIS');
  console.log('='.repeat(50));
  
  if (!results.dns) {
    console.log('\n❌ ROOT CAUSE: DNS resolution failed');
    console.log('   The hostname cannot be resolved.');
  } else if (!results.rawTCP) {
    console.log('\n❌ ROOT CAUSE: Network connectivity issue');
    console.log('   Cannot establish TCP connection to Darwin server.');
    console.log('   Possible causes:');
    console.log('   - Firewall blocking outbound connections');
    console.log('   - Network rail server down or unreachable');
    console.log('   - IP address needs whitelisting');
  } else if (!results.ports) {
    console.log('\n❌ ROOT CAUSE: Required ports are blocked');
    console.log('   TCP connection works but required ports are inaccessible.');
  } else if (!results.webSocket && !results.openWire) {
    console.log('\n❌ ROOT CAUSE: WebSocket protocol not supported');
    console.log('   TCP works but WebSocket connections fail.');
    console.log('   Solution: Use raw TCP STOMP without WebSocket wrapping.');
  } else if (!results.auth) {
    console.log('\n❌ ROOT CAUSE: Authentication failure');
    console.log('   Can connect to server but credentials are invalid.');
    console.log('   Possible causes:');
    console.log('   - Username/password incorrect');
    console.log('   - Account expired or inactive');
    console.log('   - IP address not whitelisted');
  } else {
    console.log('\n✅ All tests passed! Connection should work.');
  }
  
  console.log('\n' + '='.repeat(50));
}

runDiagnostics().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Diagnostic test failed:', error);
  process.exit(1);
});


