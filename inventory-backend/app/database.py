"""
Database Configuration and Connection Management
=================================================

This module handles all database setup and session management for the inventory system.

Components:
- Database URL: Points to SQLite database file at inventory-backend/inventory.db
- Engine: SQLAlchemy engine for database connections
- SessionLocal: Session factory for creating database sessions
- Base: Base class for all ORM models
- get_db: Dependency for FastAPI endpoints to get database sessions

Database Choice (SQLite):
- Lightweight and serverless (no separate database process needed)
- File-based storage for easy backup and portability
- Suitable for development and small-scale deployments
- Easy to switch to PostgreSQL/MySQL for production by changing DATABASE_URL

Session Management:
- Each API request gets its own database session (dependency injection)
- Sessions are properly closed using try/finally pattern
- Prevents database connection leaks

For production deployment:
- Consider PostgreSQL or MySQL for better concurrency
- Use connection pooling for performance
- Add connection timeout configuration
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# ==========================================
# DATABASE SETUP
# ==========================================

# Get the directory where this file is located
# This ensures the database file is created in the inventory-backend directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# SQLite database URL
# Format: sqlite:///path/to/database.db
# Three slashes (///) for absolute path on Unix/Mac, two (\\\) on Windows
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'inventory.db')}"

# Create SQLAlchemy engine
# connect_args={"check_same_thread": False} required for SQLite in multi-threaded environments
engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False}
)

# Create session factory
# autocommit=False: Requires explicit commit()
# autoflush=False: Requires explicit flush() (prevents auto-flushing during queries)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all ORM models
# All model classes inherit from this
Base = declarative_base()

# ==========================================
# DEPENDENCY INJECTION
# ==========================================

def get_db():
    """
    Dependency function for FastAPI endpoints.
    
    Provides a database session to API route handlers.
    Automatically closes the session after the request completes.
    
    Usage in endpoints:
        @router.get("/items")
        def get_items(db: Session = Depends(get_db)):
            return db.query(Item).all()
    
    Benefits:
    - Automatic session lifecycle management
    - Ensures database connections are properly closed
    - Follows FastAPI dependency injection pattern
    - Allows testing by providing mock database
    
    Yields:
        Session: SQLAlchemy ORM session for database operations
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        # Always close the session, even if an error occurs
        db.close()
