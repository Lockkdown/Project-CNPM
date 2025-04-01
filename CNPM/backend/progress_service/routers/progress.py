from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from dependence import get_db
from crud import (
    create_progress, get_progress, get_user_progress,
    get_task_progress, update_progress, delete_progress
)
from schemas import ProgressCreate, Progress, ProgressUpdate
from uuid import UUID

router = APIRouter()

@router.post("/", response_model=Progress)
async def create_new_progress(progress: ProgressCreate, db: Session = Depends(get_db)):
    return await create_progress(db=db, progress=progress)

@router.get("/{progress_id}", response_model=Progress)
def read_progress(progress_id: UUID, db: Session = Depends(get_db)):
    progress = get_progress(db, progress_id)
    if not progress:
        raise HTTPException(status_code=404, detail="Progress not found")
    return progress

@router.get("/user/{user_id}", response_model=List[Progress])
def read_user_progress(user_id: UUID, db: Session = Depends(get_db)):
    return get_user_progress(db, user_id)

@router.get("/task/{task_id}", response_model=List[Progress])
def read_task_progress(task_id: UUID, db: Session = Depends(get_db)):
    return get_task_progress(db, task_id)

@router.put("/{progress_id}", response_model=Progress)
def update_progress_record(progress_id: UUID, progress: ProgressUpdate, db: Session = Depends(get_db)):
    updated_progress = update_progress(db, progress_id, progress)
    if not updated_progress:
        raise HTTPException(status_code=404, detail="Progress not found")
    return updated_progress

@router.delete("/{progress_id}")
def delete_progress_record(progress_id: UUID, db: Session = Depends(get_db)):
    deleted_progress = delete_progress(db, progress_id)
    if not deleted_progress:
        raise HTTPException(status_code=404, detail="Progress not found")
    return {"message": "Progress deleted successfully"} 