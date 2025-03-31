from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from dependence import get_db, get_current_user
from crud import create_user, get_user_by_email
from schemas import UserCreate, User
from models import User as UserModel

router = APIRouter()

@router.post("/", response_model=User)
def create_new_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    return create_user(db=db, user=user)

@router.get("/me", response_model=User)
def read_user_me(current_user: UserModel = Depends(get_current_user)):
    return current_user