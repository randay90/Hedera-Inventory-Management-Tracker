from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import items, transactions
import uvicorn

# Create the database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Inventory Management System API",
    description="Backend API for perpetual inventory management system",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(items.router, prefix="/api/v1", tags=["items"])
app.include_router(transactions.router, prefix="/api/v1", tags=["transactions"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
