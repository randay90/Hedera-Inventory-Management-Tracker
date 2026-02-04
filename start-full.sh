#!/bin/bash

# Hedera Hackathon Project - Complete Startup Script
# This script starts both the backend API and frontend HTTP server

echo "🚀 Starting Hedera Hackathon Project..."
echo ""

# Get the directory where this script is located
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if virtual environment exists
if [ ! -d "$PROJECT_DIR/venv_backend" ]; then
    echo "❌ Virtual environment not found. Running install.sh first..."
    bash "$PROJECT_DIR/install.sh"
fi

# Kill any existing processes on ports 8000, 8001, and 8080
echo "🔄 Cleaning up old processes..."
lsof -i :8000 2>/dev/null | grep -v COMMAND | awk '{print $2}' | xargs kill -9 2>/dev/null || true
lsof -i :8001 2>/dev/null | grep -v COMMAND | awk '{print $2}' | xargs kill -9 2>/dev/null || true
lsof -i :8080 2>/dev/null | grep -v COMMAND | awk '{print $2}' | xargs kill -9 2>/dev/null || true
sleep 2

# Start the backend
echo "📦 Starting Backend API on http://localhost:8001..."
cd "$PROJECT_DIR/inventory-backend"
source ../venv_backend/bin/activate
python main.py > /tmp/hedera_backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
sleep 4

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Failed to start backend. Check /tmp/hedera_backend.log"
    cat /tmp/hedera_backend.log
    exit 1
fi

echo "✅ Backend started (PID: $BACKEND_PID)"
echo ""

# Start the frontend HTTP server
echo "🎨 Starting Frontend HTTP Server on http://localhost:8080..."
cd "$PROJECT_DIR"
python3 -m http.server 8080 > /tmp/hedera_frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 2

# Check if frontend is running
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "❌ Failed to start frontend. Check /tmp/hedera_frontend.log"
    cat /tmp/hedera_frontend.log
    kill $BACKEND_PID
    exit 1
fi

echo "✅ Frontend started (PID: $FRONTEND_PID)"
echo ""

# Display startup information
echo "=========================================="
echo "✅ Hedera Hackathon Project is Running!"
echo "=========================================="
echo ""
echo "📍 Backend API:    http://localhost:8001/api/v1"
echo "📍 Frontend UI:    http://localhost:8080"
echo "📍 API Docs:       http://localhost:8001/docs"
echo ""
echo "Backend PID:  $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "To stop the services, run:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "=========================================="
echo ""

# Keep the script running
wait
