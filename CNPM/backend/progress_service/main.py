from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import progress

app = FastAPI()

# Create database tables
models.Base.metadata.create_all(bind=engine)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(progress.router, prefix="/api/progress", tags=["progress"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Progress Service"} 