from sqlalchemy.orm import Session
import models
from schemas import TaskCreate, TaskUpdate
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

def get_task(db: Session, task_id: UUID):
    return db.query(models.Task).filter(models.Task.id == task_id).first()

def get_user_tasks(db: Session, user_id: UUID):
    return db.query(models.Task).filter(models.Task.user_id == user_id).all()

async def create_task(db: Session, task: TaskCreate):
    # Verify user exists before creating task
    if not await verify_user_exists(task.user_id):
        raise HTTPException(status_code=404, detail="User not found")
    
    db_task = models.Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: UUID, task: TaskUpdate):
    db_task = get_task(db, task_id)
    if not db_task:
        return None
    
    update_data = task.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: UUID):
    db_task = get_task(db, task_id)
    if not db_task:
        return None
    
    db.delete(db_task)
    db.commit()
    return db_task 