#!/bin/bash

# StationBoard Setup Script

echo "🚂 Setting up StationBoard..."

# Check if .env exists
if [ ! -f .env ]; then
  echo "📝 Creating .env file from template..."
  cp .env.example .env
  echo "⚠️  Please edit .env and add your Network Rail credentials"
else
  echo "✓ .env file already exists"
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env and add your Network Rail credentials"
echo "2. Run 'docker-compose up --build' to start the app"
echo "3. Or run 'npm run dev' in frontend/ and backend/ for development"
echo ""

