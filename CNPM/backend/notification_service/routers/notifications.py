from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from dependence import get_db
from crud import (
    create_notification, get_notification, get_user_notifications,
    get_unread_notifications, update_notification, delete_notification,
    mark_all_as_read
)
from schemas import NotificationCreate, Notification, NotificationUpdate
from uuid import UUID

router = APIRouter()

@router.post("/", response_model=Notification)
async def create_new_notification(notification: NotificationCreate, db: Session = Depends(get_db)):
    return await create_notification(db=db, notification=notification)

@router.get("/{notification_id}", response_model=Notification)
def read_notification(notification_id: UUID, db: Session = Depends(get_db)):
    notification = get_notification(db, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification

@router.get("/user/{user_id}", response_model=List[Notification])
def read_user_notifications(user_id: UUID, db: Session = Depends(get_db)):
    return get_user_notifications(db, user_id)

@router.get("/user/{user_id}/unread", response_model=List[Notification])
def read_unread_notifications(user_id: UUID, db: Session = Depends(get_db)):
    return get_unread_notifications(db, user_id)

@router.put("/{notification_id}", response_model=Notification)
def update_notification_record(notification_id: UUID, notification: NotificationUpdate, db: Session = Depends(get_db)):
    updated_notification = update_notification(db, notification_id, notification)
    if not updated_notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return updated_notification

@router.delete("/{notification_id}")
def delete_notification_record(notification_id: UUID, db: Session = Depends(get_db)):
    deleted_notification = delete_notification(db, notification_id)
    if not deleted_notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Notification deleted successfully"}

@router.post("/user/{user_id}/mark-all-read")
def mark_all_user_notifications_read(user_id: UUID, db: Session = Depends(get_db)):
    notifications = mark_all_as_read(db, user_id)
    return {"message": f"Marked {len(notifications)} notifications as read"} 