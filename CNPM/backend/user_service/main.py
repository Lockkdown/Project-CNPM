from fastapi import FastAPI 
from pydantic import EmailStr
import models 
from middleware.logging import logging_middleware
from database import engine
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, users

app = FastAPI() # Khởi động FastAPI để giao tiếp

models.Base.metadata.create_all(bind=engine) # Tạo tất cả các bảng trong database

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging middleware
app.middleware("http")(logging_middleware)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])

@app.get("/")
def read_root():
    return {"message": "Welcome to User Service"}