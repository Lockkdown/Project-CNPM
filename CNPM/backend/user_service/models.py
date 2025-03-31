from sqlalchemy import Column, Integer, String, DateTime, func, Boolean
from sqlalchemy.sql import func
from database import Base



class User(Base): # Tạo lớp model Users kế thừa từ Base -> trong đó sẽ tạo 1 bảng table là users.
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), index=True)
    email = Column(String(255), unique=True, index=True)
    password = Column(String(255))
    full_name = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)