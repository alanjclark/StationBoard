# Network Rail Darwin Credentials Setup

## Overview

Network Rail Darwin provides two types of credentials for accessing UK train data:

1. **OpenLDBWS Access Token** - For SOAP API queries (departure/arrival boards)
2. **Push Port Username/Password** - For real-time STOMP streaming

## How to Get Credentials

### 1. Register at Network Rail Data Feeds

Visit: https://datafeeds.networkrail.co.uk/

1. Click "Register" or "Sign Up"
2. Fill in your details
3. Agree to terms and conditions
4. Verify your email address
5. Request access to **Darwin Push Port**

### 2. Get Darwin Push Port Credentials

After registering at https://datafeeds.networkrail.co.uk/:

1. Request access to **"Darwin Push Port"**
2. Wait for approval (may take 24-48 hours)
3. Once approved, you'll receive:
   - **Username** (UUID format like: `DARWIN6fc4c393-...`)
   - **Password** (UUID format like: `9b7c0f43-...`)
   - **Messaging Host** (e.g., `darwin-dist-44ae45.nationalrail.co.uk`)
   - **STOMP Port** (61613)
   - **Live Feed Topic** (`darwin.pushport-v16`)
   - **Status Messages Topic** (`darwin.status`)

4. Add to `.env`:
   ```env
   DARWIN_PUSH_PORT_USERNAME=your-username
   DARWIN_PUSH_PORT_PASSWORD=your-password
   DARWIN_MESSAGING_HOST=darwin-dist-44ae45.nationalrail.co.uk
   DARWIN_STOMP_PORT=61613
   DARWIN_TOPIC_LIVE=darwin.pushport-v16
   DARWIN_TOPIC_STATUS=darwin.status
   ```

**These credentials are used for:**
- Real-time train movement data via STOMP
- Live updates on all UK trains
- Instant notifications of delays/cancellations
- Streaming via STOMP protocol on port 61613

### 3. Get OpenLDBWS Access Token (Optional)

For fallback queries if you need them:

1. Visit https://opendata.nationalrail.co.uk/
2. Navigate to **"LDB Token"** section
3. Click **"Create Token"**
4. Copy the generated token
5. Add to `.env` as `DARWIN_ACCESS_TOKEN`

**This token is used for:**
- Querying departure boards (fallback)
- Querying arrival boards (fallback)
- Station information

## Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
DARWIN_ACCESS_TOKEN=your-actual-token-here
DARWIN_PUSH_PORT_USERNAME=your-username-here
DARWIN_PUSH_PORT_PASSWORD=your-password-here
```

## Which Services Need Which Credentials?

### OpenLDBWS API (Query API)
- **Endpoint:** SOAP API at `lite.realtime.nationalrail.co.uk`
- **Credential:** `DARWIN_ACCESS_TOKEN`
- **Used by:** `backend/src/services/darwin.service.ts` for `getDepartures()` and `getArrivals()`
- **What it does:** Fetches departure/arrival boards for specific stations

### Push Port (Real-time Stream)
- **Endpoint:** STOMP/ActiveMQ at `datafeeds.networkrail.co.uk`
- **Credentials:** `DARWIN_PUSH_PORT_USERNAME` and `DARWIN_PUSH_PORT_PASSWORD`
- **Used by:** `backend/src/websocket/board.socket.ts` for real-time updates
- **What it does:** Streams live train movements across the UK network

## Important Notes

- **Never commit `.env`** - It's in `.gitignore` for security
- **Keep credentials secure** - They're tied to your account
- **Rate limits apply** - Don't abuse the APIs
- **Push Port requires approval** - May take a few days to get access
- **Both are free** - No cost for developers

## Testing Your Credentials

After adding credentials, test the connection:

```bash
# Start the backend
cd backend
npm run dev

# Check the console for connection status
# You should see: "Darwin credentials configured"
```

## Troubleshooting

### "Darwin credentials not configured"
- Check that `.env` exists in the project root
- Verify `DARWIN_ACCESS_TOKEN` is set
- Restart the backend server

### "Access denied" or "401 Unauthorized"
- Verify your token is correct (no extra spaces)
- Check token hasn't expired (regenerate if needed)
- Ensure you're using the latest credentials from the portal

### Push Port connection fails
- Verify username/password are correct
- Check your account has been approved for Push Port
- Verify STOMP client is configured correctly

## Resources

- **Main Portal:** https://opendata.nationalrail.co.uk/
- **Documentation:** https://wiki.openraildata.com/
- **API Docs:** https://lite.realtime.nationalrail.co.uk/OpenLDBWS/
- **STOMP Guide:** https://wiki.openraildata.com/index.php/Connecting_with_Stomp

