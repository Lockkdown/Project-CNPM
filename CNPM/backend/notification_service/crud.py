from sqlalchemy.orm import Session
import models
from schemas import NotificationCreate, NotificationUpdate
from uuid import UUID
import httpx
from fastapi import HTTPException
from datetime import datetime

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

def get_notification(db: Session, notification_id: UUID):
    return db.query(models.Notification).filter(models.Notification.id == notification_id).first()

def get_user_notifications(db: Session, user_id: UUID):
    return db.query(models.Notification).filter(models.Notification.recipient_id == user_id).all()

def get_unread_notifications(db: Session, user_id: UUID):
    return db.query(models.Notification).filter(
        models.Notification.recipient_id == user_id,
        models.Notification.is_read == False
    ).all()

async def create_notification(db: Session, notification: NotificationCreate):
    # Verify user exists before creating notification
    if not await verify_user_exists(notification.recipient_id):
        raise HTTPException(status_code=404, detail="User not found")
    
    db_notification = models.Notification(**notification.dict())
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

def update_notification(db: Session, notification_id: UUID, notification: NotificationUpdate):
    db_notification = get_notification(db, notification_id)
    if not db_notification:
        return None
    
    update_data = notification.dict(exclude_unset=True)
    if update_data.get("is_read") and not db_notification.is_read:
        update_data["read_at"] = datetime.utcnow()
    
    for field, value in update_data.items():
        setattr(db_notification, field, value)
    
    db.commit()
    db.refresh(db_notification)
    return db_notification

def delete_notification(db: Session, notification_id: UUID):
    db_notification = get_notification(db, notification_id)
    if not db_notification:
        return None
    
    db.delete(db_notification)
    db.commit()
    return db_notification

def mark_all_as_read(db: Session, user_id: UUID):
    notifications = get_unread_notifications(db, user_id)
    for notification in notifications:
        notification.is_read = True
        notification.read_at = datetime.utcnow()
    db.commit()
    return notifications