"""
Hedera Hash Tracker - Backend API Server
=========================================

This is the main FastAPI application entry point for the inventory management system backend.

Features:
- RESTful API for inventory management (CRUD operations on items and transactions)
- SQLite database with SQLAlchemy ORM
- Pydantic data validation for request/response bodies
- CORS support for frontend communication
- Automatic database table creation on startup
- Interactive API documentation at /docs (Swagger UI) and /redoc

Architecture:
- Framework: FastAPI (modern, fast Python web framework)
- ORM: SQLAlchemy 2.0 (database abstraction layer)
- Validation: Pydantic (data validation and parsing)
- Database: SQLite (lightweight, file-based)
- Server: Uvicorn (ASGI server for async Python)

Routes:
- /api/v1/items/* - Item CRUD endpoints
- /api/v1/transactions/* - Transaction CRUD endpoints
- /docs - Swagger UI documentation
- /redoc - ReDoc documentation
- /openapi.json - OpenAPI schema

Startup sequence:
1. Import dependencies and routers
2. Create database tables (if not exist)
3. Initialize FastAPI app with metadata
4. Configure CORS middleware
5. Register item and transaction routers
6. Start Uvicorn server on 0.0.0.0:8001

Environment:
- Python 3.10+
- See requirements.txt for dependency versions
- Frontend running on port 8080 (allowed by CORS)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import items, transactions
import uvicorn

# Create the database tables
# This runs on startup to ensure all required tables exist
# If tables already exist, SQLAlchemy skips creation
Base.metadata.create_all(bind=engine)

# Initialize FastAPI application
# Includes metadata for documentation generation
app = FastAPI(
    title="Inventory Management System API",
    description="Backend API for perpetual inventory management system",
    version="1.0.0",
    docs_url="/docs",                    # Swagger UI at /docs
    redoc_url="/redoc",                  # ReDoc at /redoc
    openapi_url="/openapi.json"          # OpenAPI schema location
)

# Configure CORS (Cross-Origin Resource Sharing)
# Allows frontend on different port to make requests to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],                 # In production, specify allowed origins like ["http://localhost:8080"]
    allow_credentials=True,              # Allow cookies/auth headers
    allow_methods=["*"],                 # Allow all HTTP methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],                 # Allow all headers
)

# Include routers with API prefix
# All routes will be under /api/v1/*
app.include_router(items.router, prefix="/api/v1", tags=["items"])
app.include_router(transactions.router, prefix="/api/v1", tags=["transactions"])

# Main entry point
if __name__ == "__main__":
    # Start Uvicorn ASGI server
    # reload=True enables auto-restart on code changes (development only)
    # In production, set reload=False
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
