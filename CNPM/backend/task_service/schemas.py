from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class TaskBase(BaseModel):
    title: str
    description: str | None = None
    due_date: datetime | None = None
    category: str | None = None

class TaskCreate(TaskBase):
    user_id: UUID

class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    due_date: datetime | None = None
    is_completed: bool | None = None
    category: str | None = None

class Task(TaskBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    is_completed: bool

    class Config:
        from_attributes = True 