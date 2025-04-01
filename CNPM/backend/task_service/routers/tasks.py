from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from dependence import get_db
from crud import (
    create_task, get_task, get_user_tasks,
    update_task, delete_task
)
from schemas import TaskCreate, Task, TaskUpdate
from uuid import UUID

router = APIRouter()

@router.post("/", response_model=Task)
async def create_new_task(task: TaskCreate, db: Session = Depends(get_db)):
    return await create_task(db=db, task=task)

@router.get("/{task_id}", response_model=Task)
def read_task(task_id: UUID, db: Session = Depends(get_db)):
    task = get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.get("/user/{user_id}", response_model=List[Task])
def read_user_tasks(user_id: UUID, db: Session = Depends(get_db)):
    return get_user_tasks(db, user_id)

@router.put("/{task_id}", response_model=Task)
def update_task_record(task_id: UUID, task: TaskUpdate, db: Session = Depends(get_db)):
    updated_task = update_task(db, task_id, task)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task

@router.delete("/{task_id}")
def delete_task_record(task_id: UUID, db: Session = Depends(get_db)):
    deleted_task = delete_task(db, task_id)
    if not deleted_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}

@router.get("/verify/{task_id}")
def verify_task_exists(task_id: UUID, db: Session = Depends(get_db)):
    """
    Verify if a task exists. This endpoint is used by other services.
    """
    task = get_task(db, task_id)
    return task is not None 