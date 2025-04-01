from sqlalchemy.orm import Session
import models
from schemas import ProgressCreate, ProgressUpdate
from uuid import UUID
import httpx
from fastapi import HTTPException

async def verify_user_exists(user_id: UUID) -> bool:
    """
    Verify if a user exists by calling the User Service API
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"http://localhost:8000/api/users/verify/{user_id}")
            return response.status_code == 200
        except Exception as e:
            raise HTTPException(status_code=503, detail="User service unavailable")

async def verify_task_exists(task_id: UUID) -> bool:
    """
    Verify if a task exists by calling the Task Service API
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"http://localhost:8001/api/tasks/verify/{task_id}")
            return response.status_code == 200
        except Exception as e:
            raise HTTPException(status_code=503, detail="Task service unavailable")

def get_progress(db: Session, progress_id: UUID):
    return db.query(models.Progress).filter(models.Progress.id == progress_id).first()

def get_user_progress(db: Session, user_id: UUID):
    return db.query(models.Progress).filter(models.Progress.user_id == user_id).all()

def get_task_progress(db: Session, task_id: UUID):
    return db.query(models.Progress).filter(models.Progress.task_id == task_id).all()

async def create_progress(db: Session, progress: ProgressCreate):
    # Verify user and task exist before creating progress
    if not await verify_user_exists(progress.user_id):
        raise HTTPException(status_code=404, detail="User not found")
    if not await verify_task_exists(progress.task_id):
        raise HTTPException(status_code=404, detail="Task not found")
    
    db_progress = models.Progress(**progress.dict())
    db.add(db_progress)
    db.commit()
    db.refresh(db_progress)
    return db_progress

def update_progress(db: Session, progress_id: UUID, progress: ProgressUpdate):
    db_progress = get_progress(db, progress_id)
    if not db_progress:
        return None
    
    update_data = progress.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_progress, field, value)
    
    db.commit()
    db.refresh(db_progress)
    return db_progress

def delete_progress(db: Session, progress_id: UUID):
    db_progress = get_progress(db, progress_id)
    if not db_progress:
        return None
    
    db.delete(db_progress)
    db.commit()
    return db_progress 