from sqlalchemy import Column, String, DateTime, func, Boolean, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from database import Base
import uuid

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    recipient_id = Column(UUID(as_uuid=True), nullable=False)
    title = Column(String(255), index=True)
    content = Column(Text, nullable=False)
    type = Column(String(50), nullable=False)  # e.g., "task", "progress", "system"
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    read_at = Column(DateTime(timezone=True), nullable=True)
    link = Column(String(255), nullable=True)  # Optional link to related resource 