from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models.inventory import Transaction
from pydantic import BaseModel

router = APIRouter()

class TransactionBase(BaseModel):
    item_id: int
    transaction_type: str
    quantity_change: int
    price_at_time: int
    location: str
    notes: str

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True

@router.get("/transactions/", response_model=List[TransactionResponse])
async def list_transactions(
    location: str = None,
    start_date: datetime = None,
    end_date: datetime = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Transaction)
    if location:
        query = query.filter(Transaction.location == location)
    if start_date:
        query = query.filter(Transaction.timestamp >= start_date)
    if end_date:
        query = query.filter(Transaction.timestamp <= end_date)
    return query.offset(skip).limit(limit).all()

@router.get("/transactions/report")
async def get_transactions_report(
    start_date: datetime,
    end_date: datetime,
    location: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(Transaction)
    if location:
        query = query.filter(Transaction.location == location)
    
    transactions = query.filter(
        Transaction.timestamp.between(start_date, end_date)
    ).all()

    total_sales = sum(
        t.quantity_change * t.price_at_time 
        for t in transactions 
        if t.transaction_type == "SALE"
    )
    total_restocks = sum(
        t.quantity_change * t.price_at_time 
        for t in transactions 
        if t.transaction_type == "RESTOCK"
    )

    return {
        "period_start": start_date,
        "period_end": end_date,
        "location": location,
        "total_sales_value": abs(total_sales) / 100,  # Convert cents to dollars
        "total_restock_value": total_restocks / 100,
        "transaction_count": len(transactions)
    }
