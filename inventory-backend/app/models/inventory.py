from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    quantity = Column(Integer, default=0)
    price = Column(Integer)  # Stored in cents, like your current system
    location = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    transactions = relationship("Transaction", back_populates="item")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"))
    transaction_type = Column(String)  # "SALE", "RESTOCK", etc.
    quantity_change = Column(Integer)  # Negative for sales, positive for restocks
    price_at_time = Column(Integer)  # Price when transaction occurred
    location = Column(String, index=True)
    notes = Column(String)  # e.g., "Weekend Sale - Downtown"
    timestamp = Column(DateTime, default=datetime.utcnow)

    item = relationship("Item", back_populates="transactions")
