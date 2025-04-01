from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID

class ProgressBase(BaseModel):
    completion_percentage: int = Field(ge=0, le=100, default=0)
    notes: str | None = None

class ProgressCreate(ProgressBase):
    user_id: UUID
    task_id: UUID

class ProgressUpdate(BaseModel):
    completion_percentage: int | None = Field(ge=0, le=100, default=None)
    notes: str | None = None

class Progress(ProgressBase):
    id: UUID
    user_id: UUID
    task_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    last_activity: datetime | None = None

    class Config:
        from_attributes = True 