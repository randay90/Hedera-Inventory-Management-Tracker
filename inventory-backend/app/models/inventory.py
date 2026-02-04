"""
Database Models for Inventory System
====================================

This module defines the SQLAlchemy ORM models for the inventory management system.

Models:
1. Item: Represents products/inventory items
   - Fields: id, name, quantity, price, created_at, updated_at
   - Relationships: transactions (one-to-many)

2. Transaction: Represents inventory movements
   - Fields: id, type, item_id, quantity, amount, created_at
   - Relationships: item (many-to-one)
   - Types: 'sale', 'purchase', 'adjustment', 'return'

Design Notes:
- Uses SQLAlchemy ORM for database abstraction
- Automatic timestamps for auditing
- Cascade delete: Deleting an item also deletes its transactions
- Foreign key constraint maintains referential integrity

Future Enhancements:
- Add inventory warnings/thresholds
- Add item categories/tags
- Add transaction notes/descriptions
- Add user/employee tracking
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Item(Base):
    """
    Represents an inventory item (product).
    
    Attributes:
        id (int): Primary key - unique identifier for the item
        name (str): Product name/description - indexed for fast lookup
        quantity (int): Current stock quantity - default 0
        price (float): Unit price in dollars - stored as float for calculations
        created_at (datetime): Timestamp when item was created - auto-set to current UTC time
        updated_at (datetime): Timestamp when item was last updated - auto-updated on changes
        transactions (List[Transaction]): One-to-many relationship to transactions
    
    Database Table: items
    Indexes: name (for efficient filtering)
    
    Relationships:
        - One-to-Many with Transaction via item_id foreign key
        - Cascade delete: Deletes all related transactions when item is deleted
    """
    
    __tablename__ = "items"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Item details - name is indexed for fast searches
    name = Column(String, index=True, nullable=False)
    
    # Inventory information
    quantity = Column(Integer, default=0)              # Current stock level
    price = Column(Float)                              # Unit price as float for calculations
    
    # Audit timestamps
    created_at = Column(DateTime, default=datetime.utcnow)           # Set on creation
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # Updated on changes

    # Relationship to transactions
    # back_populates creates bidirectional relationship
    # cascade="all, delete-orphan" means deleting item deletes its transactions
    transactions = relationship("Transaction", back_populates="item", cascade="all, delete-orphan")


class Transaction(Base):
    """
    Represents an inventory transaction (movement of items).
    
    A transaction records when items are added to, removed from, or adjusted in inventory.
    Each transaction is linked to an item and records the details of that movement.
    
    Attributes:
        id (int): Primary key - unique identifier for the transaction
        item_id (int): Foreign key to Item - links transaction to an inventory item
        type (str): Transaction type - one of: 'sale', 'purchase', 'adjustment', 'return'
        quantity (int): Number of units involved in transaction
        amount (float): Monetary value of transaction in dollars
        created_at (datetime): Timestamp when transaction occurred - auto-set to current UTC time
        item (Item): Relationship to the associated Item
    
    Database Table: transactions
    Foreign Keys: item_id → items.id (with referential integrity)
    
    Transaction Types:
        - 'sale': Item sold to customer (stock decreases)
        - 'purchase': Item purchased/received (stock increases)
        - 'adjustment': Inventory adjustment (correction, loss, found items)
        - 'return': Item returned by customer (stock increases)
    
    Relationships:
        - Many-to-One with Item via item_id foreign key
    """
    
    __tablename__ = "transactions"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign key to items table
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    
    # Transaction details
    type = Column(String, nullable=False)  # "sale", "purchase", "adjustment", "return"
    quantity = Column(Integer, nullable=False)         # Units involved
    amount = Column(Float, nullable=False)             # Dollar amount
    
    # Audit timestamp
    created_at = Column(DateTime, default=datetime.utcnow)  # When transaction occurred

    # Relationship to item
    # back_populates creates bidirectional relationship
    item = relationship("Item", back_populates="transactions")
