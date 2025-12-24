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
🚀 Starting Hedera Hash Tracker Backend...
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Step 3: Open the Frontend

Open your browser and navigate to:

```
file:///Users/randay90/Documents/Hedera\ Hackathon\ Project/index.html
```

Or simply drag `index.html` into your browser.

### Step 4: Start Using the App

Once the frontend loads:

- ✅ Create inventory items with name, quantity, and price
- ✅ View all items in real-time
- ✅ Create transactions (Sales, Purchases, Adjustments, Returns)
- ✅ Track all transactions with automatic timestamps
- ✅ Delete items and transactions as needed

**That's it! Your project is running. 🎉**

---

## Frontend Features

### 🎨 Modern Design
- Black, white, and pink color scheme
- Smooth animations and transitions
- Fully responsive (mobile, tablet, desktop)
- Real-time API status indicator

### 📦 Inventory Management
- **View Items**: Display all inventory items in an elegant card layout
- **Create Items**: Add new items with name, quantity, and price
- **Delete Items**: Remove items from inventory
- **Live Updates**: Data refreshes every 5 seconds

### 💳 Transaction Tracking
- **View Transactions**: See all transactions in a detailed table
- **Create Transactions**: Record sales, purchases, adjustments, and returns
- **Delete Transactions**: Remove transaction records
- **Type Badges**: Color-coded transaction types for easy identification

### ✨ User Experience
- Toast notifications for success/error feedback
- Form validation and error handling
- Responsive grid layout for items
- Sortable transaction table
- Auto-connecting API status monitor

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

### Full Stack (Backend + Frontend)

**Terminal 1 - Start the Backend:**
```shell
./start.sh
```

**Then - Open the Frontend:**
Open `index.html` in your browser:
```
file:///path/to/Hedera\ Hackathon\ Project/index.html
```

### Backend Only (API Development)

```shell
./start.sh
```

Access the API documentation at: http://localhost:8000/docs

### Frontend Only (UI Development)

Open `index.html` in your browser (requires backend to be running)

## Frontend File Structure

```
├── index.html      # Main HTML structure
├── styles.css      # Modern dark theme with pink accents
└── script.js       # API integration and interactivity
```

## Frontend Architecture

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Custom animations and gradients
- **Vanilla JavaScript** - No dependencies, lightweight

### Key Features

**Responsive Design**
- Mobile-first approach
- Adapts to all screen sizes (320px - 4K)
- Touch-friendly buttons and inputs

**Real-time Updates**
- Auto-refresh data every 5 seconds
- Live API connection status
- Toast notifications for user feedback

**Modern Animations**
- Smooth page transitions
- Hover effects on cards and buttons
- Loading states and transitions
- Shimmer effects on interaction

**API Integration**
- Fully integrated with FastAPI backend
- Error handling and validation
- CORS-enabled for local development
- Automatic retry on connection loss

---

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
# Hedera-Inventory-Management-Tracker
