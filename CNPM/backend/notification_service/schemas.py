from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from enum import Enum

class NotificationType(str, Enum):
    TASK = "task"
    PROGRESS = "progress"
    SYSTEM = "system"

class NotificationBase(BaseModel):
    title: str
    content: str
    type: NotificationType
    link: str | None = None

class NotificationCreate(NotificationBase):
    recipient_id: UUID

class NotificationUpdate(BaseModel):
    is_read: bool | None = None
    read_at: datetime | None = None

class Notification(NotificationBase):
    id: UUID
    recipient_id: UUID
    is_read: bool
    created_at: datetime
    read_at: datetime | None = None

    class Config:
        from_attributes = True 