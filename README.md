# StationBoard - Vintage Flap Display

A web application that recreates the classic flap-board train station displays with real-time UK train data.

## Features

- **Authentic Flap Animation**: Characters cycle through to display destinations, times, and platforms
- **Real-time Updates**: Live train movements via Network Rail Darwin Push Port
- **Station Selection**: Search and select any UK station by name or CRS code
- **URL Routing**: Navigate directly to specific stations (e.g., `/station/PAD`)
- **Departures & Arrivals**: Toggle between departure and arrival boards

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend**: Node.js + Express, Socket.io for WebSocket
- **Data Source**: Network Rail Darwin Push Port (STOMP/ActiveMQ)
- **Deployment**: Docker Compose

## Prerequisites

1. **Node.js** 20+ and npm
2. **Docker** and Docker Compose
3. **Network Rail Credentials** from [datafeeds.networkrail.co.uk](https://datafeeds.networkrail.co.uk/)
   - Username for Push Port
   - Password for Push Port

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd StationBoard
```

### 2. Configure Environment Variables

The `.env` file has been created with your credentials. It contains:

```env
# Network Rail Darwin Push Port Credentials
DARWIN_PUSH_PORT_USERNAME=your-username
DARWIN_PUSH_PORT_PASSWORD=your-password
DARWIN_MESSAGING_HOST=darwin-dist-44ae45.nationalrail.co.uk
DARWIN_STOMP_PORT=61613
DARWIN_TOPIC_LIVE=darwin.pushport-v16
DARWIN_TOPIC_STATUS=darwin.status
```

If you need to get new credentials, see `CREDENTIALS_SETUP.md`

### 3. Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..
```

### 4. Run with Docker Compose

```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

### 5. Development Mode

For development with hot reload:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Architecture

```
┌─────────────┐
│   Next.js   │  ──>  User Interface
│  Frontend   │
└──────┬──────┘
       │ WebSocket
       │ Socket.io
┌──────▼──────────────┐
│  Express Backend    │  ──>  STOMP/WebSocket Client
│  + Socket.io Server │
└──────┬──────────────┘
       │ STOMP Protocol
┌──────▼──────────────────┐
│  Network Rail Darwin     │
│  Push Port (ActiveMQ)    │
└──────────────────────────┘
```

## API Endpoints

### REST API (Backend)

- `GET /api/stations` - List all UK station codes
- `GET /api/departures/:crs` - Get departures for station
- `GET /api/arrivals/:crs` - Get arrivals for station
- `GET /health` - Health check

### WebSocket Events

- `subscribe:${crs}` - Subscribe to station updates
- `board:update` - Receive board update data
- `board:error` - Receive error messages

## Development Workflow

This project uses a Git workflow with feature branches:

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes and commit**:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Create a draft PR**:
   ```bash
   gh pr create --draft
   ```

4. **When ready for review**:
   ```bash
   gh pr ready
   ```

5. **After approval and merge**:
   ```bash
   gh pr merge
   git checkout main
   git pull
   ```

## Stations Data

The application currently uses a sample set of 11 stations. To add all UK railway stations (~2,500 stations), see `STATIONS_DATA_GUIDE.md` for instructions on sourcing and importing the complete dataset.

## Testing

The project includes comprehensive tests for both frontend and backend. See `TESTING.md` for detailed testing documentation.

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test

# Run with coverage
cd backend && npm run test:coverage
cd frontend && npm run test:coverage
```

## License

MIT

