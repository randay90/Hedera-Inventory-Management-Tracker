#!/bin/bash

# Start the Hedera Davis Automation Project Backend

echo "🚀 Starting Hedera Davis Automation Project Backend..."
echo ""

# Get the absolute path of the script's directory (project root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR"

# Check if virtual environment exists
if [ ! -f "$PROJECT_DIR/.venv/bin/python" ]; then
    echo "❌ Error: Virtual environment not found"
    echo "Please run ./install.sh first to set up the environment"
    exit 1
fi

# Navigate to the inventory-backend directory
cd "$PROJECT_DIR/inventory-backend"

# Run the backend using the virtual environment's Python
"$PROJECT_DIR/.venv/bin/python" main.py
