from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.inventory import Item, Transaction
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

# Sample retail store data
RETAIL_STORES = {
    "walmart": "Walmart Supercenter",
    "target": "Target Store",
    "bestbuy": "Best Buy",
    "costco": "Costco Wholesale",
    "sams": "Sam's Club"
}

# Sample retail departments
DEPARTMENTS = {
    "electronics": "Electronics",
    "grocery": "Grocery",
    "clothing": "Clothing & Apparel",
    "home": "Home & Kitchen",
    "toys": "Toys & Games",
    "sports": "Sports & Outdoors",
    "auto": "Automotive",
    "garden": "Garden Center"
}

# Sample inventory items
SAMPLE_INVENTORY = [
    {
        "name": "Samsung 65\" QLED TV",
        "description": "4K Ultra HD Smart TV with HDR",
        "quantity": 15,
        "price": 129999,  # $1,299.99
        "location": "Best Buy - Electronics"
    },
    {
        "name": "Apple iPad Air",
        "description": "5th Generation, 256GB, WiFi",
        "quantity": 30,
        "price": 74999,  # $749.99
        "location": "Target - Electronics"
    },
    {
        "name": "Nike Running Shoes",
        "description": "Men's Air Zoom Pegasus 38",
        "quantity": 45,
        "price": 12999,  # $129.99
        "location": "Walmart - Sports"
    },
    {
        "name": "KitchenAid Stand Mixer",
        "description": "Professional 5 Plus Series 5 Quart",
        "quantity": 20,
        "price": 39999,  # $399.99
        "location": "Target - Home"
    },
    {
        "name": "LEGO Star Wars Set",
        "description": "Millennium Falcon Building Kit",
        "quantity": 25,
        "price": 16999,  # $169.99
        "location": "Walmart - Toys"
    },
    {
        "name": "Instant Pot Duo",
        "description": "8 Quart 7-in-1 Pressure Cooker",
        "quantity": 35,
        "price": 9999,  # $99.99
        "location": "Costco - Home"
    },
    {
        "name": "Sony PS5",
        "description": "PlayStation 5 Digital Edition",
        "quantity": 10,
        "price": 49999,  # $499.99
        "location": "Best Buy - Electronics"
    },
    {
        "name": "Dyson V11",
        "description": "Cordless Vacuum Cleaner",
        "quantity": 15,
        "price": 59999,  # $599.99
        "location": "Target - Home"
    }
]

class ItemBase(BaseModel):
    name: str
    description: str
    quantity: int
    price: int  # in cents
    location: str

class ItemCreate(ItemBase):
    pass

class ItemResponse(ItemBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

@router.post("/items/", response_model=ItemResponse)
async def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    db_item = Item(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.post("/initialize-retail-data")
async def initialize_retail_data(db: Session = Depends(get_db)):
    """Initialize the database with sample retail inventory data"""
    # Clear existing items
    db.query(Item).delete()
    db.query(Transaction).delete()
    db.commit()

    # Add sample inventory items
    added_items = []
    for item_data in SAMPLE_INVENTORY:
        db_item = Item(**item_data)
        db.add(db_item)
        added_items.append(db_item)
    
    db.commit()
    
    # Add some sample transactions
    for item in added_items:
        # Simulate some sales
        if item.quantity > 5:
            transaction = Transaction(
                item_id=item.id,
                transaction_type="SALE",
                quantity_change=-2,
                price_at_time=item.price,
                location=item.location,
                notes="Initial Sale"
            )
            db.add(transaction)
            item.quantity -= 2
    
        # Simulate some restocks
        transaction = Transaction(
            item_id=item.id,
            transaction_type="RESTOCK",
            quantity_change=5,
            price_at_time=item.price,
            location=item.location,
            notes="Initial Stock"
        )
        db.add(transaction)
        item.quantity += 5
    
    db.commit()
    return {"message": "Retail data initialized successfully", "items_added": len(SAMPLE_INVENTORY)}

@router.get("/items/", response_model=List[ItemResponse])
async def list_items(
    location: str = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Item)
    if location:
        query = query.filter(Item.location == location)
    return query.offset(skip).limit(limit).all()

@router.get("/items/{item_id}", response_model=ItemResponse)
async def get_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.put("/items/{item_id}/quantity")
async def update_quantity(
    item_id: int,
    quantity_change: int,
    notes: str,
    db: Session = Depends(get_db)
):
    item = db.query(Item).filter(Item.id == item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Update quantity
    new_quantity = item.quantity + quantity_change
    if new_quantity < 0:
        raise HTTPException(status_code=400, detail="Insufficient quantity")
    
    # Record transaction
    transaction = Transaction(
        item_id=item_id,
        transaction_type="SALE" if quantity_change < 0 else "RESTOCK",
        quantity_change=quantity_change,
        price_at_time=item.price,
        location=item.location,
        notes=notes
    )
    
    item.quantity = new_quantity
    db.add(transaction)
    db.commit()
    db.refresh(item)
    
    return {"message": "Quantity updated successfully", "new_quantity": new_quantity}
