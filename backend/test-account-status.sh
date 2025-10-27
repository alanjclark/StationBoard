#!/bin/bash

echo "🔍 Darwin Account Status Test"
echo "=============================="
echo ""

echo "1. Testing DNS resolution..."
host darwin-dist-44ae45.nationalrail.co.uk
echo ""

echo "2. Testing TCP connection on port 61613..."
timeout 3 bash -c "echo > /dev/tcp/darwin-dist-44ae45.nationalrail.co.uk/61613 && echo '✅ Port is open'" || echo "❌ Port is closed or unreachable"
echo ""

echo "3. Attempting STOMP connection..."
echo "Sending CONNECT frame..."
(
echo "CONNECT"
echo "login:DARWIN6fc4c393-948c-4e00-86e9-0b6d6fdb6db4"
echo "passcode:9b7c0f43-6d1b-48c3-a29b-cad0189e9814"
echo "accept-version:1.2"
echo "host:/"
echo ""
echo ""
sleep 3
) | timeout 5 nc -v darwin-dist-44ae45.nationalrail.co.uk 61613 2>&1 | head -30

echo ""
echo "=============================="
echo "RESULTS:"
echo "=============================="
echo ""
echo "If you saw 'CONNECTED' above, your account is ACTIVE ✅"
echo "If connection closed immediately, your account is INACTIVE ❌"
echo ""
echo "Next steps if inactive:"
echo "  1. Check email for activation confirmation"
echo "  2. Log into opendata.nationalrail.co.uk and verify status"
echo "  3. Wait 24-48 hours if recently registered"
echo "  4. Contact opendata@nationalrail.co.uk if still failing"


