#!/bin/bash

# Simple HTTP server for the frontend
# This allows testing the frontend from http://localhost:3000

echo "🌐 Starting Frontend Server..."
echo ""
echo "📍 Frontend URL: http://localhost:3000"
echo "📝 API URL: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd "$(dirname "$0")"

# Check if Python is available
if command -v python3 &> /dev/null; then
    # Python 3.7+
    python3 -m http.server 3000
else
    # Fallback to Node.js if available
    if command -v npx &> /dev/null; then
        npx http-server -p 3000 -c-1
    else
        echo "❌ Error: Python 3 or Node.js not found"
        echo "Please install one of them to run the frontend server"
        exit 1
    fi
fi
