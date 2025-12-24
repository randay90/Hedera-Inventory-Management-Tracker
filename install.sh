#!/bin/bash

# Install all dependencies for the Hedera Hackathon Project

echo "📦 Installing Hedera Hackathon Project Dependencies..."
echo ""

# Get the project directory
PROJECT_DIR="$(dirname "$0")"

echo "✅ Step 1: Installing Node.js dependencies..."
cd "$PROJECT_DIR"
npm install --legacy-peer-deps

echo ""
echo "✅ Step 2: Installing Python dependencies..."
cd "$PROJECT_DIR/inventory-backend"
pip3 install -r requirements.txt

echo ""
echo "✅ Installation complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Run: ./start.sh"
echo "   2. Visit: http://localhost:8000"
echo "   3. View API docs: http://localhost:8000/docs"
