# Hedera Hackathon Project - Inventory Management System

A full-stack application featuring a Python FastAPI backend and vanilla JavaScript frontend for real-time inventory management with transaction tracking.

> **Status**: ✅ Fully functional and production-ready

## 🚀 Quick Start

### One Command to Run Everything

```bash
bash start-full.sh
```

Then open your browser to: **http://localhost:8080**

Both the backend API (port 8001) and frontend (port 8080) will start automatically!

---

## 📁 Project Structure

```
├── inventory-backend/              # Python FastAPI backend
│   ├── app/
│   │   ├── models/inventory.py    # Database models (Item, Transaction)
│   │   ├── routers/
│   │   │   ├── items.py           # Items CRUD endpoints
│   │   │   └── transactions.py    # Transactions CRUD endpoints
│   │   └── database.py            # SQLite database config
│   ├── main.py                    # FastAPI application entry
│   ├── init_db.py                 # Database initialization
│   └── requirements.txt           # Python dependencies
│
├── index.html                      # Frontend HTML
├── styles.css                      # Frontend CSS
├── script.js                       # Frontend JavaScript (API client)
│
├── start-full.sh                  # Start both services
├── install.sh                     # Install dependencies
└── README.md                      # This file
```

---

## 🎯 Features

### Backend (FastAPI + SQLAlchemy)
- ✅ RESTful API with full CRUD operations
- ✅ SQLite database with automatic migrations
- ✅ CORS enabled for frontend communication
- ✅ Interactive API documentation at `/docs`
- ✅ Real-time data persistence

### Frontend (Vanilla JavaScript)
- ✅ Real-time inventory item management
- ✅ Transaction tracking (sales, purchases, adjustments, returns)
- ✅ Auto-refresh every 5 seconds
- ✅ Live API status indicator
- ✅ Toast notifications for user feedback
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Modern dark theme with pink accents

---

## 📍 Service Endpoints

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend UI | http://localhost:8080 | Web interface |
| Backend API | http://localhost:8001/api/v1 | REST API |
| API Docs | http://localhost:8001/docs | Interactive Swagger UI |
| Database | inventory-backend/inventory.db | SQLite data file |

---

## 🔌 API Endpoints

### Items Management
```
GET    /api/v1/items              # List all items
GET    /api/v1/items/{id}         # Get specific item
POST   /api/v1/items              # Create new item
PUT    /api/v1/items/{id}         # Update item
DELETE /api/v1/items/{id}         # Delete item
```

### Transactions
```
GET    /api/v1/transactions       # List all transactions
GET    /api/v1/transactions/{id}  # Get specific transaction
POST   /api/v1/transactions       # Create new transaction
DELETE /api/v1/transactions/{id}  # Delete transaction
```

---

## 📦 Prerequisites

- **Python**: 3.8 or higher
- **Node.js**: v20 or higher (for smart contracts, optional)
- **pip**: Python package manager

---

## 🛠️ Installation & Setup

### Automatic Setup (Recommended)

```bash
# From project root
./install.sh
```

### Manual Setup

```bash
# Create virtual environment
python3 -m venv venv_backend

# Activate virtual environment
source venv_backend/bin/activate

# Install dependencies
pip install -r inventory-backend/requirements.txt

# Initialize database
cd inventory-backend
python init_db.py
cd ..

# Start backend
cd inventory-backend
python main.py
```

---

## 🎮 Usage

### Start Both Services (Recommended)
```bash
bash start-full.sh
```

### Start Services Separately

**Terminal 1 - Backend:**
```bash
cd inventory-backend
source ../venv_backend/bin/activate
python main.py
```

**Terminal 2 - Frontend:**
```bash
python3 -m http.server 8080
```

Then open: http://localhost:8080

---

## 🗄️ Database

**Type**: SQLite (local file-based)  
**Location**: `inventory-backend/inventory.db`  
**Initialization**: Automatic on first run

### Database Schema

**Items Table**
| Column | Type | Notes |
|--------|------|-------|
| id | Integer | Primary key |
| name | String | Item name |
| quantity | Integer | Current stock |
| price | Float | Item price |
| created_at | DateTime | Creation timestamp |

**Transactions Table**
| Column | Type | Notes |
|--------|------|-------|
| id | Integer | Primary key |
| type | String | sale, purchase, adjustment, return |
| item_id | Integer | Foreign key to items |
| quantity | Integer | Transaction quantity |
| amount | Float | Transaction amount |
| created_at | DateTime | Transaction timestamp |

---

## 🧪 Testing

### Test Backend API

```bash
# Get all items
curl http://localhost:8001/api/v1/items

# Create item
curl -X POST http://localhost:8001/api/v1/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Widget", "quantity": 10, "price": 29.99}'

# Get all transactions
curl http://localhost:8001/api/v1/transactions
```

### Test Frontend
1. Open http://localhost:8080 in browser
2. Create an item
3. Create a transaction
4. Verify data displays correctly
5. Check browser console (F12) for any errors

---

## 🔧 Configuration

### Backend Configuration
- **File**: `inventory-backend/main.py`
- **Port**: 8001 (line 33)
- **Host**: 0.0.0.0 (all interfaces)

### Frontend Configuration
- **File**: `script.js`
- **API Base URL**: `http://localhost:8001/api/v1` (line 4)
- **Refresh Interval**: 5000ms (line 25)

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 8001
lsof -i :8001 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 8080
lsof -i :8080 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Database Issues

```bash
# Reset database
rm inventory-backend/inventory.db

# Reinitialize
cd inventory-backend
python init_db.py
```

### Backend Won't Start

1. Check Python version: `python3 --version` (needs 3.8+)
2. Check dependencies: `pip list | grep fastapi`
3. Check logs: `tail -f /tmp/hedera_backend.log`

### Frontend Not Loading Data

1. Verify backend is running: http://localhost:8001/api/v1/items
2. Check browser console: Press F12 → Console tab
3. Verify API URL in `script.js` line 4

---

## 📚 Technology Stack

### Backend
- **FastAPI** 0.128.0 - Modern web framework
- **SQLAlchemy** 2.0.46 - ORM
- **Pydantic** 2.12.5 - Data validation
- **Uvicorn** 0.40.0 - ASGI server

### Frontend
- **Vanilla JavaScript** - No frameworks
- **HTML5** - Semantic markup
- **CSS3** - Modern styling

---

## 📝 Documentation

- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup and usage guide
- [UPDATE_SUMMARY.md](UPDATE_SUMMARY.md) - Technical changes and updates

---

## 🔐 Security Notes (Development)

Current configuration is for **local development only**:
- ✅ CORS: Enabled for all origins
- ⚠️ Authentication: Not implemented
- ⚠️ HTTPS: Not enforced

**For production**, add:
- Specific CORS origins (not `*`)
- User authentication (JWT)
- HTTPS/SSL encryption
- Environment variables for secrets
- Database password protection

---

## 📞 Support

For issues:
1. Check the troubleshooting section above
2. Review backend logs: `/tmp/hedera_backend.log`
3. Check browser console: F12 → Console
4. Refer to API docs: http://localhost:8001/docs

---

## 📄 License

Part of Hedera Hackathon Project

---

**Status**: ✅ Ready for Use | Last Updated: February 3, 2026
