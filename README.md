# Hedera Hackathon Project

A full-stack application featuring Solidity smart contracts (for Hedera network) and a Python FastAPI backend for inventory management system.

## Project Structure

```
├── contracts/                 # Solidity smart contracts
├── scripts/                   # Deployment scripts
├── test/                      # Contract tests
├── ignition/                  # Hardhat Ignition deployment modules
├── typechain-types/           # Generated TypeScript types for contracts
├── inventory-backend/         # Python FastAPI backend
│   ├── app/
│   │   ├── models/           # Database models
│   │   ├── routers/          # API endpoints
│   │   └── database.py       # Database configuration
│   ├── main.py               # FastAPI application entry point
│   └── requirements.txt       # Python dependencies
├── hardhat.config.js         # Hardhat configuration
└── package.json              # Node.js dependencies
```

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js**: v20 LTS or higher (v25+ may have compatibility issues with Hardhat)
  - Download from: https://nodejs.org/
  - Verify: `node --version`
- **Python**: v3.8 or higher
  - Download from: https://www.python.org/
  - Verify: `python3 --version`
- **npm**: Usually comes with Node.js
  - Verify: `npm --version`

## Quick Start Guide (Easiest Way!)

### Step 1: Install Everything (One-Time Setup)

Navigate to the project directory and run:

```shell
./install.sh
```

This single command will:
- ✅ Install all Node.js dependencies
- ✅ Install all Python dependencies in a virtual environment
- ✅ Set up your project completely

### Step 2: Start the Backend

Simply run:

```shell
./start.sh
```

You should see output like:
```
🚀 Starting Hedera Hackathon Project Backend...
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Step 3: Access the API

Once the backend is running, open your browser:

- **API Endpoint**: http://localhost:8000
- **Interactive API Documentation (Swagger)**: http://localhost:8000/docs
- **Alternative API Docs (ReDoc)**: http://localhost:8000/redoc

**That's it! Your project is running. 🎉**

---

## Troubleshooting the Quick Start

### Scripts don't work or I'm on Windows

See [Manual Installation](#manual-installation-if-scripts-dont-work) section below.

### Port 8000 already in use

If another process is using port 8000, either:
1. Stop the other process using port 8000, or
2. Modify `inventory-backend/main.py` and change line `port=8000` to a different port

---

## Manual Installation (if scripts don't work)

### Step 1: Navigate to the Project

```shell
cd /path/to/Hedera\ Hackathon\ Project
```

### Step 2: Install Node.js Dependencies

```shell
npm install --legacy-peer-deps
```

### Step 3: Install Python Dependencies

```shell
cd inventory-backend
pip3 install -r requirements.txt
cd ..
```

### Step 4: Run the Backend

```shell
cd inventory-backend
python3 main.py
```

## Detailed Setup Instructions

### For Windows Users

1. **Install Node.js and Python** from official websites
2. **Open PowerShell or Command Prompt** and navigate to the project
3. **Install npm dependencies**:
   ```shell
   npm install --legacy-peer-deps
   ```
4. **Install Python dependencies**:
   ```shell
   cd inventory-backend
   pip install -r requirements.txt
   cd ..
   ```
5. **Run the backend**:
   ```shell
   cd inventory-backend
   python main.py
   ```

### For macOS Users

1. **Install Node.js** (v20 LTS recommended):
   ```shell
   brew install node@20
   ```
2. **Install Python 3**:
   ```shell
   brew install python3
   ```
3. **Navigate to the project** and follow the Quick Start Guide above

### For Linux Users

1. **Install Node.js**:
   ```shell
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
2. **Install Python 3**:
   ```shell
   sudo apt-get install python3 python3-pip
   ```
3. **Navigate to the project** and follow the Quick Start Guide above

## Running the Application

### Option 1: Backend API Only (Recommended)

This is the easiest way to get started:

```shell
cd inventory-backend
python3 main.py
```

The API will be available at `http://localhost:8000`

Test the endpoints using the Swagger UI at `http://localhost:8000/docs`

### Option 2: Smart Contracts (Advanced)

#### Test the Smart Contracts

```shell
npx hardhat test
```

#### Run with Gas Reporting

```shell
REPORT_GAS=true npx hardhat test
```

#### Compile Contracts

```shell
npx hardhat compile
```

#### Deploy Contracts (Requires Hardhat Node)

> ⚠️ **Note**: Running `npx hardhat node` requires Node.js v20 LTS or lower due to compatibility issues with Hardhat Ignition in newer Node versions (v25+).

If you have Node.js v20:
```shell
# Terminal 1: Start the local blockchain
npx hardhat node

# Terminal 2: Deploy contracts
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```

## Troubleshooting

### Issue: npm install fails with peer dependency errors

**Solution**: Use the legacy peer deps flag:
```shell
npm install --legacy-peer-deps
```

### Issue: Python command not found

**Solution**: Use `python3` instead:
```shell
python3 main.py
```

### Issue: Port 8000 already in use

**Solution**: Either stop the process using port 8000 or run on a different port:
```shell
# Modify inventory-backend/main.py and change port 8000 to your desired port
```

### Issue: Hardhat node won't start

**Solution**: This is likely due to Node.js version incompatibility. Check your Node version:
```shell
node --version
```

If version is v25+, downgrade to Node.js v20 LTS:
```shell
# Using nvm (Node Version Manager)
nvm install 20
nvm use 20
```

### Issue: Pydantic warnings about orm_mode

These are non-critical warnings about Pydantic v2 configuration. They don't affect functionality and can be safely ignored.

## Common API Endpoints

Once the backend is running, you can test these endpoints:

- **GET** `/api/v1/items` - List all inventory items
- **POST** `/api/v1/items` - Create a new item
- **GET** `/api/v1/transactions` - List all transactions
- **POST** `/api/v1/transactions` - Create a new transaction

Test them interactively at: http://localhost:8000/docs

## Environment Configuration

Create `.env` files if needed for additional configuration:

1. **Root directory `.env`** (for smart contracts):
   ```
   OPERATOR_KEY=your_hedera_private_key_here
   ```

2. **`inventory-backend/.env`** (for Python backend):
   ```
   DATABASE_URL=sqlite:///./inventory.db
   ```

## Support

For issues or questions, refer to:
- Hardhat Documentation: https://hardhat.org/
- FastAPI Documentation: https://fastapi.tiangolo.com/
- Hedera Documentation: https://docs.hedera.com/
