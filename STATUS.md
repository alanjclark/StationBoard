# StationBoard - Project Status

## Current Status: ✅ WORKING

The StationBoard application is fully functional and displaying real-time train data from the National Rail Darwin system.

### Features
- Real-time train departure and arrival boards
- Vintage flap display animation
- WebSocket-based live updates (every 30 seconds)
- Station search and navigation
- Responsive design

### Tech Stack
- Frontend: Next.js 14, React, TypeScript, TailwindCSS
- Backend: Node.js, Express, Socket.io
- Data Source: Network Rail Darwin via Rail Data Marketplace API

### API Configuration
- Configure API credentials in `.env` file
- See `CREDENTIALS_SETUP.md` for details

### Running the Application
```bash
docker-compose up --build
```

Visit http://localhost:3000

