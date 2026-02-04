#!/usr/bin/env python3
"""
Initialize database with sample inventory data
"""
from sqlalchemy.orm import sessionmaker
from app.database import engine, Base
from app.models.inventory import Item, Transaction
from datetime import datetime
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Create tables
Base.metadata.create_all(bind=engine)

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

# Clear existing data
db.query(Transaction).delete()
db.query(Item).delete()
db.commit()

# Sample items
sample_items = [
    Item(name="Laptop", quantity=15, price=999.99),
    Item(name="Mouse", quantity=50, price=29.99),
    Item(name="Keyboard", quantity=30, price=79.99),
    Item(name="Monitor", quantity=20, price=299.99),
    Item(name="USB Cable", quantity=100, price=9.99),
]

for item in sample_items:
    db.add(item)

db.commit()

# Sample transactions
sample_transactions = [
    Transaction(type="sale", item_id=1, quantity=2, amount=1999.98),
    Transaction(type="purchase", item_id=2, quantity=25, amount=749.75),
    Transaction(type="sale", item_id=3, quantity=1, amount=79.99),
    Transaction(type="adjustment", item_id=5, quantity=10, amount=99.90),
]

for txn in sample_transactions:
    db.add(txn)

db.commit()

print("✅ Database initialized successfully!")
print(f"✅ Added {len(sample_items)} sample items")
print(f"✅ Added {len(sample_transactions)} sample transactions")

db.close()
